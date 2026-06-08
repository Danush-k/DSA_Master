import React, { useState, useMemo } from 'react';
import { ListChecks } from 'lucide-react';
import QuestionRow from './QuestionRow.jsx';

export default function QuestionTable({ questionList, showTopic = false, showPattern = true }) {
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
