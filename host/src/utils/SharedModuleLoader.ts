import React from 'react';

// Centralized module loader to eliminate duplicate lazy imports across components
export const SharedModuleLoader = {
  CRMApp: React.lazy(() => import('crm-app/App')),
  InventoryApp: React.lazy(() => import('inventory-app/App')),
  HRApp: React.lazy(() => import('hr-app/App')),
  FinanceApp: React.lazy(() => import('finance-app/App'))
};

// Helper function to get module component by ID
export const getModuleComponent = (moduleId: string) => {
  const moduleMap: Record<string, React.LazyExoticComponent<any>> = {
    'crm': SharedModuleLoader.CRMApp,
    'inventory': SharedModuleLoader.InventoryApp,
    'hr': SharedModuleLoader.HRApp,
    'finance': SharedModuleLoader.FinanceApp
  };

  return moduleMap[moduleId];
};
