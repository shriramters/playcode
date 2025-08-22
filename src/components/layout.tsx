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

interface PracticeLayoutProps {
  problemDescription: React.ReactNode
  editor: React.ReactNode
  terminal: React.ReactNode
}

export function PracticeLayout(props: PracticeLayoutProps) {
  const { problemDescription, editor, terminal } = props
  
  return (
    <Container fluid className="d-flex flex-column vh-100">
      <Row className="flex-grow-1 g-2 py-2">
        {/* Middle Panel - Problem Description */}
        <Col xs={7}>
          {problemDescription}
        </Col>
        
        {/* Right Panel - Editor and Terminal */}
        <Col xs={5}>
          <Row className="h-100 g-2">
            <Col xs={12} style={{ height: '400px' }}>
              {editor}
            </Col>
            <Col xs={12} style={{ height: '500px' }}>
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
