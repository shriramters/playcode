import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { FaGithub, FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../core/theme'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Navbar bg={theme} variant={theme} expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">PlayCode</Navbar.Brand>
        <Nav>
          <Button variant={theme} onClick={toggleTheme} className="me-2">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </Button>
          <Nav.Link href="https://github.com/shriramters/playcode" target="_blank">
            <FaGithub style={{ height: '20px', width: '20px' }} />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
