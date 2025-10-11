
import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper } from '@shared/ui-components';
import { useAppStore } from '@shared/state';
import { inventoryTheme } from './theme';
import ProductList from './pages/ProductList';
import StockManagement from './pages/StockManagement';
import Dashboard from './pages/Dashboard';

interface InventoryAppProps {
  basename?: string;
}

const InventoryApp = ({ basename }: InventoryAppProps) => {
  const { initializeAppState } = useAppStore();
  
  // Initialize app state when Inventory module loads
  useEffect(() => {
    initializeAppState();
  }, [initializeAppState]);

  // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const currentHost = window.location.hostname;
  const isStandalone = currentPort === '3002';
  
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <SafeWrapper fallback={<div>Loading Inventory...</div>}>
        <ThemeProvider moduleTheme={inventoryTheme}>
        <div className="inventory-app">
          <MenuBar 
            moduleId="inventory" 
            currentPath={location.pathname}
          />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </ThemeProvider>
      </SafeWrapper>
    );
  };

  // Use BrowserRouter with /inventory basename when running standalone
  if (isStandalone) {
    return (
      <BrowserRouter basename="/inventory">
        <AppContent />
      </BrowserRouter>
    );
  }
  // When embedded in host, just return content (host router handles navigation)
  return <AppContent />;
};

export default InventoryApp;
