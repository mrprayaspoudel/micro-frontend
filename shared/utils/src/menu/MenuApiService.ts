import { MenuAccessControl, UserPermissions, ModuleMenu } from './MenuAccessControl';

/**
 * Menu API Service
 * Handles loading menu data and providing menu access functionality
 */
export class MenuApiService {
  private static instance: MenuApiService;
  private menuAccessControl: MenuAccessControl | null = null;

  private constructor() {}

  static getInstance(): MenuApiService {
    if (!MenuApiService.instance) {
      MenuApiService.instance = new MenuApiService();
    }
    return MenuApiService.instance;
  }

  /**
   * Initialize the menu system with data
   */
  async initialize(): Promise<void> {
    try {
      // Load permissions and menu data
      const [permissions, menus] = await Promise.all([
        this.loadUserPermissions(),
        this.loadModuleMenus()
      ]);

      this.menuAccessControl = new MenuAccessControl(permissions, menus);
    } catch (error) {
      console.error('Failed to initialize menu system:', error);
      throw error;
    }
  }

  /**
   * Load user permissions from backend
   */
  private async loadUserPermissions(): Promise<UserPermissions> {
    const response = await fetch('/backends/user-permissions.json');
    if (!response.ok) {
      throw new Error('Failed to load user permissions');
    }
    return response.json();
  }

  /**
   * Load module menus from backend
   */
  private async loadModuleMenus(): Promise<Record<string, ModuleMenu>> {
    const response = await fetch('/backends/module-menus.json');
    if (!response.ok) {
      throw new Error('Failed to load module menus');
    }
    return response.json();
  }

  /**
   * Get menu access control instance
   */
  private getMenuAccessControl(): MenuAccessControl {
    if (!this.menuAccessControl) {
      throw new Error('Menu system not initialized. Call initialize() first.');
    }
    return this.menuAccessControl;
  }

  /**
   * Get accessible menus for a user in a module
   */
  getUserMenus(userEmail: string, moduleId: string) {
    return this.getMenuAccessControl().getAccessibleMenus(userEmail, moduleId);
  }

  /**
   * Check if user can access a module
   */
  canUserAccessModule(userEmail: string, moduleId: string): boolean {
    return this.getMenuAccessControl().canAccessModule(userEmail, moduleId);
  }

  /**
   * Check if user can access a specific menu item
   */
  canUserAccessMenuItem(userEmail: string, moduleId: string, menuPath: string): boolean {
    return this.getMenuAccessControl().canAccessMenuItem(userEmail, moduleId, menuPath);
  }

  /**
   * Get user's role in a module
   */
  getUserModuleRole(userEmail: string, moduleId: string): string | null {
    return this.getMenuAccessControl().getUserModuleRole(userEmail, moduleId);
  }

  /**
   * Get user access information
   */
  getUserAccessInfo(userEmail: string) {
    return this.getMenuAccessControl().getUserAccessInfo(userEmail);
  }

  /**
   * Get breadcrumb for a menu path
   */
  getMenuBreadcrumb(userEmail: string, moduleId: string, menuPath: string) {
    return this.getMenuAccessControl().getMenuBreadcrumb(userEmail, moduleId, menuPath);
  }
}

// Export singleton instance
export const menuApiService = MenuApiService.getInstance();
