import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User as SharedUser } from '@shared/state';

interface User {
  email: string;
  name: string;
  role: string;
}

interface StandaloneAuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const StandaloneAuthContext = createContext<StandaloneAuthContextType | null>(null);

// Default test user for standalone mode
const DEFAULT_TEST_USER: User = {
  email: 'admin@techcorp.com',
  name: 'Admin User',
  role: 'admin'
};

interface StandaloneAuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication context for standalone module development
 * This is only used when modules run independently on their own ports
 */
export const StandaloneAuthProvider: React.FC<StandaloneAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login with default test user for standalone mode
    const savedUser = localStorage.getItem('standalone_user');
    console.log('StandaloneAuth: Loading user from localStorage:', savedUser);
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('StandaloneAuth: Setting user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch {
        console.log('StandaloneAuth: Failed to parse saved user, using default');
        setUser(DEFAULT_TEST_USER);
        localStorage.setItem('standalone_user', JSON.stringify(DEFAULT_TEST_USER));
      }
    } else {
      console.log('StandaloneAuth: No saved user, using default:', DEFAULT_TEST_USER);
      setUser(DEFAULT_TEST_USER);
      localStorage.setItem('standalone_user', JSON.stringify(DEFAULT_TEST_USER));
    }
  }, []);

  const login = (email: string) => {
    const testUser = { ...DEFAULT_TEST_USER, email };
    setUser(testUser);
    localStorage.setItem('standalone_user', JSON.stringify(testUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('standalone_user');
  };

  const contextValue: StandaloneAuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <StandaloneAuthContext.Provider value={contextValue}>
      {children}
    </StandaloneAuthContext.Provider>
  );
};

export const useStandaloneAuth = () => {
  const context = useContext(StandaloneAuthContext);
  if (!context) {
    throw new Error('useStandaloneAuth must be used within a StandaloneAuthProvider');
  }
  return context;
};

// Helper function to convert SharedUser to local User type
const mapSharedUserToLocal = (sharedUser: SharedUser): User => ({
  email: sharedUser.email,
  name: `${sharedUser.firstName} ${sharedUser.lastName}`.trim(),
  role: sharedUser.role
});

/**
 * Hook that provides user context for both standalone and embedded modes
 */
export const useModuleAuth = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [sharedUser, setSharedUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Detect if running standalone
    const port = window.location.port;
    const standaloneMode = ['3001', '3002', '3003', '3004'].includes(port);
    console.log('useModuleAuth: Detected port:', port, 'isStandalone:', standaloneMode);
    setIsStandalone(standaloneMode);

    // Try to get user from shared state (when embedded in host)
    if (!standaloneMode) {
      const loadSharedUser = async () => {
        try {
          console.log('useModuleAuth: Trying to get user from shared state');
          // Use dynamic import instead of require for ES modules
          const { useAuthStore } = await import('@shared/state');
          const user = useAuthStore().user;
          console.log('useModuleAuth: SharedUser:', user);
          
          if (user) {
            // Map SharedUser to local User type
            const localUser = mapSharedUserToLocal(user);
            setSharedUser(localUser);
          } else {
            setSharedUser(null);
          }
        } catch (error) {
          console.log('useModuleAuth: Failed to get shared user:', error);
          // Shared state not available, continue with standalone auth
          setSharedUser(null);
        }
      };
      
      loadSharedUser();
    }
  }, []);

  // Try to get user from standalone context
  let standaloneUser = null;
  try {
    console.log('useModuleAuth: Trying to get user from standalone context');
    standaloneUser = useStandaloneAuth().user;
    console.log('useModuleAuth: StandaloneUser:', standaloneUser);
  } catch (error) {
    console.log('useModuleAuth: Failed to get standalone user:', error);
    // Not in standalone provider context
  }

  const finalUser = sharedUser || standaloneUser;
  console.log('useModuleAuth: Final user:', finalUser, 'isStandalone:', isStandalone);

  // Return the appropriate user based on context
  return {
    user: finalUser,
    isStandalone,
    isAuthenticated: !!finalUser
  };
};
