import { Problem, Difficulty } from '../types/problems'

export const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: '1. Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Constraints:**
- 2 <= nums.length <= 10⁴
- -10⁹ <= nums[i] <= 10⁹
- -10⁹ <= target <= 10⁹
- Only one valid answer exists.`,
    difficulty: Difficulty.Easy,
    topic: ['Array', 'Hash Table'],
    template: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};

// Test function
int main() {
    Solution solution;
    
    // Test case 1
    vector<int> nums1 = {2, 7, 11, 15};
    int target1 = 9;
    vector<int> result1 = solution.twoSum(nums1, target1);
    cout << "[" << result1[0] << "," << result1[1] << "]" << endl;
    
    // Test case 2
    vector<int> nums2 = {3, 2, 4};
    int target2 = 6;
    vector<int> result2 = solution.twoSum(nums2, target2);
    cout << "[" << result2[0] << "," << result2[1] << "]" << endl;
    
    return 0;
}`,
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        description: 'Basic test case'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        description: 'Different order'
      }
    ],
    hints: [
      'Try using a hash map to store the numbers you\'ve seen.',
      'For each number, check if target - number exists in the hash map.',
      'Don\'t forget to return the indices, not the values.'
    ]
  },
  {
    id: 'reverse-integer',
    title: '7. Reverse Integer',
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.

**Example 1:**
\`\`\`
Input: x = 123
Output: 321
\`\`\`

**Example 2:**
\`\`\`
Input: x = -123
Output: -321
\`\`\`

**Example 3:**
\`\`\`
Input: x = 120
Output: 21
\`\`\`

**Constraints:**
- -2³¹ <= x <= 2³¹ - 1`,
    difficulty: Difficulty.Medium,
    topic: ['Math'],
    template: `#include <iostream>
#include <climits>
using namespace std;

class Solution {
public:
    int reverse(int x) {
        // Your code here
        
    }
};

// Test function
int main() {
    Solution solution;
    
    cout << solution.reverse(123) << endl;
    cout << solution.reverse(-123) << endl;
    cout << solution.reverse(120) << endl;
    
    return 0;
}`,
    testCases: [
      {
        input: 'x = 123',
        expectedOutput: '321',
        description: 'Positive number'
      },
      {
        input: 'x = -123',
        expectedOutput: '-321',
        description: 'Negative number'
      },
      {
        input: 'x = 120',
        expectedOutput: '21',
        description: 'Number with trailing zero'
      }
    ],
    hints: [
      'Use modulo operator to get the last digit.',
      'Be careful about integer overflow.',
      'Consider using long long for intermediate calculations.'
    ]
  },
  {
    id: 'palindrome-number',
    title: '9. Palindrome Number',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

**Example 1:**
\`\`\`
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.
\`\`\`

**Example 2:**
\`\`\`
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
\`\`\`

**Example 3:**
\`\`\`
Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
\`\`\`

**Constraints:**
- -2³¹ <= x <= 2³¹ - 1

**Follow up:** Could you solve it without converting the integer to a string?`,
    difficulty: Difficulty.Easy,
    topic: ['Math'],
    template: `#include <iostream>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        // Your code here
        
    }
};

// Test function
int main() {
    Solution solution;
    
    cout << (solution.isPalindrome(121) ? "true" : "false") << endl;
    cout << (solution.isPalindrome(-121) ? "true" : "false") << endl;
    cout << (solution.isPalindrome(10) ? "true" : "false") << endl;
    
    return 0;
}`,
    testCases: [
      {
        input: 'x = 121',
        expectedOutput: 'true',
        description: 'Positive palindrome'
      },
      {
        input: 'x = -121',
        expectedOutput: 'false',
        description: 'Negative number'
      },
      {
        input: 'x = 10',
        expectedOutput: 'false',
        description: 'Non-palindrome'
      }
    ],
    hints: [
      'Negative numbers are not palindromes.',
      'Try reversing only half of the number.',
      'Compare the first half with the reversed second half.'
    ]
  }
]