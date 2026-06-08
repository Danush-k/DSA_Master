import { useState } from 'react';
import { createPortal } from 'react-dom';
import { StickyNote, X, Sparkles, Target, Clock, Layers, AlertTriangle, Info } from 'lucide-react';
import useNotesStore from '../../store/useNotesStore.js';

export default function NotesModal({ question, onClose }) {
  const saveNote = useNotesStore((s) => s.saveNote);
  const existingNote = useNotesStore((s) => s.profiles[s.activeProfileId]?.[question.id]);
  const existing = existingNote || {};
  const [form, setForm] = useState({
    keyIdea: existing.keyIdea || '',
    mistakes: existing.mistakes || '',
    optimalApproach: existing.optimalApproach || '',
    timeComplexity: existing.timeComplexity || '',
    spaceComplexity: existing.spaceComplexity || '',
    notes: existing.notes || '',
    interviewLearnings: existing.interviewLearnings || '',
  });

  const handleSave = () => {
    saveNote(question.id, form);
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StickyNote size={18} style={{ color: 'var(--accent-primary)' }} />
              Notes
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {question.num}. {question.title}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="notes-form">
            {[
              { key: 'keyIdea', label: 'Key Idea', icon: Sparkles, placeholder: 'What is the core insight?' },
              { key: 'optimalApproach', label: 'Optimal Approach', icon: Target, placeholder: 'Describe the best approach step by step' },
              { key: 'timeComplexity', label: 'Time Complexity', icon: Clock, placeholder: 'e.g., O(n log n)' },
              { key: 'spaceComplexity', label: 'Space Complexity', icon: Layers, placeholder: 'e.g., O(n)' },
              { key: 'mistakes', label: 'Mistakes Made', icon: AlertTriangle, placeholder: 'Common pitfalls and errors to avoid' },
              { key: 'interviewLearnings', label: 'Interview Learnings', icon: Info, placeholder: 'What would you say in an interview?' },
              { key: 'notes', label: 'Additional Notes', icon: StickyNote, placeholder: 'Any other notes...' },
            ].map(({ key, label, icon: IconComponent, placeholder }) => (
              <div className="notes-field" key={key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconComponent size={14} style={{ color: 'var(--text-secondary)' }} />
                  {label}
                </label>
                <textarea
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  rows={key === 'timeComplexity' || key === 'spaceComplexity' ? 1 : 3}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Notes</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
