// ═══════════════════════════════════════════════════════════════
// DSA ROADMAP — Beginner to Master
// 59 concept steps ordered for optimal learning progression
// Each step maps to a (topicId, patternId) and has:
//   - step: global ordering number
//   - youtubeUrl: best tutorial video
//   - level: "Beginner" | "Intermediate" | "Advanced"
//   - description: what you'll learn in this concept
// ═══════════════════════════════════════════════════════════════

export const roadmap = [
  // ─────────────────────────────────────────
  // ARRAYS
  // ─────────────────────────────────────────
  {
    step: 1,
    topicId: "arrays",
    patternId: "basic-traversal",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=37E9ckMDdTk",
    description: "Learn array basics — iteration, in-place modification, index tricks, cyclic sort, and matrix traversal. The foundation of every DSA interview.",
  },
  {
    step: 2,
    topicId: "arrays",
    patternId: "hashing",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=KEs5UyBJ39g",
    description: "Use HashMap and HashSet to reduce O(n²) brute-force to O(n). Essential for pair-sum, frequency counting, and duplicate detection.",
  },
  {
    step: 3,
    topicId: "arrays",
    patternId: "prefix-sum",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=7pJo_rM0z_s",
    description: "Precompute cumulative sums for O(1) range queries. Master prefix + hash map combos for subarray sum problems.",
  },
  {
    step: 4,
    topicId: "arrays",
    patternId: "two-pointers",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=2wB11y5811g",
    description: "Use two indices moving toward each other to solve sorted-array pair problems in O(n). Covers 2Sum, 3Sum, container water, and palindromes.",
  },
  {
    step: 5,
    topicId: "arrays",
    patternId: "sliding-window",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=9Kd9oG6P-r0",
    description: "Maintain a contiguous window expanding right, shrinking left. Fixed window for exact-size problems, variable window for optimal subarray.",
  },
  {
    step: 6,
    topicId: "arrays",
    patternId: "greedy",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=HvB9rj8YZEM",
    description: "Kadane's Algorithm for maximum subarray, Boyer-Moore Voting for majority element, and Dutch National Flag — three must-know greedy patterns.",
  },
  {
    step: 7,
    topicId: "arrays",
    patternId: "monotonic-stack",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=zx5Sw9130L0",
    description: "Maintain a stack in increasing/decreasing order to find next greater/smaller elements in O(n). Foundation for histogram and rain water problems.",
  },
  {
    step: 8,
    topicId: "arrays",
    patternId: "binary-search",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=QX45ClJpGfA",
    description: "Apply binary search on arrays — standard search, first/last position, and search on answer space. Reduces O(n) to O(log n).",
  },
  {
    step: 9,
    topicId: "arrays",
    patternId: "bit-manipulation",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=5yu8G6-1Fz0",
    description: "XOR, AND/OR masks for O(1) tricks. Find single numbers, check power of two, count set bits, and generate subsets via bitmask.",
  },

  // ─────────────────────────────────────────
  // SORTING
  // ─────────────────────────────────────────
  {
    step: 10,
    topicId: "sorting",
    patternId: "sorting-basics",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=HGk_ypEuS24",
    description: "Understand comparison-based sorting, bubble/selection/insertion sort fundamentals, and how to apply sorting as a preprocessing step.",
  },
  {
    step: 11,
    topicId: "sorting",
    patternId: "merge-sort",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=ogjf7ORKfd8",
    description: "Divide and conquer sorting. Stable O(n log n) sort — essential for counting inversions and sorting linked lists.",
  },
  {
    step: 12,
    topicId: "sorting",
    patternId: "quick-select",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=XEmy13g1Qxc",
    description: "Partition-based selection algorithm. O(n) average to find the Kth largest/smallest element without full sorting.",
  },
  {
    step: 13,
    topicId: "sorting",
    patternId: "counting-sort",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=OKd534EWcdk",
    description: "Sort by counting occurrences. Works in O(n + k) for limited range inputs. Great for character frequency problems.",
  },
  {
    step: 14,
    topicId: "sorting",
    patternId: "bucket-sort",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=VuXbEb5ywrU",
    description: "Distribute elements into buckets. Enables O(n) sorting for frequency-based problems like Top K Frequent Elements.",
  },
  {
    step: 15,
    topicId: "sorting",
    patternId: "custom-comparator",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=OcZo4-3ZUlM",
    description: "Define custom sort orders. Used in interval sorting, largest number, and task scheduling problems.",
  },

  // ─────────────────────────────────────────
  // STRINGS
  // ─────────────────────────────────────────
  {
    step: 16,
    topicId: "strings",
    patternId: "basic-traversal",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=Mf2H9WZSIyw",
    description: "String iteration, reversal, character access, and basic manipulation. Building block for all string patterns.",
  },
  {
    step: 17,
    topicId: "strings",
    patternId: "hashing",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=wtqM4TiNMdE",
    description: "Use HashMap to group anagrams, detect isomorphic strings, and find first unique character. Sorted string as hash key technique.",
  },
  {
    step: 18,
    topicId: "strings",
    patternId: "two-pointers",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=e4frmHqMkw8",
    description: "Expand from center for palindromes, shrink from ends for palindrome checks. The core technique for palindrome problems.",
  },
  {
    step: 19,
    topicId: "strings",
    patternId: "sliding-window",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=eS6PZjdKXO0",
    description: "Sliding window on strings for longest substring without repeating chars, minimum window substring, and anagram finding.",
  },
  {
    step: 20,
    topicId: "strings",
    patternId: "stack",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=wkDfsKpUsUA",
    description: "Use a stack for valid parentheses, decode nested strings, and simplify directory paths.",
  },
  {
    step: 21,
    topicId: "strings",
    patternId: "dynamic-programming",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=e89qJQO_7qo",
    description: "DP on strings — regular expression matching, wildcard matching, and edit distance. Advanced string optimization.",
  },

  // ─────────────────────────────────────────
  // HASHING (Dedicated Topic)
  // ─────────────────────────────────────────
  {
    step: 22,
    topicId: "hashing",
    patternId: "hashing",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=KEs5UyBJ39g",
    description: "Deep dive into hashing — LRU Cache (HashMap + DLL), LFU Cache, Insert/Delete/GetRandom O(1), and Sudoku validation.",
  },

  // ─────────────────────────────────────────
  // TWO POINTERS (Dedicated Topic)
  // ─────────────────────────────────────────
  {
    step: 23,
    topicId: "two-pointers",
    patternId: "two-pointers",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=2wB11y5811g",
    description: "Deep dive — Two Sum II on sorted input, 3Sum Closest, 4Sum generalization, and valid palindrome with skip.",
  },

  // ─────────────────────────────────────────
  // BINARY SEARCH (Dedicated Topic)
  // ─────────────────────────────────────────
  {
    step: 24,
    topicId: "binary-search",
    patternId: "binary-search",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=QX45ClJpGfA",
    description: "Full binary search mastery — standard search, lower/upper bounds, rotated arrays, peak elements, and binary search on answer space (Koko, Ship Packages).",
  },

  // ─────────────────────────────────────────
  // LINKED LISTS
  // ─────────────────────────────────────────
  {
    step: 25,
    topicId: "linked-lists",
    patternId: "traversal",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=58YbpRDc4yw",
    description: "Learn linked list basics — traversal, adding/removing nodes, carry propagation (Add Two Numbers), and odd-even separation.",
  },
  {
    step: 26,
    topicId: "linked-lists",
    patternId: "reversal",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=iT1Y20fOPn0",
    description: "Reverse a linked list iteratively and recursively. Extend to reverse sublists and reverse in K-groups.",
  },
  {
    step: 27,
    topicId: "linked-lists",
    patternId: "fast-slow-pointer",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=gBTe7lFR3vc",
    description: "Floyd's tortoise-and-hare: detect cycles, find cycle start, find the middle, and check palindrome lists.",
  },
  {
    step: 28,
    topicId: "linked-lists",
    patternId: "two-pointers",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=DhFh8Kw7ymk",
    description: "Two pointers for intersection detection and removing Nth node from end. Length-equalization technique.",
  },
  {
    step: 29,
    topicId: "linked-lists",
    patternId: "merge",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=q5a5OiGbT6Q",
    description: "Merge two sorted lists using dummy node. Scale to merge K sorted lists using a min heap or divide-and-conquer.",
  },
  {
    step: 30,
    topicId: "linked-lists",
    patternId: "hashing",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=5Y2EiZST97Y",
    description: "Deep copy lists with random pointers using HashMap or the elegant interleaving technique.",
  },

  // ─────────────────────────────────────────
  // STACKS & QUEUES
  // ─────────────────────────────────────────
  {
    step: 31,
    topicId: "stacks-queues",
    patternId: "stack",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=wkDfsKpUsUA",
    description: "Stack fundamentals — min stack, queue from stacks, RPN evaluation, decode string, and longest valid parentheses.",
  },
  {
    step: 32,
    topicId: "stacks-queues",
    patternId: "monotonic-stack",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=zx5Sw9130L0",
    description: "Monotonic stack in stacks context — online stock span, daily temperatures, next greater element with circular arrays.",
  },

  // ─────────────────────────────────────────
  // TREES
  // ─────────────────────────────────────────
  {
    step: 33,
    topicId: "trees",
    patternId: "dfs",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=fAAZixBzIAI",
    description: "Tree DFS — inorder/preorder/postorder traversal (recursive + iterative), height, diameter, symmetric check, and path sum.",
  },
  {
    step: 34,
    topicId: "trees",
    patternId: "bfs",
    level: "Beginner",
    youtubeUrl: "https://www.youtube.com/watch?v=6ZnyEApgFYg",
    description: "Level-order traversal with BFS. Solve right side view, zigzag traversal, min depth, and next right pointers.",
  },
  {
    step: 35,
    topicId: "trees",
    patternId: "bst",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=f-sj7I5oXEI",
    description: "BST-specific operations — search, validate, find Kth smallest via inorder, LCA using BST property, and delete node.",
  },
  {
    step: 36,
    topicId: "trees",
    patternId: "tree-construction",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=_NUM_MFBL9s",
    description: "Reconstruct trees from traversal sequences (preorder + inorder). Understand how traversal orders uniquely define a tree.",
  },
  {
    step: 37,
    topicId: "trees",
    patternId: "prefix-sum",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=uZzvivFkgtM",
    description: "Prefix sum on tree paths for Path Sum III. Combine DFS with a hash map to count path counts in O(n).",
  },

  // ─────────────────────────────────────────
  // HEAP / PRIORITY QUEUE
  // ─────────────────────────────────────────
  {
    step: 38,
    topicId: "heap",
    patternId: "heap",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=t0Cq6tVNRBA",
    description: "Min/max heap for Top-K problems, merge K sorted lists, running median via two heaps, and task scheduling.",
  },

  // ─────────────────────────────────────────
  // BACKTRACKING
  // ─────────────────────────────────────────
  {
    step: 39,
    topicId: "backtracking",
    patternId: "backtracking",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=DKCbsiDBN6c",
    description: "Systematically generate all subsets, permutations, and combinations. Prune with constraints for N-Queens, Sudoku, and word search.",
  },

  // ─────────────────────────────────────────
  // GREEDY
  // ─────────────────────────────────────────
  {
    step: 40,
    topicId: "greedy",
    patternId: "greedy",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=HvB9rj8YZEM",
    description: "Make locally optimal choices — interval scheduling, jump game reachability, assign tasks, and gas station circular check.",
  },

  // ─────────────────────────────────────────
  // GRAPHS
  // ─────────────────────────────────────────
  {
    step: 41,
    topicId: "graphs",
    patternId: "dfs",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=pcKY4hjDrxk",
    description: "Graph DFS — connected components, number of islands, flood fill, and detecting cycles in undirected graphs.",
  },
  {
    step: 42,
    topicId: "graphs",
    patternId: "bfs",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=oDqjPvD1p-I",
    description: "Graph BFS — shortest path in unweighted graphs, rotting oranges (multi-source BFS), and word ladder implicit graph.",
  },
  {
    step: 43,
    topicId: "graphs",
    patternId: "topological-sort",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=5_Elua5DWpY",
    description: "Kahn's algorithm (BFS with in-degree) for course scheduling, build order, and alien dictionary.",
  },
  {
    step: 44,
    topicId: "graphs",
    patternId: "union-find",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=aBxjDBCClM8",
    description: "Disjoint Set Union with path compression + union by rank. Detect cycles, find redundant connections, merge accounts.",
  },
  {
    step: 45,
    topicId: "graphs",
    patternId: "shortest-path",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=V6H1qAeB-N4",
    description: "Dijkstra's algorithm with a min heap for weighted shortest paths. Bellman-Ford for negative weights.",
  },
  {
    step: 46,
    topicId: "graphs",
    patternId: "mst",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=DMnDM_sxVig",
    description: "Minimum Spanning Tree via Kruskal's (sort edges + DSU) and Prim's (greedy min heap expansion).",
  },

  // ─────────────────────────────────────────
  // DYNAMIC PROGRAMMING
  // ─────────────────────────────────────────
  {
    step: 47,
    topicId: "dynamic-programming",
    patternId: "1d-dp",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=tyB0ySGQ3v4",
    description: "1D DP — climbing stairs, house robber, coin change, fibonacci variants. Learn the recurrence → memoization → tabulation pattern.",
  },
  {
    step: 48,
    topicId: "dynamic-programming",
    patternId: "grid-dp",
    level: "Intermediate",
    youtubeUrl: "https://www.youtube.com/watch?v=t_f0nwwdg5o",
    description: "2D grid DP — unique paths, minimum path sum, triangle, and dungeon game. Row-by-row tabulation approach.",
  },
  {
    step: 49,
    topicId: "dynamic-programming",
    patternId: "knapsack",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=GqOmJHQZivw",
    description: "0/1 Knapsack and unbounded knapsack. Master the include/exclude decision and space optimization tricks.",
  },
  {
    step: 50,
    topicId: "dynamic-programming",
    patternId: "lis",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=cjWnW0hdF1Y",
    description: "Longest Increasing Subsequence — O(n²) DP and O(n log n) patience sorting. Foundation for many subsequence problems.",
  },
  {
    step: 51,
    topicId: "dynamic-programming",
    patternId: "lcs",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=sSno9rV8Rhg",
    description: "Longest Common Subsequence, Edit Distance, and wildcard/regex matching. Classic 2D string DP.",
  },
  {
    step: 52,
    topicId: "dynamic-programming",
    patternId: "interval-dp",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
    description: "DP over intervals — burst balloons, matrix chain multiplication, palindrome partitioning. O(n³) DP patterns.",
  },
  {
    step: 53,
    topicId: "dynamic-programming",
    patternId: "bitmask-dp",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=cY4HiiFHO1o",
    description: "DP with bitmask state for small-n problems — traveling salesman, assignment problems, and counting valid sequences.",
  },
  {
    step: 54,
    topicId: "dynamic-programming",
    patternId: "dp-on-trees",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=fmflMqVOC7k",
    description: "DP on tree structures — house robber on trees, binary tree cameras, and diameter/path problems with global state.",
  },

  // ─────────────────────────────────────────
  // TRIE
  // ─────────────────────────────────────────
  {
    step: 55,
    topicId: "trie",
    patternId: "trie",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=dBGUm8l1g18",
    description: "Build and search a Trie (prefix tree) for autocomplete, word search with wildcards, and longest common prefix.",
  },

  // ─────────────────────────────────────────
  // BIT MANIPULATION
  // ─────────────────────────────────────────
  {
    step: 56,
    topicId: "bit-manipulation",
    patternId: "bit-manipulation",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=5yu8G6-1Fz0",
    description: "XOR tricks, Brian Kernighan's bit counting, bitmask subset generation, and power-of-two checks.",
  },

  // ─────────────────────────────────────────
  // SEGMENT TREE / BIT
  // ─────────────────────────────────────────
  {
    step: 57,
    topicId: "segment-tree",
    patternId: "segment-tree",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=ZBHKZF5w4YU",
    description: "Segment tree for O(log n) range sum/min/max queries with point updates. Binary Indexed Tree (Fenwick) as a simpler alternative.",
  },

  // ─────────────────────────────────────────
  // ADVANCED ALGORITHMS
  // ─────────────────────────────────────────
  {
    step: 58,
    topicId: "advanced",
    patternId: "string-matching",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=GTJr8OvyEVQ",
    description: "KMP algorithm for O(n + m) pattern matching, Z-algorithm for prefix matching, and Rabin-Karp rolling hash.",
  },
  {
    step: 59,
    topicId: "advanced",
    patternId: "math",
    level: "Advanced",
    youtubeUrl: "https://www.youtube.com/watch?v=p3R9RRBU5SQ",
    description: "Sieve of Eratosthenes, modular arithmetic, GCD/LCM, fast exponentiation, Catalan numbers, and combinatorics.",
  },
];

export default roadmap;
