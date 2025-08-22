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

  const requestTestResults = () => {
    if (!currentProblem || !messagePort) {
      return
    }

    // Request test result files from worker
    messagePort.postMessage({ 
      id: 'getTestFiles', 
      data: { 
        testCases: currentProblem.testCases,
        numTests: currentProblem.testCases.length 
      } 
    })
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
      setValidationResult(undefined)
      setIsRunningTests(false)
      
      messagePort.onmessage = (event) => {
        switch (event.data.id) {
          case 'write':
            const text = event.data.data
            xterm.writeln(text)
            
            // Check if this is test.wasm execution starting
            if (text.includes('test.wasm')) {
              setIsRunningTests(true)
            }
            
            // Check if test execution is complete
            if (isRunningTests && (
                text.includes('process exited') || 
                text.includes('RuntimeError:') ||
                text.includes('Error:'))) {
              // Wait a bit for any remaining output, then request test files
              setTimeout(() => {
                requestTestResults()
                setIsRunningTests(false)
              }, 1000)
            }
            break

          case 'testResults':
            // Handle test results from worker
            const { testFiles, error } = event.data.data
            
            if (error) {
              setValidationResult({
                allPassed: false,
                testResults: [],
                compilationError: error
              })
              return
            }

            const startTime = Date.now()
            
            // Parse test results from the files
            const testResults = testRunner.current.parseTestResultsFromMemfsFiles(
              testFiles, 
              currentProblem.testCases
            )
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
