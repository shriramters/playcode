export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface TestCase {
  input: string
  expectedOutput: string
  description?: string
}

export interface Problem {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  topic: string[]
  template: string
  testCases: TestCase[]
  solution?: string
  hints?: string[]
}

export interface ProblemProgress {
  problemId: string
  solved: boolean
  attempts: number
  lastAttempt?: Date
  bestTime?: number
}

export interface ProblemMetadata {
  id: string
  title: string
  difficulty: string
  topics: string[]
}