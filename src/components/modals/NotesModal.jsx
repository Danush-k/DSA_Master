import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { StickyNote, X, Sparkles, Target, Clock, Layers, AlertTriangle, Info, Image, Upload } from 'lucide-react';
import useNotesStore from '../../store/useNotesStore.js';
import { storage, auth } from '../../firebaseClient.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const allImageUrls = useMemo(() => {
    const urls = [];
    Object.values(form).forEach((val) => {
      if (typeof val === 'string') {
        const regex = /!\[.*?\]\((https?:\/\/.*?)\)/g;
        let match;
        while ((match = regex.exec(val)) !== null) {
          if (match[1] && !urls.includes(match[1])) {
            urls.push(match[1]);
          }
        }
      }
    });
    return urls;
  }, [form]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      setUploadError('Storage configuration is missing.');
      return;
    }
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setUploadError('You must be logged in to upload images.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `user_notes/${currentUser.uid}/${question.id}/${timestamp}_${safeFileName}`;
      const imageRef = ref(storage, filePath);

      // Set a 10-second timeout so the app does not hang indefinitely if Storage is disabled/unconfigured
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Upload timed out. Please check if Firebase Storage is enabled in the Firebase Console and your Storage Rules allow writes.')), 10000)
      );

      await Promise.race([
        uploadBytes(imageRef, file),
        timeoutPromise
      ]);

      const downloadUrl = await getDownloadURL(imageRef);

      const markdownLink = `\n![${file.name}](${downloadUrl})\n`;
      setForm((prev) => ({
        ...prev,
        notes: prev.notes + markdownLink,
      }));
    } catch (err) {
      console.error('Failed to upload image:', err);
      setUploadError(err.message.includes('timed out') ? err.message : 'Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

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

            {/* Image Upload field */}
            <div className="notes-field" style={{ marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Image size={14} style={{ color: 'var(--text-secondary)' }} />
                Attach Diagram or Image
              </label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0, padding: '6px 12px', fontSize: 13 }}>
                  <Upload size={14} />
                  {uploading ? 'Uploading Image...' : 'Choose Image File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
                {uploadError && <span style={{ fontSize: 12, color: 'var(--error)' }}>{uploadError}</span>}
              </div>
            </div>

            {/* Image Gallery */}
            {allImageUrls.length > 0 && (
              <div className="notes-field" style={{ marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Uploaded Note Attachments ({allImageUrls.length})
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: 10,
                  marginTop: 6,
                  padding: 10,
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-secondary)'
                }}>
                  {allImageUrls.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img 
                          src={url} 
                          alt={`Attachment ${i + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
