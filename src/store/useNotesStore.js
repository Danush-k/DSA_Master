import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotesStore = create(
  persist(
    (set, get) => ({
      activeProfileId: 'default',
      profiles: {
        'default': {}
      },

      switchProfile: (profileId) => {
        set((state) => {
          const newProfiles = { ...state.profiles };
          if (!newProfiles[profileId]) {
            newProfiles[profileId] = {};
          }
          return { activeProfileId: profileId, profiles: newProfiles };
        });
      },

      deleteProfile: (profileId) => {
        set((state) => {
          const newProfiles = { ...state.profiles };
          delete newProfiles[profileId];
          
          let nextActive = state.activeProfileId;
          if (state.activeProfileId === profileId) {
            nextActive = Object.keys(newProfiles)[0] || 'default';
          }
          if (!newProfiles[nextActive]) {
            newProfiles[nextActive] = {};
          }
          return {
            profiles: newProfiles,
            activeProfileId: nextActive
          };
        });
      },

      saveNote: (questionId, noteData) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const currentProfileNotes = state.profiles[profileId] || {};
          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...currentProfileNotes,
                [questionId]: {
                  ...currentProfileNotes[questionId],
                  ...noteData,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          };
        });
      },

      getNote: (questionId) => {
        const state = get();
        const profileId = state.activeProfileId;
        return (state.profiles[profileId] || {})[questionId] || null;
      },

      deleteNote: (questionId) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const currentProfileNotes = { ...(state.profiles[profileId] || {}) };
          delete currentProfileNotes[questionId];
          return {
            profiles: {
              ...state.profiles,
              [profileId]: currentProfileNotes,
            },
          };
        });
      },

      hasNote: (questionId) => {
        const state = get();
        const profileId = state.activeProfileId;
        const note = (state.profiles[profileId] || {})[questionId];
        if (!note) return false;
        return Object.values(note).some(v => v && v !== '' && v !== note.updatedAt);
      },
    }),
    { name: 'dsa-notes-v2' }
  )
);

export default useNotesStore;
