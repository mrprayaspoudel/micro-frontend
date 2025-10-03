// Menu access control types - no external dependencies needed

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  requiredRole: string;
  order: number;
  children?: MenuItem[];
}

export interface ModuleMenu {
  moduleId: string;
  moduleName: string;
  menus: MenuItem[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface UserPermissions {
  roles: Record<string, Role>;
  users: Record<string, {
    id: string;
    name: string;
    roles: string[];
    moduleAccess: Record<string, {
      hasAccess: boolean;
      role: string | null;
    }>;
  }>;
}

/**
 * Menu access control utility
 * Handles role-based menu filtering and permissions
 */
export class MenuAccessControl {
  private roles: Record<string, Role>;
  private userPermissions: UserPermissions['users'];
  private moduleMenus: Record<string, ModuleMenu>;

  constructor(
    permissions: UserPermissions,
    menus: Record<string, ModuleMenu>
  ) {
    this.roles = permissions.roles;
    this.userPermissions = permissions.users;
    this.moduleMenus = menus;
  }

  /**
   * Get role level for comparison
   */
  private getRoleLevel(roleId: string): number {
    return this.roles[roleId]?.level || 0;
  }

  /**
   * Check if user has access to a specific role level
   */
  private hasRoleAccess(userRole: string, requiredRole: string): boolean {
    const userLevel = this.getRoleLevel(userRole);
    const requiredLevel = this.getRoleLevel(requiredRole);
    return userLevel >= requiredLevel;
  }

  /**
   * Check if user has access to a module
   */
  canAccessModule(userEmail: string, moduleId: string): boolean {
    const user = this.userPermissions[userEmail];
    if (!user) return false;

    const moduleAccess = user.moduleAccess[moduleId];
    return moduleAccess?.hasAccess || false;
  }

  /**
   * Get user's role for a specific module
   */
  getUserModuleRole(userEmail: string, moduleId: string): string | null {
    const user = this.userPermissions[userEmail];
    if (!user) return null;

    const moduleAccess = user.moduleAccess[moduleId];
    return moduleAccess?.role || null;
  }

  /**
   * Filter menu items based on user's role in the module
   */
  private filterMenusByRole(menus: MenuItem[], userRole: string): MenuItem[] {
    return menus
      .filter(menu => this.hasRoleAccess(userRole, menu.requiredRole))
      .map(menu => ({
        ...menu,
        children: menu.children 
          ? this.filterMenusByRole(menu.children, userRole)
          : undefined
      }))
      .filter(menu => {
        // Remove parent menu if it has no accessible children
        if (menu.children && menu.children.length === 0) {
          return !!menu.path; // Keep if it has its own path
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get accessible menus for a user in a specific module
   */
  getAccessibleMenus(userEmail: string, moduleId: string): MenuItem[] {
    if (!this.canAccessModule(userEmail, moduleId)) {
      return [];
    }

    const userRole = this.getUserModuleRole(userEmail, moduleId);
    if (!userRole) {
      return [];
    }

    const moduleMenu = this.moduleMenus[moduleId];
    if (!moduleMenu) {
      return [];
    }

    return this.filterMenusByRole(moduleMenu.menus, userRole);
  }

  /**
   * Get full module menu structure (for admin purposes)
   */
  getFullModuleMenu(moduleId: string): ModuleMenu | null {
    return this.moduleMenus[moduleId] || null;
  }

  /**
   * Get user information including accessible modules
   */
  getUserAccessInfo(userEmail: string): {
    user: UserPermissions['users'][string] | null;
    accessibleModules: string[];
  } {
    const user = this.userPermissions[userEmail];
    if (!user) {
      return { user: null, accessibleModules: [] };
    }

    const accessibleModules = Object.entries(user.moduleAccess)
      .filter(([_, access]) => access.hasAccess)
      .map(([moduleId]) => moduleId);

    return { user, accessibleModules };
  }

  /**
   * Check if user can access a specific menu item
   */
  canAccessMenuItem(
    userEmail: string, 
    moduleId: string, 
    menuPath: string
  ): boolean {
    const accessibleMenus = this.getAccessibleMenus(userEmail, moduleId);
    
    const findMenuByPath = (menus: MenuItem[], path: string): boolean => {
      for (const menu of menus) {
        if (menu.path === path) return true;
        if (menu.children && findMenuByPath(menu.children, path)) {
          return true;
        }
      }
      return false;
    };

    return findMenuByPath(accessibleMenus, menuPath);
  }

  /**
   * Get breadcrumb trail for a menu path
   */
  getMenuBreadcrumb(
    userEmail: string,
    moduleId: string,
    menuPath: string
  ): { id: string; label: string; path?: string }[] {
    const accessibleMenus = this.getAccessibleMenus(userEmail, moduleId);
    
    const findBreadcrumb = (
      menus: MenuItem[], 
      path: string, 
      breadcrumb: { id: string; label: string; path?: string }[] = []
    ): { id: string; label: string; path?: string }[] | null => {
      for (const menu of menus) {
        const currentBreadcrumb = [...breadcrumb, { 
          id: menu.id, 
          label: menu.label, 
          path: menu.path 
        }];
        
        if (menu.path === path) {
          return currentBreadcrumb;
        }
        
        if (menu.children) {
          const result = findBreadcrumb(menu.children, path, currentBreadcrumb);
          if (result) return result;
        }
      }
      return null;
    };

    return findBreadcrumb(accessibleMenus, menuPath) || [];
  }
}

/**
 * Create menu access control instance
 */
export const createMenuAccessControl = (
  permissions: UserPermissions,
  menus: Record<string, ModuleMenu>
): MenuAccessControl => {
  return new MenuAccessControl(permissions, menus);
};
