import { Problem, Difficulty } from '../types/problems'

// Import all problem files
import twoSumMetadata from '../problems/two-sum/metadata.json'
import twoSumDescription from '../problems/two-sum/description.md?raw'
import twoSumTemplate from '../problems/two-sum/template.cpp?raw'
import twoSumTestCases from '../problems/two-sum/test-cases.json'

import reverseIntegerMetadata from '../problems/reverse-integer/metadata.json'
import reverseIntegerDescription from '../problems/reverse-integer/description.md?raw'
import reverseIntegerTemplate from '../problems/reverse-integer/template.cpp?raw'
import reverseIntegerTestCases from '../problems/reverse-integer/test-cases.json'

import palindromeNumberMetadata from '../problems/palindrome-number/metadata.json'
import palindromeNumberDescription from '../problems/palindrome-number/description.md?raw'
import palindromeNumberTemplate from '../problems/palindrome-number/template.cpp?raw'
import palindromeNumberTestCases from '../problems/palindrome-number/test-cases.json'

// Helper function to convert string difficulty to enum
function getDifficulty(difficulty: string): Difficulty {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return Difficulty.Easy
    case 'medium':
      return Difficulty.Medium
    case 'hard':
      return Difficulty.Hard
    default:
      return Difficulty.Easy
  }
}

// Helper function to extract hints from description
function extractHints(description: string): string[] {
  const hintsMatch = description.match(/## Hints:\n((?:\d+\. .+\n?)+)/);
  if (!hintsMatch) return [];
  
  return hintsMatch[1]
    .split('\n')
    .filter(line => line.trim().match(/^\d+\. /))
    .map(line => line.replace(/^\d+\. /, '').trim());
}

// Create problems from imported data
export const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: twoSumMetadata.id,
    title: twoSumMetadata.title,
    description: twoSumDescription,
    difficulty: getDifficulty(twoSumMetadata.difficulty),
    topic: twoSumMetadata.topics,
    template: twoSumTemplate,
    testCases: twoSumTestCases,
    hints: extractHints(twoSumDescription)
  },
  {
    id: reverseIntegerMetadata.id,
    title: reverseIntegerMetadata.title,
    description: reverseIntegerDescription,
    difficulty: getDifficulty(reverseIntegerMetadata.difficulty),
    topic: reverseIntegerMetadata.topics,
    template: reverseIntegerTemplate,
    testCases: reverseIntegerTestCases,
    hints: extractHints(reverseIntegerDescription)
  },
  {
    id: palindromeNumberMetadata.id,
    title: palindromeNumberMetadata.title,
    description: palindromeNumberDescription,
    difficulty: getDifficulty(palindromeNumberMetadata.difficulty),
    topic: palindromeNumberMetadata.topics,
    template: palindromeNumberTemplate,
    testCases: palindromeNumberTestCases,
    hints: extractHints(palindromeNumberDescription)
  }
]