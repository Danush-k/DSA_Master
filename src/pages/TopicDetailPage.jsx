import { useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useProgressStore from '../store/useProgressStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import topics from '../data/topics.js';
import patterns from '../data/patterns.js';
import { getTopicIcon, getPatternIcon } from '../utils/helpers.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import QuestionTable from '../components/QuestionTable.jsx';

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const location = useLocation();
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const topic = topics.find(t => t.id === topicId);
  const allQuestions = useAllQuestions();
  const topicQs = useMemo(() => allQuestions.filter(q => q.topic === topicId), [allQuestions, topicId]);
  const solved = topicQs.filter(q => questionStatus[q.id] === 'solved').length;

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-row');
          setTimeout(() => {
            element.classList.remove('highlight-row');
          }, 2000);
        }
      }, 100);
    }
  }, [location]);

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
