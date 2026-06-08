import { useState, useEffect } from 'react';
import { Mail, AlertTriangle, Check } from 'lucide-react';
import { auth } from '../firebaseClient.js';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { clearAllLocalStores } from '../services/dbSync.js';

export default function VerifyEmailPage({ user, onLogout }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Send verification email
  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage('A verification email has been sent to ' + auth.currentUser.email);
        setCooldown(60);
      } else {
        setError('No active session found. Please sign in again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check verification status (refresh user token/profile)
  const handleRefresh = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        window.location.reload();
      } else {
        setError('No active session found. Please sign in again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    try {
      await signOut(auth);
      clearAllLocalStores();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <div className="lc-login-container">
      <div className="lc-login-card" style={{ textAlign: 'center' }}>
        <div className="lc-login-header">
          <div className="lc-logo-circle" style={{ border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={32} color="var(--accent-primary)" />
          </div>
          <h2 className="lc-login-title">Verify Your Email</h2>
        </div>
        
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          We sent a verification link to <strong>{user?.email}</strong>. Please check your inbox (and spam folder) and verify your account.
        </p>

        {error && (
          <div style={{
            padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--error)', fontSize: 13, lineHeight: 1.4, textAlign: 'center'
          }}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '10px 12px', background: 'rgba(0, 184, 163, 0.1)',
            border: '1px solid rgba(0, 184, 163, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--success)', fontSize: 13, lineHeight: 1.4, textAlign: 'center'
          }}>
            <Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} color="var(--success)" /> {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          <button className="lc-submit-btn" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Checking...' : 'I have verified my email'}
          </button>
          
          <button 
            className="lc-google-btn" 
            onClick={handleResend} 
            disabled={loading || cooldown > 0}
            style={{ border: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)' }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </button>
          
          <button 
            className="lc-google-btn" 
            onClick={handleLogout}
            style={{ border: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)' }}
          >
            Sign Out / Different Account
          </button>
        </div>
      </div>
    </div>
  );
}
