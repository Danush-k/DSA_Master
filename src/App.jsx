import { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  LayoutDashboard, BookOpen, Target, ListChecks, RotateCcw, Bookmark,
  Search, Moon, Sun, ChevronRight, Check, ExternalLink, StickyNote,
  Menu, X, Filter, Clock, Flame, Calendar, ChevronDown, ChevronUp, BarChart3
} from 'lucide-react';
import questions from './data/questions.js';
import topics from './data/topics.js';
import patterns from './data/patterns.js';
import useProgressStore from './store/useProgressStore.js';
import useNotesStore from './store/useNotesStore.js';
import useRevisionStore from './store/useRevisionStore.js';
import useThemeStore from './store/useThemeStore.js';

// ═══════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // Compute due count directly from a primitive selector to optimize renders and prevent loops
  const dueCount = useRevisionStore((s) => {
    const today = new Date().toISOString().split('T')[0];
    return Object.values(s.revisions || {}).filter(
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
            {questions.length} Problems · Pattern-Based Learning
          </div>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
function Header({ title, onMenuClick }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return questions
      .filter(qu => qu.title.toLowerCase().includes(q) || String(qu.num).includes(q))
      .slice(0, 8);
  }, [searchQuery]);

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
  const existingNote = useNotesStore((s) => s.notes[question.id]);
  const existing = existingNote || {};
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
  const status = useProgressStore((s) => s.questionStatus[q.id] || null);
  const toggleStatus = useProgressStore((s) => s.toggleStatus);
  const bookmarked = useProgressStore((s) => s.bookmarks ? s.bookmarks.includes(q.id) : false);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const noted = useNotesStore((s) => {
    const note = s.notes[q.id];
    return note && Object.entries(note).some(([k, v]) => v && v !== '' && k !== 'updatedAt');
  });
  const scheduleRevision = useRevisionStore((s) => s.scheduleRevision);
  const revision = useRevisionStore((s) => s.revisions[q.id] || null);
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
          </div>
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
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: q.importance === 'Must Do' ? 'var(--error)' : q.importance === 'Recommended' ? 'var(--warning)' : 'var(--text-tertiary)',
          }}>
            {q.importance === 'Must Do' ? '🔥' : q.importance === 'Recommended' ? '⭐' : '·'} {q.importance}
          </span>
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
  const dailySolves = useProgressStore(useShallow((s) => s.dailySolves));

  const { weeks } = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = dailySolves[dateStr] || 0;
      data.push({
        date: dateStr,
        count,
        level: count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4,
      });
    }

    const weeksArr = [];
    let currentWeek = [];
    const startDayOfWeek = new Date(data[0]?.date).getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }
    data.forEach((d) => {
      currentWeek.push(d);
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length) weeksArr.push(currentWeek);
    return { weeks: weeksArr };
  }, [dailySolves]);

  return (
    <div>
      <div className="heatmap-container">
        <div className="heatmap">
          {weeks.map((week, wi) => (
            <div className="heatmap-week" key={wi}>
              {week.map((day, di) => (
                day ? (
                  <div
                    key={di}
                    className="heatmap-cell"
                    data-level={day.level}
                    title={`${day.date}: ${day.count} problems`}
                  />
                ) : (
                  <div key={di} className="heatmap-cell" style={{ opacity: 0 }} />
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className="heatmap-legend-cell" style={{ background: `var(--heatmap-${level})` }} />
        ))}
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
function DashboardPage() {
  const questionStatus = useProgressStore(useShallow((s) => s.questionStatus));
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const revisions = useRevisionStore(useShallow((s) => s.revisions));

  const stats = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    questions.forEach(q => {
      if (questionStatus[q.id] === 'solved') {
        if (q.difficulty === 'Easy') easy++;
        else if (q.difficulty === 'Medium') medium++;
        else hard++;
      }
    });
    return { easy, medium, hard, total: easy + medium + hard };
  }, [questionStatus]);

  const dueRevisionsList = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return Object.entries(revisions)
      .filter(([, rev]) => rev.nextRevisionDate && rev.nextRevisionDate <= today && !rev.completed)
      .map(([id, rev]) => ({ questionId: parseInt(id), ...rev }));
  }, [revisions]);

  const totalQuestions = questions.length;
  const easyTotal = questions.filter(q => q.difficulty === 'Easy').length;
  const mediumTotal = questions.filter(q => q.difficulty === 'Medium').length;
  const hardTotal = questions.filter(q => q.difficulty === 'Hard').length;

  return (
    <div className="page-content animate-fade-in">
      {/* Stats Grid */}
      <div className="dashboard-grid stagger-children">
        <div className="card stat-card">
          <div className="stat-card-label">Total Solved</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-primary)' }}>{stats.total}</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${(stats.total / totalQuestions) * 100}%` }} />
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
                const q = questions.find(qu => qu.id === rev.questionId);
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
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Calendar className="section-title-icon" /> Activity Heatmap
          </div>
        </div>
        <div className="card">
          <Heatmap />
        </div>
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
              const topicQs = questions.filter(q => q.topic === topic.id);
              const solved = topicQs.filter(q => questionStatus[q.id] === 'solved').length;
              const pct = topicQs.length ? Math.round((solved / topicQs.length) * 100) : 0;
              return (
                <Link to={`/topics/${topic.id}`} key={topic.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{topic.icon}</span>
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
  const questionStatus = useProgressStore(useShallow((s) => s.questionStatus));

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
          const topicQs = questions.filter(q => q.topic === topic.id);
          const solved = topicQs.filter(q => questionStatus[q.id] === 'solved').length;
          const pct = topicQs.length ? Math.round((solved / topicQs.length) * 100) : 0;
          const uniquePatterns = [...new Set(topicQs.map(q => q.pattern))];

          return (
            <Link to={`/topics/${topic.id}`} key={topic.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-interactive topic-card">
                <div className="topic-card-header">
                  <div className="topic-card-icon" style={{ background: `${topic.color}20`, color: topic.color }}>
                    {topic.icon}
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
  const questionStatus = useProgressStore(useShallow((s) => s.questionStatus));
  const topic = topics.find(t => t.id === topicId);
  const topicQs = useMemo(() => questions.filter(q => q.topic === topicId), [topicId]);
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>
            {topic.icon}
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
                <span>{pat?.icon || '📌'}</span>
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
  const questionStatus = useProgressStore(useShallow((s) => s.questionStatus));

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
      if (filterTopic !== 'all' && q.topic !== filterTopic) return false;
      if (filterImportance !== 'all' && q.importance !== filterImportance) return false;
      if (filterStatus === 'solved' && questionStatus[q.id] !== 'solved') return false;
      if (filterStatus === 'unsolved' && questionStatus[q.id] === 'solved') return false;
      return true;
    });
  }, [filterDifficulty, filterStatus, filterTopic, filterImportance, questionStatus]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📋 Complete Problem Sheet</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {questions.length} curated problems · Sorted by topic and pattern · Click any problem to open on LeetCode
        </p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
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
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
          Showing {filtered.length} of {questions.length}
        </span>
      </div>

      <QuestionTable questionList={filtered} showTopic={true} showPattern={true} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PATTERNS LIST PAGE
// ═══════════════════════════════════════════════════════════════
function PatternsListPage() {
  const questionStatus = useProgressStore(useShallow((s) => s.questionStatus));
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
          const patQs = questions.filter(q => q.pattern === pid);
          const solved = patQs.filter(q => questionStatus[q.id] === 'solved').length;
          const pct = patQs.length ? Math.round((solved / patQs.length) * 100) : 0;

          return (
            <Link to={`/patterns/${pid}`} key={pid} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-interactive topic-card">
                <div className="topic-card-header">
                  <div className="topic-card-icon" style={{
                    background: 'var(--accent-glow)', color: 'var(--accent-primary)', fontSize: 20,
                  }}>
                    {pat.icon}
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
  const patQs = useMemo(() => questions.filter(q => q.pattern === patternId), [patternId]);
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
          <div style={{ fontSize: 36, marginBottom: 8 }}>{pat.icon}</div>
          <h2 className="pattern-hero-title">{pat.name}</h2>
          <p className="pattern-hero-description">{pat.description}</p>

          {pat.timeComplexity && (
            <div className="pattern-meta">
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Time Complexity</span>
                <span className="pattern-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{pat.timeComplexity}</span>
              </div>
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Space Complexity</span>
                <span className="pattern-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{pat.spaceComplexity}</span>
              </div>
              <div className="pattern-meta-item">
                <span className="pattern-meta-label">Problems</span>
                <span className="pattern-meta-value">{patQs.length} questions</span>
              </div>
            </div>
          )}
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
  const revisions = useRevisionStore(useShallow((s) => s.revisions));
  const completeRevision = useRevisionStore((s) => s.completeRevision);

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
              const q = questions.find(qu => qu.id === rev.questionId);
              if (!q) return null;
              return (
                <div className="card revision-card" key={rev.questionId}>
                  <div className="revision-card-header">
                    <div>
                      <div className="revision-card-title">
                        <a href={q.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                          {q.num}. {q.title} <ExternalLink size={12} style={{ opacity: 0.4 }} />
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
                  const q = questions.find(qu => qu.id === rev.questionId);
                  if (!q) return null;
                  return (
                    <tr key={rev.questionId}>
                      <td><span className="question-number">{q.num}</span></td>
                      <td>
                        <a href={q.url} target="_blank" rel="noopener noreferrer" className="question-title-link">
                          {q.title}
                        </a>
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
  const bookmarks = useProgressStore(useShallow((s) => s.bookmarks));
  const bookmarkedQuestions = useMemo(() => {
    const bArr = bookmarks instanceof Set ? Array.from(bookmarks) : (Array.isArray(bookmarks) ? bookmarks : []);
    return questions.filter(q => bArr.includes(q.id));
  }, [bookmarks]);

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
// APP LAYOUT + ROUTING
// ═══════════════════════════════════════════════════════════════
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
        <Header title={getPageTitle()} onMenuClick={() => setSidebarOpen(true)} />
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
