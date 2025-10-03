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
  // When loaded via module federation from host, we should not use BrowserRouter
  const isStandalone = window.location.port === '3003';
  const isEmbedded = window.location.port === '3000' || basename !== undefined;
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={hrTheme}>
      <div className="hr-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="*" element={isStandalone ? <Navigate to="/hr" replace /> : <Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Only use BrowserRouter when running standalone on port 3003
  if (isStandalone && !isEmbedded) {
    return (
      <BrowserRouter basename="/hr">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host or running in preview mode for federation, no router wrapper needed
  return <AppContent />;
};

export default HRApp;
