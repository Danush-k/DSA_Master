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
};

const useProgressStore = create(
  persist(
    (set, get) => ({
      activeProfileId: 'default',
      profiles: {
        'default': {
          name: 'Danush',
          avatar: '#FFA116',
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

          let { currentStreak, longestStreak, lastSolveDate } = profile;
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
          
          // Generate unique custom ID starting at 10000
          const newId = 10000 + customQuestions.length + 1;
          const newQuestion = {
            id: newId,
            num: `C${customQuestions.length + 1}`,
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
                customQuestions
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
              avatar: '#FFA116',
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
