import { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, X, Check } from 'lucide-react';
import { renderAvatar } from '../../utils/helpers.jsx';
import useProgressStore from '../../store/useProgressStore.js';

export default function AvatarEditorModal({ onClose, activeAvatar, name }) {
  const [activeTab, setActiveTab] = useState(activeAvatar && activeAvatar.startsWith('#') ? 'color' : 'emoji');
  
  const colors = [
    '#FFA116', // LeetCode Orange
    '#00b8a3', // LeetCode Green
    '#38BDF8', // Sky Blue
    '#A78BFA', // Purple
    '#F43F5E', // Rose
    '#FBBF24', // Amber
    '#34D399', // Emerald
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  const emojis = ['🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🦖', '🐉', '👻', '⚡️'];

  const handleSelect = (val) => {
    const activeProfileId = useProgressStore.getState().activeProfileId;
    useProgressStore.setState((prev) => ({
      profiles: {
        ...prev.profiles,
        [activeProfileId]: {
          ...prev.profiles[activeProfileId],
          avatar: val
        }
      }
    }));
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} /> Edit Profile Avatar
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tabs */}
          <div className="lc-tab-container" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className={`lc-tab-btn ${activeTab === 'color' ? 'active' : ''}`}
              onClick={() => setActiveTab('color')}
            >
              Initial & Color
            </button>
            <button
              type="button"
              className={`lc-tab-btn ${activeTab === 'emoji' ? 'active' : ''}`}
              onClick={() => setActiveTab('emoji')}
            >
              Emoji Avatar
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ border: '3px solid var(--border-secondary)', borderRadius: '50%', padding: 4 }}>
              {renderAvatar(activeAvatar, name, 80)}
            </div>
          </div>

          {activeTab === 'color' ? (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'center' }}>
                Select a professional background color for your initials:
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleSelect(color)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: color,
                      border: activeAvatar === color ? '2.5px solid var(--text-primary)' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      boxShadow: activeAvatar === color ? '0 0 8px var(--accent-primary)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {activeAvatar === color && <Check size={16} color="#ffffff" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'center' }}>
                Select a playful emoji for your profile:
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleSelect(emoji)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: activeAvatar === emoji ? 'var(--bg-tertiary)' : 'none',
                      border: activeAvatar === emoji ? '1.5px solid var(--accent-primary)' : '1px solid transparent',
                      fontSize: 20,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 24px' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
