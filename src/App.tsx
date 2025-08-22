import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import clang from './assets/clang.wasm?url'
import lld from './assets/lld.wasm?url'
import memfs from './assets/memfs.wasm?url'
import sysroot from './assets/sysroot.tar?url'

import Header from './components/header'
import { HomePage } from './components/home-page'
import { PracticePage } from './components/practice-page'

import { useTheme } from './core/theme'

console.log({ clang, lld, memfs, sysroot })

export function App() {
  const theme = useTheme((state) => state.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])

  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <Header />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice/:problemId" element={<PracticePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
