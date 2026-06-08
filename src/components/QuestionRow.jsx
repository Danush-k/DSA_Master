import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, StickyNote, Star } from 'lucide-react';
import { getProblemVideoUrl, Youtube } from '../utils/helpers.jsx';
import NotesModal from './modals/NotesModal.jsx';
import useProgressStore from '../store/useProgressStore.js';
import useNotesStore from '../store/useNotesStore.js';
import useRevisionStore from '../store/useRevisionStore.js';
import topics from '../data/topics.js';
import patterns from '../data/patterns.js';

export default function QuestionRow({ q, showTopic = false, showPattern = true }) {
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
  const removeRevision = useRevisionStore((s) => s.removeRevision);
  const [notesOpen, setNotesOpen] = useState(false);

  const handleSolve = () => {
    if (status !== 'solved') {
      toggleStatus(q.id, 'solved');
      scheduleRevision(q.id);
    } else {
      toggleStatus(q.id, 'solved');
      removeRevision(q.id);
    }
  };

  return (
    <>
      <tr id={`question-${q.id}`}>
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
          <span className="question-importance">{q.importance || 'Good to Know'}</span>
        </td>
        <td>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}>
            <button
              className={`action-btn tooltip ${noted ? 'active' : ''}`}
              data-tip={noted ? "Edit Notes" : "Add Notes"}
              onClick={() => setNotesOpen(true)}
            >
              <StickyNote size={14} />
            </button>
            <button
              className={`action-btn tooltip ${bookmarked ? 'active' : ''}`}
              data-tip={bookmarked ? "Remove Bookmark" : "Bookmark Question"}
              onClick={() => toggleBookmark(q.id)}
            >
              <Star size={14} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          {notesOpen && <NotesModal question={q} onClose={() => setNotesOpen(false)} />}
        </td>
      </tr>
    </>
  );
}
