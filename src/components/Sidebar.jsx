
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, BookOpen, ListChecks, Target, RotateCcw, Bookmark, User
} from 'lucide-react';
import { formatLocalDate, DsaMasteryLogo } from '../utils/helpers.jsx';
import useRevisionStore from '../store/useRevisionStore.js';

export default function Sidebar({ isOpen, onClose, allQuestions = [] }) {
  const location = useLocation();

  // Compute due count directly from active profile's revisions
  const dueCount = useRevisionStore((s) => {
    const today = formatLocalDate();
    const profileRevisions = s.profiles[s.activeProfileId] || {};
    return Object.values(profileRevisions).filter(
      (rev) => rev.nextRevisionDate && rev.nextRevisionDate <= today && !rev.completed
    ).length;
  });

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/topics', label: 'Topics', icon: BookOpen },
    { path: '/sheet', label: 'Problem Sheet', icon: ListChecks },
    { path: '/patterns', label: 'Patterns', icon: Target },
    { path: '/revision', label: 'Revision', icon: RotateCcw, badge: dueCount || null },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DsaMasteryLogo size={20} />
          </div>
          <span className="sidebar-logo-text">DSA Mastery</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="sidebar-link-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            {allQuestions.length} Problems · Pattern-Based Learning
          </div>
        </div>
      </aside>
    </>
  );
}
