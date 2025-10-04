
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper } from '@shared/ui-components';
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

const CRMApp = ({ basename }: CRMAppProps) => {
    // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const currentHost = window.location.hostname;
  const isStandalone = currentPort === '3001';
  
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <SafeWrapper fallback={<div>Loading CRM...</div>}>
        <ThemeProvider moduleTheme={crmTheme}>
        <div className="crm-app">
          <MenuBar 
            moduleId="crm" 
            currentPath={location.pathname}
          />
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
      </SafeWrapper>
    );
  };

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
