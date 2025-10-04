
import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper } from '@shared/ui-components';
import { useAppStore } from '@shared/state';
import { hrTheme } from './theme';
import EmployeeList from './pages/EmployeeList';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';

interface HRAppProps {
  basename?: string;
}

const HRApp = ({ basename }: HRAppProps) => {
  const { initializeAppState } = useAppStore();
  
  // Initialize app state when HR module loads
  useEffect(() => {
    initializeAppState();
  }, [initializeAppState]);

  // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const currentHost = window.location.hostname;
  const isStandalone = currentPort === '3003';
  
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <SafeWrapper fallback={<div>Loading HR...</div>}>
        <ThemeProvider moduleTheme={hrTheme}>
        <div className="hr-app">
          <MenuBar 
            moduleId="hr" 
            currentPath={location.pathname}
          />
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
      <BrowserRouter basename="/hr">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host, just return content (host router handles navigation)
  return <AppContent />;
};

export default HRApp;
