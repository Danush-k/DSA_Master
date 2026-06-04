import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        set({ theme: newTheme });
      },
      initTheme: () => {
        document.documentElement.setAttribute('data-theme', get().theme);
      },
    }),
    { name: 'dsa-theme' }
  )
);

export default useThemeStore;
