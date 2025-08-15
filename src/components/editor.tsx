import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { LanguageExt, useRunner } from '../module'
import LanguageSelector from './langauge-selector'
import MonacoEditor from '@monaco-editor/react'
import { IoPlay } from 'react-icons/io5'
import { useTheme } from '../core/theme'

export default function Editor() {
  const codeMap = useRunner((state) => state.codeMap)
  const language = useRunner((state) => state.language)
  const setCode = useRunner((state) => state.setCode)
  const runCode = useRunner((state) => state.runCode)
  const theme = useTheme((state) => state.theme)

  return (
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <span className="fw-medium fs-6 text-secondary">{`test${LanguageExt[language]}`}</span>
        <div className="d-flex align-items-center gap-2">
          <LanguageSelector />
          <Button variant="success" onClick={runCode}>
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

