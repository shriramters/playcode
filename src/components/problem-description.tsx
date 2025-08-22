import React, { useState } from 'react'
import { Card, Badge, Button, Collapse, Alert } from 'react-bootstrap'
import { useProblemStore } from '../module/problems'
import { Difficulty } from '../types/problems'
import { FaEye, FaEyeSlash, FaLightbulb } from 'react-icons/fa'

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.Easy:
      return 'success'
    case Difficulty.Medium:
      return 'warning'
    case Difficulty.Hard:
      return 'danger'
    default:
      return 'secondary'
  }
}

export default function ProblemDescription() {
  const { currentProblem, getProgress } = useProblemStore()
  const [showHints, setShowHints] = useState(false)

  if (!currentProblem) {
    return (
      <Card className="h-100">
        <Card.Body>
          <p className="text-muted">Select a problem to get started</p>
        </Card.Body>
      </Card>
    )
  }

  const progress = getProgress(currentProblem.id)

  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0">{currentProblem.title}</h5>
            <Badge bg={getDifficultyColor(currentProblem.difficulty)}>
              {currentProblem.difficulty}
            </Badge>
          </div>
          {progress?.solved && (
            <Badge bg="success">Solved</Badge>
          )}
        </div>
        <div className="mt-2">
          {currentProblem.topic.map((topic) => (
            <Badge key={topic} bg="light" text="dark" className="me-1">
              {topic}
            </Badge>
          ))}
        </div>
      </Card.Header>
      
      <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <div 
          className="problem-description"
          dangerouslySetInnerHTML={{ 
            __html: currentProblem.description
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/`([^`]+)`/g, '<code>$1</code>')
              .replace(/```([^```]+)```/g, '<pre><code>$1</code></pre>')
              .replace(/\n/g, '<br>')
          }}
        />
        
        {currentProblem.hints && currentProblem.hints.length > 0 && (
          <div className="mt-4">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="d-flex align-items-center gap-2"
            >
              <FaLightbulb />
              {showHints ? <FaEyeSlash /> : <FaEye />}
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
            
            <Collapse in={showHints}>
              <div className="mt-3">
                {currentProblem.hints.map((hint, index) => (
                  <Alert key={index} variant="info" className="py-2">
                    <strong>Hint {index + 1}:</strong> {hint}
                  </Alert>
                ))}
              </div>
            </Collapse>
          </div>
        )}
        
        {progress && (
          <div className="mt-4 p-3 bg-light rounded">
            <h6>Your Progress</h6>
            <p className="mb-1">
              <strong>Attempts:</strong> {progress.attempts}
            </p>
            {progress.bestTime && (
              <p className="mb-1">
                <strong>Best Time:</strong> {progress.bestTime}ms
              </p>
            )}
            {progress.lastAttempt && (
              <p className="mb-0">
                <strong>Last Attempt:</strong> {new Date(progress.lastAttempt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}