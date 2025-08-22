# 7. Reverse Integer

Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.

## Example 1:
```
Input: x = 123
Output: 321
```

## Example 2:
```
Input: x = -123
Output: -321
```

## Example 3:
```
Input: x = 120
Output: 21
```

## Constraints:
- -2³¹ <= x <= 2³¹ - 1

## Hints:
1. Use modulo operator to get the last digit.
2. Be careful about integer overflow.
3. Consider using long long for intermediate calculations.