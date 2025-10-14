import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isUser: () => boolean;
  canAssignTickets: () => boolean;
  canManageStages: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  setCurrentUser: (user) => set({ 
    currentUser: user, 
    isAuthenticated: !!user 
  }),

  isAdmin: () => {
    const user = get().currentUser;
    return user?.role === UserRole.ADMIN;
  },

  isManager: () => {
    const user = get().currentUser;
    return user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;
  },

  isUser: () => {
    const user = get().currentUser;
    return user?.role === UserRole.USER;
  },

  canAssignTickets: () => {
    return get().isManager();
  },

  canManageStages: () => {
    return get().isAdmin();
  },
}));
