import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Clock, Calendar, Sparkles, ExternalLink, Check } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import useRevisionStore from '../store/useRevisionStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import patterns from '../data/patterns.js';
import { formatLocalDate, getProblemVideoUrl, Youtube } from '../utils/helpers.jsx';

export default function RevisionPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const revisions = useRevisionStore(useShallow((s) => s.profiles[activeProfileId] || {}));
  const completeRevision = useRevisionStore((s) => s.completeRevision);

  const allQuestions = useAllQuestions();

  const { dueRevisions, upcomingRevisions } = useMemo(() => {
    const today = formatLocalDate();
    const due = [];
    const upcoming = [];
    Object.entries(revisions).forEach(([id, rev]) => {
      if (questionStatus[id] !== 'solved') return;
      if (rev.completed) return;
      if (!rev.nextRevisionDate) return;
      const item = { questionId: parseInt(id), ...rev };
      if (rev.nextRevisionDate <= today) due.push(item);
      else upcoming.push(item);
    });
    upcoming.sort((a, b) => a.nextRevisionDate.localeCompare(b.nextRevisionDate));
    return { dueRevisions: due, upcomingRevisions: upcoming };
  }, [revisions, questionStatus]);

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
