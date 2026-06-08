import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useProgressStore from '../../store/useProgressStore.js';
import topics from '../../data/topics.js';
import patterns from '../../data/patterns.js';

export default function AddCustomQuestionModal({ onClose }) {
  const addCustomQuestion = useProgressStore((s) => s.addCustomQuestion);
  const [form, setForm] = useState({
    title: '',
    url: '',
    videoUrl: '',
    difficulty: 'Easy',
    topic: 'arrays',
    pattern: 'basic-traversal',
    importance: 'Must Do',
    why: '',
    companies: [],
  });

  const handleCompanyChange = (companyName) => {
    setForm(prev => {
      const current = prev.companies;
      const next = current.includes(companyName)
        ? current.filter(c => c !== companyName)
        : [...current, companyName];
      return { ...prev, companies: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    let finalUrl = form.url.trim();
    if (!finalUrl) {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      finalUrl = `https://leetcode.com/problems/${slug}/`;
    }

    addCustomQuestion({
      title: form.title.trim(),
      url: finalUrl,
      videoUrl: form.videoUrl.trim() || undefined,
      difficulty: form.difficulty,
      topic: form.topic,
      pattern: form.pattern,
      importance: form.importance,
      why: form.why.trim() || 'Custom added problem.',
      companies: form.companies,
    });

    onClose();
  };

  const sortedPatterns = useMemo(() => {
    return Object.entries(patterns)
      .map(([id, p]) => ({ id, name: p.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">➕ Add Custom Problem</div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="notes-field">
              <label>Problem Title *</label>
              <input
                type="text"
                placeholder="e.g., Two Sum"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>
            
            <div className="notes-field">
              <label>LeetCode URL (Optional)</label>
              <input
                type="url"
                placeholder="e.g., https://leetcode.com/problems/two-sum/"
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>

            <div className="notes-field">
              <label>YouTube Video URL (Optional)</label>
              <input
                type="url"
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="notes-field">
                <label>Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="notes-field">
                <label>Importance</label>
                <select
                  value={form.importance}
                  onChange={e => setForm({ ...form, importance: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  <option value="Must Do">Must Do</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Good to Know">Good to Know</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="notes-field">
                <label>Topic</label>
                <select
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="notes-field">
                <label>Pattern</label>
                <select
                  value={form.pattern}
                  onChange={e => setForm({ ...form, pattern: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                >
                  {sortedPatterns.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="notes-field">
              <label>Companies</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                {['Google', 'Meta', 'Amazon', 'Microsoft'].map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.companies.includes(c)}
                      onChange={() => handleCompanyChange(c)}
                      style={{ cursor: 'pointer' }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="notes-field">
              <label>Why solve / Key intuition</label>
              <textarea
                placeholder="What makes this problem special?"
                value={form.why}
                onChange={e => setForm({ ...form, why: e.target.value })}
                rows={2}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Problem</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
