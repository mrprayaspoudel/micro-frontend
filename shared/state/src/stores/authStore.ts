import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AuthState, User, Company } from '../types';

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setCompany: (company: Company) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set, get) => ({
    // State
    user: null,
    company: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true for initialization
    error: null,

    // Actions
    login: async (email: string, password: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Mock API call - replace with actual API
        const mockUser: User = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Admin',
          role: 'admin',
          companyId: '1',
          avatar: 'https://placehold.co/100x100?text=JA',
          permissions: ['read', 'write', 'delete', 'admin'],
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z'
        };

        // Remove default company - user must select one

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        set((state) => {
          state.user = mockUser;
          state.company = null; // No default company
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });

        // Store in localStorage (no company stored here)
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(mockUser));

      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = 'Login failed. Please try again.';
        });
      }
    },

    logout: () => {
      set((state) => {
        state.user = null;
        state.company = null;
        state.isAuthenticated = false;
        state.error = null;
      });

      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedCompany'); // Clear selected company on logout
    },

    setUser: (user: User) => {
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
      });
    },

    setCompany: (company: Company) => {
      set((state) => {
        state.company = company;
      });
    },

    setLoading: (loading: boolean) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error: string | null) => {
      set((state) => {
        state.error = error;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    initializeAuth: () => {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          
          set((state) => {
            state.user = user;
            state.company = null; // Company will be loaded separately by app store
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          // Failed to parse stored auth data, clear invalid data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          
          set((state) => {
            state.isLoading = false;
          });
        }
      } else {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
  }))
);
