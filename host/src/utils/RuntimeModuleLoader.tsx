import React, { useState, useEffect, Suspense } from 'react';

// Dynamic module registry for runtime loading
interface ModuleConfig {
  name: string;
  url: string;
  scope: string;
  module: string;
  displayName: string;
  description: string;
  permissions: string[];
}

// Runtime module loader utility
export class RuntimeModuleLoader {
  private static loadedModules = new Map<string, any>();
  private static moduleConfigs = new Map<string, ModuleConfig>();

  // Register a module configuration
  static registerModule(id: string, config: ModuleConfig) {
    this.moduleConfigs.set(id, config);
  }

  // Load module dynamically at runtime
  static async loadModule(moduleId: string): Promise<React.ComponentType | null> {
    try {
      // Check if already loaded
      if (this.loadedModules.has(moduleId)) {
        return this.loadedModules.get(moduleId);
      }

      const config = this.moduleConfigs.get(moduleId);
      if (!config) {
        throw new Error(`Module configuration not found: ${moduleId}`);
      }

      // Dynamic import with error handling
      const moduleFactory = await this.loadRemoteModule(config);
      const module = await moduleFactory();

      // Cache the loaded module
      this.loadedModules.set(moduleId, module.default || module);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Module ${moduleId} loaded successfully`);
      }
      return module.default || module;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Failed to load module ${moduleId}:`, error);
      }
      throw error;
    }
  }

  // Load remote module with Webpack Module Federation
  private static async loadRemoteModule(config: ModuleConfig): Promise<any> {
    const { url, scope, module } = config;

    // Load the remote container
    await this.loadScript(url);
    
    // Initialize the container
    // @ts-ignore - Webpack Module Federation globals
    await __webpack_init_sharing__('default');
    const container = (window as any)[scope];
    // @ts-ignore - Webpack Module Federation globals
    await container.init(__webpack_share_scopes__.default);

    // Get the module factory
    const factory = await container.get(module);
    return factory;
  }

  // Load script dynamically
  private static loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = url;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      
      document.head.appendChild(script);
    });
  }

  // Preload modules for better performance
  static async preloadModule(moduleId: string): Promise<void> {
    try {
      await this.loadModule(moduleId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to preload module ${moduleId}:`, error);
      }
    }
  }

  // Get list of available modules
  static getAvailableModules(): ModuleConfig[] {
    return Array.from(this.moduleConfigs.values());
  }

  // Check if module is loaded
  static isModuleLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId);
  }

  // Unload module (for development/debugging)
  static unloadModule(moduleId: string): void {
    this.loadedModules.delete(moduleId);
  }
}

// Hook for dynamic module loading
export function useDynamicModule(moduleId: string) {
  const [module, setModule] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModule = async () => {
    if (RuntimeModuleLoader.isModuleLoaded(moduleId)) {
      const loadedModule = await RuntimeModuleLoader.loadModule(moduleId);
      setModule(() => loadedModule);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loadedModule = await RuntimeModuleLoader.loadModule(moduleId);
      setModule(() => loadedModule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    RuntimeModuleLoader.unloadModule(moduleId);
    loadModule();
  };

  useEffect(() => {
    if (moduleId) {
      loadModule();
    }
  }, [moduleId]);

  return { module, loading, error, reload };
}

// Component for runtime module rendering
interface DynamicModuleProps {
  moduleId: string;
  fallback?: React.ReactNode;
  onError?: (error: string) => void;
  props?: Record<string, any>;
}

export const DynamicModule: React.FC<DynamicModuleProps> = ({
  moduleId,
  fallback = <div>Loading module...</div>,
  onError,
  props = {}
}) => {
  const { module: ModuleComponent, loading, error } = useDynamicModule(moduleId);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (error) {
    return (
      <div className="module-error">
        <h3>Failed to load {moduleId}</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!ModuleComponent) {
    return <div>Module not found: {moduleId}</div>;
  }

  return (
    <Suspense fallback={fallback}>
      <ModuleComponent {...props} />
    </Suspense>
  );
};
