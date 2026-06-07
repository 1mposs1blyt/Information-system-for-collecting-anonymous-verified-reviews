import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: number;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
