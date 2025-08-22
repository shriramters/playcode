#include <iostream>
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
}