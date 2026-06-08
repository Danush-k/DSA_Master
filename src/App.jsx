import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  LayoutDashboard, BookOpen, Target, ListChecks, RotateCcw, Bookmark,
  Search, Moon, Sun, ChevronRight, Check, ExternalLink, StickyNote,
  Menu, X, Filter, Clock, Flame, Calendar, ChevronDown, ChevronUp, BarChart3, Info,
  ArrowUpDown, Binary, ChevronsLeftRight, Columns, GitBranch, Grid, Hash, Layers,
  Link as LinkIcon, Network, Sparkles, Star, TrendingUp, Type, Zap,
  Cloud, CloudOff, RefreshCw, User, Map, Settings, Download, Upload, LogOut, Trash2,
  AlertCircle, Mail, Trophy, AlertTriangle, Key, Pencil
} from 'lucide-react';
import { auth, db } from './firebaseClient.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  sendPasswordResetEmail,
  sendEmailVerification,
  linkWithPopup,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup,
  updatePassword,
  linkWithCredential,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { initDbSync, deleteUserCloudData, clearAllLocalStores } from './services/dbSync.js';

import {
  formatLocalDate, Youtube, LeetCodeLogo, DsaMasteryLogo,
  getAvatarColor, renderAvatar, YoutubeLogo, getTopicIcon,
  getPatternIcon, getProblemVideoUrl, getPatternVideoUrl
} from './utils/helpers.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ProgressRing from './components/ProgressRing.jsx';
import QuestionRow from './components/QuestionRow.jsx';
import QuestionTable from './components/QuestionTable.jsx';
import Heatmap from './components/Heatmap.jsx';
import AddCustomQuestionModal from './components/modals/AddCustomQuestionModal.jsx';
import AvatarEditorModal from './components/modals/AvatarEditorModal.jsx';
import DeleteAccountModal from './components/modals/DeleteAccountModal.jsx';
import EditUsernameModal from './components/modals/EditUsernameModal.jsx';
import PasswordSettingsModal from './components/modals/PasswordSettingsModal.jsx';
import ProfileManagerModal from './components/modals/ProfileManagerModal.jsx';
import SignOutOverlay from './components/modals/SignOutOverlay.jsx';
import questions from './data/questions.js';
import topics from './data/topics.js';
import patterns from './data/patterns.js';
import roadmap from './data/roadmap.js';
import useProgressStore from './store/useProgressStore.js';
import useNotesStore from './store/useNotesStore.js';
import useRevisionStore from './store/useRevisionStore.js';
import useThemeStore from './store/useThemeStore.js';
import useAllQuestions from './hooks/useAllQuestions.js';
import DashboardPage from './pages/DashboardPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import TopicsPage from './pages/TopicsPage.jsx';
import TopicDetailPage from './pages/TopicDetailPage.jsx';
import SheetPage from './pages/SheetPage.jsx';
import PatternsListPage from './pages/PatternsListPage.jsx';
import PatternDetailPage from './pages/PatternDetailPage.jsx';









// ═══════════════════════════════════════════════════════════════
// TOPICS LIST PAGE
// ═══════════════════════════════════════════════════════════════



// ═══════════════════════════════════════════════════════════════
// REVISION PAGE
// ═══════════════════════════════════════════════════════════════
function RevisionPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const questionStatus = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.questionStatus || {}));
  const revisions = useRevisionStore(useShallow((s) => s.profiles[activeProfileId] || {}));
  const completeRevision = useRevisionStore((s) => s.completeRevision);

  const allQuestions = useAllQuestions();

  const { dueRevisions, upcomingRevisions } = useMemo(() => {
    const today = formatLocalDate();
    const due = [];
    const upcoming = [];
    Object.entries(revisions).forEach(([id, rev]) => {
      if (questionStatus[id] !== 'solved') return;
      if (rev.completed) return;
      if (!rev.nextRevisionDate) return;
      const item = { questionId: parseInt(id), ...rev };
      if (rev.nextRevisionDate <= today) due.push(item);
      else upcoming.push(item);
    });
    upcoming.sort((a, b) => a.nextRevisionDate.localeCompare(b.nextRevisionDate));
    return { dueRevisions: due, upcomingRevisions: upcoming };
  }, [revisions]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🔄 Spaced Repetition</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Revision schedule: Day 1 → Day 3 → Day 7 → Day 15 → Day 30. Mark problems solved to start tracking.
        </p>
      </div>

      {/* Due Today */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Clock size={20} style={{ color: 'var(--error)' }} /> Due Today ({dueRevisions.length})
          </div>
        </div>
        {dueRevisions.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--success)', marginBottom: 12 }}><Sparkles size={48} /></div>
              <div className="empty-state-title">All caught up!</div>
              <div className="empty-state-desc">No revisions due today. Keep solving problems to build your revision queue.</div>
            </div>
          </div>
        ) : (
          <div className="revision-queue">
            {dueRevisions.map(rev => {
              const q = allQuestions.find(qu => qu.id === rev.questionId);
              if (!q) return null;
              return (
                <div className="card revision-card" key={rev.questionId}>
                  <div className="revision-card-header">
                    <div>
                      <div className="revision-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <a href={q.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
                          {q.num}. {q.title} <ExternalLink size={12} style={{ marginLeft: 4, opacity: 0.4 }} />
                        </a>
                        <a
                          href={getProblemVideoUrl(q)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Watch Tutorial"
                          style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Youtube size={14} />
                        </a>
                      </div>
                      <div className="revision-card-meta">
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <span className="badge badge-pattern">{patterns[q.pattern]?.name}</span>
                      </div>
                    </div>
                    <span className="revision-count">R{rev.revisionCount + 1}/5</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{q.why}</div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => completeRevision(rev.questionId)}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Check size={14} /> Mark Revised
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="dashboard-section">
        <div className="section-header">
          <div className="section-title">
            <Calendar size={20} style={{ color: 'var(--accent-primary)' }} /> Upcoming ({upcomingRevisions.length})
          </div>
        </div>
        {upcomingRevisions.length === 0 ? (
          <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            No upcoming revisions. Solve and mark problems to start the revision cycle.
          </div>
        ) : (
          <div className="question-table-container">
            <table className="question-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Next Revision</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRevisions.slice(0, 20).map(rev => {
                  const q = allQuestions.find(qu => qu.id === rev.questionId);
                  if (!q) return null;
                  return (
                    <tr key={rev.questionId}>
                      <td><span className="question-number">{q.num}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <a href={q.url} target="_blank" rel="noopener noreferrer" className="question-title-link">
                            {q.title}
                          </a>
                          <a
                            href={getProblemVideoUrl(q)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Watch Tutorial"
                            style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center' }}
                          >
                            <Youtube size={14} />
                          </a>
                        </div>
                      </td>
                      <td><span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rev.nextRevisionDate}</td>
                      <td><span className="revision-count">R{rev.revisionCount}/5</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOOKMARKS PAGE
// ═══════════════════════════════════════════════════════════════
function BookmarksPage() {
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const bookmarks = useProgressStore(useShallow((s) => s.profiles[activeProfileId]?.bookmarks || []));
  const allQuestions = useAllQuestions();

  const bookmarkedQuestions = useMemo(() => {
    const bArr = bookmarks instanceof Set ? Array.from(bookmarks) : (Array.isArray(bookmarks) ? bookmarks : []);
    return allQuestions.filter(q => bArr.includes(q.id));
  }, [bookmarks, allQuestions]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🔖 Bookmarks</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Problems you've bookmarked for quick access.
        </p>
      </div>
      {bookmarkedQuestions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Bookmark className="empty-state-icon" />
            <div className="empty-state-title">No bookmarks yet</div>
            <div className="empty-state-desc">Click the bookmark icon on any problem to save it here.</div>
          </div>
        </div>
      ) : (
        <QuestionTable questionList={bookmarkedQuestions} showTopic={true} showPattern={true} />
      )}
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════
// APP LAYOUT + ROUTING
// ═══════════════════════════════════════════════════════════════
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const switchNotesProfile = useNotesStore((s) => s.switchProfile);
  const switchRevisionProfile = useRevisionStore((s) => s.switchProfile);

  const [syncStatus, setSyncStatus] = useState('loading'); // 'loading', 'unauthenticated', 'syncing', 'synced'
  const [user, setUser] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogoutGlobal = async () => {
    setIsSigningOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await signOut(auth);
      clearAllLocalStores();
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Initialize DB Sync
  useEffect(() => {
    initDbSync((status, currentUser) => {
      setSyncStatus(status);
      setUser(currentUser);
    });
  }, []);

  // Keep notes and revisions store profiles in sync with the active progress profile
  useEffect(() => {
    switchNotesProfile(activeProfileId);
    switchRevisionProfile(activeProfileId);
  }, [activeProfileId, switchNotesProfile, switchRevisionProfile]);

  // Ensure the default profile name is kept in sync with the user's permanent User ID (displayName)
  useEffect(() => {
    const progressStore = useProgressStore.getState();
    
    // Enforce default profile key
    if (progressStore.activeProfileId !== 'default') {
      useProgressStore.getState().switchProfile('default');
    }

    if (user && user.displayName) {
      const currentName = progressStore.profiles['default']?.name;
      if (currentName !== user.displayName) {
        useProgressStore.setState((prev) => ({
          profiles: {
            ...prev.profiles,
            'default': {
              ...prev.profiles['default'],
              name: user.displayName,
              avatar: prev.profiles['default']?.avatar || '#FFA116'
            }
          }
        }));
      }
    }
  }, [user]);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/roadmap') return 'DSA Roadmap';
    if (location.pathname === '/topics') return 'Topics';
    if (location.pathname.startsWith('/topics/')) {
      const topicId = location.pathname.split('/')[2];
      return topics.find(t => t.id === topicId)?.name || 'Topic';
    }
    if (location.pathname === '/sheet') return 'Problem Sheet';
    if (location.pathname === '/patterns') return 'Patterns';
    if (location.pathname.startsWith('/patterns/')) return 'Pattern Detail';
    if (location.pathname === '/revision') return 'Revision';
    if (location.pathname === '/bookmarks') return 'Bookmarks';
    if (location.pathname === '/login') return 'Account Login';
    if (location.pathname === '/profile') return 'User Profile';
    if (location.pathname === '/verify-email') return 'Email Verification';
    return 'DSA Mastery';
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Auth Guarding Routing Rules
  const isAuthenticated = user !== null;
  const isEmailVerified = user ? (
    user.emailVerified || 
    user.email?.endsWith('@dsamastery.local') || 
    user.providerData.some(p => p.providerId === 'google.com')
  ) : false;

  useEffect(() => {
    // Don't navigate during loading or syncing — wait until cloud hydration is complete
    if (syncStatus === 'loading' || syncStatus === 'syncing') return;
    if (!isAuthenticated) {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    } else if (!isEmailVerified) {
      if (location.pathname !== '/verify-email') {
        navigate('/verify-email');
      }
    } else {
      if (location.pathname === '/login' || location.pathname === '/verify-email') {
        navigate('/');
      }
    }
  }, [syncStatus, isAuthenticated, isEmailVerified, location.pathname, navigate]);

  // Loading Screen — show while auth state is resolving OR while cloud data is being fetched
  if (syncStatus === 'loading' || syncStatus === 'syncing') {
    return (
      <div className="lc-loading-screen">
        <div className="lc-loading-card">
          <div className="lc-logo-circle spin-glow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={36} />
          </div>
          <h2 className="lc-loading-title">DSA Mastery</h2>
          <div className="lc-loading-subtitle">
            {syncStatus === 'syncing' ? 'Syncing your progress...' : 'Loading your workspace...'}
          </div>
          <div className="lc-spinner"></div>
        </div>
      </div>
    );
  }

  // Gated View: Unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="app-layout auth-only">
        <Routes>
          <Route path="/login" element={<LoginPage user={user} />} />
          <Route path="*" element={<LoginPage user={user} />} />
        </Routes>
        {isSigningOut && <SignOutOverlay />}
      </div>
    );
  }

  // Gated View: Email Verification Needed
  if (!isEmailVerified) {
    return (
      <div className="app-layout auth-only">
        <Routes>
          <Route path="/verify-email" element={<VerifyEmailPage user={user} onLogout={handleLogoutGlobal} />} />
          <Route path="*" element={<VerifyEmailPage user={user} onLogout={handleLogoutGlobal} />} />
        </Routes>
        {isSigningOut && <SignOutOverlay />}
      </div>
    );
  }

  // Main Authenticated Workspace
  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} allQuestions={allQuestions} />
      <div className="main-content">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          onManageProfiles={() => setManagerOpen(true)}
          syncStatus={syncStatus}
          user={user}
          onAuthClick={handleAuthClick}
          allQuestions={allQuestions}
        />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/sheet" element={<SheetPage />} />
          <Route path="/patterns" element={<PatternsListPage />} />
          <Route path="/patterns/:patternId" element={<PatternDetailPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage user={user} syncStatus={syncStatus} onLogout={handleLogoutGlobal} />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </div>
      {isSigningOut && <SignOutOverlay />}
      {managerOpen && <ProfileManagerModal onClose={() => setManagerOpen(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEETCODE-STYLE LOGIN PAGE
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LEETCODE-STYLE LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ user }) {
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
      setError('Failed to check user account setup: ' + err.message);
    } finally {
      setCheckingUserId(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user && !needsUserId) {
      checkUserMapping(user);
    }
  }, [user, needsUserId, checkUserMapping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const uId = userIdForSignup.trim();
        const email = emailForSignup.trim();
        const pass = password.trim();

        if (!uId || !email || !pass) {
          throw new Error('Please fill in all fields.');
        }

        const userIdRegex = /^[a-zA-Z0-9_-]+$/;
        if (!userIdRegex.test(uId)) {
          throw new Error('User ID can only contain letters, numbers, underscores, or hyphens.');
        }
        if (uId.length < 3) {
          throw new Error('User ID must be at least 3 characters long.');
        }
        if (uId.includes('@')) {
          throw new Error('User ID cannot contain the "@" symbol.');
        }

        const lowerUsername = uId.toLowerCase();
        const usernameDocRef = doc(db, 'usernames', lowerUsername);
        const usernameDoc = await getDoc(usernameDocRef);
        if (usernameDoc.exists()) {
          throw new Error('This User ID is already taken.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          username: uId,
          email: email,
          name: uId,
          avatar: '🦊',
          currentStreak: 0,
          longestStreak: 0,
          lastSolveDate: null,
          dailySolves: {},
          solveHistory: [],
          updatedAt: new Date().toISOString()
        });

        await setDoc(usernameDocRef, {
          uid: firebaseUser.uid
        });

        await updateProfile(firebaseUser, { displayName: uId });

        const progressStore = useProgressStore.getState();
        if (progressStore.profiles['default']) {
          useProgressStore.setState((prev) => ({
            profiles: {
              ...prev.profiles,
              'default': {
                ...prev.profiles['default'],
                name: uId
              }
            }
          }));
        }

        if (!email.endsWith('@dsamastery.local')) {
          await sendEmailVerification(firebaseUser);
        }
      } else if (mode === 'signin') {
        const input = usernameOrEmail.trim();
        const pass = password.trim();

        if (!input || !pass) return;

        let emailToSignIn = input;
        if (!input.includes('@')) {
          const usernameDocRef = doc(db, 'usernames', input.toLowerCase());
          const usernameDoc = await getDoc(usernameDocRef);
          if (!usernameDoc.exists()) {
            throw new Error('Username not found. Check your username or sign in with your email address.');
          }

          const userUid = usernameDoc.data().uid;
          const userDocRef = doc(db, 'users', userUid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            throw new Error('User data not found for this username.');
          }
          emailToSignIn = userDoc.data().email;
          if (!emailToSignIn) {
            throw new Error('No email linked to this username.');
          }
        }

        await signInWithEmailAndPassword(auth, emailToSignIn, pass);
      } else if (mode === 'forgot') {
        const input = usernameOrEmail.trim();
        if (!input) return;
        
        let emailToReset = input;
        if (!input.includes('@')) {
          // Allow forgot password by username lookup
          const usernameDocRef = doc(db, 'usernames', input.toLowerCase());
          const usernameDoc = await getDoc(usernameDocRef);
          if (!usernameDoc.exists()) {
            throw new Error('Username not found.');
          }
          const userUid = usernameDoc.data().uid;
          const userDocRef = doc(db, 'users', userUid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            throw new Error('User data not found.');
          }
          emailToReset = userDoc.data().email;
          if (!emailToReset || emailToReset.endsWith('@dsamastery.local')) {
            throw new Error('Password reset is only supported for accounts registered with a real email address.');
          }
        } else if (input.endsWith('@dsamastery.local')) {
          throw new Error('Password reset is only supported for accounts registered with a real email address.');
        }

        await sendPasswordResetEmail(auth, emailToReset);
        setSuccess('Password reset link has been sent to your email.');
      }
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/wrong-password') errMsg = 'Incorrect password.';
      if (err.code === 'auth/user-not-found') errMsg = 'User not found.';
      if (err.code === 'auth/email-already-in-use') errMsg = 'This email is already in use.';
      if (err.code === 'auth/invalid-credential') errMsg = 'Invalid credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUserId = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const uId = newUserId.trim();
    if (!uId) return;

    const userIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userIdRegex.test(uId)) {
      setError('User ID can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    if (uId.length < 3) {
      setError('User ID must be at least 3 characters long.');
      return;
    }
    if (uId.includes('@')) {
      setError('User ID cannot contain the "@" symbol.');
      return;
    }

    setLoading(true);
    try {
      const usernameDocRef = doc(db, 'usernames', uId.toLowerCase());
      const usernameDoc = await getDoc(usernameDocRef);
      if (usernameDoc.exists()) {
        throw new Error('This User ID is already taken.');
      }

      if (!auth.currentUser) {
        throw new Error('No logged-in user session found.');
      }

      const firebaseUser = auth.currentUser;

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        username: uId,
        email: firebaseUser.email || '',
        name: uId,
        avatar: '🦊',
        currentStreak: 0,
        longestStreak: 0,
        lastSolveDate: null,
        dailySolves: {},
        solveHistory: [],
        updatedAt: new Date().toISOString()
      });

      await setDoc(usernameDocRef, {
        uid: firebaseUser.uid
      });

      await updateProfile(firebaseUser, { displayName: uId });

      const progressStore = useProgressStore.getState();
      if (progressStore.profiles['default']) {
        useProgressStore.setState((prev) => ({
          profiles: {
            ...prev.profiles,
            'default': {
              ...prev.profiles['default'],
              name: uId
            }
          }
        }));
      }

      setNeedsUserId(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/popup-closed-by-user') errMsg = 'Sign-in popup closed before completion.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingUserId) {
    return (
      <div className="lc-login-container">
        <div className="lc-login-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <RefreshCw className="spin" size={36} color="var(--accent-primary)" />
          <p style={{ marginTop: 16, fontSize: 14, color: 'var(--text-secondary)' }}>Checking account setup...</p>
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
            <h2 className="lc-login-title">Choose User ID</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0', lineHeight: 1.5 }}>
              Choose a permanent User ID to complete your registration. This cannot be changed later.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
              color: 'var(--error)', fontSize: 13, lineHeight: 1.4, textAlign: 'center', marginBottom: 12
            }}>
              <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSetUserId} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="lc-input-group">
              <label>User ID (Permanent)</label>
              <input
                type="text"
                placeholder="e.g. danush"
                value={newUserId}
                onChange={e => setNewUserId(e.target.value)}
                required
                className="lc-input"
              />
            </div>
            <button type="submit" className="lc-submit-btn" disabled={loading}>
              {loading ? 'Setting User ID...' : 'Confirm User ID'}
            </button>
            <button 
              type="button" 
              className="lc-google-btn" 
              onClick={() => {
                signOut(auth);
                setNeedsUserId(false);
                setError('');
              }}
              style={{ border: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)', marginTop: 4 }}
            >
              Cancel & Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="lc-login-container">
      <div className="lc-login-card">
        <div className="lc-login-header">
          <div className="lc-logo-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={36} />
          </div>
          <h2 className="lc-login-title">
            {mode === 'forgot' ? 'Reset Password' : 'DSA Mastery'}
          </h2>
        </div>

        {mode !== 'forgot' ? (
          <div className="lc-tab-container">
            <button
              type="button"
              className={`lc-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`lc-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            >
              Register
            </button>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: '4px 0', lineHeight: 1.5 }}>
            Enter your email address and we will send you a link to reset your password.
          </p>
        )}

        {error && (
          <div style={{
            padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--error)', fontSize: 13, lineHeight: 1.4, textAlign: 'center', marginBottom: 12
          }}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '10px 12px', background: 'rgba(0, 184, 163, 0.1)',
            border: '1px solid rgba(0, 184, 163, 0.2)', borderRadius: 'var(--radius-md)',
            color: 'var(--success)', fontSize: 13, lineHeight: 1.4, textAlign: 'center', marginBottom: 12
          }}>
            <Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} color="var(--success)" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' ? (
            <>
              <div className="lc-input-group">
                <label>Username <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', fontSize: 11 }}>(can be changed later in Profile)</span></label>
                <input
                  type="text"
                  placeholder="Letters, numbers, underscores or hyphens"
                  value={userIdForSignup}
                  onChange={e => setUserIdForSignup(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>
              <div className="lc-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={emailForSignup}
                  onChange={e => setEmailForSignup(e.target.value)}
                  required
                  className="lc-input"
                />
              </div>
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

          {mode !== 'forgot' && (
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

          <button type="submit" className="lc-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Recovery Email'}
          </button>
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

// ═══════════════════════════════════════════════════════════════
// EMAIL VERIFICATION PAGE
// ═══════════════════════════════════════════════════════════════
function VerifyEmailPage({ user, onLogout }) {
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
          <div className="lc-logo-circle" style={{ border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={32} color="var(--accent-primary)" /></div>
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






// ═══════════════════════════════════════════════════════════════
// LEETCODE-STYLE PROFILE PAGE
// ═══════════════════════════════════════════════════════════════
function ProfilePage({ user, syncStatus, onLogout }) {
  const navigate = useNavigate();
  const allQuestions = useAllQuestions();
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const profile = useProgressStore((s) => s.profiles[activeProfileId] || {});
  const isGoogleLinked = user?.providerData?.some(p => p.providerId === 'google.com');
  
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [passwordSettingsOpen, setPasswordSettingsOpen] = useState(false);
  // Track local username (updates instantly on rename)
  const [localUsername, setLocalUsername] = useState(user?.displayName || profile.name || '');
  useEffect(() => {
    setLocalUsername(user?.displayName || profile.name || '');
  }, [user?.displayName, profile.name]);

  // Solved and status metrics
  const questionStatus = profile.questionStatus || {};
  const bookmarks = profile.bookmarks || [];
  const customQuestions = profile.customQuestions || [];
  const currentStreak = profile.currentStreak || 0;
  const longestStreak = profile.longestStreak || 0;
  
  // Calculate total counts by difficulty
  const totalEasy = allQuestions.filter(q => q.difficulty === 'Easy').length;
  const totalMedium = allQuestions.filter(q => q.difficulty === 'Medium').length;
  const totalHard = allQuestions.filter(q => q.difficulty === 'Hard').length;
  const totalProblems = allQuestions.length;

  const solvedEasy = allQuestions.filter(q => q.difficulty === 'Easy' && questionStatus[q.id] === 'solved').length;
  const solvedMedium = allQuestions.filter(q => q.difficulty === 'Medium' && questionStatus[q.id] === 'solved').length;
  const solvedHard = allQuestions.filter(q => q.difficulty === 'Hard' && questionStatus[q.id] === 'solved').length;
  const totalSolved = solvedEasy + solvedMedium + solvedHard;

  const easyPercent = totalEasy ? Math.round((solvedEasy / totalEasy) * 100) : 0;
  const mediumPercent = totalMedium ? Math.round((solvedMedium / totalMedium) * 100) : 0;
  const hardPercent = totalHard ? Math.round((solvedHard / totalHard) * 100) : 0;
  const totalPercent = totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Revisions stats
  const revisions = useRevisionStore((s) => s.profiles[activeProfileId] || {});
  const totalRevisions = Object.keys(revisions).length;

  // Notes stats
  const notes = useNotesStore((s) => s.profiles[activeProfileId] || {});
  const totalNotes = Object.keys(notes).length;

  // Recent activity list
  const solveHistory = profile.solveHistory || [];
  const fallbackHistory = useMemo(() => {
    if (solveHistory.length > 0) return solveHistory;
    return Object.entries(questionStatus)
      .filter(([_, status]) => status === 'solved')
      .map(([id]) => ({ questionId: parseInt(id), solvedAt: null }))
      .slice(0, 10);
  }, [solveHistory, questionStatus]);

  // Helper to format timestamps
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Previously';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  // Profile manager modal trigger
  const [managerOpen, setManagerOpen] = useState(false);

  // Backup data
  const handleBackup = () => {
    const backupStr = useProgressStore.getState().exportData();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dsa_mastery_backup_${activeProfileId}_${formatLocalDate()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Sign out helper
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      try {
        await signOut(auth);
        clearAllLocalStores();
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete user account and cascading data
  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  // Link Google Account helper
  const handleLinkGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      if (!auth.currentUser) return;
      await linkWithPopup(auth.currentUser, provider);
      alert("Success! Your Google account has been successfully linked.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Linking Google account failed: ${err.message}`);
    }
  };

  // SVG circular chart variables
  const radius = 56;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalPercent / 100) * circumference;

  return (
    <div className="page-content">
      <div className="profile-container">
        {/* Left Column */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-user-info">
              <div className="profile-avatar-large">
                {renderAvatar(profile.avatar, profile.name, 72)}
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setAvatarModalOpen(true)}
                style={{ marginTop: 10, padding: '4px 12px', fontSize: 12 }}
              >
                Edit Avatar
              </button>
              <div className="profile-display-name">
                {localUsername || user?.displayName || profile.name}
              </div>
              {user?.email && (
                <div className="profile-email">
                  {user.email}
                </div>
              )}
              {user?.metadata?.createdAt && (
                <div className="profile-joined">
                  Member since {new Date(parseInt(user.metadata.createdAt)).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </div>
              )}
              <div className="profile-status-pill">
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: syncStatus === 'synced' ? 'var(--success)' : syncStatus === 'syncing' ? 'var(--warning)' : 'var(--text-tertiary)'
                }}></span>
                {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Guest Mode (Local)'}
              </div>
            </div>
          </div>

          <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, borderBottom: '1px solid var(--border-primary)', paddingBottom: 8 }}>
              Account Settings
            </h4>
            <button className="btn btn-secondary btn-sm" onClick={handleBackup} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Download size={14} /> Backup Data (JSON)
            </button>
            {user && !isGoogleLinked && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleLinkGoogle} 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 161, 22, 0.1)', 
                  border: '1px solid rgba(255, 161, 22, 0.3)', 
                  color: '#ffa116',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffa116';
                  e.currentTarget.style.color = '#1a1a2e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 161, 22, 0.1)';
                  e.currentTarget.style.color = '#ffa116';
                }}
              >
                <ExternalLink size={14} /> Link Google Account
              </button>
            )}
            {user && (
              <>
                {/* Edit Username */}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditUsernameOpen(true)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Pencil size={14} /> Edit Username
                </button>

                {/* Password Settings */}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPasswordSettingsOpen(true)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Key size={14} /> {user?.providerData?.some(p => p.providerId === 'password') ? 'Change Password' : 'Set Password'}
                </button>

                <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <LogOut size={14} /> Sign Out
                </button>
                <div style={{ borderTop: '1px solid var(--border-primary)', marginTop: 8, paddingTop: 8 }}>
                  <button
                    className="btn btn-sm"
                    onClick={handleDeleteAccount}
                    style={{
                      width: '100%',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--error)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--error)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = 'var(--error)';
                    }}
                  >
                    <Trash2 size={14} /> Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-main-grid">
          {/* Progress Ring and Difficulty Bars */}
          <div className="profile-card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Progress Summary</h3>
            <div className="profile-progress-stats">
              {/* SVG Ring */}
              <div className="profile-progress-circle-wrap">
                <div className="progress-ring-container">
                  <svg width="140" height="140">
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke="var(--bg-primary)"
                      strokeWidth={strokeWidth}
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke="var(--accent-primary)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)"
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <div className="progress-ring-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 22, fontWeight: 800 }}>{totalPercent}%</span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{totalSolved}/{totalProblems}</span>
                  </div>
                </div>
              </div>

              {/* Difficulty Bars */}
              <div className="difficulty-bars-list">
                {/* Easy */}
                <div className="difficulty-bar-item">
                  <div className="difficulty-bar-header">
                    <span style={{ color: 'var(--easy)' }}>Easy</span>
                    <div className="difficulty-bar-count">
                      <span>{solvedEasy}</span>/{totalEasy}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill easy" style={{ width: `${easyPercent}%` }}></div>
                  </div>
                </div>

                {/* Medium */}
                <div className="difficulty-bar-item">
                  <div className="difficulty-bar-header">
                    <span style={{ color: 'var(--medium)' }}>Medium</span>
                    <div className="difficulty-bar-count">
                      <span>{solvedMedium}</span>/{totalMedium}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill medium" style={{ width: `${mediumPercent}%` }}></div>
                  </div>
                </div>

                {/* Hard */}
                <div className="difficulty-bar-item">
                  <div className="difficulty-bar-header">
                    <span style={{ color: 'var(--hard)' }}>Hard</span>
                    <div className="difficulty-bar-count">
                      <span>{solvedHard}</span>/{totalHard}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill hard" style={{ width: `${hardPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Boxes */}
          <div className="profile-streak-grid">
            <div className="profile-stat-box">
              <span className="profile-stat-box-icon"><Flame size={20} style={{ color: '#f97316' }} /></span>
              <span className="profile-stat-box-val">{currentStreak}</span>
              <span className="profile-stat-box-lbl">Current Streak</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-box-icon"><Trophy size={20} style={{ color: '#eab308' }} /></span>
              <span className="profile-stat-box-val">{longestStreak}</span>
              <span className="profile-stat-box-lbl">Longest Streak</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-box-icon"><StickyNote size={20} style={{ color: 'var(--accent-primary)' }} /></span>
              <span className="profile-stat-box-val">{totalNotes}</span>
              <span className="profile-stat-box-lbl">Study Notes</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Submissions</h3>
            {fallbackHistory.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
                No recent activity. Start solving questions to populate your log!
              </p>
            ) : (
              <div className="activity-timeline">
                {fallbackHistory.map((item, idx) => {
                  const q = allQuestions.find(x => x.id === item.questionId);
                  if (!q) return null;
                  const diffClass = q.difficulty.toLowerCase();
                  return (
                    <div className="activity-item" key={idx}>
                      <span className={`activity-item-dot ${diffClass}`} />
                      <div className="activity-details">
                        <Link to="/sheet" className="activity-problem-link">
                          {q.title}
                        </Link>
                        <span className={`badge badge-${diffClass}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                          {q.difficulty}
                        </span>
                      </div>
                      <span className="activity-time">
                        {formatTimeAgo(item.solvedAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {avatarModalOpen && (
          <AvatarEditorModal 
            onClose={() => setAvatarModalOpen(false)} 
            activeAvatar={profile.avatar} 
            name={profile.name} 
          />
        )}
        {deleteModalOpen && (
          <DeleteAccountModal
            onClose={() => setDeleteModalOpen(false)}
            user={user}
            username={user?.displayName || profile.name}
            totalSolved={totalSolved}
          />
        )}
        {editUsernameOpen && user && (
          <EditUsernameModal
            onClose={() => setEditUsernameOpen(false)}
            user={user}
            currentUsername={localUsername || user?.displayName || profile.name}
            onSuccess={(newName) => setLocalUsername(newName)}
          />
        )}
        {passwordSettingsOpen && user && (
          <PasswordSettingsModal
            onClose={() => setPasswordSettingsOpen(false)}
            user={user}
          />
        )}
      </div>
    </div>
  );
}


function App() {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}

export default App;
