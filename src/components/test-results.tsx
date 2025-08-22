import React from 'react'
import { Card, Alert, Badge, Row, Col, ProgressBar } from 'react-bootstrap'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { ValidationResult } from '../utils/validation'

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
    <Card className="mt-3">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Test Results</h6>
          {runtime && (
            <small className="text-muted">Runtime: {runtime}ms</small>
          )}
        </div>
      </Card.Header>
      
      <Card.Body>
        {compilationError ? (
          <Alert variant="danger">
            <strong>Compilation Error:</strong>
            <pre className="mb-0 mt-2">{compilationError}</pre>
          </Alert>
        ) : (
          <>
            {/* Overall Status */}
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
              </div>
              <ProgressBar 
                now={(passedCount / totalCount) * 100} 
                variant={allPassed ? 'success' : 'danger'}
              />
            </div>

            {/* Individual Test Results */}
            {testResults.map((result, index) => (
              <Alert 
                key={index} 
                variant={result.passed ? 'success' : 'danger'}
                className="py-2"
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
      </Card.Body>
    </Card>
  )
}