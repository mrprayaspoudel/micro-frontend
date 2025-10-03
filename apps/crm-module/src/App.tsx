import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@shared/ui-components';
import { crmTheme } from './theme';
import CustomerList from './pages/CustomerList';
import CustomerDetails from './pages/CustomerDetails';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';

interface CRMAppProps {
  basename?: string;
}

const CRMApp: React.FC<CRMAppProps> = ({ basename }) => {
  // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const isStandalone = currentPort === '3001';
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={crmTheme}>
      <div className="crm-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="leads" element={<Leads />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Use BrowserRouter with /crm basename when running standalone
  if (isStandalone) {
    return (
      <BrowserRouter basename="/crm">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host, just return content (host router handles navigation)
  return <AppContent />;
};

export default CRMApp;
