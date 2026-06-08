import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { auth, db } from '../firebaseClient.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import useProgressStore from '../store/useProgressStore.js';
import { DsaMasteryLogo } from '../utils/helpers.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // New state variables for User ID mapping
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [needsUserId, setNeedsUserId] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [userIdForSignup, setUserIdForSignup] = useState('');
  const [emailForSignup, setEmailForSignup] = useState('');

  const checkUserMapping = useCallback(async (currentUser) => {
    if (!currentUser) return;
    setCheckingUserId(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userDoc = userDocSnap.data();
        const mappedUsername = userDoc.username;
        
        if (currentUser.displayName !== mappedUsername) {
          await updateProfile(currentUser, { displayName: mappedUsername });
        }
        
        const progressStore = useProgressStore.getState();
        if (progressStore.profiles['default'] && progressStore.profiles['default'].name !== mappedUsername) {
          useProgressStore.setState((prev) => ({
            profiles: {
              ...prev.profiles,
              'default': {
                ...prev.profiles['default'],
                name: mappedUsername
              }
            }
          }));
        }

        const isEmailVerified = currentUser.emailVerified || 
          currentUser.email?.endsWith('@dsamastery.local') || 
          currentUser.providerData.some(p => p.providerId === 'google.com');
        if (isEmailVerified) {
          navigate('/');
        } else {
          navigate('/verify-email');
        }
      } else {
        // Migration for legacy user with local dsamastery.local emails
        if (currentUser.email && currentUser.email.endsWith('@dsamastery.local')) {
          const legacyUsername = currentUser.email.split('@')[0];
          const lowerUsername = legacyUsername.toLowerCase();
          
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            username: legacyUsername,
            email: currentUser.email,
            name: legacyUsername,
            avatar: '🦊',
            currentStreak: 0,
            longestStreak: 0,
            lastSolveDate: null,
            dailySolves: {},
            solveHistory: [],
            updatedAt: new Date().toISOString()
          });
          
          await setDoc(doc(db, 'usernames', lowerUsername), {
            uid: currentUser.uid
          });
          
          await updateProfile(currentUser, { displayName: legacyUsername });
          navigate('/');
          return;
        }
        
        setNeedsUserId(true);
      }
    } catch (err) {
      console.error(err);
      setError('Error resolving user mapping: ' + err.message);
    } finally {
      setCheckingUserId(false);
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await checkUserMapping(result.user);
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'Google sign-in popup was closed before completion.';
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  const handleNewUserIdSubmit = async (e) => {
    e.preventDefault();
    const uId = newUserId.trim();
    if (!uId) return;

    const lowerUsername = uId.toLowerCase();
    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(uId)) {
      setError('Username can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    if (uId.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const usernameDocRef = doc(db, 'usernames', lowerUsername);
      const existing = await getDoc(usernameDocRef);
      if (existing.exists()) {
        throw new Error('This username is already taken. Please choose another.');
      }

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user session found.');

      await setDoc(usernameDocRef, {
        uid: currentUser.uid
      });

      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        username: uId,
        email: currentUser.email,
        name: uId,
        avatar: '🦊',
        currentStreak: 0,
        longestStreak: 0,
        lastSolveDate: null,
        dailySolves: {},
        solveHistory: [],
        updatedAt: new Date().toISOString()
      });

      await updateProfile(currentUser, { displayName: uId });

      useProgressStore.setState((prev) => ({
        profiles: {
          ...prev.profiles,
          'default': {
            ...prev.profiles['default'],
            name: uId
          }
        }
      }));

      setNeedsUserId(false);
      
      const isEmailVerified = currentUser.emailVerified || 
        currentUser.email?.endsWith('@dsamastery.local') || 
        currentUser.providerData.some(p => p.providerId === 'google.com');
      if (isEmailVerified) {
        navigate('/');
      } else {
        navigate('/verify-email');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSignupNext = async (e) => {
    e.preventDefault();
    const uId = userIdForSignup.trim();
    if (!uId) return;

    const lowerUsername = uId.toLowerCase();
    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(uId)) {
      setError('Username can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    if (uId.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const usernameDocRef = doc(db, 'usernames', lowerUsername);
      const existing = await getDoc(usernameDocRef);
      if (existing.exists()) {
        throw new Error('This username is already taken. Please choose another.');
      }

      setMode('signup_form');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (mode === 'signup_form') {
      const finalEmail = emailForSignup.trim();
      const finalPassword = password;
      const finalUsername = userIdForSignup.trim();
      
      if (!finalEmail || !finalPassword || !finalUsername) {
        setError('All fields are required.');
        return;
      }
      if (finalPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setLoading(true);
      try {
        const lowerUsername = finalUsername.toLowerCase();
        const usernameDocRef = doc(db, 'usernames', lowerUsername);
        
        const existing = await getDoc(usernameDocRef);
        if (existing.exists()) {
          throw new Error('This username is already taken. Please choose another.');
        }

        const credential = await createUserWithEmailAndPassword(auth, finalEmail, finalPassword);
        
        await setDoc(usernameDocRef, {
          uid: credential.user.uid
        });

        await setDoc(doc(db, 'users', credential.user.uid), {
          uid: credential.user.uid,
          username: finalUsername,
          email: finalEmail,
          name: finalUsername,
          avatar: '🦊',
          currentStreak: 0,
          longestStreak: 0,
          lastSolveDate: null,
          dailySolves: {},
          solveHistory: [],
          updatedAt: new Date().toISOString()
        });

        await updateProfile(credential.user, { displayName: finalUsername });

        useProgressStore.setState((prev) => ({
          profiles: {
            ...prev.profiles,
            'default': {
              ...prev.profiles['default'],
              name: finalUsername
            }
          }
        }));

        await sendEmailVerification(credential.user);
        
        setSuccess('Account created successfully! Verification email has been sent.');
        setMode('signin');
        setUsernameOrEmail(finalUsername);
        setPassword('');
      } catch (err) {
        console.error(err);
        let errMsg = err.message;
        if (err.code === 'auth/email-already-in-use') {
          errMsg = 'An account with this email address already exists.';
        }
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    } else if (mode === 'signin') {
      const input = usernameOrEmail.trim();
      const finalPassword = password;
      if (!input || !finalPassword) return;

      setLoading(true);
      try {
        let finalEmail = input;
        
        if (!input.includes('@')) {
          const lowerUser = input.toLowerCase();
          const usernameDocRef = doc(db, 'usernames', lowerUser);
          const usernameDocSnap = await getDoc(usernameDocRef);
          if (!usernameDocSnap.exists()) {
            throw new Error(`Username "@${input}" is not registered.`);
          }
          const uid = usernameDocSnap.data().uid;
          const userDocSnap = await getDoc(doc(db, 'users', uid));
          if (!userDocSnap.exists() || !userDocSnap.data().email) {
            throw new Error(`Account data could not be resolved for @${input}.`);
          }
          finalEmail = userDocSnap.data().email;
        }

        const credential = await signInWithEmailAndPassword(auth, finalEmail, finalPassword);
        await checkUserMapping(credential.user);
      } catch (err) {
        console.error(err);
        let errMsg = err.message;
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
          errMsg = 'Invalid username/email or password combination.';
        }
        setError(errMsg);
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      const input = usernameOrEmail.trim();
      if (!input) return;

      setLoading(true);
      try {
        let finalEmail = input;
        if (!input.includes('@')) {
          const lowerUser = input.toLowerCase();
          const usernameDocRef = doc(db, 'usernames', lowerUser);
          const usernameDocSnap = await getDoc(usernameDocRef);
          if (!usernameDocSnap.exists()) {
            throw new Error(`Username "@${input}" is not registered.`);
          }
          const uid = usernameDocSnap.data().uid;
          const userDocSnap = await getDoc(doc(db, 'users', uid));
          if (!userDocSnap.exists() || !userDocSnap.data().email) {
            throw new Error(`Account email could not be resolved for @${input}.`);
          }
          finalEmail = userDocSnap.data().email;
        }

        await sendPasswordResetEmail(auth, finalEmail);
        setSuccess('Success! Password reset instructions have been sent to ' + finalEmail);
        setMode('signin');
        setPassword('');
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (checkingUserId) {
    return (
      <div className="lc-login-container">
        <div className="lc-login-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <RefreshCw className="spin" size={32} color="var(--accent-primary)" />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Resolving database session profile...</div>
        </div>
      </div>
    );
  }

  if (needsUserId) {
    return (
      <div className="lc-login-container">
        <div className="lc-login-card">
          <div className="lc-login-header">
            <div className="lc-logo-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DsaMasteryLogo size={36} />
            </div>
            <h2 className="lc-login-title">Choose a Username</h2>
          </div>
          
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
            Welcome! Before syncing your workspace data, please choose a unique username for your DSA Mastery profile.
          </p>

          {error && <div className="lc-auth-error">{error}</div>}

          <form onSubmit={handleNewUserIdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="lc-input-group">
              <label>Username (alphanumeric, underscores, hyphens)</label>
              <input
                type="text"
                placeholder="e.g. coder_dan"
                value={newUserId}
                onChange={e => setNewUserId(e.target.value)}
                required
                className="lc-input"
                autoFocus
              />
            </div>
            <button type="submit" className="lc-submit-btn" disabled={loading || !newUserId.trim()}>
              {loading ? 'Registering...' : 'Complete Profile Setup'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="lc-login-container">
      <div className="lc-login-card animate-fade-in">
        <div className="lc-login-header">
          <div className="lc-logo-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={36} />
          </div>
          <h2 className="lc-login-title">
            {mode === 'signin' ? 'Sign In to DSA Mastery' : mode === 'forgot' ? 'Reset Password' : 'Create Account'}
          </h2>
        </div>

        {error && <div className="lc-auth-error">{error}</div>}
        {success && <div className="lc-auth-success" style={{
          padding: '10px 12px', background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)',
          color: 'var(--success)', fontSize: 13, marginBottom: 16
        }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' ? (
            <>
              <div className="lc-input-group">
                <label>Choose a Username</label>
                <input
                  type="text"
                  placeholder="e.g. coder_dan"
                  value={userIdForSignup}
                  onChange={e => setUserIdForSignup(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>
              <button type="button" className="lc-submit-btn" onClick={handleUsernameSignupNext} disabled={loading || !userIdForSignup.trim()}>
                Next
              </button>
              <div style={{ fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
                  style={{ background: 'none', border: 'none', color: '#ffa116', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign In
                </button>
              </div>
            </>
          ) : mode === 'signup_form' ? (
            <>
              <div style={{
                padding: '8px 12px', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                fontSize: 13, color: 'var(--text-secondary)'
              }}>
                Username selected: <strong style={{ color: 'var(--text-primary)' }}>@{userIdForSignup}</strong>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  style={{ background: 'none', border: 'none', color: '#ffa116', fontSize: 11, marginLeft: 8, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change
                </button>
              </div>
              
              <div className="lc-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailForSignup}
                  onChange={e => setEmailForSignup(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>

              <div className="lc-input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>

              <button type="submit" className="lc-submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </>
          ) : (
            <div className="lc-input-group">
              <label>{mode === 'forgot' ? 'Email Address' : 'User ID or Email'}</label>
              <input
                type="text"
                placeholder={mode === 'forgot' ? 'Email address' : 'User ID or email address'}
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                required
                className="lc-input"
              />
            </div>
          )}

          {mode !== 'forgot' && mode !== 'signup' && mode !== 'signup_form' && (
            <div className="lc-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: '#ffa116', fontSize: 11, cursor: 'pointer', padding: 0 }}
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
                className="lc-input"
              />
            </div>
          )}

          {mode !== 'forgot' && mode !== 'signup' && mode !== 'signup_form' && (
            <button type="submit" className="lc-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          )}
        </form>

        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: '#ffa116', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            >
              Back to Sign In
            </button>
          </div>
        )}

        {(mode === 'signin' || mode === 'forgot') && (
          <div style={{ fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: '#ffa116', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Sign Up
            </button>
          </div>
        )}

        {mode !== 'forgot' && (
          <>
            <div className="lc-divider">
              <span>or connect with</span>
            </div>

            <button type="button" className="lc-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
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
          </>
        )}
      </div>
    </div>
  );
}
