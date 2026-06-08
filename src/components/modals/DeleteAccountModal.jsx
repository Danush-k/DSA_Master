import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, RefreshCw, ExternalLink, Check } from 'lucide-react';
import {
  GoogleAuthProvider,
  reauthenticateWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser
} from 'firebase/auth';
import { deleteUserCloudData, clearAllLocalStores } from '../../services/dbSync.js';

export default function DeleteAccountModal({ onClose, user, username, totalSolved }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm_username'); // 'confirm_username', 'reauth', 'deleting', 'success'
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingStatus, setDeletingStatus] = useState('');

  const isGoogleLinked = user?.providerData?.some(p => p.providerId === 'google.com');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() !== username.toLowerCase()) {
      setError('User ID does not match.');
      return;
    }
    setError('');
    setStep('reauth');
  };

  const handleReauthAndPurge = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isGoogleLinked) {
        setDeletingStatus('Re-authenticating with Google...');
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        if (!password) {
          setError('Password is required.');
          setLoading(false);
          return;
        }
        setDeletingStatus('Verifying credentials...');
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      setStep('deleting');
      setDeletingStatus('Purging user progress database records...');
      await deleteUserCloudData(user);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDeletingStatus('Deleting Cloud Auth registration account...');
      await deleteUser(user);
      
      clearAllLocalStores();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('success');
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') {
        errMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'Google authentication popup was closed before completion.';
      } else if (err.code === 'auth/user-mismatch') {
        errMsg = 'Credential mismatch. Please sign in with the correct account first.';
      }
      setError(errMsg);
      setStep('reauth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        onClose();
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)' }}>
            <AlertTriangle size={18} /> Delete Account (Danger Zone)
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}><X size={18} /></button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
              color: 'var(--error)', fontSize: 13, lineHeight: 1.4
            }}>
              <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
            </div>
          )}

          {step === 'confirm_username' && (
            <form onSubmit={handleUsernameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: '12px', background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-lg)',
                fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)'
              }}>
                <span style={{ color: 'var(--error)', fontWeight: 600, display: 'block', marginBottom: 4 }}>This action is permanent and irreversible!</span>
                Deleting your account will purge all of your data from our database:
                <ul style={{ paddingLeft: 20, marginTop: 4, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <li>All study roadmap question solve states ({totalSolved} problems solved)</li>
                  <li>All custom DSA notes, hints, and code templates</li>
                  <li>All revision schedules and tracking progress</li>
                  <li>Active learning streak milestones</li>
                </ul>
              </div>

              <div className="lc-input-group">
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  To confirm, type your User ID: <strong style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-secondary)' }}>{username}</strong>
                </label>
                <input
                  type="text"
                  placeholder="Type User ID here"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="lc-input"
                  style={{ marginTop: 8 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-danger" 
                  disabled={usernameInput.trim().toLowerCase() !== username.toLowerCase()}
                  style={{ flex: 1, background: 'var(--error)', color: 'white' }}
                >
                  Proceed to Verification
                </button>
              </div>
            </form>
          )}

          {step === 'reauth' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                For security verification, you must confirm your identity before we can proceed with deleting your account.
              </div>

              {isGoogleLinked ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                  <button
                    type="button"
                    className="lc-google-btn"
                    onClick={handleReauthAndPurge}
                    disabled={loading}
                    style={{ width: '100%', maxWidth: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {loading ? <RefreshCw className="spin" size={16} /> : <ExternalLink size={16} />} Verify with Google account
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep('confirm_username')} disabled={loading} style={{ width: '100%', maxWidth: 300 }}>
                    Back
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReauthAndPurge} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="lc-input-group">
                    <label>Confirm Account Password</label>
                    <input
                      type="password"
                      placeholder="Enter password to confirm"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="lc-input"
                      required
                      autoFocus
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setStep('confirm_username')} disabled={loading} style={{ flex: 1 }}>Back</button>
                    <button 
                      type="submit" 
                      className="btn btn-danger" 
                      disabled={loading || !password}
                      style={{ flex: 1, background: 'var(--error)', color: 'white' }}
                    >
                      {loading ? 'Verifying...' : 'Permanently Delete Account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {step === 'deleting' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 20 }}>
              <RefreshCw className="spin" size={40} color="var(--error)" />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Processing Account Purge</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{deletingStatus}</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 10px', gap: 16, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--success)', marginBottom: 8
              }}>
                <Check size={28} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Account Deleted</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 360 }}>
                Your account and all associated cloud and local workspace data have been permanently deleted. We are sorry to see you go!
              </p>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
                Redirecting you to the home page...
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                style={{ marginTop: 12, width: '100%', maxWidth: 200 }}
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
