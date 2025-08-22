export interface TestResult {
  testCase: number
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  error?: string
}

export interface ValidationResult {
  allPassed: boolean
  testResults: TestResult[]
  compilationError?: string
  runtime?: number
}

export function validateOutput(expectedOutput: string, actualOutput: string): boolean {
  // Normalize outputs by trimming whitespace and removing extra newlines
  const normalize = (str: string) => str.trim().replace(/\s+/g, ' ')
  
  const expected = normalize(expectedOutput)
  const actual = normalize(actualOutput)
  
  return expected === actual
}

export function parseTestOutput(output: string, testCases: Array<{expectedOutput: string}>): TestResult[] {
  // Split output by lines and filter out empty lines
  const lines = output.split('\n').filter(line => line.trim().length > 0)
  
  const results: TestResult[] = []
  
  testCases.forEach((testCase, index) => {
    const actualOutput = lines[index] || ''
    const passed = validateOutput(testCase.expectedOutput, actualOutput)
    
    results.push({
      testCase: index + 1,
      passed,
      input: `Test case ${index + 1}`,
      expectedOutput: testCase.expectedOutput,
      actualOutput: actualOutput.trim(),
      error: !passed ? `Expected: ${testCase.expectedOutput}, Got: ${actualOutput.trim()}` : undefined
    })
  })
  
  return results
}