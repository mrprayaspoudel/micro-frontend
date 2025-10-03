import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
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
  const currentPort = window.location.port;
  const isStandalone = currentPort === '3002';
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={inventoryTheme}>
      <div className="inventory-app">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="stock" element={<StockManagement />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );

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
