import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper } from '@shared/ui-components';
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
  
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <SafeWrapper fallback={<div>Loading Finance...</div>}>
        <ThemeProvider moduleTheme={financeTheme}>
        <div className="finance-app">
          <MenuBar 
            moduleId="finance" 
            currentPath={location.pathname}
          />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </ThemeProvider>
      </SafeWrapper>
    );
  };

  // Use BrowserRouter with /finance basename when running standalone
  if (isStandalone) {
    return (
      <BrowserRouter basename="/finance">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host, just return content (host router handles navigation)
  return <AppContent />;
};

export default FinanceApp;
