import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const REVISION_INTERVALS = [1, 3, 7, 15, 30];

const useRevisionStore = create(
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

      scheduleRevision: (questionId) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const revisions = state.profiles[profileId] || {};
          const existing = revisions[questionId];
          const today = new Date().toISOString().split('T')[0];

          if (existing) {
            return state; // Already scheduled/in progress or completed
          }

          const revisionCount = 0;
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + REVISION_INTERVALS[0]);

          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...revisions,
                [questionId]: {
                  revisionCount,
                  nextRevisionDate: nextDate.toISOString().split('T')[0],
                  scheduledDate: today,
                  history: [],
                },
              },
            },
          };
        });
      },

      completeRevision: (questionId) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const revisions = state.profiles[profileId] || {};
          const revision = revisions[questionId];
          if (!revision) return state;

          const today = new Date().toISOString().split('T')[0];
          const newCount = revision.revisionCount + 1;

          if (newCount >= REVISION_INTERVALS.length) {
            // All revisions complete
            return {
              profiles: {
                ...state.profiles,
                [profileId]: {
                  ...revisions,
                  [questionId]: {
                    ...revision,
                    revisionCount: newCount,
                    nextRevisionDate: null,
                    completed: true,
                    history: [...(revision.history || []), { date: today, revisionNumber: newCount }],
                  },
                },
              },
            };
          }

          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + REVISION_INTERVALS[newCount]);

          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...revisions,
                [questionId]: {
                  ...revision,
                  revisionCount: newCount,
                  nextRevisionDate: nextDate.toISOString().split('T')[0],
                  history: [...(revision.history || []), { date: today, revisionNumber: newCount }],
                },
              },
            },
          };
        });
      },

      getDueRevisions: () => {
        const state = get();
        const profileId = state.activeProfileId;
        const revisions = state.profiles[profileId] || {};
        const today = new Date().toISOString().split('T')[0];
        return Object.entries(revisions)
          .filter(([, rev]) => rev.nextRevisionDate && rev.nextRevisionDate <= today && !rev.completed)
          .map(([id, rev]) => ({ questionId: parseInt(id), ...rev }));
      },

      getUpcomingRevisions: () => {
        const state = get();
        const profileId = state.activeProfileId;
        const revisions = state.profiles[profileId] || {};
        const today = new Date().toISOString().split('T')[0];
        return Object.entries(revisions)
          .filter(([, rev]) => rev.nextRevisionDate && rev.nextRevisionDate > today && !rev.completed)
          .sort((a, b) => a[1].nextRevisionDate.localeCompare(b[1].nextRevisionDate))
          .map(([id, rev]) => ({ questionId: parseInt(id), ...rev }));
      },

      getRevision: (questionId) => {
        const state = get();
        const profileId = state.activeProfileId;
        return (state.profiles[profileId] || {})[questionId] || null;
      },

      removeRevision: (questionId) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const revisions = { ...(state.profiles[profileId] || {}) };
          delete revisions[questionId];
          return {
            profiles: {
              ...state.profiles,
              [profileId]: revisions,
            },
          };
        });
      },

      clearStore: () => {
        set({
          activeProfileId: 'default',
          profiles: {
            'default': {}
          }
        });
      },
    }),
    { name: 'dsa-revisions-v2' }
  )
);

export { REVISION_INTERVALS };
export default useRevisionStore;
