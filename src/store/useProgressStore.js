import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProgressStore = create(
  persist(
    (set, get) => ({
      // Question status: { [questionId]: 'solved' | 'attempted' | 'revisit' }
      questionStatus: {},
      // Daily solve counts: { 'YYYY-MM-DD': count }
      dailySolves: {},
      // Bookmarks as array of ids
      bookmarks: [],
      // Streak
      currentStreak: 0,
      longestStreak: 0,
      lastSolveDate: null,

      // Toggle question status
      toggleStatus: (questionId, status) => {
        set((state) => {
          const current = state.questionStatus[questionId];
          const newStatus = { ...state.questionStatus };
          const today = new Date().toISOString().split('T')[0];
          const newDailySolves = { ...state.dailySolves };

          if (current === status) {
            delete newStatus[questionId];
            if (status === 'solved' && (newDailySolves[today] || 0) > 0) {
              newDailySolves[today] = (newDailySolves[today] || 0) - 1;
            }
          } else {
            if (status === 'solved' && current !== 'solved') {
              newDailySolves[today] = (newDailySolves[today] || 0) + 1;
            }
            if (current === 'solved' && status !== 'solved') {
              if ((newDailySolves[today] || 0) > 0) {
                newDailySolves[today] = (newDailySolves[today] || 0) - 1;
              }
            }
            newStatus[questionId] = status;
          }

          let { currentStreak, longestStreak, lastSolveDate } = state;
          if (status === 'solved' && current !== status) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastSolveDate === yesterdayStr) {
              currentStreak += 1;
            } else if (lastSolveDate !== today) {
              currentStreak = 1;
            }
            lastSolveDate = today;
            longestStreak = Math.max(longestStreak, currentStreak);
          }

          return {
            questionStatus: newStatus,
            dailySolves: newDailySolves,
            currentStreak,
            longestStreak,
            lastSolveDate,
          };
        });
      },

      // Toggle bookmark
      toggleBookmark: (questionId) => {
        set((state) => {
          const bookmarks = [...state.bookmarks];
          const idx = bookmarks.indexOf(questionId);
          if (idx >= 0) {
            bookmarks.splice(idx, 1);
          } else {
            bookmarks.push(questionId);
          }
          return { bookmarks };
        });
      },

      // Export
      exportData: () => {
        const state = get();
        return JSON.stringify({
          questionStatus: state.questionStatus,
          dailySolves: state.dailySolves,
          bookmarks: state.bookmarks,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastSolveDate: state.lastSolveDate,
        });
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          set(data);
          return true;
        } catch {
          return false;
        }
      },

      resetProgress: () => {
        set({
          questionStatus: {},
          dailySolves: {},
          bookmarks: [],
          currentStreak: 0,
          longestStreak: 0,
          lastSolveDate: null,
        });
      },
    }),
    { name: 'dsa-progress' }
  )
);

export default useProgressStore;
