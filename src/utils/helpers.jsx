import React from 'react';
import {
  Binary, ArrowUpDown, Type, Hash, ChevronsLeftRight, Columns, Search,
  Link as LinkIcon, Layers, Network, TrendingUp, RotateCcw, Zap, Grid,
  GitBranch, Sparkles, BookOpen, Target
} from 'lucide-react';

export const formatLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Custom Youtube SVG Icon since brand icons are not exported in this lucide-react version
export const Youtube = ({ size = 24, fill = "currentColor", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={fill}
    {...props}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// LeetCode official logo
export const LeetCodeLogo = ({ size = 14 }) => (
  <svg viewBox="0 0 95 111" width={size} height={size * (111/95)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M54.2 40.5H89a4.5 4.5 0 0 1 0 9H54.2a4.5 4.5 0 0 1 0-9Z" fill="#FFA116"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.7 7.5a4.5 4.5 0 0 1 6.37 0L66.8 39.12a4.5 4.5 0 0 1-6.36 6.36L28.7 13.87a4.5 4.5 0 0 1 0-6.37Z" fill="#B3B3B3"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.7 103.5a4.5 4.5 0 0 0 6.37 0L66.8 71.88a4.5 4.5 0 0 0-6.36-6.36L28.7 97.13a4.5 4.5 0 0 0 0 6.37Z" fill="#B3B3B3"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 28.2a4.5 4.5 0 0 1 0-6.37L39.12 50a4.5 4.5 0 0 1-6.37 6.37L1.13 28.2Z" fill="currentColor"/>
  </svg>
);

// DSA Mastery professional custom logo
export const DsaMasteryLogo = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logo-grad-front" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA116" />
        <stop offset="100%" stopColor="#FF7A00" />
      </linearGradient>
      <linearGradient id="logo-grad-back" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5A00" />
        <stop offset="100%" stopColor="#C23B00" />
      </linearGradient>
      <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="-2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>
    <polygon
      points="50,12 85,32 85,72 50,92"
      fill="url(#logo-grad-back)"
    />
    <polygon
      points="50,12 15,32 15,72 50,92"
      fill="url(#logo-grad-front)"
      filter="url(#logo-shadow)"
    />
    <path
      d="M38,40 L28,50 L38,60"
      fill="none"
      stroke="#ffffff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />
    <path
      d="M62,40 L72,50 L62,60"
      fill="none"
      stroke="#ffffff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />
    <line
      x1="38"
      y1="50"
      x2="62"
      y2="50"
      stroke="#ffffff"
      strokeWidth="4"
      strokeDasharray="1, 8"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

export const getAvatarColor = (avatarValue, name = 'Default') => {
  if (avatarValue && avatarValue.startsWith('#')) return avatarValue;
  const colors = [
    '#FFA116', // LeetCode Orange
    '#00b8a3', // LeetCode Green
    '#38BDF8', // Sky Blue
    '#A78BFA', // Purple
    '#F43F5E', // Rose
    '#FBBF24', // Amber
    '#34D399', // Emerald
    '#6366F1'  // Indigo
  ];
  let hash = 0;
  const str = name || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const renderAvatar = (avatarValue, name = 'Default', size = 20) => {
  const isEmoji = avatarValue && !avatarValue.startsWith('#') && avatarValue.length <= 4;
  if (isEmoji) {
    return (
      <div 
        style={{
          width: size,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(12, Math.floor(size * 0.65)),
          lineHeight: 1,
          flexShrink: 0
        }}
      >
        {avatarValue}
      </div>
    );
  }
  const color = getAvatarColor(avatarValue, name);
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'D';
  return (
    <div 
      className="avatar-circle"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: Math.max(10, Math.floor(size * 0.45)),
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans)',
        lineHeight: 1,
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {initial}
    </div>
  );
};

// YouTube official logo
export const YoutubeLogo = ({ size = 16 }) => (
  <svg viewBox="0 0 71 50" width={size} height={size * (50/71)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M69.35 7.83A8.91 8.91 0 0 0 63.1 1.56C57.55 0 35.5 0 35.5 0S13.45 0 7.9 1.56A8.91 8.91 0 0 0 1.65 7.83C0 13.43 0 25 0 25s0 11.57 1.65 17.17A8.91 8.91 0 0 0 7.9 48.44C13.45 50 35.5 50 35.5 50s22.05 0 27.6-1.56a8.91 8.91 0 0 0 6.25-6.27C71 36.57 71 25 71 25s0-11.57-1.65-17.17Z" fill="#FF0000"/>
    <path d="M28.4 35.6 46.78 25 28.4 14.4v21.2Z" fill="#fff"/>
  </svg>
);

// Mapping topic IDs to professional LeetCode-style icons
export function getTopicIcon(topicId, props = {}) {
  const map = {
    "arrays": Binary,
    "sorting": ArrowUpDown,
    "strings": Type,
    "hashing": Hash,
    "two-pointers": ChevronsLeftRight,
    "sliding-window": Columns,
    "binary-search": Search,
    "linked-lists": LinkIcon,
    "stacks-queues": Layers,
    "trees": Network,
    "heap": TrendingUp,
    "backtracking": RotateCcw,
    "greedy": Zap,
    "graphs": Network,
    "dynamic-programming": Grid,
    "trie": GitBranch,
    "bit-manipulation": Binary,
    "segment-tree": Network,
    "advanced": Sparkles,
  };
  const IconComponent = map[topicId] || BookOpen;
  return <IconComponent {...props} />;
}

// Mapping pattern IDs to professional LeetCode-style icons
export function getPatternIcon(patternId, props = {}) {
  const map = {
    "hashing": Hash,
    "two-pointers": ChevronsLeftRight,
    "sliding-window": Columns,
    "binary-search": Search,
    "stack": Layers,
    "monotonic-stack": Layers,
    "dfs": GitBranch,
    "bfs": GitBranch,
    "backtracking": RotateCcw,
    "dynamic-programming": Grid,
    "topological-sort": ArrowUpDown,
    "union-find": LinkIcon,
    "shortest-path": GitBranch,
    "heap": TrendingUp,
    "greedy": Zap,
    "trie": GitBranch,
    "bit-manipulation": Binary,
    "basic-traversal": Binary,
    "prefix-sum": Binary,
    "reversal": RotateCcw,
    "fast-slow-pointer": ChevronsLeftRight,
    "merge": LinkIcon,
    "traversal": Binary,
    "bst": Network,
    "tree-construction": Network,
    "mst": Network,
    "1d-dp": Grid,
    "grid-dp": Grid,
    "knapsack": Grid,
    "lis": Grid,
    "lcs": Grid,
    "interval-dp": Grid,
    "bitmask-dp": Grid,
    "dp-on-trees": Grid,
    "segment-tree": Network,
    "string-matching": Type,
    "math": Binary,
    "sorting-basics": ArrowUpDown,
    "merge-sort": ArrowUpDown,
    "quick-select": ArrowUpDown,
    "bucket-sort": ArrowUpDown,
    "counting-sort": ArrowUpDown,
    "custom-comparator": ArrowUpDown,
  };
  const IconComponent = map[patternId] || Target;
  return <IconComponent {...props} />;
}

// Direct YouTube explanation mappings for top/important problems
export const POPULAR_VIDEO_MAP = {
  1: "https://www.youtube.com/watch?v=UXDSeD9mN-k", // Two Sum
  9: "https://www.youtube.com/watch?v=excAOvwF_Wk", // Best Time to Buy and Sell Stock
  19: "https://www.youtube.com/watch?v=DhFh8Kw7ymk", // 3Sum
  20: "https://www.youtube.com/watch?v=w7ftYGh0u5Y", // Container With Most Water
  24: "https://www.youtube.com/watch?v=2JzRBPFYbKE", // Merge Intervals
  27: "https://www.youtube.com/watch?v=oO5uLE7EUlM", // Longest Consecutive Sequence
  34: "https://www.youtube.com/watch?v=m18Hntz4go8", // Trapping Rain Water
  35: "https://www.youtube.com/watch?v=tcvY8tScPDU", // Sliding Window Maximum
  64: "https://www.youtube.com/watch?v=XXyfz1y6A-U", // Valid Palindrome
  67: "https://www.youtube.com/watch?v=wkDfsKpUsUA", // Valid Parentheses
  70: "https://www.youtube.com/watch?v=vzdNOK2oB2E", // Group Anagrams
  71: "https://www.youtube.com/watch?v=qtVh-XEpsJo", // Longest Substring Without Repeating Characters
  83: "https://www.youtube.com/watch?v=xDEuM5qa0sg", // LRU Cache
  91: "https://www.youtube.com/watch?v=QX45ClJpGfA", // Binary Search
  93: "https://www.youtube.com/watch?v=5qGrJbHhqFs", // Search in Rotated Sorted Array
  103: "https://www.youtube.com/watch?v=iT1Y20fOPn0", // Reverse Linked List
  105: "https://www.youtube.com/watch?v=gBTe7lFR3vc", // Linked List Cycle
  152: "https://www.youtube.com/watch?v=f-sj7I5oXEI", // Validate Binary Search Tree
  156: "https://www.youtube.com/watch?v=358b1fJ768g", // Lowest Common Ancestor of a Binary Tree
};

// Direct YouTube tutorial mappings for core DSA patterns
export const PATTERN_VIDEO_MAP = {
  "sliding-window": "https://www.youtube.com/watch?v=9Kd9oG6P-r0",
  "two-pointers": "https://www.youtube.com/watch?v=2wB11y5811g",
  "binary-search": "https://www.youtube.com/watch?v=QX45ClJpGfA",
  "dfs": "https://www.youtube.com/watch?v=pcKY4hjDrxk",
  "bfs": "https://www.youtube.com/watch?v=pcKY4hjDrxk",
  "dynamic-programming": "https://www.youtube.com/watch?v=tyB0ySGQ3v4",
  "backtracking": "https://www.youtube.com/watch?v=DKCbsiDBN6c",
  "union-find": "https://www.youtube.com/watch?v=aBxjDBCClM8",
  "topological-sort": "https://www.youtube.com/watch?v=5_Elua5DWpY",
  "shortest-path": "https://www.youtube.com/watch?v=V6H1qAeB-N4",
  "trie": "https://www.youtube.com/watch?v=dBGUm8l1g18",
  "bit-manipulation": "https://www.youtube.com/watch?v=5yu8G6-1Fz0",
};

// Helper to resolve problem explanation video
export function getProblemVideoUrl(q) {
  if (q.videoUrl) return q.videoUrl; // Custom problem video link
  if (POPULAR_VIDEO_MAP[q.id]) return POPULAR_VIDEO_MAP[q.id];
  return `https://www.youtube.com/results?search_query=striver+${encodeURIComponent(q.title)}+dsa`;
}

// Helper to resolve pattern explanation video
export function getPatternVideoUrl(pid, patName) {
  if (PATTERN_VIDEO_MAP[pid]) return PATTERN_VIDEO_MAP[pid];
  return `https://www.youtube.com/results?search_query=striver+${encodeURIComponent(patName || pid)}+dsa`;
}
