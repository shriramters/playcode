import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Problem, ProblemProgress } from '../types/problems'
import { SAMPLE_PROBLEMS } from '../data/problems'

interface ProblemStore {
  problems: Problem[]
  currentProblem: Problem | null
  progress: Record<string, ProblemProgress>
  
  // Actions
  setCurrentProblem: (problemId: string) => void
  markProblemAttempted: (problemId: string) => void
  markProblemSolved: (problemId: string, time?: number) => void
  resetProgress: () => void
  getProgress: (problemId: string) => ProblemProgress | undefined
}

export const useProblemStore = create<ProblemStore>()(
  persist(
    (set, get) => ({
      problems: SAMPLE_PROBLEMS,
      currentProblem: SAMPLE_PROBLEMS[0], // Default to first problem
      progress: {},

      setCurrentProblem: (problemId: string) => {
        const problem = get().problems.find(p => p.id === problemId)
        if (problem) {
          set({ currentProblem: problem })
        }
      },

      markProblemAttempted: (problemId: string) => {
        const { progress } = get()
        const existingProgress = progress[problemId]
        
        set({
          progress: {
            ...progress,
            [problemId]: {
              problemId,
              solved: false,
              attempts: (existingProgress?.attempts || 0) + 1,
              lastAttempt: new Date(),
              bestTime: existingProgress?.bestTime
            }
          }
        })
      },

      markProblemSolved: (problemId: string, time?: number) => {
        const { progress } = get()
        const existingProgress = progress[problemId]
        
        set({
          progress: {
            ...progress,
            [problemId]: {
              problemId,
              solved: true,
              attempts: (existingProgress?.attempts || 0) + 1,
              lastAttempt: new Date(),
              bestTime: time && (!existingProgress?.bestTime || time < existingProgress.bestTime) 
                ? time 
                : existingProgress?.bestTime
            }
          }
        })
      },

      resetProgress: () => {
        set({ progress: {} })
      },

      getProgress: (problemId: string) => {
        return get().progress[problemId]
      }
    }),
    {
      name: 'problem-store',
      version: 1
    }
  )
)