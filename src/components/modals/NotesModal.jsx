import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  StickyNote,
  X,
  Sparkles,
  Target,
  Clock,
  Layers,
  AlertTriangle,
  Info,
  Heading,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Eye
} from 'lucide-react';
import useNotesStore from '../../store/useNotesStore.js';
import { renderMarkdown } from '../../utils/markdown.js';

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

  const [activeTab, setActiveTab] = useState('notes'); // Default tab is Additional Notes
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);

  const handleSave = () => {
    saveNote(question.id, form);
    onClose();
  };

  const insertMarkdown = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'heading':
        replacement = `### ${selectedText || 'Heading'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Blockquote'}`;
        break;
      case 'code':
        replacement = `\`\`\`javascript\n${selectedText || '// code here'}\n\`\`\``;
        break;
      case 'ul':
        replacement = `\n- ${selectedText || 'List item'}`;
        break;
      case 'ol':
        replacement = `\n1. ${selectedText || 'List item'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || 'image alt'}](https://example.com/image.png)`;
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setForm((prev) => ({
      ...prev,
      [activeTab]: newText,
    }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length - cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StickyNote size={18} style={{ color: 'var(--accent-primary)' }} />
              Notes Editor
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {question.num}. {question.title}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal"><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="notes-form">
            {/* Complexity inputs at the top */}
            <div className="complexity-row">
              <div className="notes-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                  Time Complexity
                </label>
                <input
                  type="text"
                  value={form.timeComplexity}
                  onChange={(e) => setForm({ ...form, timeComplexity: e.target.value })}
                  placeholder="e.g. O(n log n)"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: 14,
                  }}
                />
              </div>

              <div className="notes-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={14} style={{ color: 'var(--text-secondary)' }} />
                  Space Complexity
                </label>
                <input
                  type="text"
                  value={form.spaceComplexity}
                  onChange={(e) => setForm({ ...form, spaceComplexity: e.target.value })}
                  placeholder="e.g. O(n)"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: 14,
                  }}
                />
              </div>
            </div>

            {/* Note Fields Tabs */}
            <div className="notes-tabs">
              {[
                { id: 'notes', label: 'Notes', icon: StickyNote },
                { id: 'keyIdea', label: 'Key Idea', icon: Sparkles },
                { id: 'optimalApproach', label: 'Optimal Approach', icon: Target },
                { id: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
                { id: 'interviewLearnings', label: 'Learnings', icon: Info },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`notes-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsPreview(false);
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon size={13} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Markdown editor area */}
            <div className="markdown-editor-wrapper">
              <div className="markdown-toolbar">
                <div className="markdown-toolbar-group">
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('heading')}
                    title="Heading"
                  >
                    <Heading size={14} />
                  </button>
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('bold')}
                    title="Bold"
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('italic')}
                    title="Italic"
                  >
                    <Italic size={14} />
                  </button>
                  <div style={{ width: 1, height: 16, background: 'var(--border-primary)', margin: '0 4px' }} />
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('ul')}
                    title="Unordered List"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('ol')}
                    title="Ordered List"
                  >
                    <ListOrdered size={14} />
                  </button>
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('quote')}
                    title="Blockquote"
                  >
                    <Quote size={14} />
                  </button>
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('code')}
                    title="Code Block"
                  >
                    <Code size={14} />
                  </button>
                  <div style={{ width: 1, height: 16, background: 'var(--border-primary)', margin: '0 4px' }} />
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('link')}
                    title="Link"
                  >
                    <Link size={14} />
                  </button>
                  <button
                    type="button"
                    className="markdown-toolbar-btn"
                    onClick={() => insertMarkdown('image')}
                    title="Image"
                  >
                    <Image size={14} />
                  </button>
                </div>
                <div className="markdown-toolbar-group">
                  <button
                    type="button"
                    className={`markdown-toolbar-btn ${isPreview ? 'active' : ''}`}
                    onClick={() => setIsPreview(!isPreview)}
                    title={isPreview ? "Show Editor" : "Show Preview"}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>

              {isPreview ? (
                <div
                  className="markdown-editor-preview"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(form[activeTab]) || '<p style="color: var(--text-tertiary); font-style: italic;">Nothing to preview yet...</p>' }}
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={form[activeTab]}
                  onChange={(e) => setForm({ ...form, [activeTab]: e.target.value })}
                  placeholder={`Type here...(Markdown is enabled for ${activeTab})`}
                  className="markdown-editor-textarea"
                  rows={10}
                />
              )}
            </div>
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

