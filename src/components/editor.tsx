import React, { useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { LanguageExt, useRunner } from '../module'
import { useProblemStore, useProblemProgress } from '../module/problems'
import LanguageSelector from './langauge-selector'
import MonacoEditor from '@monaco-editor/react'
import { IoPlay, IoRefresh } from 'react-icons/io5'
import { useTheme } from '../core/theme'

export default function Editor() {
  const codeMap = useRunner((state) => state.codeMap)
  const language = useRunner((state) => state.language)
  const setCode = useRunner((state) => state.setCode)
  const runCode = useRunner((state) => state.runCode)
  const theme = useTheme((state) => state.theme)
  
  const { currentProblem } = useProblemStore()
  const { markProblemAttempted } = useProblemProgress()

  // Load problem template when problem changes
  useEffect(() => {
    if (currentProblem && language === 'cpp') {
      setCode(currentProblem.template)
    }
  }, [currentProblem, language, setCode])

  const handleRunCode = () => {
    if (currentProblem) {
      markProblemAttempted(currentProblem.id)
    }
    runCode()
  }

  const handleResetTemplate = () => {
    if (currentProblem && language === 'cpp') {
      setCode(currentProblem.template)
    }
  }

  return (
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <span className="fw-medium fs-6 text-secondary">
          {currentProblem ? `${currentProblem.title}${LanguageExt[language]}` : `test${LanguageExt[language]}`}
        </span>
        <div className="d-flex align-items-center gap-2">
          <LanguageSelector />
          {currentProblem && language === 'cpp' && (
            <Button variant="outline-secondary" size="sm" onClick={handleResetTemplate}>
              <IoRefresh />
            </Button>
          )}
          <Button variant="success" onClick={handleRunCode}>
            <IoPlay />
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <MonacoEditor
          value={codeMap[language]}
          language={language}
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          options={{ fontSize: 17, minimap: { enabled: false }, wordWrap: 'on' }}
          wrapperClassName="h-100"
          onChange={(code) => setCode(code)}
        />
      </Card.Body>
    </Card>
  )
}

