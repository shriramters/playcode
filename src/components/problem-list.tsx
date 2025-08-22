import React from 'react'
import { Card, ListGroup, Badge, Row, Col } from 'react-bootstrap'
import { useProblemStore, useProblemProgress } from '../module/problems'
import { Difficulty } from '../types/problems'
import { FaCheck, FaClock } from 'react-icons/fa'

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

export default function ProblemList() {
  const { problems, currentProblem, setCurrentProblem } = useProblemStore()
  const { getProgress } = useProblemProgress()

  return (
    <Card className="h-100">
      <Card.Header>
        <h6 className="mb-0">Problems</h6>
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {problems.map((problem) => {
              const progress = getProgress(problem.id)
              const isActive = currentProblem?.id === problem.id
              
              return (
                <ListGroup.Item
                  key={problem.id}
                  action
                  active={isActive}
                  onClick={() => setCurrentProblem(problem.id)}
                  className="py-3"
                >
                  <Row className="align-items-center">
                    <Col>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        {progress?.solved && (
                          <FaCheck className="text-success" size={14} />
                        )}
                        {progress && !progress.solved && (
                          <FaClock className="text-warning" size={14} />
                        )}
                        <span className="fw-medium">{problem.title}</span>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <Badge bg={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        {problem.topic.map((topic) => (
                          <Badge key={topic} bg="light" text="dark" className="small">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      {progress && (
                        <small className="text-muted">
                          {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                          {progress.bestTime && (
                            <> • Best: {progress.bestTime}ms</>
                          )}
                        </small>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  )
}