import React, { useEffect, useRef, useState } from 'react'
import { Card, Nav, Tab } from 'react-bootstrap'
import { Terminal as Xterm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { useMessagePort } from '../module/runner'
import { useProblemStore, useProblemProgress } from '../module/problems'
import { WasmTestRunner } from '../utils/test-runner'
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
  const testOutputBuffer = useRef<string>('')
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined)
  const [isRunningTests, setIsRunningTests] = useState(false)
  
  const { currentProblem } = useProblemStore()
  const { markProblemSolved } = useProblemProgress()
  const testRunner = useRef(new WasmTestRunner())

  const [xterm] = useState(() => {
    const newXterm = new Xterm()
    xtermRef.current = newXterm
    return newXterm
  })

  const validateTestOutput = () => {
    if (!currentProblem || !testOutputBuffer.current) {
      return
    }

    const startTime = Date.now()
    
    // Look for compilation or runtime errors first
    const output = testOutputBuffer.current.toLowerCase()
    if (output.includes('error:') || output.includes('undefined reference') || output.includes('compilation terminated')) {
      setValidationResult({
        allPassed: false,
        testResults: [],
        compilationError: testOutputBuffer.current.split('\n').find(line => 
          line.toLowerCase().includes('error:') || 
          line.toLowerCase().includes('undefined reference')
        ) || 'Compilation failed'
      })
      return
    }

    // Extract test.wasm output specifically
    const lines = testOutputBuffer.current.split('\n')
    
    // Look for the test.wasm execution section
    const testWasmStart = lines.findIndex(line => line.includes('test.wasm'))
    if (testWasmStart === -1) {
      setValidationResult({
        allPassed: false,
        testResults: [],
        compilationError: 'No test.wasm output found. Make sure test compilation succeeded.'
      })
      return
    }

    // Extract output after test.wasm execution
    const testOutput = lines.slice(testWasmStart + 1)
      .filter(line => {
        const cleanLine = line.trim()
        return cleanLine && 
               !cleanLine.includes('Untarring') &&
               !cleanLine.includes('Fetching') &&
               !cleanLine.includes('clang -cc1') &&
               !cleanLine.includes('wasm-ld') &&
               !cleanLine.includes('done.') &&
               !cleanLine.includes('process exited') &&
               !cleanLine.includes('Disallowing rAF') &&
               !cleanLine.startsWith('>')
      })
      .join('\n')

    if (!testOutput.trim()) {
      setValidationResult({
        allPassed: false,
        testResults: [],
        compilationError: 'No test output captured. Check if your solution produces the expected output format.'
      })
      return
    }

    // Parse test results using the test runner
    const testResults = testRunner.current.parseTestResults(testOutput, currentProblem.testCases)
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
      testOutputBuffer.current = ''
      setValidationResult(undefined)
      setIsRunningTests(false)
      
      messagePort.onmessage = (event) => {
        switch (event.data.id) {
          case 'write':
            const text = event.data.data
            xterm.writeln(text)
            outputBuffer.current += text + '\n'
            
            // Check if this is test.wasm execution output
            if (text.includes('test.wasm') || isRunningTests) {
              if (text.includes('test.wasm')) {
                setIsRunningTests(true)
                testOutputBuffer.current = '' // Reset test output buffer
              }
              testOutputBuffer.current += text + '\n'
            }
            
            // Check if test execution is complete
            if (isRunningTests && (
                text.includes('process exited') || 
                text.includes('RuntimeError:') ||
                text.includes('Error:') ||
                (text.trim() === '' && testOutputBuffer.current.includes('test.wasm')))) {
              // Wait a bit for any remaining output, then validate
              setTimeout(() => {
                validateTestOutput()
                setIsRunningTests(false)
              }, 1000)
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
  }, [messagePort, currentProblem, isRunningTests])

  return (
    <div className="d-flex flex-column h-100">
      <Card className="flex-grow-1">
        <Card.Header className="p-0">
          <Tab.Container defaultActiveKey="terminal" id="terminal-tabs">
            <Nav variant="tabs" className="border-bottom-0">
              <Nav.Item>
                <Nav.Link eventKey="terminal" className="px-3 py-2">
                  Terminal
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="test-results" className="px-3 py-2">
                  Test Results
                  {validationResult && (
                    <span className={`ms-2 badge ${validationResult.allPassed ? 'bg-success' : 'bg-danger'}`}>
                      {validationResult.allPassed ? 'Pass' : 'Fail'}
                    </span>
                  )}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content className="h-100">
              <Tab.Pane eventKey="terminal" className="h-100">
                <div className="h-100 bg-black" ref={containerRef} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="test-results" className="h-100">
                <div className="p-3 h-100" style={{ overflowY: 'auto' }}>
                  {validationResult ? (
                    <TestResults validationResult={validationResult} />
                  ) : (
                    <div className="text-center text-muted mt-4">
                      <p>No test results yet.</p>
                      <small>Run your code to see test results here.</small>
                    </div>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Header>
      </Card>
    </div>
  )
}
