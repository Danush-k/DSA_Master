import { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  LayoutDashboard, BookOpen, Target, ListChecks, RotateCcw, Bookmark,
  Search, Moon, Sun, ChevronRight, Check, ExternalLink, StickyNote,
  Menu, X, Filter, Clock, Flame, Calendar, ChevronDown, ChevronUp, BarChart3, Info,
  ArrowUpDown, Binary, ChevronsLeftRight, Columns, GitBranch, Grid, Hash, Layers,
  Link as LinkIcon, Network, Sparkles, Star, TrendingUp, Type, Zap,
  Cloud, CloudOff, RefreshCw, User, Map, Settings, Download, Upload, LogOut, Trash2,
  AlertCircle, Mail, Trophy, AlertTriangle, Key, Pencil
} from 'lucide-react';
import { auth, db } from './firebaseClient.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  sendPasswordResetEmail,
  sendEmailVerification,
  linkWithPopup,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup,
  updatePassword,
  linkWithCredential,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { initDbSync, deleteUserCloudData, clearAllLocalStores } from './services/dbSync.js';

// Custom Youtube SVG Icon since brand icons are not exported in this lucide-react version
const Youtube = ({ size = 24, fill = "currentColor", ...props }) => (
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
const LeetCodeLogo = ({ size = 14 }) => (
  <svg viewBox="0 0 95 111" width={size} height={size * (111/95)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M54.2 40.5H89a4.5 4.5 0 0 1 0 9H54.2a4.5 4.5 0 0 1 0-9Z" fill="#FFA116"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.7 7.5a4.5 4.5 0 0 1 6.37 0L66.8 39.12a4.5 4.5 0 0 1-6.36 6.36L28.7 13.87a4.5 4.5 0 0 1 0-6.37Z" fill="#B3B3B3"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.7 103.5a4.5 4.5 0 0 0 6.37 0L66.8 71.88a4.5 4.5 0 0 0-6.36-6.36L28.7 97.13a4.5 4.5 0 0 0 0 6.37Z" fill="#B3B3B3"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 28.2a4.5 4.5 0 0 1 0-6.37L39.12 50a4.5 4.5 0 0 1-6.37 6.37L1.13 28.2Z" fill="currentColor"/>
  </svg>
);

// DSA Mastery professional custom logo
const DsaMasteryLogo = ({ size = 24, className = "" }) => (
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
    {/* Background isometric fold */}
    <polygon
      points="50,12 85,32 85,72 50,92"
      fill="url(#logo-grad-back)"
    />
    {/* Foreground overlapping isometric fold creating depth */}
    <polygon
      points="50,12 15,32 15,72 50,92"
      fill="url(#logo-grad-front)"
      filter="url(#logo-shadow)"
    />
    {/* Stylized code brackets cutting through the isometric fold */}
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
    {/* Central connection point */}
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

const getAvatarColor = (avatarValue, name = 'Default') => {
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

const renderAvatar = (avatarValue, name = 'Default', size = 20) => {
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
const YoutubeLogo = ({ size = 16 }) => (
  <svg viewBox="0 0 71 50" width={size} height={size * (50/71)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M69.35 7.83A8.91 8.91 0 0 0 63.1 1.56C57.55 0 35.5 0 35.5 0S13.45 0 7.9 1.56A8.91 8.91 0 0 0 1.65 7.83C0 13.43 0 25 0 25s0 11.57 1.65 17.17A8.91 8.91 0 0 0 7.9 48.44C13.45 50 35.5 50 35.5 50s22.05 0 27.6-1.56a8.91 8.91 0 0 0 6.25-6.27C71 36.57 71 25 71 25s0-11.57-1.65-17.17Z" fill="#FF0000"/>
    <path d="M28.4 35.6 46.78 25 28.4 14.4v21.2Z" fill="#fff"/>
  </svg>
);

// Mapping topic IDs to professional LeetCode-style icons
function getTopicIcon(topicId, props = {}) {
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
function getPatternIcon(patternId, props = {}) {
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
import questions from './data/questions.js';
import topics from './data/topics.js';
import patterns from './data/patterns.js';
import roadmap from './data/roadmap.js';
import useProgressStore from './store/useProgressStore.js';
import useNotesStore from './store/useNotesStore.js';
import useRevisionStore from './store/useRevisionStore.js';
import useThemeStore from './store/useThemeStore.js';

// Augment static questions database with deterministic company tags
const staticQuestions = questions.map((q) => {
  const comps = [];
  if (q.id % 3 === 0) comps.push('Google');
  if (q.id % 4 === 0) comps.push('Meta');
  if (q.id % 5 === 0) comps.push('Amazon');
  if (q.id % 7 === 0) comps.push('Microsoft');
  if (comps.length === 0) {
    const list = ['Google', 'Meta', 'Amazon', 'Microsoft'];
    comps.push(list[q.id % 4]);
  }
  return { ...q, companies: comps };
});

// Custom hook to merge static questions with active profile's custom questions
function useAllQuestions() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const customQuestions = useProgressStore(
    useShallow((s) => s.profiles[activeProfileId]?.customQuestions || [])
  );
  return useMemo(() => {
    return [...staticQuestions, ...customQuestions];
  }, [customQuestions]);
}

// Direct YouTube explanation mappings for top/important problems
const POPULAR_VIDEO_MAP = {
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
const PATTERN_VIDEO_MAP = {
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
function getProblemVideoUrl(q) {
  if (q.videoUrl) return q.videoUrl; // Custom problem video link
  if (POPULAR_VIDEO_MAP[q.id]) return POPULAR_VIDEO_MAP[q.id];
  return `https://www.youtube.com/results?search_query=striver+${encodeURIComponent(q.title)}+dsa`;
}

// Helper to resolve pattern explanation video
function getPatternVideoUrl(pid, patName) {
  if (PATTERN_VIDEO_MAP[pid]) return PATTERN_VIDEO_MAP[pid];
  return `https://www.youtube.com/results?search_query=striver+${encodeURIComponent(patName || pid)}+dsa`;
}

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const allQuestions = useAllQuestions();

  // Compute due count directly from active profile's revisions to optimize renders and prevent loops
  const dueCount = useRevisionStore((s) => {
    const today = new Date().toISOString().split('T')[0];
    const profileRevisions = s.profiles[s.activeProfileId] || {};
    return Object.values(profileRevisions).filter(
      (rev) => rev.nextRevisionDate && rev.nextRevisionDate <= today && !rev.completed
    ).length;
  });

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/topics', label: 'Topics', icon: BookOpen },
    { path: '/sheet', label: 'Problem Sheet', icon: ListChecks },
    { path: '/patterns', label: 'Patterns', icon: Target },
    { path: '/revision', label: 'Revision', icon: RotateCcw, badge: dueCount || null },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={20} />
          </div>
          <span className="sidebar-logo-text">DSA Mastery</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="sidebar-link-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            {allQuestions.length} Problems · Pattern-Based Learning
          </div>
        </div>
      </aside>
    </>
  );
}


// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
function Header({ title, onMenuClick, onManageProfiles, syncStatus, user, onAuthClick }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const profiles = useProgressStore(useShallow((s) => s.profiles));
  const switchProfile = useProgressStore((s) => s.switchProfile);
  const activeProfile = profiles[activeProfileId];

  const allQuestions = useAllQuestions();

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allQuestions
      .filter(qu => qu.title.toLowerCase().includes(q) || String(qu.num).includes(q))
      .slice(0, 8);
  }, [searchQuery, allQuestions]);

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search className="search-bar-icon" />
          <input
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          {searchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden', zIndex: 200,
              boxShadow: 'var(--shadow-xl)',
            }}>
              {searchResults.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: '8px 12px', cursor: 'pointer', fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: '1px solid var(--border-primary)',
                  }}
                  className="search-result-item"
                  onMouseDown={() => {
                    navigate(`/topics/${q.topic}`);
                    setSearchQuery('');
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', minWidth: 32 }}>
                    {q.num}.
                  </span>
                  <span style={{ flex: 1 }}>{q.title}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Selector */}
        <div style={{ position: 'relative' }}>
          <button className="profile-btn" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} title="Switch profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {renderAvatar(activeProfile?.avatar, activeProfile?.name, 22)}
            <span className="profile-btn-name">{activeProfile?.name || 'Default'}</span>
            <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">Logged in as</div>
              <div className="profile-dropdown-item active" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
                {renderAvatar(activeProfile?.avatar, activeProfile?.name, 18)}
                <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{activeProfile?.name || 'Default'}</span>
              </div>
              <div className="profile-dropdown-divider" />
              <Link
                to="/profile"
                className="profile-dropdown-item"
                onClick={() => setProfileDropdownOpen(false)}
                style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <User size={14} /> View Profile Page
              </Link>
            </div>
          )}
        </div>

        {/* Cloud Sync Status */}
        <button
          className="cloud-sync-btn"
          onClick={onAuthClick}
          title={
            syncStatus === 'local-only' ? 'Cloud Sync Unavailable (Config Missing)' :
            syncStatus === 'local' ? 'Cloud Sync Disconnected (Click to Log In)' :
            syncStatus === 'syncing' ? 'Syncing with Cloud Database...' :
            'Synchronized with Cloud Database'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: syncStatus === 'synced' ? 'var(--success)' : syncStatus === 'syncing' ? 'var(--warning)' : 'var(--text-tertiary)',
            cursor: syncStatus === 'local-only' ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          disabled={syncStatus === 'local-only'}
        >
          {syncStatus === 'syncing' ? (
            <RefreshCw size={16} className="spin" />
          ) : syncStatus === 'local' || syncStatus === 'local-only' ? (
            <CloudOff size={16} />
          ) : (
            <Cloud size={16} />
          )}
        </button>

        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}


// ═══════════════════════════════════════════════════════════════
// PROGRESS RING
// ═══════════════════════════════════════════════════════════════
function ProgressRing({ progress, size = 80, strokeWidth = 6, color = 'var(--accent-primary)', children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="var(--bg-tertiary)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <div className="progress-ring-text">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOTES MODAL
// ═══════════════════════════════════════════════════════════════
function NotesModal({ question, onClose }) {
  const saveNote = useNotesStore((s) => s.saveNote);
  const existingNote = useNotesStore((s) => {
    const profileNotes = s.profiles[s.activeProfileId] || {};
    return profileNotes[question.id] || {};
  });
  const existing = existingNote;
  const [form, setForm] = useState({
    keyIdea: existing.keyIdea || '',
    mistakes: existing.mistakes || '',
    optimalApproach: existing.optimalApproach || '',
    timeComplexity: existing.timeComplexity || '',
    spaceComplexity: existing.spaceComplexity || '',
    notes: existing.notes || '',
    interviewLearnings: existing.interviewLearnings || '',
  });

  const handleSave = () => {
    saveNote(question.id, form);
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StickyNote size={18} style={{ color: 'var(--accent-primary)' }} />
              Notes
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {question.num}. {question.title}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="notes-form">
            {[
              { key: 'keyIdea', label: 'Key Idea', icon: Sparkles, placeholder: 'What is the core insight?' },
              { key: 'optimalApproach', label: 'Optimal Approach', icon: Target, placeholder: 'Describe the best approach step by step' },
              { key: 'timeComplexity', label: 'Time Complexity', icon: Clock, placeholder: 'e.g., O(n log n)' },
              { key: 'spaceComplexity', label: 'Space Complexity', icon: Layers, placeholder: 'e.g., O(n)' },
              { key: 'mistakes', label: 'Mistakes Made', icon: AlertTriangle, placeholder: 'Common pitfalls and errors to avoid' },
              { key: 'interviewLearnings', label: 'Interview Learnings', icon: Info, placeholder: 'What would you say in an interview?' },
              { key: 'notes', label: 'Additional Notes', icon: StickyNote, placeholder: 'Any other notes...' },
            ].map(({ key, label, icon: IconComponent, placeholder }) => (
              <div className="notes-field" key={key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconComponent size={14} style={{ color: 'var(--text-secondary)' }} />
                  {label}
                </label>
                <textarea
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  rows={key === 'timeComplexity' || key === 'spaceComplexity' ? 1 : 3}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Notes</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION ROW
// ═══════════════════════════════════════════════════════════════
function QuestionRow({ q, showTopic = false, showPattern = true }) {
  const status = useProgressStore((s) => s.profiles[s.activeProfileId]?.questionStatus?.[q.id] || null);
  const toggleStatus = useProgressStore((s) => s.toggleStatus);
  const bookmarked = useProgressStore((s) => {
    const bookmarks = s.profiles[s.activeProfileId]?.bookmarks;
    return bookmarks ? bookmarks.includes(q.id) : false;
  });
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const noted = useNotesStore((s) => {
    const note = s.profiles[s.activeProfileId]?.[q.id];
    return note && Object.entries(note).some(([k, v]) => v && v !== '' && k !== 'updatedAt');
  });
  const scheduleRevision = useRevisionStore((s) => s.scheduleRevision);
  const revision = useRevisionStore((s) => s.profiles[s.activeProfileId]?.[q.id] || null);
  const [notesOpen, setNotesOpen] = useState(false);

  const handleSolve = () => {
    if (status !== 'solved') {
      toggleStatus(q.id, 'solved');
      scheduleRevision(q.id);
    } else {
      toggleStatus(q.id, 'solved');
    }
  };

  return (
    <>
      <tr>
        <td>
          <button
            className={`question-status ${status || ''}`}
            onClick={handleSolve}
            title={status === 'solved' ? 'Mark unsolved' : 'Mark solved'}
          >
            {status === 'solved' && <Check size={12} />}
          </button>
        </td>
        <td>
          <span className="question-number">{q.num}</span>
        </td>
        <td>
          <div className="question-title-cell">
            <a href={q.url} target="_blank" rel="noopener noreferrer" className="question-title-link">
              {q.title}
              <ExternalLink size={12} style={{ marginLeft: 4, opacity: 0.4 }} />
            </a>
            {q.companies && q.companies.length > 0 && (
              <div className="question-companies-list" style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                {q.companies.map(c => (
                  <span key={c} className="badge-company-tag" style={{
                    fontSize: 10, padding: '1px 4px', borderRadius: 3,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)'
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </td>
        <td>
          <a
            href={getProblemVideoUrl(q)}
            target="_blank"
            rel="noopener noreferrer"
            className="tutorial-link-btn"
            title="Watch YouTube Tutorial"
          >
            <Youtube size={14} />
            <span>Video</span>
          </a>
        </td>
        <td>
          <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
        </td>
        {showTopic && (
          <td>
            <Link to={`/topics/${q.topic}`} className="badge badge-topic" style={{ textDecoration: 'none' }}>
              {topics.find(t => t.id === q.topic)?.name || q.topic}
            </Link>
          </td>
        )}
        {showPattern && (
          <td>
            <span className="badge badge-pattern">
              {patterns[q.pattern]?.name || q.pattern}
            </span>
          </td>
        )}
        <td>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: q.importance === 'Must Do' ? 'var(--error)' : q.importance === 'Recommended' ? 'var(--warning)' : 'var(--text-tertiary)',
          }}>
            {q.importance === 'Must Do' && <Flame size={12} fill="currentColor" />}
            {q.importance === 'Recommended' && <Star size={12} fill="currentColor" />}
            {q.importance === 'Good to Know' && <span style={{ marginRight: 2 }}>·</span>}
            <span>{q.importance}</span>
          </div>
        </td>
        <td>
          <div className="question-actions">
            <button
              className={`question-action-btn ${bookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(q.id)}
              title="Bookmark"
            >
              <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              className="question-action-btn"
              onClick={() => setNotesOpen(true)}
              title="Notes"
              style={noted ? { color: 'var(--accent-primary)' } : {}}
            >
              <StickyNote size={14} />
            </button>
            {revision && (
              <span className="revision-count" title={`Revision ${revision.revisionCount}/5`}>
                R{revision.revisionCount}
              </span>
            )}
          </div>
        </td>
      </tr>
      {notesOpen && <NotesModal question={q} onClose={() => setNotesOpen(false)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUESTION TABLE
// ═══════════════════════════════════════════════════════════════
function QuestionTable({ questionList, showTopic = false, showPattern = true }) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2 };

  const sorted = useMemo(() => {
    if (!sortBy) return questionList;
    return [...questionList].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'num') cmp = a.num - b.num;
      if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
      if (sortBy === 'difficulty') cmp = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [questionList, sortBy, sortDir]);

  if (!questionList.length) {
    return (
      <div className="empty-state">
        <ListChecks className="empty-state-icon" />
        <div className="empty-state-title">No questions found</div>
        <div className="empty-state-desc">Try adjusting your filters.</div>
      </div>
    );
  }

  return (
    <div className="question-table-container">
      <table className="question-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}>Status</th>
            <th style={{ width: 50, cursor: 'pointer' }} onClick={() => toggleSort('num')} className={sortBy === 'num' ? 'sorted' : ''}>
              # {sortBy === 'num' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => toggleSort('title')} className={sortBy === 'title' ? 'sorted' : ''}>
              Title {sortBy === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ width: 90 }}>Tutorial</th>
            <th style={{ width: 90 }} onClick={() => toggleSort('difficulty')} className={sortBy === 'difficulty' ? 'sorted' : ''}>
              Difficulty {sortBy === 'difficulty' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            {showTopic && <th style={{ width: 130 }}>Topic</th>}
            {showPattern && <th style={{ width: 140 }}>Pattern</th>}
            <th style={{ width: 110 }}>Importance</th>
            <th style={{ width: 100 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((q) => (
            <QuestionRow key={q.id} q={q} showTopic={showTopic} showPattern={showPattern} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEATMAP
// ═══════════════════════════════════════════════════════════════
function Heatmap() {
  const dailySolves = useProgressStore(useShallow((s) => s.profiles[s.activeProfileId]?.dailySolves || {}));
  const [selectedYear, setSelectedYear] = useState('Current');

  // Compute list of years from dailySolves
  const years = useMemo(() => {
    const list = new Set(['Current']);
    Object.keys(dailySolves).forEach(dateStr => {
      const year = dateStr.split('-')[0];
      if (year && year.length === 4) {
        list.add(year);
      }
    });
    list.add(new Date().getFullYear().toString());
    const sorted = Array.from(list).filter(y => y !== 'Current').sort((a, b) => b.localeCompare(a));
    return ['Current', ...sorted];
  }, [dailySolves]);

  const stats = useMemo(() => {
    const today = new Date();
    let startDate, endDate;
    let monthsToShow = [];

    if (selectedYear === 'Current') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 364);
      endDate = today;

      let curYear = today.getFullYear();
      let curMonth = today.getMonth();
      for (let i = 11; i >= 0; i--) {
        let m = curMonth - i;
        let y = curYear;
        if (m < 0) {
          m += 12;
          y -= 1;
        }
        monthsToShow.push({ year: y, month: m });
      }
    } else {
      const yearNum = parseInt(selectedYear);
      startDate = new Date(yearNum, 0, 1);
      endDate = new Date(yearNum, 11, 31);

      for (let m = 0; m < 12; m++) {
        monthsToShow.push({ year: yearNum, month: m });
      }
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    let totalSubmissions = 0;
    const activeDates = new Set();

    Object.entries(dailySolves).forEach(([dateStr, count]) => {
      if (dateStr >= startStr && dateStr <= endStr && count > 0) {
        totalSubmissions += count;
        activeDates.add(dateStr);
      }
    });

    const activeDaysCount = activeDates.size;

    let maxStreak = 0;
    let currentStreak = 0;
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      const dateStr = tempDate.toISOString().split('T')[0];
      if (dailySolves[dateStr] > 0) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return {
      totalSubmissions,
      activeDays: activeDaysCount,
      maxStreak,
      monthsToShow,
    };
  }, [selectedYear, dailySolves]);

  const getMonthName = (mIndex) => {
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[mIndex];
  };

  const getMonthWeeks = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= numDays; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const count = dailySolves[dateStr] || 0;
      days.push({
        date: dateStr,
        dayNum: d,
        count,
        level: count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4,
      });
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  return (
    <div className="heatmap-card animate-fade-in">
      <div className="heatmap-header">
        <div className="heatmap-title-container">
          <span>{stats.totalSubmissions} submissions in the past {selectedYear === 'Current' ? 'one year' : selectedYear}</span>
          <span className="heatmap-info-icon heatmap-tooltip" data-tip="Total solved questions in the selected period.">
            <Info size={14} />
          </span>
        </div>
        <div className="heatmap-stats-wrapper">
          <div className="heatmap-stat-item">
            Total active days: <span className="heatmap-stat-value">{stats.activeDays}</span>
          </div>
          <div className="heatmap-stat-item">
            Max streak: <span className="heatmap-stat-value">{stats.maxStreak}</span>
          </div>
          <select
            className="heatmap-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(y => (
              <option key={y} value={y}>{y === 'Current' ? 'Current' : y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="heatmap-grid-outer">
        <div className="heatmap-months-row">
          {stats.monthsToShow.map(({ year, month }) => {
            const weeks = getMonthWeeks(year, month);
            return (
              <div className="heatmap-month-column" key={`${year}-${month}`}>
                <div className="heatmap-month-weeks-grid">
                  {weeks.map((week, wi) => (
                    <div className="heatmap-week-col" key={wi}>
                      {week.map((day, di) => (
                        day ? (
                          <div
                            key={di}
                            className="heatmap-day-node"
                            data-level={day.level}
                            title={`${day.date}: ${day.count} problems solved`}
                          />
                        ) : (
                          <div key={di} className="heatmap-day-node empty" />
                        )
                      ))}
                    </div>
                  ))}
                </div>
                <div className="heatmap-month-text">{getMonthName(month)}</div>
              </div>
            );
          })}
        </div>

        {/* Legend Stack */}
        <div className="heatmap-legend-vert-stack" title="Color Legend">
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-4)' }} />
            <span className="heatmap-legend-label">6+ solves</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-3)' }} />
            <span className="heatmap-legend-label">4-5 solves</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-2)' }} />
            <span className="heatmap-legend-label">2-3 solves</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-1)' }} />
            <span className="heatmap-legend-label">1 solve</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--bg-tertiary)' }} />
            <span className="heatmap-legend-label">0 solves</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
function DashboardPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const currentStreak = useProgressStore((s) => s.profiles[activeProfileId]?.currentStreak || 0);
  const longestStreak = useProgressStore((s) => s.profiles[activeProfileId]?.longestStreak || 0);
  const revisions = useRevisionStore(useShallow((s) => s.profiles[activeProfileId] || {}));

  const allQuestions = useAllQuestions();

  const stats = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    allQuestions.forEach(q => {
      if (questionStatus[q.id] === 'solved') {
        if (q.difficulty === 'Easy') easy++;
        else if (q.difficulty === 'Medium') medium++;
        else hard++;
      }
    });
    return { easy, medium, hard, total: easy + medium + hard };
  }, [allQuestions, questionStatus]);

  const dueRevisionsList = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return Object.entries(revisions)
      .filter(([, rev]) => rev.nextRevisionDate && rev.nextRevisionDate <= today && !rev.completed)
      .map(([id, rev]) => ({ questionId: parseInt(id), ...rev }));
  }, [revisions]);

  const totalQuestions = allQuestions.length;
  const easyTotal = allQuestions.filter(q => q.difficulty === 'Easy').length;
  const mediumTotal = allQuestions.filter(q => q.difficulty === 'Medium').length;
  const hardTotal = allQuestions.filter(q => q.difficulty === 'Hard').length;

  return (
    <div className="page-content animate-fade-in">
      {/* Stats Grid */}
      <div className="dashboard-grid stagger-children">
        <div className="card stat-card">
          <div className="stat-card-label">Total Solved</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-primary)' }}>{stats.total}</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${totalQuestions ? (stats.total / totalQuestions) * 100 : 0}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{stats.total}/{totalQuestions}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-label">Easy</div>
          <div className="stat-card-value" style={{ color: 'var(--easy)' }}>{stats.easy}</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill easy" style={{ width: `${easyTotal ? (stats.easy / easyTotal) * 100 : 0}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{stats.easy}/{easyTotal}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-label">Medium</div>
          <div className="stat-card-value" style={{ color: 'var(--medium)' }}>{stats.medium}</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill medium" style={{ width: `${mediumTotal ? (stats.medium / mediumTotal) * 100 : 0}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{stats.medium}/{mediumTotal}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-label">Hard</div>
          <div className="stat-card-value" style={{ color: 'var(--hard)' }}>{stats.hard}</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill hard" style={{ width: `${hardTotal ? (stats.hard / hardTotal) * 100 : 0}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{stats.hard}/{hardTotal}</div>
        </div>
      </div>

      {/* Streak + Revisions Due */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-7)' }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
            <Flame size={20} style={{ color: '#f97316' }} /> Streak
          </div>
          <div className="streak-container">
            <div className="streak-item">
              <span className="streak-fire"><Flame size={24} style={{ color: '#f97316', fill: '#f97316', display: 'block' }} /></span>
              <span className="streak-value">{currentStreak}</span>
              <span className="streak-label">Current Streak</span>
            </div>
            <div className="streak-item">
              <span className="streak-fire"><Trophy size={24} style={{ color: '#eab308', fill: '#eab308', display: 'block' }} /></span>
              <span className="streak-value">{longestStreak}</span>
              <span className="streak-label">Longest Streak</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
            <RotateCcw size={20} style={{ color: 'var(--accent-primary)' }} /> Revision Due Today
          </div>
          {dueRevisionsList.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              <Check size={16} style={{ color: 'var(--success)', verticalAlign: 'middle', marginRight: 6, display: 'inline' }} /> No revisions due today. Great job!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dueRevisionsList.slice(0, 3).map(rev => {
                const q = allQuestions.find(qu => qu.id === rev.questionId);
                if (!q) return null;
                return (
                  <div key={rev.questionId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                    fontSize: 13,
                  }}>
                    <span>{q.num}. {q.title}</span>
                    <span className="revision-count">R{rev.revisionCount + 1}</span>
                  </div>
                );
              })}
              {dueRevisionsList.length > 3 && (
                <Link to="/revision" style={{ fontSize: 13, fontWeight: 500 }}>+{dueRevisionsList.length - 3} more →</Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className="dashboard-section" style={{ marginBottom: 'var(--space-7)' }}>
        <Heatmap />
      </div>

      {/* Topic Progress */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <BarChart3 className="section-title-icon" /> Topic Progress
          </div>
          <Link to="/topics" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topics.map(topic => {
              const topicQs = allQuestions.filter(q => q.topic === topic.id);
              const solved = topicQs.filter(q => questionStatus[q.id] === 'solved').length;
              const pct = topicQs.length ? Math.round((solved / topicQs.length) * 100) : 0;
              return (
                <Link to={`/topics/${topic.id}`} key={topic.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, color: topic.color }}>
                      {getTopicIcon(topic.id, { size: 18 })}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, width: 160, flexShrink: 0 }}>{topic.name}</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: topic.color }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', width: 70, textAlign: 'right' }}>
                      {solved}/{topicQs.length}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOPICS LIST PAGE
// ═══════════════════════════════════════════════════════════════
function TopicsPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const allQuestions = useAllQuestions();

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={24} style={{ color: 'var(--accent-primary)' }} /> DSA Topics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Master each topic from beginner to advanced. Topics are ordered for optimal learning progression.
        </p>
      </div>
      <div className="topic-grid stagger-children">
        {topics.map(topic => {
          const topicQs = allQuestions.filter(q => q.topic === topic.id);
          const solved = topicQs.filter(q => questionStatus[q.id] === 'solved').length;
          const pct = topicQs.length ? Math.round((solved / topicQs.length) * 100) : 0;
          const uniquePatterns = [...new Set(topicQs.map(q => q.pattern))];

          return (
            <Link to={`/topics/${topic.id}`} key={topic.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-interactive topic-card">
                <div className="topic-card-header">
                  <div className="topic-card-icon" style={{ background: `${topic.color}20`, color: topic.color }}>
                    {getTopicIcon(topic.id, { size: 24 })}
                  </div>
                  <div>
                    <div className="topic-card-title">{topic.name}</div>
                    <div className="topic-card-count">{topicQs.length} problems</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
                  {topic.description}
                </p>
                <div className="topic-card-patterns">
                  {uniquePatterns.slice(0, 4).map(p => (
                    <span key={p} className="badge badge-pattern" style={{ fontSize: 11 }}>
                      {patterns[p]?.name || p}
                    </span>
                  ))}
                  {uniquePatterns.length > 4 && (
                    <span className="badge badge-pattern" style={{ fontSize: 11 }}>+{uniquePatterns.length - 4}</span>
                  )}
                </div>
                <div className="topic-card-footer">
                  <span className="topic-card-progress-text">{solved}/{topicQs.length} solved</span>
                  <ProgressRing progress={pct} size={42} strokeWidth={4} color={topic.color}>
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{pct}%</span>
                  </ProgressRing>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOPIC DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
function TopicDetailPage() {
  const { topicId } = useParams();
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const topic = topics.find(t => t.id === topicId);
  const allQuestions = useAllQuestions();
  const topicQs = useMemo(() => allQuestions.filter(q => q.topic === topicId), [allQuestions, topicId]);
  const solved = topicQs.filter(q => questionStatus[q.id] === 'solved').length;

  const diffCounts = useMemo(() => ({
    easy: topicQs.filter(q => q.difficulty === 'Easy').length,
    medium: topicQs.filter(q => q.difficulty === 'Medium').length,
    hard: topicQs.filter(q => q.difficulty === 'Hard').length,
  }), [topicQs]);

  const patternGroups = useMemo(() => {
    const groups = {};
    const diffOrder = { Easy: 0, Medium: 1, Hard: 2 };
    topicQs.forEach(q => {
      if (!groups[q.pattern]) groups[q.pattern] = [];
      groups[q.pattern].push(q);
    });
    Object.keys(groups).forEach(p => {
      groups[p].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    });
    return groups;
  }, [topicQs]);

  if (!topic) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-title">Topic not found</div>
          <Link to="/topics" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Topics</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 8 }}>
        <Link to="/topics" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>← Back to Topics</Link>
      </div>

      {/* Topic Header */}
      <div className="topic-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: `${topic.color}20`, color: topic.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {getTopicIcon(topic.id, { size: 28 })}
          </div>
          <div>
            <h2 className="topic-detail-title">{topic.name}</h2>
            <p className="topic-detail-desc">{topic.description}</p>
          </div>
        </div>
        <div className="topic-detail-stats">
          <div className="stat-card" style={{ padding: 0 }}>
            <div className="stat-card-label">Total</div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>{topicQs.length}</div>
          </div>
          <div className="stat-card" style={{ padding: 0 }}>
            <div className="stat-card-label">Solved</div>
            <div className="stat-card-value" style={{ fontSize: 22, color: 'var(--success)' }}>{solved}</div>
          </div>
          <div className="stat-card" style={{ padding: 0 }}>
            <div className="stat-card-label">Easy</div>
            <div className="stat-card-value" style={{ fontSize: 22, color: 'var(--easy)' }}>{diffCounts.easy}</div>
          </div>
          <div className="stat-card" style={{ padding: 0 }}>
            <div className="stat-card-label">Medium</div>
            <div className="stat-card-value" style={{ fontSize: 22, color: 'var(--medium)' }}>{diffCounts.medium}</div>
          </div>
          <div className="stat-card" style={{ padding: 0 }}>
            <div className="stat-card-label">Hard</div>
            <div className="stat-card-value" style={{ fontSize: 22, color: 'var(--hard)' }}>{diffCounts.hard}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <ProgressRing progress={topicQs.length ? Math.round((solved / topicQs.length) * 100) : 0}
              size={64} strokeWidth={5} color={topic.color}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {topicQs.length ? Math.round((solved / topicQs.length) * 100) : 0}%
              </span>
            </ProgressRing>
          </div>
        </div>
      </div>

      {/* Pattern Groups */}
      {Object.entries(patternGroups).map(([patternId, qs]) => {
        const pat = patterns[patternId];
        const patSolved = qs.filter(q => questionStatus[q.id] === 'solved').length;
        return (
          <div className="pattern-group" key={patternId}>
            <div className="pattern-group-header">
              <div className="pattern-group-title">
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  {getPatternIcon(patternId, { size: 18 })}
                </span>
                <span>{pat?.name || patternId}</span>
                <span className="pattern-group-count">{patSolved}/{qs.length}</span>
              </div>
              {pat?.recognition && (
                <Link to={`/patterns/${patternId}`} className="btn btn-ghost btn-sm">
                  Learn Pattern →
                </Link>
              )}
            </div>
            <QuestionTable questionList={qs} showTopic={false} showPattern={false} />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FULL SHEET PAGE (Like Striver's Sheet)
// ═══════════════════════════════════════════════════════════════
function SheetPage() {
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterImportance, setFilterImportance] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));

  const allQuestions = useAllQuestions();

  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
      if (filterTopic !== 'all' && q.topic !== filterTopic) return false;
      if (filterImportance !== 'all' && q.importance !== filterImportance) return false;
      if (filterStatus === 'solved' && questionStatus[q.id] !== 'solved') return false;
      if (filterStatus === 'unsolved' && questionStatus[q.id] === 'solved') return false;
      if (filterCompany !== 'all' && (!q.companies || !q.companies.includes(filterCompany))) return false;
      return true;
    });
  }, [allQuestions, filterDifficulty, filterStatus, filterTopic, filterImportance, filterCompany, questionStatus]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><ListChecks size={24} style={{ color: 'var(--accent-primary)' }} /> Complete Problem Sheet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {allQuestions.length} curated problems · Sorted by topic and pattern · Click any problem to open on LeetCode
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
          + Add Problem
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
        <Filter size={16} style={{ color: 'var(--text-tertiary)' }} />
        <select className="filter-select" value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
          <option value="all">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
        <select className="filter-select" value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
          <option value="all">All Topics</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="filter-select" value={filterImportance} onChange={e => setFilterImportance(e.target.value)}>
          <option value="all">All Importance</option>
          <option value="Must Do">Must Do</option>
          <option value="Recommended">Recommended</option>
          <option value="Good to Know">Good to Know</option>
        </select>
        <select className="filter-select" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
          <option value="all">All Companies</option>
          <option value="Google">Google</option>
          <option value="Meta">Meta</option>
          <option value="Amazon">Amazon</option>
          <option value="Microsoft">Microsoft</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
          Showing {filtered.length} of {allQuestions.length}
        </span>
      </div>

      <QuestionTable questionList={filtered} showTopic={true} showPattern={true} />

      {addModalOpen && <AddCustomQuestionModal onClose={() => setAddModalOpen(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PATTERNS LIST PAGE
// ═══════════════════════════════════════════════════════════════
function PatternsListPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const allQuestions = useAllQuestions();

  const mainPatterns = [
    'hashing', 'two-pointers', 'sliding-window', 'binary-search', 'stack', 'monotonic-stack',
    'dfs', 'bfs', 'backtracking', 'dynamic-programming', 'greedy', 'topological-sort',
    'union-find', 'shortest-path', 'heap', 'trie', 'bit-manipulation',
  ];

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={24} style={{ color: 'var(--accent-primary)' }} /> DSA Patterns</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Learn to recognize patterns — the key skill that separates good from great problem solvers.
        </p>
      </div>
      <div className="topic-grid stagger-children">
        {mainPatterns.map(pid => {
          const pat = patterns[pid];
          if (!pat) return null;
          const patQs = allQuestions.filter(q => q.pattern === pid);
          const solved = patQs.filter(q => questionStatus[q.id] === 'solved').length;
          const pct = patQs.length ? Math.round((solved / patQs.length) * 100) : 0;

          return (
            <Link to={`/patterns/${pid}`} key={pid} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-interactive topic-card">
                <div className="topic-card-header">
                  <div className="topic-card-icon" style={{
                    background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                  }}>
                    {getPatternIcon(pid, { size: 24 })}
                  </div>
                  <div>
                    <div className="topic-card-title">{pat.name}</div>
                    <div className="topic-card-count">{patQs.length} problems</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
                  {pat.description}
                </p>
                <div className="topic-card-footer">
                  <span className="topic-card-progress-text">{solved}/{patQs.length} solved</span>
                  <ProgressRing progress={pct} size={42} strokeWidth={4}>
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{pct}%</span>
                  </ProgressRing>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PATTERN DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
function PatternDetailPage() {
  const { patternId } = useParams();
  const pat = patterns[patternId];
  const allQuestions = useAllQuestions();
  const patQs = useMemo(() => allQuestions.filter(q => q.pattern === patternId), [allQuestions, patternId]);
  const [showTheory, setShowTheory] = useState(true);

  if (!pat) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-title">Pattern not found</div>
          <Link to="/patterns" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Patterns</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 8 }}>
        <Link to="/patterns" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>← Back to Patterns</Link>
      </div>

      {/* Pattern Hero */}
      <div className="pattern-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'var(--accent-primary)', marginBottom: 12 }}>
            {getPatternIcon(patternId, { size: 36 })}
          </div>
          <h2 className="pattern-hero-title">{pat.name}</h2>
          <p className="pattern-hero-description">{pat.description}</p>

          <div className="pattern-meta">
            {pat.timeComplexity && (
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Time Complexity</span>
                <span className="pattern-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{pat.timeComplexity}</span>
              </div>
            )}
            {pat.spaceComplexity && (
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Space Complexity</span>
                <span className="pattern-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{pat.spaceComplexity}</span>
              </div>
            )}
            <div className="pattern-meta-item">
              <span className="pattern-meta-label">Problems</span>
              <span className="pattern-meta-value">{patQs.length} questions</span>
            </div>
            <div className="pattern-meta-item">
              <span className="pattern-meta-label">Concept Video</span>
              <a
                href={getPatternVideoUrl(patternId, pat.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="tutorial-link-btn"
                style={{ width: 'fit-content', marginTop: 4 }}
              >
                <Youtube size={14} /> Watch Tutorial
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Theory Section */}
      {pat.recognition && (
        <div style={{ marginBottom: 'var(--space-7)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowTheory(!showTheory)}
            style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {showTheory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showTheory ? 'Hide' : 'Show'} Pattern Theory
          </button>

          {showTheory && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
              {/* Recognition Clues */}
              <div className="card pattern-section">
                <div className="pattern-section-title">🔍 Recognition Clues</div>
                <ul className="clue-list">
                  {pat.recognition.map((clue, i) => (
                    <li className="clue-item" key={i}>
                      <ChevronRight className="clue-icon" size={16} />
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* When to Use / Not Use */}
              <div className="card pattern-section">
                <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={16} style={{ color: 'var(--success)' }} />
                  When to Use
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {pat.whenToUse}
                </p>
                <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <X size={16} style={{ color: 'var(--error)' }} />
                  When NOT to Use
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {pat.whenNotToUse}
                </p>
                {pat.interviewTips && (
                  <>
                    <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                      Interview Tips
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--accent-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      {pat.interviewTips}
                    </p>
                  </>
                )}
              </div>

              {/* Common Mistakes */}
              {pat.commonMistakes && (
                <div className="card pattern-section" style={{ gridColumn: 'span 2' }}>
                    <div className="pattern-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
                      Common Mistakes
                    </div>
                  <ul className="clue-list">
                    {pat.commonMistakes.map((m, i) => (
                      <li className="clue-item" key={i} style={{ background: 'var(--error-bg)' }}>
                        <X size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="section-header">
        <div className="section-title">
          <ListChecks size={20} className="section-title-icon" /> Practice Problems ({patQs.length})
        </div>
      </div>
      <QuestionTable questionList={patQs} showTopic={true} showPattern={false} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REVISION PAGE
// ═══════════════════════════════════════════════════════════════
function RevisionPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const revisions = useRevisionStore(useShallow((s) => s.profiles[activeProfileId] || {}));
  const completeRevision = useRevisionStore((s) => s.completeRevision);

  const allQuestions = useAllQuestions();

  const { dueRevisions, upcomingRevisions } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const due = [];
    const upcoming = [];
    Object.entries(revisions).forEach(([id, rev]) => {
      if (rev.completed) return;
      if (!rev.nextRevisionDate) return;
      const item = { questionId: parseInt(id), ...rev };
      if (rev.nextRevisionDate <= today) due.push(item);
      else upcoming.push(item);
    });
    upcoming.sort((a, b) => a.nextRevisionDate.localeCompare(b.nextRevisionDate));
    return { dueRevisions: due, upcomingRevisions: upcoming };
  }, [revisions]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🔄 Spaced Repetition</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Revision schedule: Day 1 → Day 3 → Day 7 → Day 15 → Day 30. Mark problems solved to start tracking.
        </p>
      </div>

      {/* Due Today */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Clock size={20} style={{ color: 'var(--error)' }} /> Due Today ({dueRevisions.length})
          </div>
        </div>
        {dueRevisions.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--success)', marginBottom: 12 }}><Sparkles size={48} /></div>
              <div className="empty-state-title">All caught up!</div>
              <div className="empty-state-desc">No revisions due today. Keep solving problems to build your revision queue.</div>
            </div>
          </div>
        ) : (
          <div className="revision-queue">
            {dueRevisions.map(rev => {
              const q = allQuestions.find(qu => qu.id === rev.questionId);
              if (!q) return null;
              return (
                <div className="card revision-card" key={rev.questionId}>
                  <div className="revision-card-header">
                    <div>
                      <div className="revision-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <a href={q.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
                          {q.num}. {q.title} <ExternalLink size={12} style={{ marginLeft: 4, opacity: 0.4 }} />
                        </a>
                        <a
                          href={getProblemVideoUrl(q)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Watch Tutorial"
                          style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Youtube size={14} />
                        </a>
                      </div>
                      <div className="revision-card-meta">
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <span className="badge badge-pattern">{patterns[q.pattern]?.name}</span>
                      </div>
                    </div>
                    <span className="revision-count">R{rev.revisionCount + 1}/5</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{q.why}</div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => completeRevision(rev.questionId)}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Check size={14} /> Mark Revised
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Calendar size={20} style={{ color: 'var(--accent-primary)' }} /> Upcoming ({upcomingRevisions.length})
          </div>
        </div>
        {upcomingRevisions.length === 0 ? (
          <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            No upcoming revisions. Solve and mark problems to start the revision cycle.
          </div>
        ) : (
          <div className="question-table-container">
            <table className="question-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Next Revision</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRevisions.slice(0, 20).map(rev => {
                  const q = allQuestions.find(qu => qu.id === rev.questionId);
                  if (!q) return null;
                  return (
                    <tr key={rev.questionId}>
                      <td><span className="question-number">{q.num}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <a href={q.url} target="_blank" rel="noopener noreferrer" className="question-title-link">
                            {q.title}
                          </a>
                          <a
                            href={getProblemVideoUrl(q)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Watch Tutorial"
                            style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                          >
                            <Youtube size={14} />
                          </a>
                        </div>
                      </td>
                      <td><span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rev.nextRevisionDate}</td>
                      <td><span className="revision-count">R{rev.revisionCount}/5</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOOKMARKS PAGE
// ═══════════════════════════════════════════════════════════════
function BookmarksPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const bookmarks = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.bookmarks || []));
  const allQuestions = useAllQuestions();

  const bookmarkedQuestions = useMemo(() => {
    const bArr = bookmarks instanceof Set ? Array.from(bookmarks) : (Array.isArray(bookmarks) ? bookmarks : []);
    return allQuestions.filter(q => bArr.includes(q.id));
  }, [bookmarks, allQuestions]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🔖 Bookmarks</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Problems you've bookmarked for quick access.
        </p>
      </div>
      {bookmarkedQuestions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Bookmark className="empty-state-icon" />
            <div className="empty-state-title">No bookmarks yet</div>
            <div className="empty-state-desc">Click the bookmark icon on any problem to save it here.</div>
          </div>
        </div>
      ) : (
        <QuestionTable questionList={bookmarkedQuestions} showTopic={true} showPattern={true} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE MANAGER MODAL
// ═══════════════════════════════════════════════════════════════
function ProfileManagerModal({ onClose }) {
  const profiles = useProgressStore(useShallow((s) => s.profiles));
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const switchProfile = useProgressStore((s) => s.switchProfile);
  const createProfile = useProgressStore((s) => s.createProfile);
  const deleteProgressProfile = useProgressStore((s) => s.deleteProfile);
  const deleteNotesProfile = useNotesStore((s) => s.deleteProfile);
  const deleteRevisionProfile = useRevisionStore((s) => s.deleteProfile);

  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('#FFA116');

  const avatarOptions = [
    '#FFA116', // LeetCode Orange
    '#00b8a3', // LeetCode Green
    '#38BDF8', // Sky Blue
    '#A78BFA', // Purple
    '#F43F5E', // Rose
    '#FBBF24', // Amber
    '#34D399', // Emerald
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const profileId = newName.trim().toLowerCase().replace(/\s+/g, '-');
    if (profiles[profileId]) {
      alert('A profile with this name already exists.');
      return;
    }
    createProfile(profileId, newName.trim(), selectedAvatar);
    setNewName('');
  };

  const handleDelete = (id) => {
    if (Object.keys(profiles).length <= 1) {
      alert('You must keep at least one profile.');
      return;
    }
    if (confirm(`Are you sure you want to delete profile "${profiles[id].name}"? This action cannot be undone.`)) {
      deleteProgressProfile(id);
      deleteNotesProfile(id);
      deleteRevisionProfile(id);
    }
  };

  const handleExportBackup = () => {
    const backup = {
      progress: JSON.parse(useProgressStore.getState().exportData()),
      notes: useNotesStore.getState().profiles,
      revisions: useRevisionStore.getState().profiles,
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_master_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup && backup.progress && backup.notes && backup.revisions) {
          // Hydrate progress store
          useProgressStore.setState({
            profiles: backup.progress.profiles,
            activeProfileId: backup.progress.activeProfileId,
          });
          
          // Hydrate notes store
          useNotesStore.setState({
            profiles: backup.notes,
            activeProfileId: backup.progress.activeProfileId,
          });
          
          // Hydrate revision store
          useRevisionStore.setState({
            profiles: backup.revisions,
            activeProfileId: backup.progress.activeProfileId,
          });
          
          alert('Backup imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} /> Profile Management</div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* List existing */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Existing Profiles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(profiles).map(([id, p]) => {
                const solvedCount = Object.values(p.questionStatus || {}).filter(s => s === 'solved').length;
                return (
                  <div key={id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                    border: id === activeProfileId ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {renderAvatar(p.avatar, p.name, 24)}
                      <div>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</span>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{solvedCount} solved</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {id !== activeProfileId && (
                        <button className="btn btn-ghost btn-sm" onClick={() => switchProfile(id)}>Switch</button>
                      )}
                      {Object.keys(profiles).length > 1 && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>Delete</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create new profile */}
          <form onSubmit={handleCreate} style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Create New Profile</h3>
            <div className="notes-field" style={{ marginBottom: 8 }}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
                required
              />
            </div>
            <div className="notes-field" style={{ marginBottom: 12 }}>
              <label>Choose Avatar</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                {avatarOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedAvatar(color)}
                    style={{
                      width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: color,
                      border: selectedAvatar === color ? '2px solid var(--text-primary)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50%', cursor: 'pointer',
                      boxShadow: selectedAvatar === color ? '0 0 8px var(--accent-primary)' : 'none',
                    }}
                  >
                    {selectedAvatar === color && <Check size={14} color="#ffffff" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Profile</button>
          </form>

          {/* Backup / Restore */}
          <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Backup & Restore</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={handleExportBackup}>
                <Download size={14} /> Export Backup
              </button>
              <label className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                <Upload size={14} /> Import Backup
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleImportBackup}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// ADD CUSTOM QUESTION MODAL
// ═══════════════════════════════════════════════════════════════
function AddCustomQuestionModal({ onClose }) {
  const addCustomQuestion = useProgressStore((s) => s.addCustomQuestion);
  const [form, setForm] = useState({
    title: '',
    url: '',
    videoUrl: '',
    difficulty: 'Easy',
    topic: 'arrays',
    pattern: 'basic-traversal',
    importance: 'Must Do',
    why: '',
    companies: [],
  });

  const handleCompanyChange = (companyName) => {
    setForm(prev => {
      const current = prev.companies;
      const next = current.includes(companyName)
        ? current.filter(c => c !== companyName)
        : [...current, companyName];
      return { ...prev, companies: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    let finalUrl = form.url.trim();
    if (!finalUrl) {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      finalUrl = `https://leetcode.com/problems/${slug}/`;
    }

    addCustomQuestion({
      title: form.title.trim(),
      url: finalUrl,
      videoUrl: form.videoUrl.trim() || undefined,
      difficulty: form.difficulty,
      topic: form.topic,
      pattern: form.pattern,
      importance: form.importance,
      why: form.why.trim() || 'Custom added problem.',
      companies: form.companies,
    });

    onClose();
  };

  const sortedPatterns = useMemo(() => {
    return Object.entries(patterns)
      .map(([id, p]) => ({ id, name: p.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">➕ Add Custom Problem</div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="notes-field">
              <label>Problem Title *</label>
              <input
                type="text"
                placeholder="e.g., Two Sum"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>
            
            <div className="notes-field">
              <label>LeetCode URL (Optional)</label>
              <input
                type="url"
                placeholder="e.g., https://leetcode.com/problems/two-sum/"
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>

            <div className="notes-field">
              <label>YouTube Video URL (Optional)</label>
              <input
                type="url"
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="notes-field">
                <label>Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="notes-field">
                <label>Importance</label>
                <select
                  value={form.importance}
                  onChange={e => setForm({ ...form, importance: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  <option value="Must Do">Must Do</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Good to Know">Good to Know</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="notes-field">
                <label>Topic</label>
                <select
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="notes-field">
                <label>Pattern</label>
                <select
                  value={form.pattern}
                  onChange={e => setForm({ ...form, pattern: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  {sortedPatterns.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="notes-field">
              <label>Companies</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                {['Google', 'Meta', 'Amazon', 'Microsoft'].map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.companies.includes(c)}
                      onChange={() => handleCompanyChange(c)}
                      style={{ cursor: 'pointer' }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="notes-field">
              <label>Why solve / Key intuition</label>
              <textarea
                placeholder="What makes this problem special?"
                value={form.why}
                onChange={e => setForm({ ...form, why: e.target.value })}
                rows={2}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Problem</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// APP LAYOUT + ROUTING
// ═══════════════════════════════════════════════════════════════
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const switchNotesProfile = useNotesStore((s) => s.switchProfile);
  const switchRevisionProfile = useRevisionStore((s) => s.switchProfile);

  const [syncStatus, setSyncStatus] = useState('loading'); // 'loading', 'unauthenticated', 'syncing', 'synced'
  const [user, setUser] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogoutGlobal = async () => {
    setIsSigningOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await signOut(auth);
      clearAllLocalStores();
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Initialize DB Sync
  useEffect(() => {
    initDbSync((status, currentUser) => {
      setSyncStatus(status);
      setUser(currentUser);
    });
  }, []);

  // Keep notes and revisions store profiles in sync with the active progress profile
  useEffect(() => {
    switchNotesProfile(activeProfileId);
    switchRevisionProfile(activeProfileId);
  }, [activeProfileId, switchNotesProfile, switchRevisionProfile]);

  // Ensure the default profile name is kept in sync with the user's permanent User ID (displayName)
  useEffect(() => {
    const progressStore = useProgressStore.getState();
    
    // Enforce default profile key
    if (progressStore.activeProfileId !== 'default') {
      useProgressStore.getState().switchProfile('default');
    }

    if (user && user.displayName) {
      const currentName = progressStore.profiles['default']?.name;
      if (currentName !== user.displayName) {
        useProgressStore.setState((prev) => ({
          profiles: {
            ...prev.profiles,
            'default': {
              ...prev.profiles['default'],
              name: user.displayName,
              avatar: prev.profiles['default']?.avatar || '#FFA116'
            }
          }
        }));
      }
    }
  }, [user]);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/roadmap') return 'DSA Roadmap';
    if (location.pathname === '/topics') return 'Topics';
    if (location.pathname.startsWith('/topics/')) {
      const topicId = location.pathname.split('/')[2];
      return topics.find(t => t.id === topicId)?.name || 'Topic';
    }
    if (location.pathname === '/sheet') return 'Problem Sheet';
    if (location.pathname === '/patterns') return 'Patterns';
    if (location.pathname.startsWith('/patterns/')) return 'Pattern Detail';
    if (location.pathname === '/revision') return 'Revision';
    if (location.pathname === '/bookmarks') return 'Bookmarks';
    if (location.pathname === '/login') return 'Account Login';
    if (location.pathname === '/profile') return 'User Profile';
    if (location.pathname === '/verify-email') return 'Email Verification';
    return 'DSA Mastery';
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Auth Guarding Routing Rules
  const isAuthenticated = user !== null;
  const isEmailVerified = user ? (
    user.emailVerified || 
    user.email?.endsWith('@dsamastery.local') || 
    user.providerData.some(p => p.providerId === 'google.com')
  ) : false;

  useEffect(() => {
    if (syncStatus !== 'loading') {
      if (!isAuthenticated) {
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      } else if (!isEmailVerified) {
        if (location.pathname !== '/verify-email') {
          navigate('/verify-email');
        }
      } else {
        if (location.pathname === '/login' || location.pathname === '/verify-email') {
          navigate('/');
        }
      }
    }
  }, [syncStatus, isAuthenticated, isEmailVerified, location.pathname, navigate]);

  // Loading Screen
  if (syncStatus === 'loading') {
    return (
      <div className="lc-loading-screen">
        <div className="lc-loading-card">
          <div className="lc-logo-circle spin-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={36} />
          </div>
          <h2 className="lc-loading-title">DSA Mastery</h2>
          <div className="lc-loading-subtitle">Loading your workspace...</div>
          <div className="lc-spinner"></div>
        </div>
      </div>
    );
  }

  // Gated View: Unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="app-layout auth-only">
        <Routes>
          <Route path="/login" element={<LoginPage user={user} />} />
          <Route path="*" element={<LoginPage user={user} />} />
        </Routes>
        {isSigningOut && <SignOutOverlay />}
      </div>
    );
  }

  // Gated View: Email Verification Needed
  if (!isEmailVerified) {
    return (
      <div className="app-layout auth-only">
        <Routes>
          <Route path="/verify-email" element={<VerifyEmailPage user={user} onLogout={handleLogoutGlobal} />} />
          <Route path="*" element={<VerifyEmailPage user={user} onLogout={handleLogoutGlobal} />} />
        </Routes>
        {isSigningOut && <SignOutOverlay />}
      </div>
    );
  }

  // Main Authenticated Workspace
  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          onManageProfiles={() => setManagerOpen(true)}
          syncStatus={syncStatus}
          user={user}
          onAuthClick={handleAuthClick}
        />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/sheet" element={<SheetPage />} />
          <Route path="/patterns" element={<PatternsListPage />} />
          <Route path="/patterns/:patternId" element={<PatternDetailPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage user={user} syncStatus={syncStatus} onLogout={handleLogoutGlobal} />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </div>
      {isSigningOut && <SignOutOverlay />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROADMAP PAGE
// ═══════════════════════════════════════════════════════════════

const LEVEL_CONFIG = {
  Beginner:     { color: '#00b8a3', bg: 'rgba(0,184,163,0.1)',   border: 'rgba(0,184,163,0.25)',   label: 'Easy',   abbr: 'Easy'   },
  Intermediate: { color: '#ffc01e', bg: 'rgba(255,192,30,0.1)',  border: 'rgba(255,192,30,0.25)',  label: 'Medium', abbr: 'Medium' },
  Advanced:     { color: '#ff375f', bg: 'rgba(255,55,95,0.1)',   border: 'rgba(255,55,95,0.25)',   label: 'Hard',   abbr: 'Hard'   },
};

// Circular progress SVG
const CircleProgress = ({ pct = 0, size = 36, color = '#00b8a3', trackColor = 'rgba(255,255,255,0.08)' }) => {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={3.5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={3.5} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
};

function ConceptCard({ step, allQuestions, questionStatus }) {
  const [open, setOpen] = useState(false);
  const pattern = patterns[step.patternId];
  const topic   = topics.find(t => t.id === step.topicId);
  const lc = LEVEL_CONFIG[step.level];
  const toggleStatus = useProgressStore((s) => s.toggleStatus);
  const scheduleRevision = useRevisionStore((s) => s.scheduleRevision);

  const handleCheckClick = (qId, isSolved) => {
    if (!isSolved) {
      toggleStatus(qId, 'solved');
      scheduleRevision(qId);
    } else {
      toggleStatus(qId, 'solved');
    }
  };

  const conceptQs = useMemo(() =>
    allQuestions
      .filter(q => q.topic === step.topicId && q.pattern === step.patternId)
      .sort((a, b) => ({ Easy: 0, Medium: 1, Hard: 2 }[a.difficulty] - { Easy: 0, Medium: 1, Hard: 2 }[b.difficulty])),
    [allQuestions, step.topicId, step.patternId]
  );

  const solved = conceptQs.filter(q => questionStatus[q.id] === 'solved').length;
  const total  = conceptQs.length;
  const pct    = total ? Math.round((solved / total) * 100) : 0;
  const done   = total > 0 && solved === total;

  return (
    <div className="lc-concept-row" style={{ borderLeft: `3px solid ${done ? lc.color : 'transparent'}` }}>

      {/* ── Row header ── */}
      <div className="lc-concept-header" onClick={() => setOpen(o => !o)}>

        {/* Step circle */}
        <div className="lc-step-circle" style={{
          background: done ? lc.color : 'var(--bg-tertiary)',
          color: done ? '#fff' : 'var(--text-tertiary)',
          border: `1.5px solid ${done ? lc.color : 'var(--border-secondary)'}`,
        }}>
          {done
            ? <Check size={11} strokeWidth={3} />
            : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>{step.step}</span>
          }
        </div>

        {/* Pattern icon + name */}
        <div className="lc-concept-icon-wrap" style={{ color: topic?.color || 'var(--accent-primary)' }}>
          {getPatternIcon(step.patternId, { size: 15 })}
        </div>

        <div className="lc-concept-info">
          <span className="lc-concept-name">{pattern?.name || step.patternId}</span>
          <span className="lc-concept-desc">{step.description}</span>
        </div>

        {/* Right cluster */}
        <div className="lc-concept-right">
          {/* Difficulty label */}
          <span className="lc-diff-pill" style={{ color: lc.color, background: lc.bg, border: `1px solid ${lc.border}` }}>
            {lc.abbr}
          </span>

          {/* Progress */}
          <div className="lc-progress-wrap">
            <div style={{ position: 'relative', width: 36, height: 36 }}>
              <CircleProgress pct={pct} size={36} color={done ? lc.color : 'var(--accent-primary)'} />
              <span style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 800, fontFamily: 'var(--font-mono)',
                color: done ? lc.color : 'var(--text-secondary)',
              }}>{pct}%</span>
            </div>
            <span className="lc-progress-label">{solved}<span style={{ opacity: 0.45 }}>/{total}</span></span>
          </div>

          {/* YouTube button — official logo */}
          <a
            href={step.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="lc-yt-btn"
            title="Watch Tutorial on YouTube"
          >
            <YoutubeLogo size={20} />
          </a>

          {/* Chevron */}
          <span className="lc-chevron">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
        </div>
      </div>

      {/* ── Problem list ── */}
      {open && (
        <div className="lc-problem-list">
          {/* Column header */}
          <div className="lc-prob-col-header">
            <span style={{ width: 28 }} />
            <span style={{ width: 50 }}>#</span>
            <span style={{ flex: 1 }}>Problem</span>
            <span style={{ width: 72, textAlign: 'center' }}>Difficulty</span>
            <span style={{ width: 36, textAlign: 'center' }}>Video</span>
            <span style={{ width: 36, textAlign: 'center' }}>LC</span>
          </div>

          {conceptQs.length === 0 ? (
            <div style={{ padding: '16px 16px', fontSize: 13, color: 'var(--text-tertiary)' }}>
              No problems mapped for this concept yet.
            </div>
          ) : (
            conceptQs.map((q, idx) => {
              const isSolved = questionStatus[q.id] === 'solved';
              const diffColor = q.difficulty === 'Easy' ? 'var(--easy)' : q.difficulty === 'Medium' ? 'var(--medium)' : 'var(--hard)';
              return (
                <div
                  key={q.id}
                  className={`lc-prob-row ${isSolved ? 'lc-prob-solved' : ''} ${idx % 2 === 0 ? 'lc-prob-stripe' : ''}`}
                >
                  {/* Checkbox */}
                  <div 
                    className="lc-prob-check" 
                    style={{
                      border: `1.5px solid ${isSolved ? 'var(--success)' : 'var(--border-secondary)'}`,
                      background: isSolved ? 'var(--success)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCheckClick(q.id, isSolved)}
                  >
                    {isSolved && <Check size={9} strokeWidth={3} color="#fff" />}
                  </div>

                  {/* Number */}
                  <span className="lc-prob-num">{q.num}.</span>

                  {/* Title */}
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="lc-prob-title">
                    {q.title}
                  </a>

                  {/* Difficulty */}
                  <span className="lc-prob-diff" style={{ color: diffColor }}>{q.difficulty}</span>

                  {/* YouTube icon */}
                  <a
                    href={`https://www.youtube.com/results?search_query=striver+${encodeURIComponent(q.title)}+leetcode`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lc-prob-icon-btn"
                    title="Search on YouTube"
                  >
                    <YoutubeLogo size={16} />
                  </a>

                  {/* LeetCode icon */}
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lc-prob-icon-btn"
                    title="Open on LeetCode"
                  >
                    <LeetCodeLogo size={14} />
                  </a>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function RoadmapPage() {
  const activeProfileId = useProgressStore(s => s.activeProfileId);
  const questionStatus  = useProgressStore(useShallow(s => s.profiles[activeProfileId]?.questionStatus || {}));
  const allQuestions    = useAllQuestions();

  const [filterLevel, setFilterLevel] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [searchQuery,  setSearchQuery] = useState('');

  const { completedConcepts, totalProblems, solvedProblems } = useMemo(() => {
    let completedConcepts = 0, totalProblems = 0, solvedProblems = 0;
    roadmap.forEach(step => {
      const qs     = allQuestions.filter(q => q.topic === step.topicId && q.pattern === step.patternId);
      const solved = qs.filter(q => questionStatus[q.id] === 'solved').length;
      if (qs.length > 0 && solved === qs.length) completedConcepts++;
      totalProblems  += qs.length;
      solvedProblems += solved;
    });
    return { completedConcepts, totalProblems, solvedProblems };
  }, [allQuestions, questionStatus]);

  const filteredSteps = useMemo(() =>
    roadmap.filter(step => {
      if (filterLevel !== 'All' && step.level !== filterLevel) return false;
      if (filterTopic !== 'All' && step.topicId !== filterTopic) return false;
      if (searchQuery.trim()) {
        const name = (patterns[step.patternId]?.name || step.patternId).toLowerCase();
        if (!name.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    }),
    [filterLevel, filterTopic, searchQuery]
  );

  const groupedByTopic = useMemo(() => {
    const order = topics.map(t => t.id);
    const map   = {};
    filteredSteps.forEach(step => {
      if (!map[step.topicId]) map[step.topicId] = [];
      map[step.topicId].push(step);
    });
    return order.filter(tid => map[tid]).map(tid => ({ topicId: tid, steps: map[tid] }));
  }, [filteredSteps]);

  const overallPct  = totalProblems ? Math.round((solvedProblems / totalProblems) * 100) : 0;
  const conceptPct  = Math.round((completedConcepts / roadmap.length) * 100);

  const uniqueTopics = useMemo(() => {
    const ids = [...new Set(roadmap.map(s => s.topicId))];
    return ids.map(id => topics.find(t => t.id === id)).filter(Boolean);
  }, []);

  const TABS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const TAB_LABELS = { All: 'All', Beginner: 'Easy', Intermediate: 'Medium', Advanced: 'Hard' };

  return (
    <div className="page-content animate-fade-in">

      {/* ═══ LeetCode-style study plan header ═══ */}
      <div className="lc-roadmap-hero">
        {/* Left — title block */}
        <div className="lc-hero-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div className="lc-hero-icon-wrap">
              <Map size={18} strokeWidth={2} />
            </div>
            <h2 className="lc-hero-title">DSA Study Plan — Beginner to Master</h2>
          </div>
          <p className="lc-hero-desc">
            59 concepts ordered for optimal learning. Watch the tutorial, then solve the problems — concept by concept.
          </p>

          {/* Stat row */}
          <div className="lc-hero-stats">
            <div className="lc-hero-stat">
              <span className="lc-hero-stat-val" style={{ color: 'var(--accent-primary)' }}>{roadmap.length}</span>
              <span className="lc-hero-stat-lbl">Concepts</span>
            </div>
            <div className="lc-hero-stat-divider" />
            <div className="lc-hero-stat">
              <span className="lc-hero-stat-val" style={{ color: 'var(--easy)' }}>{totalProblems}</span>
              <span className="lc-hero-stat-lbl">Problems</span>
            </div>
            <div className="lc-hero-stat-divider" />
            <div className="lc-hero-stat">
              <span className="lc-hero-stat-val" style={{ color: 'var(--medium)' }}>{completedConcepts}</span>
              <span className="lc-hero-stat-lbl">Completed</span>
            </div>
            <div className="lc-hero-stat-divider" />
            <div className="lc-hero-stat">
              <span className="lc-hero-stat-val" style={{ color: 'var(--hard)' }}>{solvedProblems}</span>
              <span className="lc-hero-stat-lbl">Solved</span>
            </div>
          </div>
        </div>

        {/* Right — dual progress rings */}
        <div className="lc-hero-rings">
          <div className="lc-ring-item">
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <CircleProgress pct={conceptPct} size={80} color="var(--accent-primary)" trackColor="var(--bg-tertiary)" />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{conceptPct}%</span>
              </div>
            </div>
            <div className="lc-ring-label">
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{completedConcepts}<span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>/{roadmap.length}</span></span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>concepts done</span>
            </div>
          </div>

          <div className="lc-ring-item">
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <CircleProgress pct={overallPct} size={80} color="var(--easy)" trackColor="var(--bg-tertiary)" />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{overallPct}%</span>
              </div>
            </div>
            <div className="lc-ring-label">
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{solvedProblems}<span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>/{totalProblems}</span></span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>problems solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ LeetCode-style tab + filter bar ═══ */}
      <div className="lc-filter-bar">
        {/* Tabs */}
        <div className="lc-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`lc-tab ${filterLevel === tab ? 'lc-tab-active' : ''}`}
              style={filterLevel === tab && tab !== 'All' ? {
                color: LEVEL_CONFIG[tab]?.color,
                borderBottomColor: LEVEL_CONFIG[tab]?.color,
              } : {}}
              onClick={() => setFilterLevel(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="lc-filter-right">
          {/* Topic select */}
          <select
            value={filterTopic}
            onChange={e => setFilterTopic(e.target.value)}
            className="lc-select"
          >
            <option value="All">All Topics</option>
            {uniqueTopics.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Search */}
          <div className="lc-search-wrap">
            <Search size={13} className="lc-search-icon" />
            <input
              type="text"
              placeholder="Search concept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="lc-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="lc-search-clear">
                <X size={12} />
              </button>
            )}
          </div>

          <span className="lc-count-badge">{filteredSteps.length} concept{filteredSteps.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ═══ Topic sections ═══ */}
      {groupedByTopic.length === 0 ? (
        <div className="empty-state">
          <Map className="empty-state-icon" />
          <div className="empty-state-title">No concepts match</div>
          <div className="empty-state-desc">Try adjusting the level or topic filter.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {groupedByTopic.map(({ topicId, steps: topicSteps }, gi) => {
            const topic = topics.find(t => t.id === topicId);
            const topicSolved = topicSteps.reduce((acc, step) => {
              const qs = allQuestions.filter(q => q.topic === step.topicId && q.pattern === step.patternId);
              return acc + qs.filter(q => questionStatus[q.id] === 'solved').length;
            }, 0);
            const topicTotal = topicSteps.reduce((acc, step) =>
              acc + allQuestions.filter(q => q.topic === step.topicId && q.pattern === step.patternId).length, 0);
            const topicPct = topicTotal ? Math.round((topicSolved / topicTotal) * 100) : 0;

            return (
              <div key={topicId} className="lc-topic-section" style={{ marginTop: gi === 0 ? 0 : 24 }}>
                {/* Topic heading */}
                <div className="lc-topic-heading">
                  <div className="lc-topic-icon-box" style={{ background: `${topic?.color || 'var(--accent-primary)'}18`, color: topic?.color || 'var(--accent-primary)' }}>
                    {getTopicIcon(topicId, { size: 16 })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span className="lc-topic-name">{topic?.name || topicId}</span>
                    <span className="lc-topic-meta">{topicSteps.length} concept{topicSteps.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="lc-topic-progress-text">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: topicPct === 100 ? 'var(--easy)' : 'var(--text-secondary)' }}>
                      {topicSolved}<span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>/{topicTotal}</span>
                    </span>
                  </div>
                  <Link to={`/topics/${topicId}`} className="lc-topic-link">
                    View all <ChevronRight size={13} />
                  </Link>
                </div>

                {/* Concept rows */}
                <div className="lc-concept-list">
                  {topicSteps.map(step => (
                    <ConceptCard
                      key={`${step.topicId}-${step.patternId}`}
                      step={step}
                      allQuestions={allQuestions}
                      questionStatus={questionStatus}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEETCODE-STYLE LOGIN PAGE
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LEETCODE-STYLE LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ user }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // New state variables for User ID mapping
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [needsUserId, setNeedsUserId] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [userIdForSignup, setUserIdForSignup] = useState('');
  const [emailForSignup, setEmailForSignup] = useState('');

  const checkUserMapping = async (currentUser) => {
    if (!currentUser) return;
    setCheckingUserId(true);
    try {
      const q = query(collection(db, 'users'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userDoc = snap.docs[0].data();
        const mappedUsername = userDoc.username;
        
        if (currentUser.displayName !== mappedUsername) {
          await updateProfile(currentUser, { displayName: mappedUsername });
        }
        
        const progressStore = useProgressStore.getState();
        if (progressStore.profiles['default'] && progressStore.profiles['default'].name !== mappedUsername) {
          useProgressStore.setState((prev) => ({
            profiles: {
              ...prev.profiles,
              'default': {
                ...prev.profiles['default'],
                name: mappedUsername
              }
            }
          }));
        }

        const isEmailVerified = currentUser.emailVerified || 
          currentUser.email?.endsWith('@dsamastery.local') || 
          currentUser.providerData.some(p => p.providerId === 'google.com');
        if (isEmailVerified) {
          navigate('/');
        } else {
          navigate('/verify-email');
        }
      } else {
        // Migration for legacy user with local dsamastery.local emails
        if (currentUser.email && currentUser.email.endsWith('@dsamastery.local')) {
          const legacyUsername = currentUser.email.split('@')[0];
          await setDoc(doc(db, 'users', legacyUsername.toLowerCase()), {
            userId: currentUser.uid,
            username: legacyUsername,
            email: currentUser.email
          });
          await updateProfile(currentUser, { displayName: legacyUsername });
          navigate('/');
          return;
        }
        
        setNeedsUserId(true);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to check user account setup: ' + err.message);
    } finally {
      setCheckingUserId(false);
    }
  };

  useEffect(() => {
    if (user && !needsUserId) {
      checkUserMapping(user);
    }
  }, [user, needsUserId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const uId = userIdForSignup.trim();
        const email = emailForSignup.trim();
        const pass = password.trim();

        if (!uId || !email || !pass) {
          throw new Error('Please fill in all fields.');
        }

        const userIdRegex = /^[a-zA-Z0-9_-]+$/;
        if (!userIdRegex.test(uId)) {
          throw new Error('User ID can only contain letters, numbers, underscores, or hyphens.');
        }
        if (uId.length < 3) {
          throw new Error('User ID must be at least 3 characters long.');
        }
        if (uId.includes('@')) {
          throw new Error('User ID cannot contain the "@" symbol.');
        }

        const userDocRef = doc(db, 'users', uId.toLowerCase());
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          throw new Error('This User ID is already taken.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;

        await setDoc(userDocRef, {
          userId: firebaseUser.uid,
          username: uId,
          email: email
        });

        await updateProfile(firebaseUser, { displayName: uId });

        const progressStore = useProgressStore.getState();
        if (progressStore.profiles['default']) {
          useProgressStore.setState((prev) => ({
            profiles: {
              ...prev.profiles,
              'default': {
                ...prev.profiles['default'],
                name: uId
              }
            }
          }));
        }

        if (!email.endsWith('@dsamastery.local')) {
          await sendEmailVerification(firebaseUser);
        }
      } else if (mode === 'signin') {
        const input = usernameOrEmail.trim();
        const pass = password.trim();

        if (!input || !pass) return;

        let emailToSignIn = input;
        if (!input.includes('@')) {
          // Primary: direct doc lookup by lowercase username key
          const userDocRef = doc(db, 'users', input.toLowerCase());
          let userDoc = await getDoc(userDocRef);

          // Fallback: if doc not found by key, search by 'username' field
          if (!userDoc.exists()) {
            const q = query(
              collection(db, 'users'),
              where('username', '==', input.toLowerCase())
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
              userDoc = snap.docs[0];
            }
          }

          if (!userDoc.exists()) {
            throw new Error('Username not found. Check your username or sign in with your email address.');
          }
          emailToSignIn = userDoc.data().email;
          if (!emailToSignIn) {
            throw new Error('No email linked to this username. Please sign in with Google.');
          }
        }

        await signInWithEmailAndPassword(auth, emailToSignIn, pass);
      } else if (mode === 'forgot') {
        const input = usernameOrEmail.trim();
        if (!input) return;
        if (!input.includes('@')) {
          throw new Error('Password reset is only supported for accounts registered with a real email address.');
        }
        await sendPasswordResetEmail(auth, input);
        setSuccess('Password reset link has been sent to your email.');
      }
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') errMsg = 'Incorrect password.';
      if (err.code === 'auth/user-not-found') errMsg = 'User not found.';
      if (err.code === 'auth/email-already-in-use') errMsg = 'This email is already in use.';
      if (err.code === 'auth/invalid-credential') errMsg = 'Invalid credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUserId = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const uId = newUserId.trim();
    if (!uId) return;

    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(uId)) {
      setError('User ID can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    if (uId.length < 3) {
      setError('User ID must be at least 3 characters long.');
      return;
    }
    if (uId.includes('@')) {
      setError('User ID cannot contain the "@" symbol.');
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', uId.toLowerCase());
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        throw new Error('This User ID is already taken.');
      }

      if (!auth.currentUser) {
        throw new Error('No logged-in user session found.');
      }

      const firebaseUser = auth.currentUser;

      await setDoc(userDocRef, {
        userId: firebaseUser.uid,
        username: uId,
        email: firebaseUser.email
      });

      await updateProfile(firebaseUser, { displayName: uId });

      const progressStore = useProgressStore.getState();
      if (progressStore.profiles['default']) {
        useProgressStore.setState((prev) => ({
          profiles: {
            ...prev.profiles,
            'default': {
              ...prev.profiles['default'],
              name: uId
            }
          }
        }));
      }

      setNeedsUserId(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/popup-closed-by-user') errMsg = 'Sign-in popup closed before completion.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingUserId) {
    return (
      <div className="lc-login-container">
        <div className="lc-login-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <RefreshCw className="spin" size={36} color="var(--accent-primary)" />
          <p style={{ marginTop: 16, fontSize: 14, color: 'var(--text-secondary)' }}>Checking account setup...</p>
        </div>
      </div>
    );
  }

  if (needsUserId) {
    return (
      <div className="lc-login-container">
        <div className="lc-login-card">
          <div className="lc-login-header">
            <div className="lc-logo-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DsaMasteryLogo size={36} />
            </div>
            <h2 className="lc-login-title">Choose User ID</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0', lineHeight: 1.5 }}>
              Choose a permanent User ID to complete your registration. This cannot be changed later.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
              color: 'var(--error)', fontSize: 13, lineHeight: 1.4, textAlign: 'center', marginBottom: 12
            }}>
              <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSetUserId} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="lc-input-group">
              <label>User ID (Permanent)</label>
              <input
                type="text"
                placeholder="e.g. danush"
                value={newUserId}
                onChange={e => setNewUserId(e.target.value)}
                required
                className="lc-input"
              />
            </div>
            <button type="submit" className="lc-submit-btn" disabled={loading}>
              {loading ? 'Setting User ID...' : 'Confirm User ID'}
            </button>
            <button 
              type="button" 
              className="lc-google-btn" 
              onClick={() => {
                signOut(auth);
                setNeedsUserId(false);
                setError('');
              }}
              style={{ border: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)', marginTop: 4 }}
            >
              Cancel & Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="lc-login-container">
      <div className="lc-login-card">
        <div className="lc-login-header">
          <div className="lc-logo-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={36} />
          </div>
          <h2 className="lc-login-title">
            {mode === 'forgot' ? 'Reset Password' : 'DSA Mastery'}
          </h2>
        </div>

        {mode !== 'forgot' ? (
          <div className="lc-tab-container">
            <button
              type="button"
              className={`lc-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`lc-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            >
              Register
            </button>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: '4px 0', lineHeight: 1.5 }}>
            Enter your email address and we will send you a link to reset your password.
          </p>
        )}

        {error && (
          <div style={{
            padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--error)', fontSize: 13, lineHeight: 1.4, textAlign: 'center', marginBottom: 12
          }}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '10px 12px', background: 'rgba(0, 184, 163, 0.1)',
            border: '1px solid rgba(0, 184, 163, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--success)', fontSize: 13, lineHeight: 1.4, textAlign: 'center', marginBottom: 12
          }}>
            <Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} color="var(--success)" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' ? (
            <>
              <div className="lc-input-group">
                <label>Username <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', fontSize: 11 }}>(can be changed later in Profile)</span></label>
                <input
                  type="text"
                  placeholder="Letters, numbers, underscores or hyphens"
                  value={userIdForSignup}
                  onChange={e => setUserIdForSignup(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>
              <div className="lc-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={emailForSignup}
                  onChange={e => setEmailForSignup(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>
            </>
          ) : (
            <div className="lc-input-group">
              <label>{mode === 'forgot' ? 'Email Address' : 'User ID or Email'}</label>
              <input
                type="text"
                placeholder={mode === 'forgot' ? 'Email address' : 'User ID or email address'}
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                required
                className="lc-input"
              />
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="lc-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: '#ffa116', fontSize: 11, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required={!loading}
                className="lc-input"
              />
            </div>
          )}

          <button type="submit" className="lc-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Recovery Email'}
          </button>
        </form>

        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: '#ffa116', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            >
              Back to Sign In
            </button>
          </div>
        )}

        {mode !== 'forgot' && (
          <>
            <div className="lc-divider">
              <span>or connect with</span>
            </div>

            <button type="button" className="lc-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
              <svg viewBox="0 0 24 24" width="18" height="18" style={{ minWidth: 18 }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EMAIL VERIFICATION PAGE
// ═══════════════════════════════════════════════════════════════
function VerifyEmailPage({ user, onLogout }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Send verification email
  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage('A verification email has been sent to ' + auth.currentUser.email);
        setCooldown(60);
      } else {
        setError('No active session found. Please sign in again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check verification status (refresh user token/profile)
  const handleRefresh = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        window.location.reload();
      } else {
        setError('No active session found. Please sign in again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    try {
      await signOut(auth);
      clearAllLocalStores();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <div className="lc-login-container">
      <div className="lc-login-card" style={{ textAlign: 'center' }}>
        <div className="lc-login-header">
          <div className="lc-logo-circle" style={{ border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={32} color="var(--accent-primary)" /></div>
          <h2 className="lc-login-title">Verify Your Email</h2>
        </div>
        
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          We sent a verification link to <strong>{user?.email}</strong>. Please check your inbox (and spam folder) and verify your account.
        </p>

        {error && (
          <div style={{
            padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--error)', fontSize: 13, lineHeight: 1.4, textAlign: 'center'
          }}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '10px 12px', background: 'rgba(0, 184, 163, 0.1)',
            border: '1px solid rgba(0, 184, 163, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--success)', fontSize: 13, lineHeight: 1.4, textAlign: 'center'
          }}>
            <Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} color="var(--success)" /> {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          <button className="lc-submit-btn" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Checking...' : 'I have verified my email'}
          </button>
          
          <button 
            className="lc-google-btn" 
            onClick={handleResend} 
            disabled={loading || cooldown > 0}
            style={{ border: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)' }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </button>
          
          <button 
            className="lc-google-btn" 
            onClick={handleLogout}
            style={{ border: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)' }}
          >
            Sign Out / Different Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AVATAR EDITOR MODAL
// ═══════════════════════════════════════════════════════════════
function AvatarEditorModal({ onClose, activeAvatar, name }) {
  const [activeTab, setActiveTab] = useState(activeAvatar && activeAvatar.startsWith('#') ? 'color' : 'emoji');
  
  const colors = [
    '#FFA116', // LeetCode Orange
    '#00b8a3', // LeetCode Green
    '#38BDF8', // Sky Blue
    '#A78BFA', // Purple
    '#F43F5E', // Rose
    '#FBBF24', // Amber
    '#34D399', // Emerald
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  const emojis = ['🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🦖', '🐉', '👻', '⚡️'];

  const handleSelect = (val) => {
    useProgressStore.setState((prev) => ({
      profiles: {
        ...prev.profiles,
        'default': {
          ...prev.profiles['default'],
          avatar: val
        }
      }
    }));
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} /> Edit Profile Avatar
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tabs */}
          <div className="lc-tab-container" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className={`lc-tab-btn ${activeTab === 'color' ? 'active' : ''}`}
              onClick={() => setActiveTab('color')}
            >
              Initial & Color
            </button>
            <button
              type="button"
              className={`lc-tab-btn ${activeTab === 'emoji' ? 'active' : ''}`}
              onClick={() => setActiveTab('emoji')}
            >
              Emoji Avatar
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ border: '3px solid var(--border-secondary)', borderRadius: '50%', padding: 4 }}>
              {renderAvatar(activeAvatar, name, 80)}
            </div>
          </div>

          {activeTab === 'color' ? (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'center' }}>
                Select a professional background color for your initials:
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleSelect(color)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: color,
                      border: activeAvatar === color ? '2.5px solid var(--text-primary)' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      boxShadow: activeAvatar === color ? '0 0 8px var(--accent-primary)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {activeAvatar === color && <Check size={16} color="#ffffff" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'center' }}>
                Select a playful emoji for your profile:
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleSelect(emoji)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: activeAvatar === emoji ? 'var(--bg-tertiary)' : 'none',
                      border: activeAvatar === emoji ? '1.5px solid var(--accent-primary)' : '1px solid transparent',
                      fontSize: 20,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 24px' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// SIGN OUT OVERLAY
// ═══════════════════════════════════════════════════════════════
function SignOutOverlay() {
  return (
    <div className="signout-overlay">
      <div className="signout-card">
        <RefreshCw className="spin signout-spinner" size={40} />
        <h3>Signing out of DSA Mastery</h3>
        <p>Securing your workspace and syncing records...</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DANGER ZONE: DELETE ACCOUNT MODAL
// ═══════════════════════════════════════════════════════════════
function DeleteAccountModal({ onClose, user, username, totalSolved }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm_username'); // 'confirm_username', 'reauth', 'deleting', 'success'
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingStatus, setDeletingStatus] = useState('');

  const isGoogleLinked = user?.providerData?.some(p => p.providerId === 'google.com');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() !== username.toLowerCase()) {
      setError('User ID does not match.');
      return;
    }
    setError('');
    setStep('reauth');
  };

  const handleReauthAndPurge = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isGoogleLinked) {
        setDeletingStatus('Re-authenticating with Google...');
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        if (!password) {
          setError('Password is required.');
          setLoading(false);
          return;
        }
        setDeletingStatus('Verifying credentials...');
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      setStep('deleting');
      setDeletingStatus('Purging user progress database records...');
      await deleteUserCloudData(user);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDeletingStatus('Deleting Cloud Auth registration account...');
      await deleteUser(user);
      
      clearAllLocalStores();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('success');
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') {
        errMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'Google authentication popup was closed before completion.';
      } else if (err.code === 'auth/user-mismatch') {
        errMsg = 'Credential mismatch. Please sign in with the correct account first.';
      }
      setError(errMsg);
      setStep('reauth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        onClose();
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)' }}>
            <AlertTriangle size={18} /> Delete Account (Danger Zone)
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}><X size={18} /></button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
              color: 'var(--error)', fontSize: 13, lineHeight: 1.4
            }}>
              <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
            </div>
          )}

          {step === 'confirm_username' && (
            <form onSubmit={handleUsernameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: '12px', background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-lg)',
                fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)'
              }}>
                <span style={{ color: 'var(--error)', fontWeight: 600, display: 'block', marginBottom: 4 }}>This action is permanent and irreversible!</span>
                Deleting your account will purge all of your data from our database:
                <ul style={{ paddingLeft: 20, marginTop: 4, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <li>All study roadmap question solve states ({totalSolved} problems solved)</li>
                  <li>All custom DSA notes, hints, and code templates</li>
                  <li>All revision schedules and tracking progress</li>
                  <li>Active learning streak milestones</li>
                </ul>
              </div>

              <div className="lc-input-group">
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  To confirm, type your User ID: <strong style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-secondary)' }}>{username}</strong>
                </label>
                <input
                  type="text"
                  placeholder="Type User ID here"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="lc-input"
                  style={{ marginTop: 8 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-danger" 
                  disabled={usernameInput.trim().toLowerCase() !== username.toLowerCase()}
                  style={{ flex: 1, background: 'var(--error)', color: 'white' }}
                >
                  Proceed to Verification
                </button>
              </div>
            </form>
          )}

          {step === 'reauth' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                For security verification, you must confirm your identity before we can proceed with deleting your account.
              </div>

              {isGoogleLinked ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                  <button
                    type="button"
                    className="lc-google-btn"
                    onClick={handleReauthAndPurge}
                    disabled={loading}
                    style={{ width: '100%', maxWidth: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {loading ? <RefreshCw className="spin" size={16} /> : <ExternalLink size={16} />} Verify with Google account
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep('confirm_username')} disabled={loading} style={{ width: '100%', maxWidth: 300 }}>
                    Back
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReauthAndPurge} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="lc-input-group">
                    <label>Confirm Account Password</label>
                    <input
                      type="password"
                      placeholder="Enter password to confirm"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="lc-input"
                      required
                      autoFocus
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setStep('confirm_username')} disabled={loading} style={{ flex: 1 }}>Back</button>
                    <button 
                      type="submit" 
                      className="btn btn-danger" 
                      disabled={loading || !password}
                      style={{ flex: 1, background: 'var(--error)', color: 'white' }}
                    >
                      {loading ? 'Verifying...' : 'Permanently Delete Account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {step === 'deleting' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 20 }}>
              <RefreshCw className="spin" size={40} color="var(--error)" />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Processing Account Purge</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{deletingStatus}</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 10px', gap: 16, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--success)', marginBottom: 8
              }}>
                <Check size={28} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Account Deleted</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 360 }}>
                Your account and all associated cloud and local workspace data have been permanently deleted. We are sorry to see you go!
              </p>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
                Redirecting you to the home page...
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                style={{ marginTop: 12, width: '100%', maxWidth: 200 }}
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// EDIT USERNAME MODAL
// ═══════════════════════════════════════════════════════════════
function EditUsernameModal({ onClose, user, currentUsername, onSuccess }) {
  const [newUsername, setNewUsername] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'saving', 'success'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uId = newUsername.trim().toLowerCase();
    if (!uId) return;

    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(uId)) {
      setError('Username can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    if (uId.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (uId === currentUsername?.toLowerCase()) {
      setError('That is already your current username.');
      return;
    }

    setError('');
    setLoading(true);
    setStep('saving');

    try {
      // 1. Check uniqueness
      const newDocRef = doc(db, 'users', uId);
      const existing = await getDoc(newDocRef);
      if (existing.exists()) {
        throw new Error('This username is already taken. Please choose another.');
      }

      // 2. Create new doc with same data
      await setDoc(newDocRef, {
        userId: user.uid,
        username: uId,
        email: user.email || ''
      });

      // 3. Delete old doc
      const oldDocRef = doc(db, 'users', currentUsername.toLowerCase());
      await deleteDoc(oldDocRef);

      // 4. Update Firebase Auth displayName
      await updateProfile(user, { displayName: uId });

      // 5. Update Zustand store
      useProgressStore.setState((prev) => ({
        profiles: {
          ...prev.profiles,
          'default': {
            ...prev.profiles['default'],
            name: uId
          }
        }
      }));

      setStep('success');
      setTimeout(() => {
        onSuccess(uId);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pencil size={18} /> Edit Username
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
              }}>
                <Check size={24} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Username updated!</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your new username is <strong>{newUsername.trim().toLowerCase()}</strong></div>
            </div>
          ) : step === 'saving' ? (
            <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <RefreshCw className="spin" size={32} color="var(--accent-primary)" />
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Updating username...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: '10px 12px', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                fontSize: 13, color: 'var(--text-secondary)'
              }}>
                Current username: <strong style={{ color: 'var(--text-primary)' }}>@{currentUsername}</strong>
              </div>

              {error && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
                  color: 'var(--error)', fontSize: 13
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
                </div>
              )}

              <div className="lc-input-group">
                <label>New Username</label>
                <input
                  type="text"
                  placeholder="e.g. coderdan99"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="lc-input"
                  required
                  autoFocus
                />
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  Lowercase letters, numbers, underscores, hyphens. Min 3 characters.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading || !newUsername.trim()} style={{ flex: 1 }}>
                  Save Username
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function PasswordSettingsModal({ onClose, user }) {
  // Determine if user has email/password provider
  const hasEmailProvider = user?.providerData?.some(p => p.providerId === 'password');
  const isGoogleOnly = !hasEmailProvider;

  const [step, setStep] = useState('form'); // 'form', 'processing', 'success'
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      if (isGoogleOnly) {
        // Link email/password credential to the Google account
        const credential = EmailAuthProvider.credential(user.email, newPassword);
        await linkWithCredential(user, credential);

        // CRITICAL: Ensure the Firestore username doc exists so the user can
        // sign in with username + password. Google-only accounts may not have one.
        const username = (user.displayName || '').toLowerCase();
        if (username) {
          const userDocRef = doc(db, 'users', username);
          const existing = await getDoc(userDocRef);
          if (!existing.exists()) {
            await setDoc(userDocRef, {
              userId: user.uid,
              username: username,
              email: user.email || ''
            });
          } else if (!existing.data().email && user.email) {
            // Patch email in case it was stored empty
            await setDoc(userDocRef, { email: user.email }, { merge: true });
          }
        }
      } else {
        // Re-authenticate then change password
        if (!currentPassword) {
          setError('Please enter your current password.');
          setStep('form');
          setLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      setStep('success');
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') errMsg = 'Incorrect current password.';
      if (err.code === 'auth/too-many-requests') errMsg = 'Too many failed attempts. Please try again later.';
      if (err.code === 'auth/provider-already-linked') errMsg = 'A password is already set on this account. Please sign in with password to change it.';
      if (err.code === 'auth/requires-recent-login') errMsg = 'Session expired. Please sign out and sign back in to change your password.';
      if (err.code === 'auth/weak-password') errMsg = 'Password must be at least 6 characters.';
      setError(errMsg);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key size={18} /> {isGoogleOnly ? 'Set Password' : 'Change Password'}
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
              }}>
                <Check size={24} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {isGoogleOnly ? 'Password set successfully!' : 'Password changed!'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {isGoogleOnly
                  ? 'You can now sign in with your username and password in addition to Google.'
                  : 'Your password has been updated.'}
              </div>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 8, padding: '8px 24px' }}>Done</button>
            </div>
          ) : step === 'processing' ? (
            <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <RefreshCw className="spin" size={32} color="var(--accent-primary)" />
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {isGoogleOnly ? 'Setting up password login...' : 'Updating password...'}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isGoogleOnly && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(255, 161, 22, 0.07)',
                  border: '1px solid rgba(255, 161, 22, 0.2)', borderRadius: 'var(--radius-md)',
                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5
                }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>Enable password login</strong><br />
                  Set a password so you can also sign in with your <strong>username + password</strong> (not just Google).
                </div>
              )}

              {error && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
                  color: 'var(--error)', fontSize: 13
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
                </div>
              )}

              {!isGoogleOnly && (
                <div className="lc-input-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="lc-input"
                    required
                    autoFocus
                  />
                </div>
              )}

              <div className="lc-input-group">
                <label>{isGoogleOnly ? 'Password' : 'New Password'}</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="lc-input"
                  required
                  autoFocus={isGoogleOnly}
                />
              </div>

              <div className="lc-input-group">
                <label>Confirm {isGoogleOnly ? 'Password' : 'New Password'}</label>
                <input
                  type="password"
                  placeholder="Repeat the password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="lc-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !newPassword || !confirmPassword}
                  style={{ flex: 1 }}
                >
                  {isGoogleOnly ? 'Set Password' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════
// LEETCODE-STYLE PROFILE PAGE
// ═══════════════════════════════════════════════════════════════
function ProfilePage({ user, syncStatus, onLogout }) {
  const navigate = useNavigate();
  const allQuestions = useAllQuestions();
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const profile = useProgressStore((s) => s.profiles[activeProfileId] || {});
  const isGoogleLinked = user?.providerData?.some(p => p.providerId === 'google.com');
  
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [passwordSettingsOpen, setPasswordSettingsOpen] = useState(false);
  // Track local username (updates instantly on rename)
  const [localUsername, setLocalUsername] = useState(user?.displayName || profile.name || '');
  useEffect(() => {
    setLocalUsername(user?.displayName || profile.name || '');
  }, [user?.displayName, profile.name]);

  // Solved and status metrics
  const questionStatus = profile.questionStatus || {};
  const bookmarks = profile.bookmarks || [];
  const customQuestions = profile.customQuestions || [];
  const currentStreak = profile.currentStreak || 0;
  const longestStreak = profile.longestStreak || 0;
  
  // Calculate total counts by difficulty
  const totalEasy = allQuestions.filter(q => q.difficulty === 'Easy').length;
  const totalMedium = allQuestions.filter(q => q.difficulty === 'Medium').length;
  const totalHard = allQuestions.filter(q => q.difficulty === 'Hard').length;
  const totalProblems = allQuestions.length;

  const solvedEasy = allQuestions.filter(q => q.difficulty === 'Easy' && questionStatus[q.id] === 'solved').length;
  const solvedMedium = allQuestions.filter(q => q.difficulty === 'Medium' && questionStatus[q.id] === 'solved').length;
  const solvedHard = allQuestions.filter(q => q.difficulty === 'Hard' && questionStatus[q.id] === 'solved').length;
  const totalSolved = solvedEasy + solvedMedium + solvedHard;

  const easyPercent = totalEasy ? Math.round((solvedEasy / totalEasy) * 100) : 0;
  const mediumPercent = totalMedium ? Math.round((solvedMedium / totalMedium) * 100) : 0;
  const hardPercent = totalHard ? Math.round((solvedHard / totalHard) * 100) : 0;
  const totalPercent = totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Revisions stats
  const revisions = useRevisionStore((s) => s.profiles[activeProfileId] || {});
  const totalRevisions = Object.keys(revisions).length;

  // Notes stats
  const notes = useNotesStore((s) => s.profiles[activeProfileId] || {});
  const totalNotes = Object.keys(notes).length;

  // Recent activity list
  const solveHistory = profile.solveHistory || [];
  const fallbackHistory = useMemo(() => {
    if (solveHistory.length > 0) return solveHistory;
    return Object.entries(questionStatus)
      .filter(([_, status]) => status === 'solved')
      .map(([id]) => ({ questionId: parseInt(id), solvedAt: null }))
      .slice(0, 10);
  }, [solveHistory, questionStatus]);

  // Helper to format timestamps
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Previously';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  // Profile manager modal trigger
  const [managerOpen, setManagerOpen] = useState(false);

  // Backup data
  const handleBackup = () => {
    const backupStr = useProgressStore.getState().exportData();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dsa_mastery_backup_${activeProfileId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Sign out helper
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      try {
        await signOut(auth);
        clearAllLocalStores();
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete user account and cascading data
  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  // Link Google Account helper
  const handleLinkGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      if (!auth.currentUser) return;
      await linkWithPopup(auth.currentUser, provider);
      alert("Success! Your Google account has been successfully linked.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Linking Google account failed: ${err.message}`);
    }
  };

  // SVG circular chart variables
  const radius = 56;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalPercent / 100) * circumference;

  return (
    <div className="page-content">
      <div className="profile-container">
        {/* Left Column */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-user-info">
              <div className="profile-avatar-large">
                {renderAvatar(profile.avatar, profile.name, 72)}
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setAvatarModalOpen(true)}
                style={{ marginTop: 10, padding: '4px 12px', fontSize: 12 }}
              >
                Edit Avatar
              </button>
              <div className="profile-display-name">
                {localUsername || user?.displayName || profile.name}
              </div>
              {user?.email && (
                <div className="profile-email">
                  {user.email}
                </div>
              )}
              {user?.metadata?.createdAt && (
                <div className="profile-joined">
                  Member since {new Date(parseInt(user.metadata.createdAt)).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </div>
              )}
              <div className="profile-status-pill">
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: syncStatus === 'synced' ? 'var(--success)' : syncStatus === 'syncing' ? 'var(--warning)' : 'var(--text-tertiary)'
                }}></span>
                {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Guest Mode (Local)'}
              </div>
            </div>
          </div>

          <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, borderBottom: '1px solid var(--border-primary)', paddingBottom: 8 }}>
              Account Settings
            </h4>
            <button className="btn btn-secondary btn-sm" onClick={handleBackup} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Download size={14} /> Backup Data (JSON)
            </button>
            {user && !isGoogleLinked && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleLinkGoogle} 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 161, 22, 0.1)', 
                  border: '1px solid rgba(255, 161, 22, 0.3)', 
                  color: '#ffa116',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffa116';
                  e.currentTarget.style.color = '#1a1a2e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 161, 22, 0.1)';
                  e.currentTarget.style.color = '#ffa116';
                }}
              >
                <ExternalLink size={14} /> Link Google Account
              </button>
            )}
            {user && (
              <>
                {/* Edit Username */}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditUsernameOpen(true)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Pencil size={14} /> Edit Username
                </button>

                {/* Password Settings */}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPasswordSettingsOpen(true)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Key size={14} /> {user?.providerData?.some(p => p.providerId === 'password') ? 'Change Password' : 'Set Password'}
                </button>

                <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <LogOut size={14} /> Sign Out
                </button>
                <div style={{ borderTop: '1px solid var(--border-primary)', marginTop: 8, paddingTop: 8 }}>
                  <button
                    className="btn btn-sm"
                    onClick={handleDeleteAccount}
                    style={{
                      width: '100%',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--error)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--error)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = 'var(--error)';
                    }}
                  >
                    <Trash2 size={14} /> Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-main-grid">
          {/* Progress Ring and Difficulty Bars */}
          <div className="profile-card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Progress Summary</h3>
            <div className="profile-progress-stats">
              {/* SVG Ring */}
              <div className="profile-progress-circle-wrap">
                <div className="progress-ring-container">
                  <svg width="140" height="140">
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke="var(--bg-primary)"
                      strokeWidth={strokeWidth}
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke="var(--accent-primary)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)"
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <div className="progress-ring-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 22, fontWeight: 800 }}>{totalPercent}%</span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{totalSolved}/{totalProblems}</span>
                  </div>
                </div>
              </div>

              {/* Difficulty Bars */}
              <div className="difficulty-bars-list">
                {/* Easy */}
                <div className="difficulty-bar-item">
                  <div className="difficulty-bar-header">
                    <span style={{ color: 'var(--easy)' }}>Easy</span>
                    <div className="difficulty-bar-count">
                      <span>{solvedEasy}</span>/{totalEasy}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill easy" style={{ width: `${easyPercent}%` }}></div>
                  </div>
                </div>

                {/* Medium */}
                <div className="difficulty-bar-item">
                  <div className="difficulty-bar-header">
                    <span style={{ color: 'var(--medium)' }}>Medium</span>
                    <div className="difficulty-bar-count">
                      <span>{solvedMedium}</span>/{totalMedium}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill medium" style={{ width: `${mediumPercent}%` }}></div>
                  </div>
                </div>

                {/* Hard */}
                <div className="difficulty-bar-item">
                  <div className="difficulty-bar-header">
                    <span style={{ color: 'var(--hard)' }}>Hard</span>
                    <div className="difficulty-bar-count">
                      <span>{solvedHard}</span>/{totalHard}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill hard" style={{ width: `${hardPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Boxes */}
          <div className="profile-streak-grid">
            <div className="profile-stat-box">
              <span className="profile-stat-box-icon"><Flame size={20} style={{ color: '#f97316' }} /></span>
              <span className="profile-stat-box-val">{currentStreak}</span>
              <span className="profile-stat-box-lbl">Current Streak</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-box-icon"><Trophy size={20} style={{ color: '#eab308' }} /></span>
              <span className="profile-stat-box-val">{longestStreak}</span>
              <span className="profile-stat-box-lbl">Longest Streak</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-box-icon"><StickyNote size={20} style={{ color: 'var(--accent-primary)' }} /></span>
              <span className="profile-stat-box-val">{totalNotes}</span>
              <span className="profile-stat-box-lbl">Study Notes</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Submissions</h3>
            {fallbackHistory.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
                No recent activity. Start solving questions to populate your log!
              </p>
            ) : (
              <div className="activity-timeline">
                {fallbackHistory.map((item, idx) => {
                  const q = allQuestions.find(x => x.id === item.questionId);
                  if (!q) return null;
                  const diffClass = q.difficulty.toLowerCase();
                  return (
                    <div className="activity-item" key={idx}>
                      <span className={`activity-item-dot ${diffClass}`} />
                      <div className="activity-details">
                        <Link to="/sheet" className="activity-problem-link">
                          {q.title}
                        </Link>
                        <span className={`badge badge-${diffClass}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                          {q.difficulty}
                        </span>
                      </div>
                      <span className="activity-time">
                        {formatTimeAgo(item.solvedAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {avatarModalOpen && (
          <AvatarEditorModal 
            onClose={() => setAvatarModalOpen(false)} 
            activeAvatar={profile.avatar} 
            name={profile.name} 
          />
        )}
        {deleteModalOpen && (
          <DeleteAccountModal
            onClose={() => setDeleteModalOpen(false)}
            user={user}
            username={user?.displayName || profile.name}
            totalSolved={totalSolved}
          />
        )}
        {editUsernameOpen && user && (
          <EditUsernameModal
            onClose={() => setEditUsernameOpen(false)}
            user={user}
            currentUsername={localUsername || user?.displayName || profile.name}
            onSuccess={(newName) => setLocalUsername(newName)}
          />
        )}
        {passwordSettingsOpen && user && (
          <PasswordSettingsModal
            onClose={() => setPasswordSettingsOpen(false)}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLOUD AUTH MODAL
// ═══════════════════════════════════════════════════════════════
function AuthModal({ onClose, user }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      }
      onClose();
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') errMsg = 'Incorrect password.';
      if (err.code === 'auth/user-not-found') errMsg = 'User not found.';
      if (err.code === 'auth/email-already-in-use') errMsg = 'Email already in use.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/popup-closed-by-user') errMsg = 'Sign-in popup closed before completion.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error("Log out failed:", err);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Cloud size={18} /> Cloud Database Sync</div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        {user ? (
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Connected to cloud database as:
            </p>
            <div style={{
              padding: '12px 16px', background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
              fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)'
            }}>
              {user.displayName || user.email}
            </div>
            <p style={{ fontSize: 13, color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Check size={14} color="var(--success)" /> Your progress, notes, and revisions are being synchronized in real-time.
            </p>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>
              Disconnect / Log Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Sync your DSA sheet data across multiple devices. Register or sign in below.
              </p>

              {error && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
                  color: 'var(--error)', fontSize: 13, lineHeight: 1.4
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                  marginTop: 4,
                  marginBottom: 4
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ minWidth: 18 }}>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', color: 'var(--text-secondary)', fontSize: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }}></div>
                <span style={{ padding: '0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 10 }}>or use email</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }}></div>
              </div>

              <div className="notes-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                />
              </div>

              <div className="notes-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required={!loading}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                />
              </div>

              <div style={{ fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

function App() {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}

export default App;
