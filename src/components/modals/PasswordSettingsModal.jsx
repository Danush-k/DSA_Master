import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Key, X, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseClient.js';

export default function PasswordSettingsModal({ onClose, user }) {
  // Determine if user has email/password provider
  const hasEmailProvider = user?.providerData?.some(p => p.providerId === 'password');
  const isGoogleOnly = !hasEmailProvider;

  const [step, setStep] = useState('form'); // 'form', 'processing', 'success'
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      if (isGoogleOnly) {
        // Link email/password credential to the Google account
        const credential = EmailAuthProvider.credential(user.email, newPassword);
        await linkWithCredential(user, credential);

        // CRITICAL: Ensure the username is registered
        const username = user.displayName;
        if (username) {
          const usernameLower = username.toLowerCase();
          const usernameDocRef = doc(db, 'usernames', usernameLower);
          const usernameDoc = await getDoc(usernameDocRef);
          if (!usernameDoc.exists()) {
            await setDoc(usernameDocRef, { uid: user.uid });
          }

          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: user.uid,
              username: username,
              email: user.email || '',
              name: username,
              avatar: '🦊',
              currentStreak: 0,
              longestStreak: 0,
              lastSolveDate: null,
              dailySolves: {},
              solveHistory: [],
              updatedAt: new Date().toISOString()
            });
          } else {
            await setDoc(userDocRef, { email: user.email || '' }, { merge: true });
          }
        }
      } else {
        // Re-authenticate then change password
        if (!currentPassword) {
          setError('Please enter your current password.');
          setStep('form');
          setLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      setStep('success');
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') errMsg = 'Incorrect current password.';
      if (err.code === 'auth/too-many-requests') errMsg = 'Too many failed attempts. Please try again later.';
      if (err.code === 'auth/provider-already-linked') errMsg = 'A password is already set on this account. Please sign in with password to change it.';
      if (err.code === 'auth/requires-recent-login') errMsg = 'Session expired. Please sign out and sign back in to change your password.';
      if (err.code === 'auth/weak-password') errMsg = 'Password must be at least 6 characters.';
      setError(errMsg);
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
            <Key size={18} /> {isGoogleOnly ? 'Set Password' : 'Change Password'}
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
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {isGoogleOnly ? 'Password set successfully!' : 'Password changed!'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {isGoogleOnly
                  ? 'You can now sign in with your username and password in addition to Google.'
                  : 'Your password has been updated.'}
              </div>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 8, padding: '8px 24px' }}>Done</button>
            </div>
          ) : step === 'processing' ? (
            <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <RefreshCw className="spin" size={32} color="var(--accent-primary)" />
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {isGoogleOnly ? 'Setting up password login...' : 'Updating password...'}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isGoogleOnly && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(255, 161, 22, 0.07)',
                  border: '1px solid rgba(255, 161, 22, 0.2)', borderRadius: 'var(--radius-md)',
                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5
                }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>Enable password login</strong><br />
                  Set a password so you can also sign in with your <strong>username + password</strong> (not just Google).
                </div>
              )}

              {error && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
                  color: 'var(--error)', fontSize: 13
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
                </div>
              )}

              {!isGoogleOnly && (
                <div className="lc-input-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="lc-input"
                    required
                    autoFocus
                  />
                </div>
              )}

              <div className="lc-input-group">
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{isGoogleOnly ? 'Password' : 'New Password'}</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="lc-input"
                  required
                  autoFocus={isGoogleOnly}
                />
              </div>

              <div className="lc-input-group">
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Confirm {isGoogleOnly ? 'Password' : 'New Password'}</label>
                <input
                  type="password"
                  placeholder="Repeat the password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="lc-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !newPassword || !confirmPassword}
                  style={{ flex: 1 }}
                >
                  {isGoogleOnly ? 'Set Password' : 'Change Password'}
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
