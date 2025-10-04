import { useState, useEffect, useMemo, useCallback } from 'react';
import { MenuItem } from './MenuAccessControl';
import { getModuleMenus } from './menuData';

/**
 * Hook for accessing module-specific menus without role-based filtering
 */
export const useModuleMenus = (moduleId: string) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load module menus using direct import (works in both dev and build modes)
      const moduleMenus = getModuleMenus(moduleId);
      
      if (moduleMenus.length === 0) {
        throw new Error(`Module '${moduleId}' not found or has no menus`);
      }

      // Return all menus for the module (no role-based filtering)
      setMenus(moduleMenus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menus');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (moduleId) {
      // Small delay to prevent React context issues in module federation
      const timer = setTimeout(() => {
        loadMenus();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [moduleId, loadMenus]);

  // Memoize menu utilities
  const menuUtils = useMemo(() => ({
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
    },

    getMenuBreadcrumb: (menuPath: string): { id: string; label: string; path?: string }[] => {
      const findBreadcrumb = (
        menuItems: MenuItem[], 
        path: string, 
        breadcrumb: { id: string; label: string; path?: string }[] = []
      ): { id: string; label: string; path?: string }[] | null => {
        for (const menu of menuItems) {
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

      return findBreadcrumb(menus, menuPath) || [];
    }
  }), [menus]);

  return {
    menus,
    loading,
    error,
    hasAccess: menus.length > 0,
    ...menuUtils
  };
};
