import React from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { BookOpen } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import topics from '../data/topics.js';
import patterns from '../data/patterns.js';
import { getTopicIcon } from '../utils/helpers.jsx';
import ProgressRing from '../components/ProgressRing.jsx';

export default function TopicsPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const allQuestions = useAllQuestions();

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} /> DSA Topics
        </h2>
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
