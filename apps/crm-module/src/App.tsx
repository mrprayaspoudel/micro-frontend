import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper, StandaloneAuthProvider, useModuleAuth, StandaloneUserSwitcher } from '@shared/ui-components';
import styled from 'styled-components';
import { crmTheme } from './theme';

const DebugContainer = styled.div`
  padding: 10px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  margin: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
`;
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
  const currentHost = window.location.hostname;
  const isStandalone = currentPort === '3001' && currentHost === 'localhost';
  
  console.log('CRM App Init:', { currentPort, currentHost, isStandalone, basename, location: window.location.href });
  
  const AppContentWithAuth = () => {
    const location = useLocation();
    const { user, isAuthenticated } = useModuleAuth();
    
    // Debug logging
    console.log('CRM App Debug (Standalone Mode):', { user, isAuthenticated, location: location.pathname, currentPort });
    
    return (
      <SafeWrapper fallback={<div>Loading CRM...</div>}>
        <ThemeProvider moduleTheme={crmTheme}>
        <div className="crm-app">
          {user ? (
            <MenuBar 
              userEmail={user.email} 
              moduleId="crm" 
              currentPath={location.pathname}
            />
          ) : (
            <DebugContainer>
              Standalone Mode Debug: No user found - isAuthenticated: {isAuthenticated?.toString() || 'undefined'}, port: {currentPort}
              <br />
              Expected: Should auto-login with admin@techcorp.com
              <br />
              Check StandaloneAuthProvider and useModuleAuth hook
            </DebugContainer>
          )}
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

  const AppContentWithoutAuth = () => {
    const location = useLocation();
    // For embedded mode, try to get user from host auth store
    let hostUser = null;
    try {
      const { useAuthStore } = require('@shared/state');
      hostUser = useAuthStore().user;
    } catch {
      // Host auth not available
    }
    
    console.log('CRM App (Embedded Mode) Debug:', { hostUser, location: location.pathname, currentPort });
    
    return (
      <SafeWrapper fallback={<div>Loading CRM...</div>}>
        <ThemeProvider moduleTheme={crmTheme}>
        <div className="crm-app">
          {hostUser ? (
            <MenuBar 
              userEmail={hostUser.email} 
              moduleId="crm" 
              currentPath={location.pathname}
            />
          ) : (
            <DebugContainer>
              Embedded Mode Debug: No host user found
              <br />
              This should only show when loaded via host app (port 3000)
              <br />
              Current port: {currentPort} - Expected port: 3000
            </DebugContainer>
          )}
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
      <StandaloneAuthProvider>
        <StandaloneUserSwitcher />
        <BrowserRouter basename="/crm">
          <AppContentWithAuth />
        </BrowserRouter>
      </StandaloneAuthProvider>
    );
  }

  // When embedded in host, just return content (host router handles navigation)
  return <AppContentWithoutAuth />;
};

export default CRMApp;
