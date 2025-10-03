import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
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
