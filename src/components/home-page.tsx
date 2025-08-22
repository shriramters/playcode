import React from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { SAMPLE_PROBLEMS } from '../data/problem-loader'
import { useProblemProgress } from '../module/problems'
import { Difficulty } from '../types/problems'

export function HomePage() {
  const navigate = useNavigate()
  const progress = useProblemProgress(state => state.progress)

  const getDifficultyVariant = (difficulty: Difficulty) => {
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

  const getProgressInfo = (problemId: string) => {
    const problemProgress = progress[problemId]
    return {
      solved: problemProgress?.solved || false,
      attempts: problemProgress?.attempts || 0
    }
  }

  const handleProblemSelect = (problemId: string) => {
    navigate(`/practice/${problemId}`)
  }

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-3">Coding Practice Platform</h1>
          <p className="text-center text-muted">
            Practice your C++ programming skills with interactive coding challenges.
            Compile and test your solutions directly in the browser.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="mb-4">Available Problems</h2>
        </Col>
      </Row>

      <Row>
        {SAMPLE_PROBLEMS.map((problem) => {
          const { solved, attempts } = getProgressInfo(problem.id)
          
          return (
            <Col lg={4} md={6} className="mb-4" key={problem.id}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{problem.title}</h5>
                    <Badge bg={getDifficultyVariant(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    {problem.topic.map((topic, index) => (
                      <Badge 
                        key={index} 
                        bg="secondary" 
                        className="me-1 mb-1"
                        style={{ fontSize: '0.7em' }}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-3 flex-grow-1">
                    <p className="text-muted small">
                      {problem.description.split('\n')[0].substring(0, 150)}...
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="small text-muted">
                        {solved ? (
                          <span className="text-success">
                            ✓ Solved
                          </span>
                        ) : attempts > 0 ? (
                          <span className="text-warning">
                            {attempts} attempt{attempts !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span>Not attempted</span>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={solved ? "outline-success" : "primary"}
                      onClick={() => handleProblemSelect(problem.id)}
                      className="w-100"
                    >
                      {solved ? 'Review Solution' : 'Start Coding'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}