// Menu data constants - this approach works in both dev and build modes
import menuDataImport from '../../../../backends/module-menus.json';
import { MenuItem } from './MenuAccessControl';

export interface ModuleMenuData {
  moduleId: string;
  moduleName: string;
  menus: MenuItem[];
}

export interface AllMenuData {
  [moduleId: string]: ModuleMenuData;
}

// Export the menu data with proper typing
export const menuData: AllMenuData = menuDataImport as AllMenuData;

// Helper function to get menu data for a specific module
export const getModuleMenuData = (moduleId: string): ModuleMenuData | null => {
  return menuData[moduleId] || null;
};

// Helper function to get menus for a specific module
export const getModuleMenus = (moduleId: string): MenuItem[] => {
  const moduleData = getModuleMenuData(moduleId);
  return moduleData?.menus || [];
};
