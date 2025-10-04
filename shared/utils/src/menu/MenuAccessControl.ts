// Simplified menu types for app-specific menu system

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  order: number;
  children?: MenuItem[];
}

export interface ModuleMenu {
  moduleId: string;
  moduleName: string;
  menus: MenuItem[];
}
