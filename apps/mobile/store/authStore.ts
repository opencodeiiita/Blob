import { create } from 'zustand';
import { saveToken, getToken, saveUser, getUser, clearAuth } from '@/utils/secureStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  hasToken: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<string | null>;
  setUserFromSession: (user: User) => Promise<void>;
  finishLoading: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasToken: false,
  user: null,
  isLoading: true,

  login: async (token: string, user: User) => {
    await Promise.all([saveToken(token), saveUser(user)]);
    set({ isAuthenticated: true, hasToken: true, user, isLoading: false });
  },

  logout: async () => {
    await clearAuth();
    set({ isAuthenticated: false, hasToken: false, user: null, isLoading: false });
  },

  initialize: async () => {
    const [token, user] = await Promise.all([getToken(), getUser()]);
    set({
      isAuthenticated: !!token,
      hasToken: !!token,
      user: user ?? null,
    });
    return token;
  },

  setUserFromSession: async (user: User) => {
    await saveUser(user);
    set({ user, isAuthenticated: true, hasToken: true });
  },

  finishLoading: () => set({ isLoading: false }),
}));
