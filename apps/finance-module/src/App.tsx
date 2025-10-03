import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@shared/ui-components';
import { financeTheme } from './theme';
import Accounts from './pages/Accounts';
import Invoices from './pages/Invoices';
import Dashboard from './pages/Dashboard';

interface FinanceAppProps {
  basename?: string;
}

const FinanceApp: React.FC<FinanceAppProps> = ({ basename }) => {
  // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const isStandalone = currentPort === '3004';
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={financeTheme}>
      <div className="finance-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="invoices" element={<Invoices />} />
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

export default FinanceApp;
