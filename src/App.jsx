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
import RevisionPage from './pages/RevisionPage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';









// ═══════════════════════════════════════════════════════════════
// TOPICS LIST PAGE
// ═══════════════════════════════════════════════════════════════



// ═══════════════════════════════════════════════════════════════
// REVISION PAGE
// ═══════════════════════════════════════════════════════════════
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
