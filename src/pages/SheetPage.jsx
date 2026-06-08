import React, { useState, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ListChecks, Filter } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import topics from '../data/topics.js';
import QuestionTable from '../components/QuestionTable.jsx';
import AddCustomQuestionModal from '../components/modals/AddCustomQuestionModal.jsx';

export default function SheetPage() {
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
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ListChecks size={24} style={{ color: 'var(--accent-primary)' }} /> Complete Problem Sheet
          </h2>
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
          <option value="Must Do">Must Do</option>
          <option value="Recommended">Recommended</option>
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
