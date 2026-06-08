import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Cloud, X, Check, AlertTriangle } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from '../../firebaseClient.js';

export default function AuthModal({ onClose, user }) {
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password.trim()) return;
        await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
        onClose();
      } else if (mode === 'signin') {
        if (!email.trim() || !password.trim()) return;
        await signInWithEmailAndPassword(auth, email.trim(), password.trim());
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) return;
        await sendPasswordResetEmail(auth, email.trim());
        alert("Success! Password reset email has been sent.");
        setMode('signin');
      }
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') errMsg = 'Incorrect password.';
      if (err.code === 'auth/user-not-found') errMsg = 'User not found.';
      if (err.code === 'auth/email-already-in-use') errMsg = 'Email already in use.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/popup-closed-by-user') errMsg = 'Sign-in popup closed before completion.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error("Log out failed:", err);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Cloud size={18} /> Cloud Database Sync</div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        {user ? (
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Connected to cloud database as:
            </p>
            <div style={{
              padding: '12px 16px', background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
              fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)'
            }}>
              {user.displayName || user.email}
            </div>
            <p style={{ fontSize: 13, color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Check size={14} color="var(--success)" /> Your progress, notes, and revisions are being synchronized in real-time.
            </p>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>
              Disconnect / Log Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {mode === 'forgot'
                  ? 'Enter your email address below and we will send you a password recovery link.'
                  : 'Sync your DSA sheet data across multiple devices. Register or sign in below.'}
              </p>

              {error && (
                <div style={{
                  padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
                  color: 'var(--error)', fontSize: 13, lineHeight: 1.4
                }}>
                  <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
                </div>
              )}

              {mode !== 'forgot' && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s, border-color 0.2s',
                      marginTop: 4,
                      marginBottom: 4
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.borderColor = 'var(--border-primary)';
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" style={{ minWidth: 18 }}>
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', color: 'var(--text-secondary)', fontSize: 12 }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }}></div>
                    <span style={{ padding: '0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 10 }}>or use email</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }}></div>
                  </div>
                </>
              )}

              <div className="notes-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}
                />
              </div>

              {mode !== 'forgot' && (
                <div className="notes-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: 11, cursor: 'pointer', padding: 0 }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required={!loading}
                    style={{
                      width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)', fontSize: 14,
                    }}
                  />
                </div>
              )}

              {mode !== 'forgot' ? (
                <div style={{ fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Recovery Email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
