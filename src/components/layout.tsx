import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

interface LayoutProps {
  header: React.ReactNode
  left: React.ReactNode
  right: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { header, left, right } = props
  return (
    <Container fluid className="d-flex flex-column vh-100">
      <header>{header}</header>
      <Row className="flex-grow-1 g-2 py-2">
        <Col xs={6}>{left}</Col>
        <Col>{right}</Col>
      </Row>
    </Container>
  )
}

interface LeetCodeLayoutProps {
  problemList: React.ReactNode
  problemDescription: React.ReactNode
  editor: React.ReactNode
  terminal: React.ReactNode
}

export function LeetCodeLayout(props: LeetCodeLayoutProps) {
  const { problemList, problemDescription, editor, terminal } = props
  
  return (
    <Container fluid className="d-flex flex-column vh-100">
      <Row className="flex-grow-1 g-2 py-2">
        {/* Left Panel - Problem List */}
        <Col xs={3}>
          {problemList}
        </Col>
        
        {/* Middle Panel - Problem Description */}
        <Col xs={4}>
          {problemDescription}
        </Col>
        
        {/* Right Panel - Editor and Terminal */}
        <Col xs={5}>
          <Row className="h-100 g-2">
            <Col xs={12} style={{ height: '45%' }}>
              {editor}
            </Col>
            <Col xs={12} style={{ height: '55%' }}>
              <div style={{ height: '100%', overflowY: 'auto' }}>
                {terminal}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
