import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DefaultPythonCode, DefaultCppCode, DefaultTypescriptCode } from '../examples'
import { Language } from './types'
import { initWorker } from './utils'

const workerMap = {};
for (const language of Object.values(Language)) {
  workerMap[language] = initWorker(language)
}

export const useRunner = create(
  persist<{
    language: Language
    codeMap: Record<Language, string>
    setCode: (code: string) => void
    setLanguage: (language: string) => void
    runCode: () => void
  }>(
    (set, get) => ({
      codeMap: {
        [Language.Cpp]: DefaultCppCode,
        [Language.Python]: DefaultPythonCode,
        [Language.TypeScript]: DefaultTypescriptCode,
      },
      language: Language.Cpp,
      setCode: (code: string) => {
        const state = get()
        const codeMap = { ...state.codeMap, [state.language]: code }
        set({ ...state, codeMap })
      },
      setLanguage: (language: Language) => set({ ...get(), language }),
      runCode() {
        const { codeMap, language } = get()
        workerMap[language].messagePort.postMessage({ id: 'compileLinkRun', data: codeMap[language] })
      },
    }),
    { name: 'runner-store', version: 2, blacklist: ['workerMap'] }
  )
)

export const useMessagePort = () => {
  const { language } = useRunner()
  const messagePort = workerMap[language]?.messagePort
  return React.useMemo(() => messagePort, [messagePort])
}
