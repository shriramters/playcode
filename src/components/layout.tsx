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
