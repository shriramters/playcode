import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { FaGithub } from 'react-icons/fa'

export default function Header() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">PlayCode</Navbar.Brand>
        <Nav>
          <Nav.Link href="https://github.com/InfiniteXyy/playcode" target="_blank">
            <FaGithub style={{ height: '20px', width: '20px' }} className="text-dark" />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
