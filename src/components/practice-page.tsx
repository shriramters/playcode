import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { BsArrowLeft } from 'react-icons/bs'

import { PracticeLayout } from './layout'
import Editor from './editor'
import Terminal from './terminal'
import ProblemDescription from './problem-description'

import { useProblemStore } from '../module/problems'

export function PracticePage() {
  const { problemId } = useParams<{ problemId: string }>()
  const navigate = useNavigate()
  const { setCurrentProblem, currentProblem } = useProblemStore()

  useEffect(() => {
    if (problemId) {
      setCurrentProblem(problemId)
    }
  }, [problemId, setCurrentProblem])

  const handleGoHome = () => {
    navigate('/')
  }

  if (!currentProblem) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h3>Problem not found</h3>
          <Button variant="primary" onClick={handleGoHome}>
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  const BackButton = () => (
    <Button 
      variant="outline-secondary" 
      size="sm" 
      onClick={handleGoHome}
      className="mb-3"
    >
      <BsArrowLeft className="me-2" />
      Back to Problems
    </Button>
  )

  return (
    <div className="d-flex flex-column vh-100">
      <div className="flex-grow-1">
        <PracticeLayout 
          problemDescription={<ProblemDescription />}
          editor={<Editor />}
          terminal={<Terminal />}
        />
      </div>
    </div>
  )
}