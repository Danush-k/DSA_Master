import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  Menu, Search, ChevronDown, CloudOff, Cloud, RefreshCw, Sun, Moon, User
} from 'lucide-react';
import { renderAvatar } from '../utils/helpers.jsx';
import useThemeStore from '../store/useThemeStore.js';
import useProgressStore from '../store/useProgressStore.js';


export default function Header({
  title,
  onMenuClick,
  syncStatus,
  onAuthClick,
  allQuestions = []
}) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const profiles = useProgressStore(useShallow((s) => s.profiles));
  const activeProfile = profiles[activeProfileId];

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allQuestions
      .filter(qu => qu.title.toLowerCase().includes(q) || String(qu.num).includes(q))
      .slice(0, 8);
  }, [searchQuery, allQuestions]);

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search className="search-bar-icon" />
          <input
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          {searchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden', zIndex: 200,
              boxShadow: 'var(--shadow-xl)',
            }}>
              {searchResults.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: '8px 12px', cursor: 'pointer', fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: '1px solid var(--border-primary)',
                  }}
                  className="search-result-item"
                  onMouseDown={() => {
                    navigate(`/topics/${q.topic}#question-${q.id}`);
                    setSearchQuery('');
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', minWidth: 32 }}>
                    {q.num}.
                  </span>
                  <span style={{ flex: 1 }}>{q.title}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Selector */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button className="profile-btn" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} title="Switch profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {renderAvatar(activeProfile?.avatar, activeProfile?.name, 22)}
            <span className="profile-btn-name">{activeProfile?.name || 'Default'}</span>
            <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">Logged in as</div>
              <div className="profile-dropdown-item active" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
                {renderAvatar(activeProfile?.avatar, activeProfile?.name, 18)}
                <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{activeProfile?.name || 'Default'}</span>
              </div>
              <div className="profile-dropdown-divider" />
              <Link
                to="/profile"
                className="profile-dropdown-item"
                onClick={() => setProfileDropdownOpen(false)}
                style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <User size={14} /> View Profile Page
              </Link>
            </div>
          )}
        </div>

        {/* Cloud Sync Status */}
        <button
          className="cloud-sync-btn"
          onClick={onAuthClick}
          title={
            syncStatus === 'local-only' ? 'Cloud Sync Unavailable (Config Missing)' :
            syncStatus === 'local' ? 'Cloud Sync Disconnected (Click to Log In)' :
            syncStatus === 'syncing' ? 'Syncing with Cloud Database...' :
            'Synchronized with Cloud Database'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: syncStatus === 'synced' ? 'var(--success)' : syncStatus === 'syncing' ? 'var(--warning)' : 'var(--text-tertiary)',
            cursor: syncStatus === 'local-only' ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          disabled={syncStatus === 'local-only'}
        >
          {syncStatus === 'syncing' ? (
            <RefreshCw size={16} className="spin" />
          ) : syncStatus === 'local' || syncStatus === 'local-only' ? (
            <CloudOff size={16} />
          ) : (
            <Cloud size={16} />
          )}
        </button>

        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
