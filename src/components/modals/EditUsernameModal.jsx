import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, X, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseClient.js';
import useProgressStore from '../../store/useProgressStore.js';

export default function EditUsernameModal({ onClose, user, currentUsername, onSuccess }) {
  const [newUsername, setNewUsername] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'saving', 'success'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uId = newUsername.trim();
    if (!uId) return;

    const lowerNew = uId.toLowerCase();
    const lowerOld = currentUsername?.toLowerCase();

    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(uId)) {
      setError('Username can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    if (uId.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (lowerNew === lowerOld) {
      setError('That is already your current username.');
      return;
    }

    setError('');
    setLoading(true);
    setStep('saving');

    try {
      // 1. Check uniqueness in the usernames collection
      const newUsernameDocRef = doc(db, 'usernames', lowerNew);
      const existing = await getDoc(newUsernameDocRef);
      if (existing.exists()) {
        throw new Error('This username is already taken. Please choose another.');
      }

      // 2. Register the new username
      await setDoc(newUsernameDocRef, {
        uid: user.uid
      });

      // 3. Update username in the main users document
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        username: uId,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 4. Delete the old username mapping
      if (lowerOld) {
        const oldUsernameDocRef = doc(db, 'usernames', lowerOld);
        await deleteDoc(oldUsernameDocRef);
      }

      // 5. Update Firebase Auth displayName
      await updateProfile(user, { displayName: uId });

      // 6. Update Zustand store
      useProgressStore.setState((prev) => ({
        profiles: {
          ...prev.profiles,
          'default': {
            ...prev.profiles['default'],
            name: uId
          }
        }
      }));

      setStep('success');
      setTimeout(() => {
        onSuccess(uId);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pencil size={18} /> Edit Username
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 'success' ? (
            <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
              }}>
                <Check size={24} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Username updated!</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your new username is <strong>{newUsername.trim().toLowerCase()}</strong></div>
            </div>
          ) : step === 'saving' ? (
            <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <RefreshCw className="spin" size={32} color="var(--accent-primary)" />
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Updating username...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: '10px 12px', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                fontSize: 13, color: 'var(--text-secondary)'
              }}>
                Current username: <strong style={{ color: 'var(--text-primary)' }}>@{currentUsername}</strong>
              </div>

              {error && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
                  color: 'var(--error)', fontSize: 13
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
                </div>
              )}

              <div className="lc-input-group">
                <label>New Username</label>
                <input
                  type="text"
                  placeholder="e.g. coderdan99"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="lc-input"
                  required
                  autoFocus
                />
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  Lowercase letters, numbers, underscores, hyphens. Min 3 characters.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading || !newUsername.trim()} style={{ flex: 1 }}>
                  Save Username
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
