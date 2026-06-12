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
  Eye,
  Maximize2,
  Minimize2
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
  const [isMaximized, setIsMaximized] = useState(false);
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
      <div className={`modal ${isMaximized ? 'maximized' : ''}`} onClick={(e) => e.stopPropagation()} style={isMaximized ? {} : { maxWidth: '720px' }}>
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
            {/* Note Fields Tabs & Complexity Inline */}
            <div className="notes-tabs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: '4px', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
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
                      style={{ paddingBottom: '6px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon size={13} />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Inline Complexity Fields */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', paddingBottom: '4px' }}>
                {/* Time Capsule */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '100px',
                  padding: '4px 12px',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                }}
                >
                  <Clock size={12} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Time:</span>
                  <input
                    type="text"
                    value={form.timeComplexity}
                    onChange={(e) => setForm({ ...form, timeComplexity: e.target.value })}
                    placeholder="e.g. O(n)"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      padding: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      width: '80px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Space Capsule */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '100px',
                  padding: '4px 12px',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                }}
                >
                  <Layers size={12} style={{ color: 'var(--accent-secondary)' }} />
                  <span style={{ fontSize: 11, color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Space:</span>
                  <input
                    type="text"
                    value={form.spaceComplexity}
                    onChange={(e) => setForm({ ...form, spaceComplexity: e.target.value })}
                    placeholder="e.g. O(1)"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      padding: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      width: '80px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
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
                  <button
                    type="button"
                    className={`markdown-toolbar-btn ${isMaximized ? 'active' : ''}`}
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
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

