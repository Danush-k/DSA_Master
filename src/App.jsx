import { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  LayoutDashboard, BookOpen, Target, ListChecks, RotateCcw, Bookmark,
  Search, Moon, Sun, ChevronRight, Check, ExternalLink, StickyNote,
  Menu, X, Filter, Clock, Flame, Calendar, ChevronDown, ChevronUp, BarChart3, Info,
  ArrowUpDown, Binary, ChevronsLeftRight, Columns, GitBranch, Grid, Hash, Layers,
  Link as LinkIcon, Network, Sparkles, Star, TrendingUp, Type, Zap
} from 'lucide-react';

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
    { path: '/topics', label: 'Topics', icon: BookOpen },
    { path: '/sheet', label: 'Problem Sheet', icon: ListChecks },
    { path: '/patterns', label: 'Patterns', icon: Target },
    { path: '/revision', label: 'Revision', icon: RotateCcw, badge: dueCount || null },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
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
function Header({ title, onMenuClick, onManageProfiles }) {
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
          <button className="profile-btn" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} title="Switch profile">
            <span style={{ fontSize: 18 }}>{activeProfile?.avatar || '⚡'}</span>
            <span className="profile-btn-name">{activeProfile?.name || 'Default'}</span>
            <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">Profiles</div>
              {Object.entries(profiles).map(([id, p]) => (
                <button
                  key={id}
                  className={`profile-dropdown-item ${id === activeProfileId ? 'active' : ''}`}
                  onClick={() => {
                    switchProfile(id);
                    setProfileDropdownOpen(false);
                  }}
                >
                  <span style={{ fontSize: 16 }}>{p.avatar}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{p.name}</span>
                  {id === activeProfileId && <Check size={14} className="active-check" />}
                </button>
              ))}
              <div className="profile-dropdown-divider" />
              <button
                className="profile-dropdown-item"
                onClick={() => {
                  onManageProfiles();
                  setProfileDropdownOpen(false);
                }}
              >
                ⚙️ Manage Profiles
              </button>
            </div>
          )}
        </div>

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
            <div className="modal-title">📝 Notes</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {question.num}. {question.title}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="notes-form">
            {[
              { key: 'keyIdea', label: '💡 Key Idea', placeholder: 'What is the core insight?' },
              { key: 'optimalApproach', label: '🎯 Optimal Approach', placeholder: 'Describe the best approach step by step' },
              { key: 'timeComplexity', label: '⏱️ Time Complexity', placeholder: 'e.g., O(n log n)' },
              { key: 'spaceComplexity', label: '💾 Space Complexity', placeholder: 'e.g., O(n)' },
              { key: 'mistakes', label: '⚠️ Mistakes Made', placeholder: 'Common pitfalls and errors to avoid' },
              { key: 'interviewLearnings', label: '🎤 Interview Learnings', placeholder: 'What would you say in an interview?' },
              { key: 'notes', label: '📋 Additional Notes', placeholder: 'Any other notes...' },
            ].map(({ key, label, placeholder }) => (
              <div className="notes-field" key={key}>
                <label>{label}</label>
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
              <span className="streak-fire">🔥</span>
              <span className="streak-value">{currentStreak}</span>
              <span className="streak-label">Current Streak</span>
            </div>
            <div className="streak-item">
              <span className="streak-fire">⚡</span>
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
              ✅ No revisions due today. Great job!
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
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📚 DSA Topics</h2>
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
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📋 Complete Problem Sheet</h2>
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
          <option value="Must Do">🔥 Must Do</option>
          <option value="Recommended">⭐ Recommended</option>
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
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🎯 DSA Patterns</h2>
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
                <div className="pattern-section-title">✅ When to Use</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {pat.whenToUse}
                </p>
                <div className="pattern-section-title">❌ When NOT to Use</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {pat.whenNotToUse}
                </p>
                {pat.interviewTips && (
                  <>
                    <div className="pattern-section-title">💡 Interview Tips</div>
                    <p style={{ fontSize: 14, color: 'var(--accent-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      {pat.interviewTips}
                    </p>
                  </>
                )}
              </div>

              {/* Common Mistakes */}
              {pat.commonMistakes && (
                <div className="card pattern-section" style={{ gridColumn: 'span 2' }}>
                  <div className="pattern-section-title">⚠️ Common Mistakes</div>
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
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
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
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');

  const avatarOptions = ['🦊', '🐼', '🦁', '🐯', '🐸', '🐙', '🐵', '⚡', '🚀', '💻', '⭐', '🔥'];

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
          
          alert('🎉 Backup imported successfully!');
        } else {
          alert('❌ Invalid backup file format.');
        }
      } catch (err) {
        alert('❌ Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">👤 Profile Management</div>
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
                      <span style={{ fontSize: 20 }}>{p.avatar}</span>
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
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {avatarOptions.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(emoji)}
                    style={{
                      fontSize: 20, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: selectedAvatar === emoji ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                      border: selectedAvatar === emoji ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    }}
                  >
                    {emoji}
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
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleExportBackup}>
                📥 Export Backup
              </button>
              <label className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                📤 Import Backup
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
                  <option value="Must Do">🔥 Must Do</option>
                  <option value="Recommended">⭐ Recommended</option>
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

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const switchNotesProfile = useNotesStore((s) => s.switchProfile);
  const switchRevisionProfile = useRevisionStore((s) => s.switchProfile);

  // Keep notes and revisions store profiles in sync with the active progress profile
  useEffect(() => {
    switchNotesProfile(activeProfileId);
    switchRevisionProfile(activeProfileId);
  }, [activeProfileId, switchNotesProfile, switchRevisionProfile]);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
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
    return 'DSA Mastery';
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          onManageProfiles={() => setManagerOpen(true)}
        />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/sheet" element={<SheetPage />} />
          <Route path="/patterns" element={<PatternsListPage />} />
          <Route path="/patterns/:patternId" element={<PatternDetailPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </div>
      {managerOpen && <ProfileManagerModal onClose={() => setManagerOpen(false)} />}
    </div>
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
