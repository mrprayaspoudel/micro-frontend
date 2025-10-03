import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@shared/ui-components';
import { inventoryTheme } from './theme';
import ProductList from './pages/ProductList';
import StockManagement from './pages/StockManagement';
import Dashboard from './pages/Dashboard';

interface InventoryAppProps {
  basename?: string;
}

const InventoryApp: React.FC<InventoryAppProps> = ({ basename }) => {
  // Check if we're running as a standalone app or as a micro frontend
  // When loaded via module federation from host, we should not use BrowserRouter
  const isStandalone = window.location.port === '3002';
  const isEmbedded = window.location.port === '3000' || basename !== undefined;
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={inventoryTheme}>
      <div className="inventory-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="stock" element={<StockManagement />} />
          <Route path="*" element={isStandalone ? <Navigate to="/inventory" replace /> : <Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Only use BrowserRouter when running standalone on port 3002
  if (isStandalone && !isEmbedded) {
    return (
      <BrowserRouter basename="/inventory">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host or running in preview mode for federation, no router wrapper needed
  return <AppContent />;
};

export default InventoryApp;
