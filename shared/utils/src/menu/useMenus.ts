import { useState, useEffect, useMemo, useCallback } from 'react';
import { menuApiService } from './MenuApiService';
import { MenuItem } from './MenuAccessControl';

/**
 * Hook for accessing user menus with role-based filtering
 */
export const useUserMenus = (userEmail: string, moduleId: string) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize menu system if not already done
      await menuApiService.initialize().catch(() => {
        // Ignore if already initialized
      });

      // Check if user has access to the module
      if (!menuApiService.canUserAccessModule(userEmail, moduleId)) {
        setMenus([]);
        setUserRole(null);
        return;
      }

      // Get user's role and menus
      const role = menuApiService.getUserModuleRole(userEmail, moduleId);
      const userMenus = menuApiService.getUserMenus(userEmail, moduleId);

      setUserRole(role);
      setMenus(userMenus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menus');
      setMenus([]);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  }, [userEmail, moduleId]);

  useEffect(() => {
    if (userEmail && moduleId) {
      // Small delay to prevent React context issues in module federation
      const timer = setTimeout(() => {
        loadMenus();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [userEmail, moduleId, loadMenus]);

  // Memoize menu utilities
  const menuUtils = useMemo(() => ({
    canAccessMenuItem: (menuPath: string) => 
      menuApiService.canUserAccessMenuItem(userEmail, moduleId, menuPath),
    
    getMenuBreadcrumb: (menuPath: string) =>
      menuApiService.getMenuBreadcrumb(userEmail, moduleId, menuPath),
    
    findMenuByPath: (path: string): MenuItem | null => {
      const findInMenus = (menuItems: MenuItem[]): MenuItem | null => {
        for (const item of menuItems) {
          if (item.path === path) return item;
          if (item.children) {
            const found = findInMenus(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findInMenus(menus);
    },

    getTopLevelMenus: () => menus.filter(menu => !menu.children || menu.children.length === 0 || menu.path),
    
    getMenusByParent: (parentId: string) => {
      const parent = menus.find(menu => menu.id === parentId);
      return parent?.children || [];
    }
  }), [userEmail, moduleId, menus]);

  return {
    menus,
    userRole,
    loading,
    error,
    hasAccess: menus.length > 0,
    ...menuUtils
  };
};

/**
 * Hook for accessing user's overall access information
 */
export const useUserAccess = (userEmail: string) => {
  const [accessInfo, setAccessInfo] = useState<{
    user: any;
    accessibleModules: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccessInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        await menuApiService.initialize().catch(() => {
          // Ignore if already initialized
        });

        const info = menuApiService.getUserAccessInfo(userEmail);
        setAccessInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load access information');
        setAccessInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      loadAccessInfo();
    }
  }, [userEmail]);

  return {
    user: accessInfo?.user || null,
    accessibleModules: accessInfo?.accessibleModules || [],
    loading,
    error,
    canAccessModule: (moduleId: string) => 
      accessInfo?.accessibleModules.includes(moduleId) || false
  };
};
