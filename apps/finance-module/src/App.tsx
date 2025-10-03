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
  // When loaded via module federation from host, we should not use BrowserRouter
  const isStandalone = window.location.port === '3004';
  const isEmbedded = window.location.port === '3000' || basename !== undefined;
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={financeTheme}>
      <div className="finance-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="*" element={isStandalone ? <Navigate to="/finance" replace /> : <Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Only use BrowserRouter when running standalone on port 3004
  if (isStandalone && !isEmbedded) {
    return (
      <BrowserRouter basename="/finance">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host or running in preview mode for federation, no router wrapper needed
  return <AppContent />;
};

export default FinanceApp;
