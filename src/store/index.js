import { create } from 'zustand';

export const useStore = create((set, get) => ({
  user: null,
  userProfile: null,
  theme: localStorage.getItem('theme') || 'light',

  setUser: (user) => set({ user }),
  
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  // Partial update - merges with existing profile
  updateProfile: (updates) => set((state) => ({
    userProfile: state.userProfile ? { ...state.userProfile, ...updates } : updates
  })),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
}));
