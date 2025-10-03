import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
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
  // When loaded via module federation from host, we should not use BrowserRouter
  const isStandalone = window.location.port === '3001';
  const isEmbedded = window.location.port === '3000' || basename !== undefined;
  
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
          <Route path="*" element={isStandalone ? <Navigate to="/crm" replace /> : <Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Only use BrowserRouter when running standalone on port 3001
  if (isStandalone && !isEmbedded) {
    return (
      <BrowserRouter basename="/crm">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host or running in preview mode for federation, no router wrapper needed
  return <AppContent />;
};

export default CRMApp;
