import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Download, ExternalLink, Pencil, Key, LogOut, Trash2, Flame, Trophy, StickyNote } from 'lucide-react';
import { auth } from '../firebaseClient.js';
import { signOut, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { clearAllLocalStores } from '../services/dbSync.js';
import useProgressStore from '../store/useProgressStore.js';
import useRevisionStore from '../store/useRevisionStore.js';
import useNotesStore from '../store/useNotesStore.js';
import useAllQuestions from '../hooks/useAllQuestions.js';
import { renderAvatar, formatLocalDate } from '../utils/helpers.jsx';
import AvatarEditorModal from '../components/modals/AvatarEditorModal.jsx';
import DeleteAccountModal from '../components/modals/DeleteAccountModal.jsx';
import EditUsernameModal from '../components/modals/EditUsernameModal.jsx';
import PasswordSettingsModal from '../components/modals/PasswordSettingsModal.jsx';

export default function ProfilePage({ user, syncStatus, onLogout }) {
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
