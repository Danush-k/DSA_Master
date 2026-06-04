import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Spaced repetition intervals in days
const REVISION_INTERVALS = [1, 3, 7, 15, 30];

const useRevisionStore = create(
  persist(
    (set, get) => ({
      // { [questionId]: { revisionCount, nextRevisionDate, history: [{ date, revisionNumber }] } }
      revisions: {},

      // Mark question for revision (called when marking as solved)
      scheduleRevision: (questionId) => {
        set((state) => {
          const existing = state.revisions[questionId];
          const today = new Date().toISOString().split('T')[0];

          if (existing && existing.revisionCount >= REVISION_INTERVALS.length) {
            return state; // All revisions complete
          }

          const revisionCount = 0;
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + REVISION_INTERVALS[0]);

          return {
            revisions: {
              ...state.revisions,
              [questionId]: {
                revisionCount,
                nextRevisionDate: nextDate.toISOString().split('T')[0],
                scheduledDate: today,
                history: [],
              },
            },
          };
        });
      },

      // Complete a revision
      completeRevision: (questionId) => {
        set((state) => {
          const revision = state.revisions[questionId];
          if (!revision) return state;

          const today = new Date().toISOString().split('T')[0];
          const newCount = revision.revisionCount + 1;

          if (newCount >= REVISION_INTERVALS.length) {
            // All revisions complete
            return {
              revisions: {
                ...state.revisions,
                [questionId]: {
                  ...revision,
                  revisionCount: newCount,
                  nextRevisionDate: null,
                  completed: true,
                  history: [...(revision.history || []), { date: today, revisionNumber: newCount }],
                },
              },
            };
          }

          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + REVISION_INTERVALS[newCount]);

          return {
            revisions: {
              ...state.revisions,
              [questionId]: {
                ...revision,
                revisionCount: newCount,
                nextRevisionDate: nextDate.toISOString().split('T')[0],
                history: [...(revision.history || []), { date: today, revisionNumber: newCount }],
              },
            },
          };
        });
      },

      // Get questions due for revision today
      getDueRevisions: () => {
        const today = new Date().toISOString().split('T')[0];
        const revisions = get().revisions;
        return Object.entries(revisions)
          .filter(([, rev]) => rev.nextRevisionDate && rev.nextRevisionDate <= today && !rev.completed)
          .map(([id, rev]) => ({ questionId: parseInt(id), ...rev }));
      },

      // Get upcoming revisions
      getUpcomingRevisions: () => {
        const today = new Date().toISOString().split('T')[0];
        const revisions = get().revisions;
        return Object.entries(revisions)
          .filter(([, rev]) => rev.nextRevisionDate && rev.nextRevisionDate > today && !rev.completed)
          .sort((a, b) => a[1].nextRevisionDate.localeCompare(b[1].nextRevisionDate))
          .map(([id, rev]) => ({ questionId: parseInt(id), ...rev }));
      },

      getRevision: (questionId) => {
        return get().revisions[questionId] || null;
      },

      removeRevision: (questionId) => {
        set((state) => {
          const revisions = { ...state.revisions };
          delete revisions[questionId];
          return { revisions };
        });
      },
    }),
    { name: 'dsa-revisions' }
  )
);

export { REVISION_INTERVALS };
export default useRevisionStore;
