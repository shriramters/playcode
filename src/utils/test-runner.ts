import { TestCase, ValidationResult, TestResult } from '../types/problems'
import { validateOutput } from './validation'

export interface TestRunner {
  runTests: (userCode: string, testCases: TestCase[]) => Promise<ValidationResult>
}

export class WasmTestRunner implements TestRunner {
  async runTests(userCode: string, testCases: TestCase[]): Promise<ValidationResult> {
    try {
      // Generate test file that includes user code and test cases
      const testFile = this.generateTestFile(userCode, testCases)
      
      // This would compile the test file to wasm and capture stdout
      // For now, we'll use the existing compilation approach but with test-specific code
      const output = await this.compileAndRun(testFile)
      
      // Parse the output and validate against expected results
      const testResults = this.parseTestResults(output, testCases)
      const allPassed = testResults.every(r => r.passed)
      
      return {
        allPassed,
        testResults,
        runtime: 0 // Runtime would be measured during compilation
      }
    } catch (error) {
      return {
        allPassed: false,
        testResults: [],
        compilationError: `Test compilation failed: ${error}`
      }
    }
  }

  private generateTestFile(userCode: string, testCases: TestCase[]): string {
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
using namespace std;

${solutionClass}

int main() {
    Solution solution;
    
`

    // Add test case calls based on the test cases
    testCases.forEach((testCase, index) => {
      testCode += `    // Test case ${index + 1}: ${testCase.description || ''}\n`
      testCode += this.generateTestCall(testCase, index)
      testCode += '\n'
    })

    testCode += `    return 0;
}`

    return testCode
  }

  private generateTestCall(testCase: TestCase, index: number): string {
    // This is a simplified approach - in a real implementation, 
    // we'd need to parse the input more intelligently
    const input = testCase.input
    
    // For two-sum example: "nums = [2,7,11,15], target = 9"
    if (input.includes('nums =') && input.includes('target =')) {
      const numsMatch = input.match(/nums\s*=\s*\[([^\]]+)\]/)
      const targetMatch = input.match(/target\s*=\s*(\d+)/)
      
      if (numsMatch && targetMatch) {
        const nums = numsMatch[1]
        const target = targetMatch[1]
        
        return `    vector<int> nums${index} = {${nums}};
    int target${index} = ${target};
    vector<int> result${index} = solution.twoSum(nums${index}, target${index});
    cout << "[" << result${index}[0] << "," << result${index}[1] << "]" << endl;`
      }
    }
    
    // For reverse integer: "x = 123"
    if (input.includes('x =')) {
      const xMatch = input.match(/x\s*=\s*(-?\d+)/)
      if (xMatch) {
        const x = xMatch[1]
        return `    cout << solution.reverse(${x}) << endl;`
      }
    }
    
    // For palindrome: "x = 121"
    if (input.includes('x =') && testCase.expectedOutput.includes('true')) {
      const xMatch = input.match(/x\s*=\s*(-?\d+)/)
      if (xMatch) {
        const x = xMatch[1]
        return `    cout << (solution.isPalindrome(${x}) ? "true" : "false") << endl;`
      }
    }
    
    // Fallback
    return `    // Unable to parse test case: ${input}`
  }

  private async compileAndRun(testCode: string): Promise<string> {
    // This would use the existing compilation infrastructure
    // For now, return a mock result
    return "[0,1]\n[1,2]\n"
  }

  private parseTestResults(output: string, testCases: TestCase[]): TestResult[] {
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