import { TestCase, ValidationResult, TestResult } from '../types/problems'
import { validateOutput } from './validation'

export interface TestRunner {
  generateTestFile: (userCode: string, testCases: TestCase[], problemId: string) => string
  runTests: (userCode: string, testCases: TestCase[]) => Promise<ValidationResult>
}

export class WasmTestRunner implements TestRunner {
  generateTestFile(userCode: string, testCases: TestCase[], problemId: string): string {
    // Extract the solution class from user code
    const solutionClassMatch = userCode.match(/class Solution\s*{[^}]+}/s)
    if (!solutionClassMatch) {
      throw new Error('No Solution class found in user code')
    }

    const solutionClass = solutionClassMatch[0]
    
    // Generate includes and setup
    let testCode = `#include <iostream>
#include <vector>
#include <unordered_map>
#include <climits>
#include <string>
#include <sstream>
using namespace std;

${solutionClass}

// Test case runner that reads from predefined test cases
int main() {
    Solution solution;
    
    // Test cases are embedded here (generated from test-cases.json)
`

    // Add test case calls based on the test cases from the JSON file
    testCases.forEach((testCase, index) => {
      testCode += `    // Test case ${index + 1}: ${testCase.description || ''}\n`
      testCode += `    // Input: ${testCase.input}\n`
      testCode += `    // Expected: ${testCase.expectedOutput}\n`
      testCode += this.generateTestCall(testCase, index, problemId)
      testCode += '\n'
    })

    testCode += `    return 0;
}`

    return testCode
  }

  async runTests(userCode: string, testCases: TestCase[]): Promise<ValidationResult> {
    try {
      // This would integrate with the existing compilation system
      // For now, we'll return a mock result that shows the structure
      const startTime = Date.now()
      
      // In a real implementation, this would:
      // 1. Generate the test file using generateTestFile()
      // 2. Compile it to test.wasm using the existing compilation pipeline
      // 3. Run test.wasm and capture stdout
      // 4. Parse the stdout and validate against expected results
      
      const runtime = Date.now() - startTime
      
      return {
        allPassed: false,
        testResults: [],
        runtime,
        compilationError: 'Test runner integration pending - compile test.wasm separately'
      }
    } catch (error) {
      return {
        allPassed: false,
        testResults: [],
        compilationError: `Test compilation failed: ${error}`
      }
    }
  }

  private generateTestCall(testCase: TestCase, index: number, problemId: string): string {
    // Generate test calls based on problem type and input format
    const input = testCase.input
    
    switch (problemId) {
      case 'two-sum':
        return this.generateTwoSumTest(input, index)
      case 'reverse-integer':
        return this.generateReverseIntegerTest(input, index)
      case 'palindrome-number':
        return this.generatePalindromeTest(input, index)
      default:
        return `    // Unsupported problem type: ${problemId}`
    }
  }

  private generateTwoSumTest(input: string, index: number): string {
    // For two-sum example: "nums = [2,7,11,15], target = 9"
    const numsMatch = input.match(/nums\s*=\s*\[([^\]]+)\]/)
    const targetMatch = input.match(/target\s*=\s*(\d+)/)
    
    if (numsMatch && targetMatch) {
      const nums = numsMatch[1]
      const target = targetMatch[1]
      
      return `    {
        vector<int> nums = {${nums}};
        int target = ${target};
        vector<int> result = solution.twoSum(nums, target);
        cout << "[" << result[0] << "," << result[1] << "]" << endl;
    }`
    }
    
    return `    // Unable to parse two-sum test case: ${input}`
  }

  private generateReverseIntegerTest(input: string, index: number): string {
    // For reverse integer: "x = 123"
    const xMatch = input.match(/x\s*=\s*(-?\d+)/)
    if (xMatch) {
      const x = xMatch[1]
      return `    {
        int result = solution.reverse(${x});
        cout << result << endl;
    }`
    }
    
    return `    // Unable to parse reverse-integer test case: ${input}`
  }

  private generatePalindromeTest(input: string, index: number): string {
    // For palindrome: "x = 121"
    const xMatch = input.match(/x\s*=\s*(-?\d+)/)
    if (xMatch) {
      const x = xMatch[1]
      return `    {
        bool result = solution.isPalindrome(${x});
        cout << (result ? "true" : "false") << endl;
    }`
    }
    
    return `    // Unable to parse palindrome test case: ${input}`
  }

  parseTestResults(output: string, testCases: TestCase[]): TestResult[] {
    // Parse the stdout output from test.wasm and validate against expected results
    const lines = output.split('\n').filter(line => line.trim().length > 0)
    const results: TestResult[] = []
    
    testCases.forEach((testCase, index) => {
      const actualOutput = lines[index] || ''
      const passed = validateOutput(testCase.expectedOutput, actualOutput)
      
      results.push({
        testCase: index + 1,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: actualOutput.trim(),
        error: !passed ? `Expected: ${testCase.expectedOutput}, Got: ${actualOutput.trim()}` : undefined
      })
    })
    
    return results
  }
}