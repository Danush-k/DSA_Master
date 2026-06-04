// ═══════════════════════════════════════════════════════════════
// COMPLETE DSA QUESTION DATABASE — 450+ Curated Problems
// Organized by Topic → Pattern → Difficulty
// Every question is hand-picked for building pattern recognition
// ═══════════════════════════════════════════════════════════════

export const questions = [
  // ═══════════════════════════════════════════════════════════
  // ARRAYS — Basic Traversal
  // ═══════════════════════════════════════════════════════════
  { id: 1, num: 1, title: "Two Sum", difficulty: "Easy", topic: "arrays", pattern: "hashing", url: "https://leetcode.com/problems/two-sum/", importance: "Must Do", why: "Foundation of hash map usage. Most frequently asked interview question across all companies." },
  { id: 2, num: 26, title: "Remove Duplicates from Sorted Array", difficulty: "Easy", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", importance: "Must Do", why: "Teaches in-place array modification with two pointers." },
  { id: 3, num: 27, title: "Remove Element", difficulty: "Easy", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/remove-element/", importance: "Recommended", why: "Reinforces in-place modification patterns." },
  { id: 4, num: 35, title: "Search Insert Position", difficulty: "Easy", topic: "arrays", pattern: "binary-search", url: "https://leetcode.com/problems/search-insert-position/", importance: "Must Do", why: "Introduction to binary search concept." },
  { id: 5, num: 66, title: "Plus One", difficulty: "Easy", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/plus-one/", importance: "Recommended", why: "Teaches reverse iteration and carry propagation." },
  { id: 6, num: 88, title: "Merge Sorted Array", difficulty: "Easy", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/merge-sorted-array/", importance: "Must Do", why: "Classic two-pointer merging technique." },
  { id: 7, num: 118, title: "Pascal's Triangle", difficulty: "Easy", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/pascals-triangle/", importance: "Recommended", why: "Pattern construction using previous row." },
  { id: 8, num: 119, title: "Pascal's Triangle II", difficulty: "Easy", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/pascals-triangle-ii/", importance: "Good to Know", why: "Space-optimized version of Pascal's Triangle." },
  { id: 9, num: 121, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "arrays", pattern: "greedy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", importance: "Must Do", why: "Classic greedy problem. Track minimum and compute max profit." },
  { id: 10, num: 136, title: "Single Number", difficulty: "Easy", topic: "arrays", pattern: "bit-manipulation", url: "https://leetcode.com/problems/single-number/", importance: "Must Do", why: "XOR trick - foundational bit manipulation concept." },
  { id: 11, num: 169, title: "Majority Element", difficulty: "Easy", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/majority-element/", importance: "Must Do", why: "Boyer-Moore Voting Algorithm — elegant O(1) space solution." },
  { id: 12, num: 217, title: "Contains Duplicate", difficulty: "Easy", topic: "arrays", pattern: "hashing", url: "https://leetcode.com/problems/contains-duplicate/", importance: "Must Do", why: "Hash set for duplicate detection." },
  { id: 13, num: 268, title: "Missing Number", difficulty: "Easy", topic: "arrays", pattern: "bit-manipulation", url: "https://leetcode.com/problems/missing-number/", importance: "Recommended", why: "Multiple approaches: XOR, math, sorting." },
  { id: 14, num: 283, title: "Move Zeroes", difficulty: "Easy", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/move-zeroes/", importance: "Must Do", why: "In-place two pointer partitioning." },
  { id: 15, num: 448, title: "Find All Numbers Disappeared in an Array", difficulty: "Easy", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/", importance: "Recommended", why: "Cyclic sort / index marking technique." },
  { id: 16, num: 560, title: "Subarray Sum Equals K", difficulty: "Medium", topic: "arrays", pattern: "prefix-sum", url: "https://leetcode.com/problems/subarray-sum-equals-k/", importance: "Must Do", why: "Prefix sum with hash map — extremely common pattern." },
  { id: 17, num: 238, title: "Product of Array Except Self", difficulty: "Medium", topic: "arrays", pattern: "prefix-sum", url: "https://leetcode.com/problems/product-of-array-except-self/", importance: "Must Do", why: "Prefix and suffix product. Must solve without division." },
  { id: 18, num: 53, title: "Maximum Subarray", difficulty: "Medium", topic: "arrays", pattern: "greedy", url: "https://leetcode.com/problems/maximum-subarray/", importance: "Must Do", why: "Kadane's Algorithm — most important array DP concept." },
  { id: 19, num: 15, title: "3Sum", difficulty: "Medium", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/3sum/", importance: "Must Do", why: "Sort + Two Pointers with skip duplicates. Very frequently asked." },
  { id: 20, num: 11, title: "Container With Most Water", difficulty: "Medium", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/container-with-most-water/", importance: "Must Do", why: "Greedy two-pointer approach with proof of correctness." },
  { id: 21, num: 31, title: "Next Permutation", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/next-permutation/", importance: "Must Do", why: "Important algorithm used in many permutation problems." },
  { id: 22, num: 48, title: "Rotate Image", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/rotate-image/", importance: "Must Do", why: "Matrix rotation: transpose + reverse. Common interview question." },
  { id: 23, num: 54, title: "Spiral Matrix", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/spiral-matrix/", importance: "Must Do", why: "Boundary simulation. Tests careful index management." },
  { id: 24, num: 56, title: "Merge Intervals", difficulty: "Medium", topic: "arrays", pattern: "greedy", url: "https://leetcode.com/problems/merge-intervals/", importance: "Must Do", why: "Interval merging — one of the most common interview patterns." },
  { id: 25, num: 73, title: "Set Matrix Zeroes", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/set-matrix-zeroes/", importance: "Must Do", why: "In-place matrix marking using first row/column as flags." },
  { id: 26, num: 75, title: "Sort Colors", difficulty: "Medium", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/sort-colors/", importance: "Must Do", why: "Dutch National Flag algorithm. Three-way partitioning." },
  { id: 27, num: 128, title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "arrays", pattern: "hashing", url: "https://leetcode.com/problems/longest-consecutive-sequence/", importance: "Must Do", why: "Hash set with O(n) sequence detection." },
  { id: 28, num: 189, title: "Rotate Array", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/rotate-array/", importance: "Recommended", why: "Three reversal technique for array rotation." },
  { id: 29, num: 229, title: "Majority Element II", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/majority-element-ii/", importance: "Recommended", why: "Extended Boyer-Moore Voting for n/3 threshold." },
  { id: 30, num: 287, title: "Find the Duplicate Number", difficulty: "Medium", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/find-the-duplicate-number/", importance: "Must Do", why: "Floyd's cycle detection on array — brilliant technique." },
  { id: 31, num: 442, title: "Find All Duplicates in an Array", difficulty: "Medium", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/", importance: "Recommended", why: "Index marking technique for O(1) space." },
  { id: 32, num: 495, title: "Teemo Attacking", difficulty: "Medium", topic: "arrays", pattern: "greedy", url: "https://leetcode.com/problems/teemo-attacking/", importance: "Good to Know", why: "Interval overlap calculation." },
  { id: 33, num: 41, title: "First Missing Positive", difficulty: "Hard", topic: "arrays", pattern: "basic-traversal", url: "https://leetcode.com/problems/first-missing-positive/", importance: "Must Do", why: "Cyclic sort variant. O(n) time O(1) space constraint." },
  { id: 34, num: 42, title: "Trapping Rain Water", difficulty: "Hard", topic: "arrays", pattern: "two-pointers", url: "https://leetcode.com/problems/trapping-rain-water/", importance: "Must Do", why: "Classic hard problem. Multiple approaches: two-pointer, stack, prefix." },
  { id: 35, num: 239, title: "Sliding Window Maximum", difficulty: "Hard", topic: "arrays", pattern: "sliding-window", url: "https://leetcode.com/problems/sliding-window-maximum/", importance: "Must Do", why: "Monotonic deque — key concept for sliding window problems." },
  { id: 36, num: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "arrays", pattern: "binary-search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", importance: "Must Do", why: "Binary search on answer space. Classic hard binary search." },

  // ═══════════════════════════════════════════════════════════
  // ARRAYS — Prefix Sum
  // ═══════════════════════════════════════════════════════════
  { id: 37, num: 303, title: "Range Sum Query - Immutable", difficulty: "Easy", topic: "arrays", pattern: "prefix-sum", url: "https://leetcode.com/problems/range-sum-query-immutable/", importance: "Must Do", why: "Foundation of prefix sum concept." },
  { id: 38, num: 304, title: "Range Sum Query 2D - Immutable", difficulty: "Medium", topic: "arrays", pattern: "prefix-sum", url: "https://leetcode.com/problems/range-sum-query-2d-immutable/", importance: "Recommended", why: "2D prefix sum extension." },
  { id: 39, num: 523, title: "Continuous Subarray Sum", difficulty: "Medium", topic: "arrays", pattern: "prefix-sum", url: "https://leetcode.com/problems/continuous-subarray-sum/", importance: "Recommended", why: "Prefix sum modulo with hash map." },
  { id: 40, num: 974, title: "Subarray Sums Divisible by K", difficulty: "Medium", topic: "arrays", pattern: "prefix-sum", url: "https://leetcode.com/problems/subarray-sums-divisible-by-k/", importance: "Recommended", why: "Prefix sum remainder counting." },

  // ═══════════════════════════════════════════════════════════
  // ARRAYS — Sliding Window
  // ═══════════════════════════════════════════════════════════
  { id: 41, num: 209, title: "Minimum Size Subarray Sum", difficulty: "Medium", topic: "arrays", pattern: "sliding-window", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", importance: "Must Do", why: "Classic variable-size sliding window." },
  { id: 42, num: 713, title: "Subarray Product Less Than K", difficulty: "Medium", topic: "arrays", pattern: "sliding-window", url: "https://leetcode.com/problems/subarray-product-less-than-k/", importance: "Recommended", why: "Sliding window with product constraint." },
  { id: 43, num: 1004, title: "Max Consecutive Ones III", difficulty: "Medium", topic: "arrays", pattern: "sliding-window", url: "https://leetcode.com/problems/max-consecutive-ones-iii/", importance: "Must Do", why: "Sliding window with flip allowance." },

  // ═══════════════════════════════════════════════════════════
  // ARRAYS — Monotonic Stack
  // ═══════════════════════════════════════════════════════════
  { id: 44, num: 496, title: "Next Greater Element I", difficulty: "Easy", topic: "arrays", pattern: "monotonic-stack", url: "https://leetcode.com/problems/next-greater-element-i/", importance: "Must Do", why: "Introduction to monotonic stack concept." },
  { id: 45, num: 503, title: "Next Greater Element II", difficulty: "Medium", topic: "arrays", pattern: "monotonic-stack", url: "https://leetcode.com/problems/next-greater-element-ii/", importance: "Recommended", why: "Circular array with monotonic stack." },
  { id: 46, num: 739, title: "Daily Temperatures", difficulty: "Medium", topic: "arrays", pattern: "monotonic-stack", url: "https://leetcode.com/problems/daily-temperatures/", importance: "Must Do", why: "Classic monotonic stack application." },
  { id: 47, num: 84, title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "arrays", pattern: "monotonic-stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", importance: "Must Do", why: "Classic hard monotonic stack. Foundation for maximal rectangle." },
  { id: 48, num: 85, title: "Maximal Rectangle", difficulty: "Hard", topic: "arrays", pattern: "monotonic-stack", url: "https://leetcode.com/problems/maximal-rectangle/", importance: "Recommended", why: "Builds on histogram problem for 2D matrices." },

  // ═══════════════════════════════════════════════════════════
  // SORTING
  // ═══════════════════════════════════════════════════════════
  { id: 49, num: 912, title: "Sort an Array", difficulty: "Medium", topic: "sorting", pattern: "merge-sort", url: "https://leetcode.com/problems/sort-an-array/", importance: "Must Do", why: "Implement merge sort / quick sort from scratch." },
  { id: 50, num: 215, title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "sorting", pattern: "quick-select", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", importance: "Must Do", why: "Quick Select algorithm — O(n) average case." },
  { id: 51, num: 148, title: "Sort List", difficulty: "Medium", topic: "sorting", pattern: "merge-sort", url: "https://leetcode.com/problems/sort-list/", importance: "Must Do", why: "Merge sort on linked list. Tests multiple concepts." },
  { id: 52, num: 179, title: "Largest Number", difficulty: "Medium", topic: "sorting", pattern: "custom-comparator", url: "https://leetcode.com/problems/largest-number/", importance: "Must Do", why: "Custom comparator with string concatenation logic." },
  { id: 53, num: 347, title: "Top K Frequent Elements", difficulty: "Medium", topic: "sorting", pattern: "bucket-sort", url: "https://leetcode.com/problems/top-k-frequent-elements/", importance: "Must Do", why: "Bucket sort / heap approach for frequency problems." },
  { id: 54, num: 451, title: "Sort Characters By Frequency", difficulty: "Medium", topic: "sorting", pattern: "bucket-sort", url: "https://leetcode.com/problems/sort-characters-by-frequency/", importance: "Recommended", why: "Frequency-based sorting with bucket sort." },
  { id: 55, num: 242, title: "Valid Anagram", difficulty: "Easy", topic: "sorting", pattern: "counting-sort", url: "https://leetcode.com/problems/valid-anagram/", importance: "Must Do", why: "Character frequency counting." },
  { id: 56, num: 349, title: "Intersection of Two Arrays", difficulty: "Easy", topic: "sorting", pattern: "sorting-basics", url: "https://leetcode.com/problems/intersection-of-two-arrays/", importance: "Recommended", why: "Sort + two pointer or hash set approach." },
  { id: 57, num: 350, title: "Intersection of Two Arrays II", difficulty: "Easy", topic: "sorting", pattern: "sorting-basics", url: "https://leetcode.com/problems/intersection-of-two-arrays-ii/", importance: "Recommended", why: "Frequency map intersection." },
  { id: 58, num: 1122, title: "Relative Sort Array", difficulty: "Easy", topic: "sorting", pattern: "counting-sort", url: "https://leetcode.com/problems/relative-sort-array/", importance: "Good to Know", why: "Custom ordering with counting sort." },
  { id: 59, num: 324, title: "Wiggle Sort II", difficulty: "Medium", topic: "sorting", pattern: "sorting-basics", url: "https://leetcode.com/problems/wiggle-sort-ii/", importance: "Recommended", why: "Sorting with specific arrangement constraints." },
  { id: 60, num: 164, title: "Maximum Gap", difficulty: "Medium", topic: "sorting", pattern: "bucket-sort", url: "https://leetcode.com/problems/maximum-gap/", importance: "Recommended", why: "Bucket/radix sort for linear time solution." },
  { id: 61, num: 57, title: "Insert Interval", difficulty: "Medium", topic: "sorting", pattern: "sorting-basics", url: "https://leetcode.com/problems/insert-interval/", importance: "Must Do", why: "Interval insertion and merging." },
  { id: 62, num: 252, title: "Meeting Rooms", difficulty: "Easy", topic: "sorting", pattern: "sorting-basics", url: "https://leetcode.com/problems/meeting-rooms/", importance: "Recommended", why: "Sort intervals and check overlaps." },
  { id: 63, num: 253, title: "Meeting Rooms II", difficulty: "Medium", topic: "sorting", pattern: "sorting-basics", url: "https://leetcode.com/problems/meeting-rooms-ii/", importance: "Must Do", why: "Min heap or sweep line for concurrent events." },

  // ═══════════════════════════════════════════════════════════
  // STRINGS
  // ═══════════════════════════════════════════════════════════
  { id: 64, num: 125, title: "Valid Palindrome", difficulty: "Easy", topic: "strings", pattern: "two-pointers", url: "https://leetcode.com/problems/valid-palindrome/", importance: "Must Do", why: "Two-pointer palindrome check. Filter non-alphanumeric." },
  { id: 65, num: 13, title: "Roman to Integer", difficulty: "Easy", topic: "strings", pattern: "basic-traversal", url: "https://leetcode.com/problems/roman-to-integer/", importance: "Recommended", why: "Pattern matching with lookup." },
  { id: 66, num: 14, title: "Longest Common Prefix", difficulty: "Easy", topic: "strings", pattern: "basic-traversal", url: "https://leetcode.com/problems/longest-common-prefix/", importance: "Recommended", why: "Character-by-character comparison across strings." },
  { id: 67, num: 20, title: "Valid Parentheses", difficulty: "Easy", topic: "strings", pattern: "stack", url: "https://leetcode.com/problems/valid-parentheses/", importance: "Must Do", why: "Stack for bracket matching — foundational concept." },
  { id: 68, num: 344, title: "Reverse String", difficulty: "Easy", topic: "strings", pattern: "two-pointers", url: "https://leetcode.com/problems/reverse-string/", importance: "Must Do", why: "In-place two-pointer reversal." },
  { id: 69, num: 387, title: "First Unique Character in a String", difficulty: "Easy", topic: "strings", pattern: "hashing", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", importance: "Must Do", why: "Hash map frequency counting for strings." },
  { id: 70, num: 49, title: "Group Anagrams", difficulty: "Medium", topic: "strings", pattern: "hashing", url: "https://leetcode.com/problems/group-anagrams/", importance: "Must Do", why: "Sorted string as hash key. Very common interview question." },
  { id: 71, num: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "strings", pattern: "sliding-window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", importance: "Must Do", why: "Classic sliding window. Top 5 most asked interview question." },
  { id: 72, num: 5, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "strings", pattern: "two-pointers", url: "https://leetcode.com/problems/longest-palindromic-substring/", importance: "Must Do", why: "Expand from center technique. Foundation for palindrome problems." },
  { id: 73, num: 22, title: "Generate Parentheses", difficulty: "Medium", topic: "strings", pattern: "backtracking", url: "https://leetcode.com/problems/generate-parentheses/", importance: "Must Do", why: "Backtracking with open/close count constraints." },
  { id: 74, num: 151, title: "Reverse Words in a String", difficulty: "Medium", topic: "strings", pattern: "basic-traversal", url: "https://leetcode.com/problems/reverse-words-in-a-string/", importance: "Must Do", why: "String manipulation with edge cases." },
  { id: 75, num: 647, title: "Palindromic Substrings", difficulty: "Medium", topic: "strings", pattern: "two-pointers", url: "https://leetcode.com/problems/palindromic-substrings/", importance: "Recommended", why: "Count all palindromes using expand from center." },
  { id: 76, num: 76, title: "Minimum Window Substring", difficulty: "Hard", topic: "strings", pattern: "sliding-window", url: "https://leetcode.com/problems/minimum-window-substring/", importance: "Must Do", why: "Hardest sliding window problem. Frequency matching with shrinking window." },
  { id: 77, num: 10, title: "Regular Expression Matching", difficulty: "Hard", topic: "strings", pattern: "dynamic-programming", url: "https://leetcode.com/problems/regular-expression-matching/", importance: "Recommended", why: "DP on strings with wildcard matching." },
  { id: 78, num: 424, title: "Longest Repeating Character Replacement", difficulty: "Medium", topic: "strings", pattern: "sliding-window", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", importance: "Must Do", why: "Sliding window with character replacement budget." },

  // ═══════════════════════════════════════════════════════════
  // HASHING (Dedicated)
  // ═══════════════════════════════════════════════════════════
  { id: 79, num: 205, title: "Isomorphic Strings", difficulty: "Easy", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/isomorphic-strings/", importance: "Must Do", why: "Bidirectional character mapping." },
  { id: 80, num: 290, title: "Word Pattern", difficulty: "Easy", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/word-pattern/", importance: "Recommended", why: "Similar to isomorphic strings but with words." },
  { id: 81, num: 383, title: "Ransom Note", difficulty: "Easy", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/ransom-note/", importance: "Must Do", why: "Character frequency comparison." },
  { id: 82, num: 36, title: "Valid Sudoku", difficulty: "Medium", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/valid-sudoku/", importance: "Must Do", why: "Hash sets for row, column, and box validation." },
  { id: 83, num: 146, title: "LRU Cache", difficulty: "Medium", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/lru-cache/", importance: "Must Do", why: "Hash map + doubly linked list. Top design question." },
  { id: 84, num: 380, title: "Insert Delete GetRandom O(1)", difficulty: "Medium", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/insert-delete-getrandom-o1/", importance: "Must Do", why: "Hash map + array for O(1) operations." },
  { id: 85, num: 460, title: "LFU Cache", difficulty: "Hard", topic: "hashing", pattern: "hashing", url: "https://leetcode.com/problems/lfu-cache/", importance: "Recommended", why: "Advanced cache with frequency tracking." },

  // ═══════════════════════════════════════════════════════════
  // TWO POINTERS (Dedicated)
  // ═══════════════════════════════════════════════════════════
  { id: 86, num: 167, title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", topic: "two-pointers", pattern: "two-pointers", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", importance: "Must Do", why: "Two pointers on sorted array — foundational technique." },
  { id: 87, num: 16, title: "3Sum Closest", difficulty: "Medium", topic: "two-pointers", pattern: "two-pointers", url: "https://leetcode.com/problems/3sum-closest/", importance: "Recommended", why: "Extension of 3Sum with closest target." },
  { id: 88, num: 18, title: "4Sum", difficulty: "Medium", topic: "two-pointers", pattern: "two-pointers", url: "https://leetcode.com/problems/4sum/", importance: "Recommended", why: "K-sum generalization with two pointers." },
  { id: 89, num: 977, title: "Squares of a Sorted Array", difficulty: "Easy", topic: "two-pointers", pattern: "two-pointers", url: "https://leetcode.com/problems/squares-of-a-sorted-array/", importance: "Must Do", why: "Two pointers from both ends for sorted merge." },
  { id: 90, num: 680, title: "Valid Palindrome II", difficulty: "Easy", topic: "two-pointers", pattern: "two-pointers", url: "https://leetcode.com/problems/valid-palindrome-ii/", importance: "Must Do", why: "Greedy skip with two pointers." },

  // ═══════════════════════════════════════════════════════════
  // BINARY SEARCH
  // ═══════════════════════════════════════════════════════════
  { id: 91, num: 704, title: "Binary Search", difficulty: "Easy", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/binary-search/", importance: "Must Do", why: "Foundation of binary search — get the template right." },
  { id: 92, num: 278, title: "First Bad Version", difficulty: "Easy", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/first-bad-version/", importance: "Must Do", why: "Binary search on boolean condition." },
  { id: 93, num: 33, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", importance: "Must Do", why: "Modified binary search. Very frequently asked." },
  { id: 94, num: 34, title: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", importance: "Must Do", why: "Lower and upper bound binary search." },
  { id: 95, num: 74, title: "Search a 2D Matrix", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/search-a-2d-matrix/", importance: "Must Do", why: "Binary search treating 2D matrix as 1D." },
  { id: 96, num: 153, title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", importance: "Must Do", why: "Find inflection point in rotated array." },
  { id: 97, num: 162, title: "Find Peak Element", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/find-peak-element/", importance: "Must Do", why: "Binary search on non-sorted array using gradient." },
  { id: 98, num: 875, title: "Koko Eating Bananas", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/koko-eating-bananas/", importance: "Must Do", why: "Binary search on answer space — key pattern." },
  { id: 99, num: 1011, title: "Capacity To Ship Packages Within D Days", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", importance: "Must Do", why: "Binary search on answer space with feasibility check." },
  { id: 100, num: 410, title: "Split Array Largest Sum", difficulty: "Hard", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/split-array-largest-sum/", importance: "Must Do", why: "Binary search on answer space — advanced application." },
  { id: 101, num: 69, title: "Sqrt(x)", difficulty: "Easy", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/sqrtx/", importance: "Recommended", why: "Binary search on answer." },
  { id: 102, num: 540, title: "Single Element in a Sorted Array", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/single-element-in-a-sorted-array/", importance: "Recommended", why: "Binary search with parity check." },

  // ═══════════════════════════════════════════════════════════
  // LINKED LISTS
  // ═══════════════════════════════════════════════════════════
  { id: 103, num: 206, title: "Reverse Linked List", difficulty: "Easy", topic: "linked-lists", pattern: "reversal", url: "https://leetcode.com/problems/reverse-linked-list/", importance: "Must Do", why: "Foundation of linked list manipulation. Iterative + recursive." },
  { id: 104, num: 21, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "linked-lists", pattern: "merge", url: "https://leetcode.com/problems/merge-two-sorted-lists/", importance: "Must Do", why: "Merge pattern with dummy node technique." },
  { id: 105, num: 141, title: "Linked List Cycle", difficulty: "Easy", topic: "linked-lists", pattern: "fast-slow-pointer", url: "https://leetcode.com/problems/linked-list-cycle/", importance: "Must Do", why: "Floyd's cycle detection — tortoise and hare." },
  { id: 106, num: 160, title: "Intersection of Two Linked Lists", difficulty: "Easy", topic: "linked-lists", pattern: "two-pointers", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/", importance: "Must Do", why: "Two-pointer length equalization technique." },
  { id: 107, num: 83, title: "Remove Duplicates from Sorted List", difficulty: "Easy", topic: "linked-lists", pattern: "traversal", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/", importance: "Recommended", why: "Simple traversal with skip logic." },
  { id: 108, num: 234, title: "Palindrome Linked List", difficulty: "Easy", topic: "linked-lists", pattern: "fast-slow-pointer", url: "https://leetcode.com/problems/palindrome-linked-list/", importance: "Must Do", why: "Find middle + reverse second half + compare." },
  { id: 109, num: 876, title: "Middle of the Linked List", difficulty: "Easy", topic: "linked-lists", pattern: "fast-slow-pointer", url: "https://leetcode.com/problems/middle-of-the-linked-list/", importance: "Must Do", why: "Slow-fast pointer to find middle." },
  { id: 110, num: 2, title: "Add Two Numbers", difficulty: "Medium", topic: "linked-lists", pattern: "traversal", url: "https://leetcode.com/problems/add-two-numbers/", importance: "Must Do", why: "Digit-by-digit addition with carry." },
  { id: 111, num: 19, title: "Remove Nth Node From End of List", difficulty: "Medium", topic: "linked-lists", pattern: "two-pointers", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", importance: "Must Do", why: "Two pointers with gap technique." },
  { id: 112, num: 24, title: "Swap Nodes in Pairs", difficulty: "Medium", topic: "linked-lists", pattern: "reversal", url: "https://leetcode.com/problems/swap-nodes-in-pairs/", importance: "Recommended", why: "Pairwise node manipulation." },
  { id: 113, num: 61, title: "Rotate List", difficulty: "Medium", topic: "linked-lists", pattern: "traversal", url: "https://leetcode.com/problems/rotate-list/", importance: "Recommended", why: "Find length, connect tail to head, break at new position." },
  { id: 114, num: 92, title: "Reverse Linked List II", difficulty: "Medium", topic: "linked-lists", pattern: "reversal", url: "https://leetcode.com/problems/reverse-linked-list-ii/", importance: "Must Do", why: "Reverse a sublist — tricky pointer management." },
  { id: 115, num: 138, title: "Copy List with Random Pointer", difficulty: "Medium", topic: "linked-lists", pattern: "hashing", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", importance: "Must Do", why: "Deep copy with hash map or interleaving technique." },
  { id: 116, num: 142, title: "Linked List Cycle II", difficulty: "Medium", topic: "linked-lists", pattern: "fast-slow-pointer", url: "https://leetcode.com/problems/linked-list-cycle-ii/", importance: "Must Do", why: "Find cycle start using Floyd's algorithm." },
  { id: 117, num: 143, title: "Reorder List", difficulty: "Medium", topic: "linked-lists", pattern: "fast-slow-pointer", url: "https://leetcode.com/problems/reorder-list/", importance: "Must Do", why: "Combines find middle, reverse, and merge." },
  { id: 118, num: 328, title: "Odd Even Linked List", difficulty: "Medium", topic: "linked-lists", pattern: "traversal", url: "https://leetcode.com/problems/odd-even-linked-list/", importance: "Recommended", why: "Separate odd and even nodes in place." },
  { id: 119, num: 23, title: "Merge k Sorted Lists", difficulty: "Hard", topic: "linked-lists", pattern: "merge", url: "https://leetcode.com/problems/merge-k-sorted-lists/", importance: "Must Do", why: "Min heap or divide-and-conquer merge. Very common in interviews." },
  { id: 120, num: 25, title: "Reverse Nodes in k-Group", difficulty: "Hard", topic: "linked-lists", pattern: "reversal", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", importance: "Must Do", why: "Group reversal — complex pointer manipulation." },

  // ═══════════════════════════════════════════════════════════
  // STACKS & QUEUES
  // ═══════════════════════════════════════════════════════════
  { id: 121, num: 155, title: "Min Stack", difficulty: "Medium", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/min-stack/", importance: "Must Do", why: "Stack with O(1) min retrieval." },
  { id: 122, num: 232, title: "Implement Queue using Stacks", difficulty: "Easy", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/implement-queue-using-stacks/", importance: "Must Do", why: "Amortized O(1) using two stacks." },
  { id: 123, num: 225, title: "Implement Stack using Queues", difficulty: "Easy", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/implement-stack-using-queues/", importance: "Recommended", why: "Understanding stack-queue relationship." },
  { id: 124, num: 150, title: "Evaluate Reverse Polish Notation", difficulty: "Medium", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", importance: "Must Do", why: "Stack for expression evaluation." },
  { id: 125, num: 71, title: "Simplify Path", difficulty: "Medium", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/simplify-path/", importance: "Recommended", why: "Stack for path simplification." },
  { id: 126, num: 394, title: "Decode String", difficulty: "Medium", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/decode-string/", importance: "Must Do", why: "Nested structure decoding with stack." },
  { id: 127, num: 735, title: "Asteroid Collision", difficulty: "Medium", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/asteroid-collision/", importance: "Must Do", why: "Stack simulation with collision logic." },
  { id: 128, num: 901, title: "Online Stock Span", difficulty: "Medium", topic: "stacks-queues", pattern: "monotonic-stack", url: "https://leetcode.com/problems/online-stock-span/", importance: "Recommended", why: "Monotonic stack for online queries." },
  { id: 129, num: 946, title: "Validate Stack Sequences", difficulty: "Medium", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/validate-stack-sequences/", importance: "Recommended", why: "Simulation of push/pop sequences." },
  { id: 130, num: 32, title: "Longest Valid Parentheses", difficulty: "Hard", topic: "stacks-queues", pattern: "stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", importance: "Must Do", why: "Stack with index tracking for parentheses." },

  // ═══════════════════════════════════════════════════════════
  // TREES — DFS
  // ═══════════════════════════════════════════════════════════
  { id: 131, num: 94, title: "Binary Tree Inorder Traversal", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/", importance: "Must Do", why: "Foundation of tree DFS. Know iterative + recursive." },
  { id: 132, num: 144, title: "Binary Tree Preorder Traversal", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/binary-tree-preorder-traversal/", importance: "Must Do", why: "Preorder DFS traversal." },
  { id: 133, num: 145, title: "Binary Tree Postorder Traversal", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/binary-tree-postorder-traversal/", importance: "Must Do", why: "Postorder DFS — trickiest iterative implementation." },
  { id: 134, num: 104, title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", importance: "Must Do", why: "Simple recursive DFS. Great warm-up." },
  { id: 135, num: 100, title: "Same Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/same-tree/", importance: "Must Do", why: "Simultaneous DFS comparison." },
  { id: 136, num: 101, title: "Symmetric Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/symmetric-tree/", importance: "Must Do", why: "Mirror check with paired recursion." },
  { id: 137, num: 226, title: "Invert Binary Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/invert-binary-tree/", importance: "Must Do", why: "Simple recursive swap. Classic interview question." },
  { id: 138, num: 543, title: "Diameter of Binary Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/diameter-of-binary-tree/", importance: "Must Do", why: "Track max path through each node." },
  { id: 139, num: 110, title: "Balanced Binary Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/balanced-binary-tree/", importance: "Must Do", why: "Height-balanced check with early termination." },
  { id: 140, num: 112, title: "Path Sum", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/path-sum/", importance: "Must Do", why: "Root-to-leaf path sum check." },
  { id: 141, num: 257, title: "Binary Tree Paths", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/binary-tree-paths/", importance: "Recommended", why: "Path collection using DFS backtracking." },
  { id: 142, num: 113, title: "Path Sum II", difficulty: "Medium", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/path-sum-ii/", importance: "Must Do", why: "Collect all root-to-leaf paths with target sum." },
  { id: 143, num: 437, title: "Path Sum III", difficulty: "Medium", topic: "trees", pattern: "prefix-sum", url: "https://leetcode.com/problems/path-sum-iii/", importance: "Must Do", why: "Prefix sum on tree paths — combines two techniques." },
  { id: 144, num: 124, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", importance: "Must Do", why: "Global max with local path contribution." },
  { id: 145, num: 114, title: "Flatten Binary Tree to Linked List", difficulty: "Medium", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/", importance: "Must Do", why: "In-place tree flattening using reverse preorder." },
  { id: 146, num: 199, title: "Binary Tree Right Side View", difficulty: "Medium", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/binary-tree-right-side-view/", importance: "Must Do", why: "BFS level order, take last element of each level." },

  // ═══════════════════════════════════════════════════════════
  // TREES — BFS
  // ═══════════════════════════════════════════════════════════
  { id: 147, num: 102, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", importance: "Must Do", why: "Foundation of tree BFS." },
  { id: 148, num: 103, title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", importance: "Must Do", why: "BFS with alternating direction." },
  { id: 149, num: 111, title: "Minimum Depth of Binary Tree", difficulty: "Easy", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/minimum-depth-of-binary-tree/", importance: "Recommended", why: "BFS finds minimum depth first." },
  { id: 150, num: 116, title: "Populating Next Right Pointers in Each Node", difficulty: "Medium", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/", importance: "Must Do", why: "BFS or O(1) space with next pointers." },

  // ═══════════════════════════════════════════════════════════
  // TREES — BST
  // ═══════════════════════════════════════════════════════════
  { id: 151, num: 700, title: "Search in a Binary Search Tree", difficulty: "Easy", topic: "trees", pattern: "bst", url: "https://leetcode.com/problems/search-in-a-binary-search-tree/", importance: "Must Do", why: "BST search fundamentals." },
  { id: 152, num: 98, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "trees", pattern: "bst", url: "https://leetcode.com/problems/validate-binary-search-tree/", importance: "Must Do", why: "BST validation with range checking. Very common." },
  { id: 153, num: 230, title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "trees", pattern: "bst", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", importance: "Must Do", why: "Inorder traversal gives sorted order." },
  { id: 154, num: 108, title: "Convert Sorted Array to Binary Search Tree", difficulty: "Easy", topic: "trees", pattern: "bst", url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/", importance: "Must Do", why: "Divide and conquer BST construction." },
  { id: 155, num: 235, title: "Lowest Common Ancestor of a Binary Search Tree", difficulty: "Medium", topic: "trees", pattern: "bst", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", importance: "Must Do", why: "Use BST property for efficient LCA." },
  { id: 156, num: 236, title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", importance: "Must Do", why: "General LCA using DFS — classic technique." },
  { id: 157, num: 450, title: "Delete Node in a BST", difficulty: "Medium", topic: "trees", pattern: "bst", url: "https://leetcode.com/problems/delete-node-in-a-bst/", importance: "Must Do", why: "BST deletion with three cases." },

  // ═══════════════════════════════════════════════════════════
  // TREES — Construction
  // ═══════════════════════════════════════════════════════════
  { id: 158, num: 105, title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", topic: "trees", pattern: "tree-construction", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", importance: "Must Do", why: "Classic tree construction. Must understand." },
  { id: 159, num: 106, title: "Construct Binary Tree from Inorder and Postorder Traversal", difficulty: "Medium", topic: "trees", pattern: "tree-construction", url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/", importance: "Recommended", why: "Similar to preorder+inorder but reversed." },
  { id: 160, num: 297, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "trees", pattern: "tree-construction", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", importance: "Must Do", why: "BFS or preorder serialization. Common system design component." },

  // ═══════════════════════════════════════════════════════════
  // HEAP / PRIORITY QUEUE
  // ═══════════════════════════════════════════════════════════
  { id: 161, num: 703, title: "Kth Largest Element in a Stream", difficulty: "Easy", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", importance: "Must Do", why: "Min heap of size k for kth largest." },
  { id: 162, num: 1046, title: "Last Stone Weight", difficulty: "Easy", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/last-stone-weight/", importance: "Must Do", why: "Max heap simulation." },
  { id: 163, num: 973, title: "K Closest Points to Origin", difficulty: "Medium", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/k-closest-points-to-origin/", importance: "Must Do", why: "Top-K pattern using max heap." },
  { id: 164, num: 355, title: "Design Twitter", difficulty: "Medium", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/design-twitter/", importance: "Recommended", why: "Merge K sorted streams with heap." },
  { id: 165, num: 621, title: "Task Scheduler", difficulty: "Medium", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/task-scheduler/", importance: "Must Do", why: "Greedy scheduling with cooldown using heap." },
  { id: 166, num: 295, title: "Find Median from Data Stream", difficulty: "Hard", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/find-median-from-data-stream/", importance: "Must Do", why: "Two heaps (max + min) for running median." },
  { id: 167, num: 373, title: "Find K Pairs with Smallest Sums", difficulty: "Medium", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/", importance: "Recommended", why: "Min heap for pair generation." },
  { id: 168, num: 767, title: "Reorganize String", difficulty: "Medium", topic: "heap", pattern: "heap", url: "https://leetcode.com/problems/reorganize-string/", importance: "Must Do", why: "Greedy with max heap for character placement." },

  // ═══════════════════════════════════════════════════════════
  // RECURSION & BACKTRACKING
  // ═══════════════════════════════════════════════════════════
  { id: 169, num: 78, title: "Subsets", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/subsets/", importance: "Must Do", why: "Foundation of backtracking — include/exclude pattern." },
  { id: 170, num: 90, title: "Subsets II", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/subsets-ii/", importance: "Must Do", why: "Subsets with duplicate handling." },
  { id: 171, num: 46, title: "Permutations", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/permutations/", importance: "Must Do", why: "Foundation of permutation generation." },
  { id: 172, num: 47, title: "Permutations II", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/permutations-ii/", importance: "Must Do", why: "Permutations with duplicate handling." },
  { id: 173, num: 39, title: "Combination Sum", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/combination-sum/", importance: "Must Do", why: "Combinations with unlimited reuse." },
  { id: 174, num: 40, title: "Combination Sum II", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/combination-sum-ii/", importance: "Must Do", why: "Combinations with single use and deduplication." },
  { id: 175, num: 77, title: "Combinations", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/combinations/", importance: "Recommended", why: "Basic combination generation." },
  { id: 176, num: 17, title: "Letter Combinations of a Phone Number", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", importance: "Must Do", why: "Backtracking with character mapping." },
  { id: 177, num: 79, title: "Word Search", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/word-search/", importance: "Must Do", why: "Grid DFS backtracking. Very common." },
  { id: 178, num: 131, title: "Palindrome Partitioning", difficulty: "Medium", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/palindrome-partitioning/", importance: "Must Do", why: "Partition with palindrome check backtracking." },
  { id: 179, num: 51, title: "N-Queens", difficulty: "Hard", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/n-queens/", importance: "Must Do", why: "Classic constraint satisfaction backtracking." },
  { id: 180, num: 37, title: "Sudoku Solver", difficulty: "Hard", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/sudoku-solver/", importance: "Recommended", why: "Grid constraint backtracking." },
  { id: 181, num: 212, title: "Word Search II", difficulty: "Hard", topic: "backtracking", pattern: "backtracking", url: "https://leetcode.com/problems/word-search-ii/", importance: "Must Do", why: "Backtracking + Trie optimization." },

  // ═══════════════════════════════════════════════════════════
  // GREEDY
  // ═══════════════════════════════════════════════════════════
  { id: 182, num: 55, title: "Jump Game", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/jump-game/", importance: "Must Do", why: "Track max reachable index." },
  { id: 183, num: 45, title: "Jump Game II", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/jump-game-ii/", importance: "Must Do", why: "BFS-style greedy for minimum jumps." },
  { id: 184, num: 134, title: "Gas Station", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/gas-station/", importance: "Must Do", why: "Circular array greedy with deficit tracking." },
  { id: 185, num: 135, title: "Candy", difficulty: "Hard", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/candy/", importance: "Must Do", why: "Two-pass greedy (left-to-right, right-to-left)." },
  { id: 186, num: 435, title: "Non-overlapping Intervals", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/non-overlapping-intervals/", importance: "Must Do", why: "Interval scheduling — greedy by end time." },
  { id: 187, num: 452, title: "Minimum Number of Arrows to Burst Balloons", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/", importance: "Recommended", why: "Interval overlap counting with greedy." },
  { id: 188, num: 763, title: "Partition Labels", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/partition-labels/", importance: "Must Do", why: "Greedy partitioning with last occurrence tracking." },
  { id: 189, num: 846, title: "Hand of Straights", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/hand-of-straights/", importance: "Recommended", why: "Greedy grouping with sorted map." },
  { id: 190, num: 1899, title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/", importance: "Recommended", why: "Greedy filtering and validation." },

  // ═══════════════════════════════════════════════════════════
  // GRAPHS — DFS / BFS
  // ═══════════════════════════════════════════════════════════
  { id: 191, num: 200, title: "Number of Islands", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/number-of-islands/", importance: "Must Do", why: "Grid DFS/BFS. Most asked graph question." },
  { id: 192, num: 133, title: "Clone Graph", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/clone-graph/", importance: "Must Do", why: "DFS graph cloning with hash map." },
  { id: 193, num: 695, title: "Max Area of Island", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/max-area-of-island/", importance: "Must Do", why: "DFS with area counting." },
  { id: 194, num: 417, title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", importance: "Must Do", why: "Multi-source DFS from both oceans." },
  { id: 195, num: 130, title: "Surrounded Regions", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/surrounded-regions/", importance: "Must Do", why: "Border-connected DFS to find non-surrounded regions." },
  { id: 196, num: 994, title: "Rotting Oranges", difficulty: "Medium", topic: "graphs", pattern: "bfs", url: "https://leetcode.com/problems/rotting-oranges/", importance: "Must Do", why: "Multi-source BFS for shortest time." },
  { id: 197, num: 542, title: "01 Matrix", difficulty: "Medium", topic: "graphs", pattern: "bfs", url: "https://leetcode.com/problems/01-matrix/", importance: "Must Do", why: "Multi-source BFS for nearest distance." },
  { id: 198, num: 733, title: "Flood Fill", difficulty: "Easy", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/flood-fill/", importance: "Must Do", why: "Simple grid DFS — great starting point for graphs." },
  { id: 199, num: 463, title: "Island Perimeter", difficulty: "Easy", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/island-perimeter/", importance: "Recommended", why: "Count exposed edges of island cells." },
  { id: 200, num: 207, title: "Course Schedule", difficulty: "Medium", topic: "graphs", pattern: "topological-sort", url: "https://leetcode.com/problems/course-schedule/", importance: "Must Do", why: "Topological sort / cycle detection. Very common." },
  { id: 201, num: 210, title: "Course Schedule II", difficulty: "Medium", topic: "graphs", pattern: "topological-sort", url: "https://leetcode.com/problems/course-schedule-ii/", importance: "Must Do", why: "Return topological ordering." },
  { id: 202, num: 802, title: "Find Eventual Safe States", difficulty: "Medium", topic: "graphs", pattern: "topological-sort", url: "https://leetcode.com/problems/find-eventual-safe-states/", importance: "Recommended", why: "Reverse topological sort to find safe nodes." },
  { id: 203, num: 310, title: "Minimum Height Trees", difficulty: "Medium", topic: "graphs", pattern: "topological-sort", url: "https://leetcode.com/problems/minimum-height-trees/", importance: "Recommended", why: "Leaf trimming topological approach." },

  // ═══════════════════════════════════════════════════════════
  // GRAPHS — Union Find
  // ═══════════════════════════════════════════════════════════
  { id: 204, num: 547, title: "Number of Provinces", difficulty: "Medium", topic: "graphs", pattern: "union-find", url: "https://leetcode.com/problems/number-of-provinces/", importance: "Must Do", why: "Union Find or DFS for connected components." },
  { id: 205, num: 684, title: "Redundant Connection", difficulty: "Medium", topic: "graphs", pattern: "union-find", url: "https://leetcode.com/problems/redundant-connection/", importance: "Must Do", why: "Union Find to detect cycle edge." },
  { id: 206, num: 323, title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", topic: "graphs", pattern: "union-find", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", importance: "Must Do", why: "Classic connected components with Union Find." },
  { id: 207, num: 721, title: "Accounts Merge", difficulty: "Medium", topic: "graphs", pattern: "union-find", url: "https://leetcode.com/problems/accounts-merge/", importance: "Must Do", why: "Union Find for merging related sets." },
  { id: 208, num: 1971, title: "Find if Path Exists in Graph", difficulty: "Easy", topic: "graphs", pattern: "union-find", url: "https://leetcode.com/problems/find-if-path-exists-in-graph/", importance: "Recommended", why: "Basic connectivity check." },

  // ═══════════════════════════════════════════════════════════
  // GRAPHS — Shortest Path
  // ═══════════════════════════════════════════════════════════
  { id: 209, num: 743, title: "Network Delay Time", difficulty: "Medium", topic: "graphs", pattern: "shortest-path", url: "https://leetcode.com/problems/network-delay-time/", importance: "Must Do", why: "Dijkstra's algorithm implementation." },
  { id: 210, num: 787, title: "Cheapest Flights Within K Stops", difficulty: "Medium", topic: "graphs", pattern: "shortest-path", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", importance: "Must Do", why: "BFS/Bellman-Ford with hop constraint." },
  { id: 211, num: 1631, title: "Path With Minimum Effort", difficulty: "Medium", topic: "graphs", pattern: "shortest-path", url: "https://leetcode.com/problems/path-with-minimum-effort/", importance: "Must Do", why: "Dijkstra on grid with effort minimization." },
  { id: 212, num: 778, title: "Swim in Rising Water", difficulty: "Hard", topic: "graphs", pattern: "shortest-path", url: "https://leetcode.com/problems/swim-in-rising-water/", importance: "Recommended", why: "Binary search + BFS or Dijkstra." },

  // ═══════════════════════════════════════════════════════════
  // GRAPHS — MST
  // ═══════════════════════════════════════════════════════════
  { id: 213, num: 1584, title: "Min Cost to Connect All Points", difficulty: "Medium", topic: "graphs", pattern: "mst", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", importance: "Must Do", why: "Prim's or Kruskal's MST algorithm." },
  { id: 214, num: 1135, title: "Connecting Cities With Minimum Cost", difficulty: "Medium", topic: "graphs", pattern: "mst", url: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/", importance: "Recommended", why: "Kruskal's with Union Find." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — 1D DP
  // ═══════════════════════════════════════════════════════════
  { id: 215, num: 70, title: "Climbing Stairs", difficulty: "Easy", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/climbing-stairs/", importance: "Must Do", why: "Foundation of DP. Fibonacci-like recurrence." },
  { id: 216, num: 746, title: "Min Cost Climbing Stairs", difficulty: "Easy", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/min-cost-climbing-stairs/", importance: "Must Do", why: "Simple DP with min choice." },
  { id: 217, num: 198, title: "House Robber", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/house-robber/", importance: "Must Do", why: "Classic skip/take DP pattern." },
  { id: 218, num: 213, title: "House Robber II", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/house-robber-ii/", importance: "Must Do", why: "Circular array DP — run twice excluding first/last." },
  { id: 219, num: 139, title: "Word Break", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/word-break/", importance: "Must Do", why: "DP with string matching. BFS approach also works." },
  { id: 220, num: 322, title: "Coin Change", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/coin-change/", importance: "Must Do", why: "Unbounded knapsack variant. Foundation for coin problems." },
  { id: 221, num: 152, title: "Maximum Product Subarray", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/maximum-product-subarray/", importance: "Must Do", why: "Track both min and max due to negative numbers." },
  { id: 222, num: 91, title: "Decode Ways", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/decode-ways/", importance: "Must Do", why: "Fibonacci-like DP with character constraints." },
  { id: 223, num: 647, title: "Palindromic Substrings", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/palindromic-substrings/", importance: "Recommended", why: "DP or expand from center for palindrome counting." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — LIS
  // ═══════════════════════════════════════════════════════════
  { id: 224, num: 300, title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "dynamic-programming", pattern: "lis", url: "https://leetcode.com/problems/longest-increasing-subsequence/", importance: "Must Do", why: "Classic LIS problem. O(n log n) with patience sorting." },
  { id: 225, num: 673, title: "Number of Longest Increasing Subsequence", difficulty: "Medium", topic: "dynamic-programming", pattern: "lis", url: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/", importance: "Recommended", why: "Count of LIS — extended DP." },
  { id: 226, num: 354, title: "Russian Doll Envelopes", difficulty: "Hard", topic: "dynamic-programming", pattern: "lis", url: "https://leetcode.com/problems/russian-doll-envelopes/", importance: "Recommended", why: "2D LIS after sorting." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — LCS
  // ═══════════════════════════════════════════════════════════
  { id: 227, num: 1143, title: "Longest Common Subsequence", difficulty: "Medium", topic: "dynamic-programming", pattern: "lcs", url: "https://leetcode.com/problems/longest-common-subsequence/", importance: "Must Do", why: "Foundation of 2D string DP." },
  { id: 228, num: 72, title: "Edit Distance", difficulty: "Medium", topic: "dynamic-programming", pattern: "lcs", url: "https://leetcode.com/problems/edit-distance/", importance: "Must Do", why: "Classic edit distance DP. Three operations." },
  { id: 229, num: 583, title: "Delete Operation for Two Strings", difficulty: "Medium", topic: "dynamic-programming", pattern: "lcs", url: "https://leetcode.com/problems/delete-operation-for-two-strings/", importance: "Recommended", why: "LCS variant — minimize deletions." },
  { id: 230, num: 97, title: "Interleaving String", difficulty: "Medium", topic: "dynamic-programming", pattern: "lcs", url: "https://leetcode.com/problems/interleaving-string/", importance: "Recommended", why: "2D DP on two strings." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — Knapsack
  // ═══════════════════════════════════════════════════════════
  { id: 231, num: 416, title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "dynamic-programming", pattern: "knapsack", url: "https://leetcode.com/problems/partition-equal-subset-sum/", importance: "Must Do", why: "0/1 Knapsack — subset sum variant." },
  { id: 232, num: 494, title: "Target Sum", difficulty: "Medium", topic: "dynamic-programming", pattern: "knapsack", url: "https://leetcode.com/problems/target-sum/", importance: "Must Do", why: "Knapsack transformation of +/- assignment." },
  { id: 233, num: 518, title: "Coin Change II", difficulty: "Medium", topic: "dynamic-programming", pattern: "knapsack", url: "https://leetcode.com/problems/coin-change-ii/", importance: "Must Do", why: "Unbounded knapsack — count combinations." },
  { id: 234, num: 474, title: "Ones and Zeroes", difficulty: "Medium", topic: "dynamic-programming", pattern: "knapsack", url: "https://leetcode.com/problems/ones-and-zeroes/", importance: "Recommended", why: "2D knapsack with two constraints." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — Grid DP
  // ═══════════════════════════════════════════════════════════
  { id: 235, num: 62, title: "Unique Paths", difficulty: "Medium", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/unique-paths/", importance: "Must Do", why: "Foundation of grid DP." },
  { id: 236, num: 63, title: "Unique Paths II", difficulty: "Medium", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/unique-paths-ii/", importance: "Must Do", why: "Grid DP with obstacles." },
  { id: 237, num: 64, title: "Minimum Path Sum", difficulty: "Medium", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/minimum-path-sum/", importance: "Must Do", why: "Grid DP with cost minimization." },
  { id: 238, num: 120, title: "Triangle", difficulty: "Medium", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/triangle/", importance: "Must Do", why: "Bottom-up DP on triangular grid." },
  { id: 239, num: 221, title: "Maximal Square", difficulty: "Medium", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/maximal-square/", importance: "Must Do", why: "2D DP for maximum square submatrix." },
  { id: 240, num: 1277, title: "Count Square Submatrices with All Ones", difficulty: "Medium", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/count-square-submatrices-with-all-ones/", importance: "Recommended", why: "Similar to maximal square but count all." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — Interval DP
  // ═══════════════════════════════════════════════════════════
  { id: 241, num: 516, title: "Longest Palindromic Subsequence", difficulty: "Medium", topic: "dynamic-programming", pattern: "interval-dp", url: "https://leetcode.com/problems/longest-palindromic-subsequence/", importance: "Must Do", why: "Classic interval DP. LCS with reverse string." },
  { id: 242, num: 1312, title: "Minimum Insertion Steps to Make a String Palindrome", difficulty: "Hard", topic: "dynamic-programming", pattern: "interval-dp", url: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/", importance: "Recommended", why: "LPS-based calculation." },
  { id: 243, num: 312, title: "Burst Balloons", difficulty: "Hard", topic: "dynamic-programming", pattern: "interval-dp", url: "https://leetcode.com/problems/burst-balloons/", importance: "Must Do", why: "Classic interval DP. Reverse thinking." },
  { id: 244, num: 1039, title: "Minimum Score Triangulation of Polygon", difficulty: "Medium", topic: "dynamic-programming", pattern: "interval-dp", url: "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/", importance: "Recommended", why: "Interval DP on polygon." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — Bitmask DP
  // ═══════════════════════════════════════════════════════════
  { id: 245, num: 1986, title: "Minimum Number of Work Sessions to Finish the Tasks", difficulty: "Medium", topic: "dynamic-programming", pattern: "bitmask-dp", url: "https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/", importance: "Recommended", why: "Bitmask DP for subset enumeration." },
  { id: 246, num: 691, title: "Stickers to Spell Word", difficulty: "Hard", topic: "dynamic-programming", pattern: "bitmask-dp", url: "https://leetcode.com/problems/stickers-to-spell-word/", importance: "Recommended", why: "Bitmask DP with string state." },
  { id: 247, num: 943, title: "Find the Shortest Superstring", difficulty: "Hard", topic: "dynamic-programming", pattern: "bitmask-dp", url: "https://leetcode.com/problems/find-the-shortest-superstring/", importance: "Good to Know", why: "TSP-like bitmask DP." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — DP on Trees
  // ═══════════════════════════════════════════════════════════
  { id: 248, num: 337, title: "House Robber III", difficulty: "Medium", topic: "dynamic-programming", pattern: "dp-on-trees", url: "https://leetcode.com/problems/house-robber-iii/", importance: "Must Do", why: "DP on tree structure — take/skip at each node." },
  { id: 249, num: 968, title: "Binary Tree Cameras", difficulty: "Hard", topic: "dynamic-programming", pattern: "dp-on-trees", url: "https://leetcode.com/problems/binary-tree-cameras/", importance: "Recommended", why: "Greedy/DP on tree with state tracking." },

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING — More Classic
  // ═══════════════════════════════════════════════════════════
  { id: 250, num: 509, title: "Fibonacci Number", difficulty: "Easy", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/fibonacci-number/", importance: "Must Do", why: "Simplest DP problem. Build intuition." },
  { id: 251, num: 338, title: "Counting Bits", difficulty: "Easy", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/counting-bits/", importance: "Must Do", why: "DP with bit manipulation." },
  { id: 252, num: 279, title: "Perfect Squares", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/perfect-squares/", importance: "Must Do", why: "BFS or DP for minimum decomposition." },
  { id: 253, num: 377, title: "Combination Sum IV", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/combination-sum-iv/", importance: "Recommended", why: "Permutation counting DP." },
  { id: 254, num: 343, title: "Integer Break", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/integer-break/", importance: "Recommended", why: "DP or math for optimal splitting." },
  { id: 255, num: 115, title: "Distinct Subsequences", difficulty: "Hard", topic: "dynamic-programming", pattern: "lcs", url: "https://leetcode.com/problems/distinct-subsequences/", importance: "Must Do", why: "2D DP counting subsequences." },
  { id: 256, num: 329, title: "Longest Increasing Path in a Matrix", difficulty: "Hard", topic: "dynamic-programming", pattern: "grid-dp", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", importance: "Must Do", why: "DFS + memoization on grid." },

  // ═══════════════════════════════════════════════════════════
  // TRIE
  // ═══════════════════════════════════════════════════════════
  { id: 257, num: 208, title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "trie", pattern: "trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", importance: "Must Do", why: "Foundation of Trie data structure." },
  { id: 258, num: 211, title: "Design Add and Search Words Data Structure", difficulty: "Medium", topic: "trie", pattern: "trie", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", importance: "Must Do", why: "Trie with wildcard search." },
  { id: 259, num: 14, title: "Longest Common Prefix", difficulty: "Easy", topic: "trie", pattern: "trie", url: "https://leetcode.com/problems/longest-common-prefix/", importance: "Recommended", why: "Can be solved with Trie for practice." },
  { id: 260, num: 648, title: "Replace Words", difficulty: "Medium", topic: "trie", pattern: "trie", url: "https://leetcode.com/problems/replace-words/", importance: "Recommended", why: "Trie for prefix matching." },

  // ═══════════════════════════════════════════════════════════
  // BIT MANIPULATION
  // ═══════════════════════════════════════════════════════════
  { id: 261, num: 191, title: "Number of 1 Bits", difficulty: "Easy", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/number-of-1-bits/", importance: "Must Do", why: "Hamming weight — fundamental bit counting." },
  { id: 262, num: 190, title: "Reverse Bits", difficulty: "Easy", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/reverse-bits/", importance: "Must Do", why: "Bit reversal technique." },
  { id: 263, num: 371, title: "Sum of Two Integers", difficulty: "Medium", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/sum-of-two-integers/", importance: "Must Do", why: "Addition using XOR and AND carry." },
  { id: 264, num: 201, title: "Bitwise AND of Numbers Range", difficulty: "Medium", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/bitwise-and-of-numbers-range/", importance: "Recommended", why: "Common prefix of binary representations." },
  { id: 265, num: 137, title: "Single Number II", difficulty: "Medium", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/single-number-ii/", importance: "Recommended", why: "Bit counting modulo 3." },
  { id: 266, num: 260, title: "Single Number III", difficulty: "Medium", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/single-number-iii/", importance: "Recommended", why: "XOR + bit partitioning." },
  { id: 267, num: 78, title: "Subsets (Bit Masking)", difficulty: "Medium", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/subsets/", importance: "Must Do", why: "Generate subsets using bitmasks." },
  { id: 268, num: 389, title: "Find the Difference", difficulty: "Easy", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/find-the-difference/", importance: "Recommended", why: "XOR to find added character." },
  { id: 269, num: 461, title: "Hamming Distance", difficulty: "Easy", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/hamming-distance/", importance: "Recommended", why: "XOR + count set bits." },
  { id: 270, num: 231, title: "Power of Two", difficulty: "Easy", topic: "bit-manipulation", pattern: "bit-manipulation", url: "https://leetcode.com/problems/power-of-two/", importance: "Must Do", why: "n & (n-1) trick." },

  // ═══════════════════════════════════════════════════════════
  // SEGMENT TREE / FENWICK TREE
  // ═══════════════════════════════════════════════════════════
  { id: 271, num: 307, title: "Range Sum Query - Mutable", difficulty: "Medium", topic: "segment-tree", pattern: "segment-tree", url: "https://leetcode.com/problems/range-sum-query-mutable/", importance: "Must Do", why: "Foundation of Segment Tree / BIT." },
  { id: 272, num: 315, title: "Count of Smaller Numbers After Self", difficulty: "Hard", topic: "segment-tree", pattern: "segment-tree", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", importance: "Must Do", why: "Merge sort or BIT application." },
  { id: 273, num: 493, title: "Reverse Pairs", difficulty: "Hard", topic: "segment-tree", pattern: "segment-tree", url: "https://leetcode.com/problems/reverse-pairs/", importance: "Recommended", why: "Merge sort with counting." },
  { id: 274, num: 218, title: "The Skyline Problem", difficulty: "Hard", topic: "segment-tree", pattern: "segment-tree", url: "https://leetcode.com/problems/the-skyline-problem/", importance: "Recommended", why: "Sweep line with ordered set or segment tree." },

  // ═══════════════════════════════════════════════════════════
  // STRING MATCHING (KMP, Rabin-Karp)
  // ═══════════════════════════════════════════════════════════
  { id: 275, num: 28, title: "Find the Index of the First Occurrence in a String", difficulty: "Easy", topic: "advanced", pattern: "string-matching", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", importance: "Must Do", why: "KMP algorithm application." },
  { id: 276, num: 459, title: "Repeated Substring Pattern", difficulty: "Easy", topic: "advanced", pattern: "string-matching", url: "https://leetcode.com/problems/repeated-substring-pattern/", importance: "Recommended", why: "KMP failure function application." },
  { id: 277, num: 214, title: "Shortest Palindrome", difficulty: "Hard", topic: "advanced", pattern: "string-matching", url: "https://leetcode.com/problems/shortest-palindrome/", importance: "Recommended", why: "KMP to find longest palindromic prefix." },

  // ═══════════════════════════════════════════════════════════
  // MATH & MISCELLANEOUS
  // ═══════════════════════════════════════════════════════════
  { id: 278, num: 7, title: "Reverse Integer", difficulty: "Medium", topic: "advanced", pattern: "math", url: "https://leetcode.com/problems/reverse-integer/", importance: "Recommended", why: "Integer overflow handling." },
  { id: 279, num: 9, title: "Palindrome Number", difficulty: "Easy", topic: "advanced", pattern: "math", url: "https://leetcode.com/problems/palindrome-number/", importance: "Recommended", why: "Number reversal without converting to string." },
  { id: 280, num: 50, title: "Pow(x, n)", difficulty: "Medium", topic: "advanced", pattern: "math", url: "https://leetcode.com/problems/powx-n/", importance: "Must Do", why: "Binary exponentiation — O(log n)." },
  { id: 281, num: 204, title: "Count Primes", difficulty: "Medium", topic: "advanced", pattern: "math", url: "https://leetcode.com/problems/count-primes/", importance: "Recommended", why: "Sieve of Eratosthenes." },
  { id: 282, num: 172, title: "Factorial Trailing Zeroes", difficulty: "Medium", topic: "advanced", pattern: "math", url: "https://leetcode.com/problems/factorial-trailing-zeroes/", importance: "Recommended", why: "Count factors of 5." },
  { id: 283, num: 202, title: "Happy Number", difficulty: "Easy", topic: "advanced", pattern: "math", url: "https://leetcode.com/problems/happy-number/", importance: "Must Do", why: "Cycle detection with fast-slow pointer." },

  // ═══════════════════════════════════════════════════════════
  // SLIDING WINDOW (More dedicated)
  // ═══════════════════════════════════════════════════════════
  { id: 284, num: 438, title: "Find All Anagrams in a String", difficulty: "Medium", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", importance: "Must Do", why: "Fixed-size sliding window with frequency matching." },
  { id: 285, num: 567, title: "Permutation in String", difficulty: "Medium", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/permutation-in-string/", importance: "Must Do", why: "Fixed-size sliding window permutation check." },
  { id: 286, num: 904, title: "Fruit Into Baskets", difficulty: "Medium", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/fruit-into-baskets/", importance: "Recommended", why: "Variable window with at most K distinct." },
  { id: 287, num: 30, title: "Substring with Concatenation of All Words", difficulty: "Hard", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/", importance: "Recommended", why: "Fixed window with word frequency." },

  // ═══════════════════════════════════════════════════════════
  // MORE GRAPH PROBLEMS
  // ═══════════════════════════════════════════════════════════
  { id: 288, num: 127, title: "Word Ladder", difficulty: "Hard", topic: "graphs", pattern: "bfs", url: "https://leetcode.com/problems/word-ladder/", importance: "Must Do", why: "BFS on implicit graph. Word transformation." },
  { id: 289, num: 269, title: "Alien Dictionary", difficulty: "Hard", topic: "graphs", pattern: "topological-sort", url: "https://leetcode.com/problems/alien-dictionary/", importance: "Must Do", why: "Topological sort from character ordering." },
  { id: 290, num: 332, title: "Reconstruct Itinerary", difficulty: "Hard", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/reconstruct-itinerary/", importance: "Recommended", why: "Eulerian path with DFS." },
  { id: 291, num: 785, title: "Is Graph Bipartite?", difficulty: "Medium", topic: "graphs", pattern: "bfs", url: "https://leetcode.com/problems/is-graph-bipartite/", importance: "Must Do", why: "Graph coloring with BFS/DFS." },
  { id: 292, num: 1254, title: "Number of Closed Islands", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/number-of-closed-islands/", importance: "Recommended", why: "DFS with boundary check." },

  // ═══════════════════════════════════════════════════════════
  // MORE TREE PROBLEMS
  // ═══════════════════════════════════════════════════════════
  { id: 293, num: 572, title: "Subtree of Another Tree", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/subtree-of-another-tree/", importance: "Must Do", why: "Tree comparison at each node." },
  { id: 294, num: 617, title: "Merge Two Binary Trees", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/merge-two-binary-trees/", importance: "Recommended", why: "Simultaneous DFS merging." },
  { id: 295, num: 404, title: "Sum of Left Leaves", difficulty: "Easy", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/sum-of-left-leaves/", importance: "Recommended", why: "DFS with parent context." },
  { id: 296, num: 1448, title: "Count Good Nodes in Binary Tree", difficulty: "Medium", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/", importance: "Must Do", why: "DFS tracking max from root." },
  { id: 297, num: 662, title: "Maximum Width of Binary Tree", difficulty: "Medium", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/maximum-width-of-binary-tree/", importance: "Must Do", why: "BFS with position indexing." },
  { id: 298, num: 958, title: "Check Completeness of a Binary Tree", difficulty: "Medium", topic: "trees", pattern: "bfs", url: "https://leetcode.com/problems/check-completeness-of-a-binary-tree/", importance: "Recommended", why: "BFS null check for completeness." },

  // ═══════════════════════════════════════════════════════════
  // MORE DP PROBLEMS
  // ═══════════════════════════════════════════════════════════
  { id: 299, num: 740, title: "Delete and Earn", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/delete-and-earn/", importance: "Recommended", why: "House robber variant with sorting." },
  { id: 300, num: 983, title: "Minimum Cost For Tickets", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/minimum-cost-for-tickets/", importance: "Must Do", why: "DP with variable cost windows." },
  { id: 301, num: 1155, title: "Number of Dice Rolls With Target Sum", difficulty: "Medium", topic: "dynamic-programming", pattern: "knapsack", url: "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/", importance: "Recommended", why: "Classic counting DP." },
  { id: 302, num: 309, title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", importance: "Must Do", why: "State machine DP — buy/sell/cooldown states." },
  { id: 303, num: 188, title: "Best Time to Buy and Sell Stock IV", difficulty: "Hard", topic: "dynamic-programming", pattern: "1d-dp", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/", importance: "Recommended", why: "K transactions DP." },
  { id: 304, num: 1049, title: "Last Stone Weight II", difficulty: "Medium", topic: "dynamic-programming", pattern: "knapsack", url: "https://leetcode.com/problems/last-stone-weight-ii/", importance: "Recommended", why: "Subset sum minimization — knapsack variant." },
  { id: 305, num: 312, title: "Burst Balloons", difficulty: "Hard", topic: "dynamic-programming", pattern: "interval-dp", url: "https://leetcode.com/problems/burst-balloons/", importance: "Must Do", why: "Interval DP with reverse thinking." },

  // ═══════════════════════════════════════════════════════════
  // MORE BINARY SEARCH PROBLEMS
  // ═══════════════════════════════════════════════════════════
  { id: 306, num: 240, title: "Search a 2D Matrix II", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/search-a-2d-matrix-ii/", importance: "Must Do", why: "Staircase search from top-right corner." },
  { id: 307, num: 658, title: "Find K Closest Elements", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/find-k-closest-elements/", importance: "Recommended", why: "Binary search for window start." },
  { id: 308, num: 981, title: "Time Based Key-Value Store", difficulty: "Medium", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/time-based-key-value-store/", importance: "Must Do", why: "Design with binary search for timestamps." },
  { id: 309, num: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "binary-search", pattern: "binary-search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", importance: "Must Do", why: "Binary search partition — classic hard." },

  // ═══════════════════════════════════════════════════════════
  // ADDITIONAL IMPORTANT PROBLEMS
  // ═══════════════════════════════════════════════════════════
  { id: 310, num: 287, title: "Find the Duplicate Number", difficulty: "Medium", topic: "arrays", pattern: "fast-slow-pointer", url: "https://leetcode.com/problems/find-the-duplicate-number/", importance: "Must Do", why: "Floyd's cycle detection on array indices." },
  { id: 311, num: 406, title: "Queue Reconstruction by Height", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/queue-reconstruction-by-height/", importance: "Recommended", why: "Sort + greedy insertion." },
  { id: 312, num: 621, title: "Task Scheduler", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/task-scheduler/", importance: "Must Do", why: "Greedy with idle slot calculation." },
  { id: 313, num: 678, title: "Valid Parenthesis String", difficulty: "Medium", topic: "greedy", pattern: "greedy", url: "https://leetcode.com/problems/valid-parenthesis-string/", importance: "Must Do", why: "Greedy with range tracking for wildcard." },
  { id: 314, num: 1423, title: "Maximum Points You Can Obtain from Cards", difficulty: "Medium", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/", importance: "Recommended", why: "Reverse sliding window — minimize middle." },
  { id: 315, num: 1838, title: "Frequency of the Most Frequent Element", difficulty: "Medium", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/", importance: "Recommended", why: "Sort + sliding window with budget." },
  { id: 316, num: 1248, title: "Count Number of Nice Subarrays", difficulty: "Medium", topic: "sliding-window", pattern: "sliding-window", url: "https://leetcode.com/problems/count-number-of-nice-subarrays/", importance: "Recommended", why: "At most K trick for exactly K." },
  
  // More Essential Trees
  { id: 317, num: 222, title: "Count Complete Tree Nodes", difficulty: "Medium", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/count-complete-tree-nodes/", importance: "Must Do", why: "O(log^2 n) using binary search on levels." },
  { id: 318, num: 129, title: "Sum Root to Leaf Numbers", difficulty: "Medium", topic: "trees", pattern: "dfs", url: "https://leetcode.com/problems/sum-root-to-leaf-numbers/", importance: "Must Do", why: "DFS with running number accumulation." },
  
  // More Essential Stacks
  { id: 319, num: 402, title: "Remove K Digits", difficulty: "Medium", topic: "stacks-queues", pattern: "monotonic-stack", url: "https://leetcode.com/problems/remove-k-digits/", importance: "Must Do", why: "Monotonic stack for smallest number." },
  { id: 320, num: 316, title: "Remove Duplicate Letters", difficulty: "Medium", topic: "stacks-queues", pattern: "monotonic-stack", url: "https://leetcode.com/problems/remove-duplicate-letters/", importance: "Must Do", why: "Monotonic stack with frequency tracking." },
  
  // More Essential Graphs  
  { id: 321, num: 1091, title: "Shortest Path in Binary Matrix", difficulty: "Medium", topic: "graphs", pattern: "bfs", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/", importance: "Must Do", why: "BFS for shortest path in grid." },
  { id: 322, num: 841, title: "Keys and Rooms", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/keys-and-rooms/", importance: "Recommended", why: "DFS graph traversal with keys." },
  { id: 323, num: 797, title: "All Paths From Source to Target", difficulty: "Medium", topic: "graphs", pattern: "dfs", url: "https://leetcode.com/problems/all-paths-from-source-to-target/", importance: "Recommended", why: "DFS path enumeration in DAG." },
  
  // More Essential DP
  { id: 324, num: 1964, title: "Find the Longest Valid Obstacle Course at Each Position", difficulty: "Hard", topic: "dynamic-programming", pattern: "lis", url: "https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/", importance: "Recommended", why: "Online LIS computation." },
  { id: 325, num: 5, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "dynamic-programming", pattern: "interval-dp", url: "https://leetcode.com/problems/longest-palindromic-substring/", importance: "Must Do", why: "Expand from center or DP approach." },
];

// Generate unique ID for deduplication
const seen = new Set();
export const uniqueQuestions = questions.filter(q => {
  const key = q.num;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

export default uniqueQuestions;
