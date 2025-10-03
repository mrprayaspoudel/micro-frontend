import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@shared/ui-components';
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
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={hrTheme}>
      <div className="hr-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Use BrowserRouter with root basename when running standalone
  if (isStandalone) {
    return (
      <BrowserRouter basename="/">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host, no router wrapper needed (host handles routing)
  return <AppContent />;
};

export default HRApp;
