import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotesStore = create(
  persist(
    (set, get) => ({
      // { [questionId]: { keyIdea, mistakes, optimalApproach, timeComplexity, spaceComplexity, notes, interviewLearnings } }
      notes: {},

      saveNote: (questionId, noteData) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [questionId]: {
              ...state.notes[questionId],
              ...noteData,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      getNote: (questionId) => {
        return get().notes[questionId] || null;
      },

      deleteNote: (questionId) => {
        set((state) => {
          const notes = { ...state.notes };
          delete notes[questionId];
          return { notes };
        });
      },

      hasNote: (questionId) => {
        const note = get().notes[questionId];
        if (!note) return false;
        return Object.values(note).some(v => v && v !== '' && v !== note.updatedAt);
      },
    }),
    { name: 'dsa-notes' }
  )
);

export default useNotesStore;
