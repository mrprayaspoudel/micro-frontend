import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper, StandaloneAuthProvider, useModuleAuth, StandaloneUserSwitcher } from '@shared/ui-components';
import { hrTheme } from './theme';
import EmployeeList from './pages/EmployeeList';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';

interface HRAppProps {
  basename?: string;
}

const HRApp: React.FC<HRAppProps> = ({ basename }) => {
  // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const isStandalone = currentPort === '3003';
  
  const AppContent = () => {
    const location = useLocation();
    const { user } = useModuleAuth();
    
    return (
      <SafeWrapper fallback={<div>Loading HR...</div>}>
        <ThemeProvider moduleTheme={hrTheme}>
        <div className="hr-app">
          {user && (
            <MenuBar 
              userEmail={user.email} 
              moduleId="hr" 
              currentPath={location.pathname}
            />
          )}
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </ThemeProvider>
      </SafeWrapper>
    );
  };

  // Use BrowserRouter with /hr basename when running standalone
  if (isStandalone) {
    return (
      <StandaloneAuthProvider>
        <StandaloneUserSwitcher />
        <BrowserRouter basename="/hr">
          <AppContent />
        </BrowserRouter>
      </StandaloneAuthProvider>
    );
  }

  // When embedded in host, just return content (host router handles navigation)
  return <AppContent />;
};

export default HRApp;
