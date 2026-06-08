import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import { User, X, Check, Download, Upload } from 'lucide-react';
import { renderAvatar, formatLocalDate } from '../../utils/helpers.jsx';
import useProgressStore from '../../store/useProgressStore.js';
import useNotesStore from '../../store/useNotesStore.js';
import useRevisionStore from '../../store/useRevisionStore.js';

export default function ProfileManagerModal({ onClose }) {
  const profiles = useProgressStore(useShallow((s) => s.profiles));
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const switchProfile = useProgressStore((s) => s.switchProfile);
  const createProfile = useProgressStore((s) => s.createProfile);
  const deleteProgressProfile = useProgressStore((s) => s.deleteProfile);
  const deleteNotesProfile = useNotesStore((s) => s.deleteProfile);
  const deleteRevisionProfile = useRevisionStore((s) => s.deleteProfile);

  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('#FFA116');

  const avatarOptions = [
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

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const profileId = newName.trim().toLowerCase().replace(/\s+/g, '-');
    if (profiles[profileId]) {
      alert('A profile with this name already exists.');
      return;
    }
    createProfile(profileId, newName.trim(), selectedAvatar);
    setNewName('');
  };

  const handleDelete = (id) => {
    if (Object.keys(profiles).length <= 1) {
      alert('You must keep at least one profile.');
      return;
    }
    if (confirm(`Are you sure you want to delete profile "${profiles[id].name}"? This action cannot be undone.`)) {
      deleteProgressProfile(id);
      deleteNotesProfile(id);
      deleteRevisionProfile(id);
    }
  };

  const handleExportBackup = () => {
    const backup = {
      progress: JSON.parse(useProgressStore.getState().exportData()),
      notes: useNotesStore.getState().profiles,
      revisions: useRevisionStore.getState().profiles,
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa_master_backup_${formatLocalDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup && backup.progress && backup.notes && backup.revisions) {
          // Hydrate progress store
          useProgressStore.setState({
            profiles: backup.progress.profiles,
            activeProfileId: backup.progress.activeProfileId,
          });
          
          // Hydrate notes store
          useNotesStore.setState({
            profiles: backup.notes,
            activeProfileId: backup.progress.activeProfileId,
          });
          
          // Hydrate revision store
          useRevisionStore.setState({
            profiles: backup.revisions,
            activeProfileId: backup.progress.activeProfileId,
          });
          
          alert('Backup imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} /> Profile Management</div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* List existing */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Existing Profiles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(profiles).map(([id, p]) => {
                const solvedCount = Object.values(p.questionStatus || {}).filter(s => s === 'solved').length;
                return (
                  <div key={id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                    border: id === activeProfileId ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {renderAvatar(p.avatar, p.name, 24)}
                      <div>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</span>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{solvedCount} solved</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {id !== activeProfileId && (
                        <button className="btn btn-ghost btn-sm" onClick={() => switchProfile(id)}>Switch</button>
                      )}
                      {Object.keys(profiles).length > 1 && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>Delete</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create new profile */}
          <form onSubmit={handleCreate} style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Create New Profile</h3>
            <div className="notes-field" style={{ marginBottom: 8 }}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: 14,
                }}
                required
              />
            </div>
            <div className="notes-field" style={{ marginBottom: 12 }}>
              <label>Choose Avatar</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                {avatarOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedAvatar(color)}
                    style={{
                      width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: color,
                      border: selectedAvatar === color ? '2px solid var(--text-primary)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50%', cursor: 'pointer',
                      boxShadow: selectedAvatar === color ? '0 0 8px var(--accent-primary)' : 'none',
                    }}
                  >
                    {selectedAvatar === color && <Check size={14} color="#ffffff" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Profile</button>
          </form>

          {/* Backup / Restore */}
          <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Backup & Restore</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={handleExportBackup}>
                <Download size={14} /> Export Backup
              </button>
              <label className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <Upload size={14} /> Import Backup
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleImportBackup}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
