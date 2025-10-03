import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@shared/state';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import SearchResults from './pages/SearchResults';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RemoteErrorBoundary from './components/RemoteErrorBoundary/RemoteErrorBoundary';
import { initializeModuleRegistry } from './utils/ModuleRegistry';

// Lazy load micro frontends
const CRMApp = React.lazy(() => import('crm-app/App'));
const InventoryApp = React.lazy(() => import('inventory-app/App'));
const HRApp = React.lazy(() => import('hr-app/App'));
const FinanceApp = React.lazy(() => import('finance-app/App'));

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    
    // Initialize module registry for runtime loading
    if (process.env.NODE_ENV === 'development') {
      initializeModuleRegistry();
    }
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
          />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="company/search" element={<SearchResults />} />
              <Route path="company/:id" element={<CompanyProfile />} />
              
              {/* Micro frontend routes */}
              <Route 
                path="crm/*" 
                element={
                  <RemoteErrorBoundary remoteName="CRM">
                    <Suspense fallback={<LoadingSpinner />}>
                      <CRMApp />
                    </Suspense>
                  </RemoteErrorBoundary>
                } 
              />
              <Route 
                path="inventory/*" 
                element={
                  <RemoteErrorBoundary remoteName="Inventory">
                    <Suspense fallback={<LoadingSpinner />}>
                      <InventoryApp />
                    </Suspense>
                  </RemoteErrorBoundary>
                } 
              />
              <Route 
                path="hr/*" 
                element={
                  <RemoteErrorBoundary remoteName="HR">
                    <Suspense fallback={<LoadingSpinner />}>
                      <HRApp />
                    </Suspense>
                  </RemoteErrorBoundary>
                } 
              />
              <Route 
                path="finance/*" 
                element={
                  <RemoteErrorBoundary remoteName="Finance">
                    <Suspense fallback={<LoadingSpinner />}>
                      <FinanceApp />
                    </Suspense>
                  </RemoteErrorBoundary>
                } 
              />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
