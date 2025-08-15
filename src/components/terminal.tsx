import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Terminal as Xterm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { useMessagePort } from '../module/runner'

function debounce(fn: () => void, delay = 60) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagePort = useMessagePort()
  const xtermRef = useRef<Xterm | null>(null); // Use a ref for xterm

  const [xterm] = useState(() => {
    const newXterm = new Xterm();
    xtermRef.current = newXterm; // Assign to ref
    return newXterm;
  })

  useEffect(() => {
    xterm.open(containerRef.current)
    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    const resizeObserver = new ResizeObserver(debounce(() => fitAddon.fit()))
    resizeObserver.observe(containerRef.current)

    // Set up message listener here
    if (messagePort) {
      xterm.clear();
      messagePort.onmessage = (event) => {
        switch (event.data.id) {
          case 'write':
            xterm.writeln(event.data.data)
            break
        }
      }
    }

    return () => {
      resizeObserver.disconnect()
      if (messagePort) {
        messagePort.onmessage = null; // Clean up listener
      }
    }
  }, [messagePort]) // messagePort is now memoized, so this effect will only run when messagePort itself changes

  return (
    <Card className="h-100">
      <Card.Header>Terminal</Card.Header>
      <Card.Body className="p-0">
        <div className="h-100 bg-black" ref={containerRef} />
      </Card.Body>
    </Card>
  )
}
