import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_PROFILE_STATE = {
  questionStatus: {},
  dailySolves: {},
  bookmarks: [],
  currentStreak: 0,
  longestStreak: 0,
  lastSolveDate: null,
  customQuestions: [],
  solveHistory: [],
  nextCustomId: 10001,
};

const useProgressStore = create(
  persist(
    (set, get) => ({
      activeProfileId: 'default',
      profiles: {
        'default': {
          name: 'Danush',
          avatar: '🦊',
          ...DEFAULT_PROFILE_STATE
        }
      },

      // Profile Actions
      switchProfile: (profileId) => {
        set((state) => {
          if (!state.profiles[profileId]) {
            return state;
          }
          return { activeProfileId: profileId };
        });
      },

      createProfile: (profileId, name, avatar) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profileId]: {
              name,
              avatar: avatar || '#FFA116',
              ...DEFAULT_PROFILE_STATE
            }
          }
        }));
      },

      deleteProfile: (profileId) => {
        set((state) => {
          const profileIds = Object.keys(state.profiles);
          if (profileIds.length <= 1) return state;

          const newProfiles = { ...state.profiles };
          delete newProfiles[profileId];

          let nextActive = state.activeProfileId;
          if (state.activeProfileId === profileId) {
            nextActive = Object.keys(newProfiles)[0];
          }

          return {
            profiles: newProfiles,
            activeProfileId: nextActive
          };
        });
      },

      // Toggle question status
      toggleStatus: (questionId, status) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const profile = state.profiles[profileId] || { ...DEFAULT_PROFILE_STATE };
          const current = profile.questionStatus[questionId];
          const newStatus = { ...profile.questionStatus };
          const today = new Date().toISOString().split('T')[0];
          const newDailySolves = { ...profile.dailySolves };
          let newSolveHistory = [...(profile.solveHistory || [])];

          if (current === status) {
            delete newStatus[questionId];
            if (status === 'solved' && (newDailySolves[today] || 0) > 0) {
              newDailySolves[today] = (newDailySolves[today] || 0) - 1;
            }
            newSolveHistory = newSolveHistory.filter(item => item.questionId !== questionId);
          } else {
            if (status === 'solved' && current !== 'solved') {
              newDailySolves[today] = (newDailySolves[today] || 0) + 1;
              newSolveHistory = [
                { questionId, solvedAt: new Date().toISOString() },
                ...newSolveHistory.filter(item => item.questionId !== questionId)
              ].slice(0, 50);
            }
            if (current === 'solved' && status !== 'solved') {
              if ((newDailySolves[today] || 0) > 0) {
                newDailySolves[today] = (newDailySolves[today] || 0) - 1;
              }
              newSolveHistory = newSolveHistory.filter(item => item.questionId !== questionId);
            }
            newStatus[questionId] = status;
          }

          // Recalculate streak from dailySolves
          const sortedDates = Object.keys(newDailySolves)
            .filter(date => newDailySolves[date] > 0)
            .sort();

          let lastSolveDate = null;
          let currentStreak = 0;

          if (sortedDates.length > 0) {
            const lastDateStr = sortedDates[sortedDates.length - 1];
            const todayDate = new Date(today);
            const lastDate = new Date(lastDateStr);
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
              lastSolveDate = lastDateStr;
              currentStreak = 1;
              let checkDate = new Date(lastDate);
              while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                const checkDateStr = checkDate.toISOString().split('T')[0];
                if (newDailySolves[checkDateStr] > 0) {
                  currentStreak++;
                } else {
                  break;
                }
              }
            } else {
              lastSolveDate = lastDateStr;
              currentStreak = 0;
            }
          }

          const longestStreak = Math.max(profile.longestStreak || 0, currentStreak);

          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...profile,
                questionStatus: newStatus,
                dailySolves: newDailySolves,
                currentStreak,
                longestStreak,
                lastSolveDate,
                solveHistory: newSolveHistory
              }
            }
          };
        });
      },

      // Toggle bookmark
      toggleBookmark: (questionId) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const profile = state.profiles[profileId] || { ...DEFAULT_PROFILE_STATE };
          const bookmarks = [...(profile.bookmarks || [])];
          const idx = bookmarks.indexOf(questionId);
          if (idx >= 0) {
            bookmarks.splice(idx, 1);
          } else {
            bookmarks.push(questionId);
          }
          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...profile,
                bookmarks
              }
            }
          };
        });
      },

      // Add Custom Question
      addCustomQuestion: (questionData) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const profile = state.profiles[profileId] || { ...DEFAULT_PROFILE_STATE };
          const customQuestions = [...(profile.customQuestions || [])];
          
          // Generate unique custom ID
          const nextCustomId = profile.nextCustomId || (Math.max(10000, ...customQuestions.map(q => q.id)) + 1);
          const newId = nextCustomId;
          const newQuestion = {
            id: newId,
            num: `C${newId - 10000}`,
            isCustom: true,
            importance: 'Good to Know',
            companies: [],
            ...questionData
          };

          customQuestions.push(newQuestion);
          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...profile,
                customQuestions,
                nextCustomId: newId + 1
              }
            }
          };
        });
      },

      // Export/Import
      exportData: () => {
        const state = get();
        return JSON.stringify({
          profiles: state.profiles,
          activeProfileId: state.activeProfileId,
        });
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          if (data && data.profiles && data.activeProfileId) {
            set({
              profiles: data.profiles,
              activeProfileId: data.activeProfileId
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetProgress: () => {
        set((state) => {
          const profileId = state.activeProfileId;
          const profile = state.profiles[profileId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [profileId]: {
                ...profile,
                ...DEFAULT_PROFILE_STATE
              }
            }
          };
        });
      },

      clearStore: () => {
        set({
          activeProfileId: 'default',
          profiles: {
            'default': {
              name: 'Danush',
              avatar: '🦊',
              ...DEFAULT_PROFILE_STATE
            }
          }
        });
      },
    }),
    { name: 'dsa-progress-v2' }
  )
);

export default useProgressStore;
