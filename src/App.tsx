import React, { useEffect } from 'react'

import clang from './assets/clang.wasm?url'
import lld from './assets/lld.wasm?url'
import memfs from './assets/memfs.wasm?url'
import sysroot from './assets/sysroot.tar?url'

import { LeetCodeLayout } from './components/layout'
import Header from './components/header'
import Editor from './components/editor'
import Terminal from './components/terminal'
import ProblemList from './components/problem-list'
import ProblemDescription from './components/problem-description'

import { useTheme } from './core/theme'

console.log({ clang, lld, memfs, sysroot })

export function App() {
  const theme = useTheme((state) => state.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="flex-grow-1">
        <LeetCodeLayout 
          problemList={<ProblemList />}
          problemDescription={<ProblemDescription />}
          editor={<Editor />}
          terminal={<Terminal />}
        />
      </div>
    </div>
  )
}
