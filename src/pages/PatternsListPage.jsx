
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { Target } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import patterns from '../data/patterns.js';
import { getPatternIcon } from '../utils/helpers.jsx';
import ProgressRing from '../components/ProgressRing.jsx';

export default function PatternsListPage() {
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
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={24} style={{ color: 'var(--accent-primary)' }} /> DSA Patterns
        </h2>
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
