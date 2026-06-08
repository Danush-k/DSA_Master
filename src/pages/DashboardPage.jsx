import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { Flame, Trophy, RotateCcw, Check, BarChart3 } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import useRevisionStore from '../store/useRevisionStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import Heatmap from '../components/Heatmap.jsx';
import topics from '../data/topics.js';
import { formatLocalDate, getTopicIcon } from '../utils/helpers.jsx';

export default function DashboardPage() {
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
    const today = formatLocalDate();
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
