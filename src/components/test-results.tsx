import React from 'react'
import { Card, Alert, Badge, Row, Col, ProgressBar } from 'react-bootstrap'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { ValidationResult } from '../types/problems'

interface TestResultsProps {
  validationResult?: ValidationResult
}

export default function TestResults({ validationResult }: TestResultsProps) {
  if (!validationResult) {
    return null
  }

  const { allPassed, testResults, compilationError, runtime } = validationResult
  const passedCount = testResults.filter(r => r.passed).length
  const totalCount = testResults.length

  return (
    <div>
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-medium">
            {allPassed ? (
              <Badge bg="success" className="d-flex align-items-center gap-1">
                <FaCheck size={12} />
                All tests passed!
              </Badge>
            ) : (
              <Badge bg="danger" className="d-flex align-items-center gap-1">
                <FaTimes size={12} />
                {passedCount}/{totalCount} tests passed
              </Badge>
            )}
          </span>
          {runtime && (
            <small className="text-muted">Runtime: {runtime}ms</small>
          )}
        </div>
        <ProgressBar 
          now={(passedCount / totalCount) * 100} 
          variant={allPassed ? 'success' : 'danger'}
        />
      </div>

      {compilationError ? (
        <Alert variant="danger">
          <strong>Compilation Error:</strong>
          <pre className="mb-0 mt-2">{compilationError}</pre>
        </Alert>
      ) : (
        <>
          {/* Individual Test Results */}
          {testResults.map((result, index) => (
            <Alert 
              key={index} 
              variant={result.passed ? 'success' : 'danger'}
              className="py-2 mb-2"
            >
              <Row className="align-items-center">
                <Col xs="auto">
                  {result.passed ? (
                    <FaCheck className="text-success" />
                  ) : (
                    <FaTimes className="text-danger" />
                  )}
                </Col>
                <Col>
                  <div className="fw-medium">Test Case {result.testCase}</div>
                  <div className="small">
                    <strong>Input:</strong> <code>{result.input}</code><br />
                    <strong>Expected:</strong> <code>{result.expectedOutput}</code><br />
                    <strong>Got:</strong> <code>{result.actualOutput || '(no output)'}</code>
                  </div>
                  {result.error && (
                    <div className="small text-danger mt-1">
                      {result.error}
                    </div>
                  )}
                </Col>
              </Row>
            </Alert>
          ))}
        </>
      )}
    </div>
  )
}