import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Bookmark } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import QuestionTable from '../components/QuestionTable.jsx';

export default function BookmarksPage() {
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
