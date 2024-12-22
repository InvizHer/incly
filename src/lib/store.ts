import { create } from 'zustand';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));