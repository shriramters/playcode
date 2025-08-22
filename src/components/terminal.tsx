import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Terminal as Xterm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { useMessagePort } from '../module/runner'
import { useProblemStore, useProblemProgress } from '../module/problems'
import { parseTestOutput } from '../utils/validation'
import { ValidationResult } from '../types/problems'
import TestResults from './test-results'

function debounce(fn: () => void, delay = 60) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagePort = useMessagePort()
  const xtermRef = useRef<Xterm | null>(null)
  const outputBuffer = useRef<string>('')
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined)
  
  const { currentProblem } = useProblemStore()
  const { markProblemSolved } = useProblemProgress()

  const [xterm] = useState(() => {
    const newXterm = new Xterm()
    xtermRef.current = newXterm
    return newXterm
  })

  const validateOutput = () => {
    if (!currentProblem || !outputBuffer.current) {
      return
    }

    const startTime = Date.now()
    
    // Look for compilation or runtime errors
    const output = outputBuffer.current.toLowerCase()
    if (output.includes('error:') || output.includes('undefined reference') || output.includes('compilation terminated')) {
      setValidationResult({
        allPassed: false,
        testResults: [],
        compilationError: outputBuffer.current.split('\n').find(line => 
          line.toLowerCase().includes('error:') || 
          line.toLowerCase().includes('undefined reference')
        ) || 'Compilation failed'
      })
      return
    }

    // Extract just the program output (after the last '>' prompt)
    const lines = outputBuffer.current.split('\n')
    const lastPromptIndex = lines.findLastIndex(line => line.trim().startsWith('>'))
    const programOutput = lines.slice(lastPromptIndex + 1).join('\n')
    
    // Skip lines that contain system messages
    const cleanOutput = programOutput
      .split('\n')
      .filter(line => {
        const cleanLine = line.trim()
        return cleanLine && 
               !cleanLine.includes('Untarring') &&
               !cleanLine.includes('Fetching') &&
               !cleanLine.includes('clang -cc1') &&
               !cleanLine.includes('wasm-ld') &&
               !cleanLine.includes('done.') &&
               !cleanLine.startsWith('>')
      })
      .join('\n')

    if (!cleanOutput.trim()) {
      // No output likely means runtime error - check for specific error patterns
      if (output.includes('unreachable') || output.includes('runtimeerror')) {
        setValidationResult({
          allPassed: false,
          testResults: [],
          compilationError: 'Runtime Error: The program crashed during execution. Make sure your solution handles all edge cases.'
        })
        return
      }
    }

    const testResults = parseTestOutput(cleanOutput, currentProblem.testCases)
    const allPassed = testResults.every(r => r.passed)
    const runtime = Date.now() - startTime

    const result: ValidationResult = {
      allPassed,
      testResults,
      runtime
    }

    setValidationResult(result)

    // Mark problem as solved if all tests pass
    if (allPassed && currentProblem) {
      markProblemSolved(currentProblem.id, runtime)
    }
  }

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(debounce(() => fitAddon.fit()))
    resizeObserver.observe(containerRef.current)

    // Set up message listener here
    if (messagePort) {
      xterm.clear()
      outputBuffer.current = ''
      setValidationResult(undefined)
      
      messagePort.onmessage = (event) => {
        switch (event.data.id) {
          case 'write':
            const text = event.data.data
            xterm.writeln(text)
            outputBuffer.current += text + '\n'
            
            // Check if execution is complete (look for specific end patterns)
            if (text.includes('process exited') || 
                text.includes('RuntimeError:') ||
                text.includes('Error:') ||
                (outputBuffer.current.includes('test.wasm') && 
                 (text.trim() === '' || text.includes('Disallowing rAF')))) {
              // Wait a bit for any remaining output, then validate
              setTimeout(validateOutput, 1000)
            }
            break
        }
      }
    }

    return () => {
      resizeObserver.disconnect()
      if (messagePort) {
        messagePort.onmessage = null
      }
    }
  }, [messagePort, currentProblem])

  return (
    <div className="d-flex flex-column h-100">
      <Card className="flex-grow-1">
        <Card.Header>Terminal</Card.Header>
        <Card.Body className="p-0">
          <div className="h-100 bg-black" ref={containerRef} />
        </Card.Body>
      </Card>
      
      {validationResult && (
        <TestResults validationResult={validationResult} />
      )}
    </div>
  )
}
