import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  userProfile: null,
  theme: localStorage.getItem('theme') || 'light',

  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
}));
