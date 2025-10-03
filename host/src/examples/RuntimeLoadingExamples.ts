// Example integration file showing how to use runtime module loading
// Add this to your host/src/main.tsx or App.tsx

import { initializeModuleRegistry, ModulePreloader } from '../utils/ModuleRegistry';
import { useAuthStore } from '@shared/state';

// Initialize the module registry when your app starts
export async function initializeApp() {
  try {
    // 1. Initialize module registry with your current modules
    initializeModuleRegistry();
    
    // 2. Get user permissions (from your auth store)
    const user = useAuthStore.getState().user;
    const userPermissions = user?.permissions || [];
    
    // 3. Preload modules based on user permissions
    await ModulePreloader.preloadUserModules(userPermissions);
    
    console.log('✅ App initialized with dynamic module loading');
  } catch (error) {
    console.error('❌ App initialization failed:', error);
  }
}

// Usage examples for different runtime loading scenarios:

// 1. CONDITIONAL LOADING - Load modules based on user role
export function loadModulesForUser(userRole: string) {
  const moduleMap = {
    'admin': ['crm', 'inventory', 'hr', 'finance'],
    'manager': ['crm', 'inventory', 'hr'],
    'user': ['crm']
  };
  
  const allowedModules = moduleMap[userRole as keyof typeof moduleMap] || [];
  allowedModules.forEach(moduleId => {
    ModulePreloader.preloadModule(moduleId);
  });
}

// 2. LAZY LOADING - Load modules only when needed
export const LazyModuleLoader = {
  // Load module when user navigates to a route
  loadOnNavigation: async (moduleId: string) => {
    console.log(`Loading ${moduleId} for navigation...`);
    await ModulePreloader.preloadModule(moduleId);
  },
  
  // Load module when user hovers over menu item
  loadOnHover: async (moduleId: string) => {
    console.log(`Pre-loading ${moduleId} on hover...`);
    await ModulePreloader.preloadModule(moduleId);
  },
  
  // Load module when it becomes visible
  loadOnVisible: async (moduleId: string) => {
    console.log(`Loading ${moduleId} when visible...`);
    await ModulePreloader.preloadModule(moduleId);
  }
};

// 3. PERFORMANCE OPTIMIZED LOADING - Load modules during idle time
export function loadModulesDuringIdle() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(async () => {
      await ModulePreloader.preloadAllModules();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(async () => {
      await ModulePreloader.preloadAllModules();
    }, 1000);
  }
}

// 4. NETWORK-AWARE LOADING - Load based on connection speed
export async function loadModulesBasedOnNetwork() {
  // @ts-ignore - Network API is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    const effectiveType = connection.effectiveType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        console.log('Slow connection - loading critical modules only');
        await ModulePreloader.preloadModule('crm'); // Load only essential module
        break;
      case '3g':
        console.log('Medium connection - loading core modules');
        await ModulePreloader.preloadModule('crm');
        await ModulePreloader.preloadModule('inventory');
        break;
      case '4g':
        console.log('Fast connection - loading all modules');
        await ModulePreloader.preloadAllModules();
        break;
      default:
        await ModulePreloader.preloadAllModules();
    }
  } else {
    // Default behavior when Network API is not available
    await ModulePreloader.preloadAllModules();
  }
}

// 5. ERROR RECOVERY - Retry failed module loads
export class ModuleErrorRecovery {
  private static retryCount = new Map<string, number>();
  private static maxRetries = 3;
  
  static async retryModuleLoad(moduleId: string): Promise<boolean> {
    const currentRetries = this.retryCount.get(moduleId) || 0;
    
    if (currentRetries >= this.maxRetries) {
      console.error(`Max retries reached for module ${moduleId}`);
      return false;
    }
    
    this.retryCount.set(moduleId, currentRetries + 1);
    
    try {
      await ModulePreloader.preloadModule(moduleId);
      this.retryCount.delete(moduleId); // Reset on success
      return true;
    } catch (error) {
      console.warn(`Retry ${currentRetries + 1} failed for ${moduleId}:`, error);
      return false;
    }
  }
  
  static resetRetryCount(moduleId: string) {
    this.retryCount.delete(moduleId);
  }
}

// 6. MODULE HEALTH MONITORING
export class ModuleHealthMonitor {
  private static healthStatus = new Map<string, 'healthy' | 'degraded' | 'failed'>();
  
  static monitorModule(moduleId: string) {
    const startTime = Date.now();
    
    ModulePreloader.preloadModule(moduleId)
      .then(() => {
        const loadTime = Date.now() - startTime;
        console.log(`Module ${moduleId} loaded in ${loadTime}ms`);
        
        if (loadTime < 1000) {
          this.healthStatus.set(moduleId, 'healthy');
        } else if (loadTime < 3000) {
          this.healthStatus.set(moduleId, 'degraded');
        } else {
          this.healthStatus.set(moduleId, 'failed');
        }
      })
      .catch(() => {
        this.healthStatus.set(moduleId, 'failed');
      });
  }
  
  static getHealthStatus(moduleId: string) {
    return this.healthStatus.get(moduleId) || 'unknown';
  }
  
  static getAllHealthStatuses() {
    return Object.fromEntries(this.healthStatus);
  }
}

// Usage in your components:
// 
// In Sidebar.tsx - preload on hover:
// <ModuleItem onMouseEnter={() => LazyModuleLoader.loadOnHover('crm')}>
//
// In App.tsx - initialize on startup:
// useEffect(() => { initializeApp(); }, []);
//
// In ModulePanel.tsx - retry on error:
// const handleRetry = () => ModuleErrorRecovery.retryModuleLoad(activeModule);
