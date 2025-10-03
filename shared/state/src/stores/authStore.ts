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
          avatar: 'https://via.placeholder.com/100x100?text=JA',
          permissions: ['read', 'write', 'delete', 'admin'],
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z'
        };

        const mockCompany: Company = {
          id: '1',
          name: 'TechCorp Solutions',
          email: 'contact@techcorp.com',
          phone: '+1-555-0123',
          address: '123 Business Ave, Tech City, TC 12345',
          industry: 'Technology',
          employees: 250,
          founded: '2015',
          website: 'https://techcorp.com',
          description: 'Leading technology solutions provider',
          status: 'active',
          modules: ['crm', 'inventory', 'hr', 'finance'],
          subscription: {
            plan: 'enterprise',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            features: ['advanced-analytics', 'custom-integrations']
          }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        set((state) => {
          state.user = mockUser;
          state.company = mockCompany;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });

        // Store in localStorage
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('company', JSON.stringify(mockCompany));

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
      localStorage.removeItem('company');
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
      const companyStr = localStorage.getItem('company');

      if (token && userStr && companyStr) {
        try {
          const user = JSON.parse(userStr);
          const company = JSON.parse(companyStr);
          
          set((state) => {
            state.user = user;
            state.company = company;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          // Clear invalid data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('company');
          
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
