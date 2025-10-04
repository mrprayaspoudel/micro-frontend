import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AppState, Company, MenuItem, Notification } from '../types';

interface AppActions {
  setSelectedCompany: (company: Company | null) => void;
  setActiveModule: (moduleId: string | null) => void;
  setModuleMenus: (moduleId: string, menus: MenuItem[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationAsRead: (notificationId: string) => void;
  setSearchResults: (results: Company[]) => void;
  setSearching: (searching: boolean) => void;
  clearSearchResults: () => void;
  initializeAppState: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  immer((set, get) => ({
    // State
    selectedCompany: null,
    activeModule: null,
    moduleMenus: {},
    notifications: [],
    unreadNotificationsCount: 0,
    searchResults: [],
    isSearching: false,

    // Actions
    setSelectedCompany: (company: Company | null) => {
      set((state) => {
        state.selectedCompany = company;
        
        // Persist company selection to localStorage
        if (company) {
          localStorage.setItem('selectedCompany', JSON.stringify(company));
          
          // Load notifications for the selected company
          // This would typically be an API call
          const mockNotifications: Notification[] = [
            {
              id: '1',
              title: 'System Maintenance Scheduled',
              message: 'System maintenance is scheduled for tonight from 10 PM to 2 AM EST.',
              type: 'warning',
              priority: 'high',
              isRead: false,
              createdAt: new Date().toISOString()
            }
          ];
          state.notifications = mockNotifications;
          state.unreadNotificationsCount = mockNotifications.filter(n => !n.isRead).length;
        } else {
          // Clear company from localStorage when null
          localStorage.removeItem('selectedCompany');
          state.notifications = [];
          state.unreadNotificationsCount = 0;
        }
      });
    },

    setActiveModule: (moduleId: string | null) => {
      set((state) => {
        state.activeModule = moduleId;
      });
    },

    setModuleMenus: (moduleId: string, menus: MenuItem[]) => {
      set((state) => {
        state.moduleMenus[moduleId] = menus;
      });
    },

    setNotifications: (notifications: Notification[]) => {
      set((state) => {
        state.notifications = notifications;
        state.unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
      });
    },

    markNotificationAsRead: (notificationId: string) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadNotificationsCount = Math.max(0, state.unreadNotificationsCount - 1);
        }
      });
    },

    setSearchResults: (results: Company[]) => {
      set((state) => {
        state.searchResults = results;
        state.isSearching = false;
      });
    },

    setSearching: (searching: boolean) => {
      set((state) => {
        state.isSearching = searching;
      });
    },

    clearSearchResults: () => {
      set((state) => {
        state.searchResults = [];
        state.isSearching = false;
      });
    },

    initializeAppState: () => {
      // Load selected company from localStorage
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (selectedCompanyStr) {
        try {
          const company = JSON.parse(selectedCompanyStr);
          set((state) => {
            state.selectedCompany = company;
            // Load notifications for the restored company
            const mockNotifications: Notification[] = [
              {
                id: '1',
                title: 'System Maintenance Scheduled',
                message: 'System maintenance is scheduled for tonight from 10 PM to 2 AM EST.',
                type: 'warning',
                priority: 'high',
                isRead: false,
                createdAt: new Date().toISOString()
              }
            ];
            state.notifications = mockNotifications;
            state.unreadNotificationsCount = mockNotifications.filter(n => !n.isRead).length;
          });
        } catch (error) {
          // Failed to parse company data, remove invalid data
          localStorage.removeItem('selectedCompany');
        }
      }
    }
  }))
);
