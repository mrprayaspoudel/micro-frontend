import { RuntimeModuleLoader } from './RuntimeModuleLoader';

interface ModuleHealth {
  id: string;
  name: string;
  url: string;
  isHealthy: boolean;
  latency?: number;
  error?: string;
  lastChecked: Date;
}

export class ModuleHealthChecker {
  private static healthCache = new Map<string, ModuleHealth>();
  private static healthCheckInterval = 30000; // 30 seconds

  // Check if a remote module is healthy
  static async checkModuleHealth(moduleId: string): Promise<ModuleHealth> {
    const modules = RuntimeModuleLoader.getAvailableModules();
    const module = modules.find(m => m.name.includes(moduleId));
    
    if (!module) {
      return {
        id: moduleId,
        name: moduleId,
        url: 'unknown',
        isHealthy: false,
        error: 'Module configuration not found',
        lastChecked: new Date()
      };
    }

    const startTime = Date.now();
    
    try {
      // Try to fetch the remoteEntry.js file
      const response = await fetch(module.url, {
        method: 'HEAD', // Use HEAD to avoid downloading the entire file
        cache: 'no-cache'
      });
      
      const latency = Date.now() - startTime;
      const health: ModuleHealth = {
        id: moduleId,
        name: module.displayName,
        url: module.url,
        isHealthy: response.ok,
        latency,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
        lastChecked: new Date()
      };

      this.healthCache.set(moduleId, health);
      return health;
    } catch (error) {
      const health: ModuleHealth = {
        id: moduleId,
        name: module.displayName,
        url: module.url,
        isHealthy: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Network error',
        lastChecked: new Date()
      };

      this.healthCache.set(moduleId, health);
      return health;
    }
  }

  // Check health of all registered modules
  static async checkAllModulesHealth(): Promise<ModuleHealth[]> {
    const modules = RuntimeModuleLoader.getAvailableModules();
    const healthChecks = modules.map(module => {
      const moduleId = module.name.split('-')[0]; // Extract 'crm' from 'crm-app'
      return this.checkModuleHealth(moduleId);
    });

    return Promise.all(healthChecks);
  }

  // Get cached health status
  static getCachedHealth(moduleId: string): ModuleHealth | null {
    const cached = this.healthCache.get(moduleId);
    if (!cached) return null;

    // Check if cache is stale (older than health check interval)
    const isStale = Date.now() - cached.lastChecked.getTime() > this.healthCheckInterval;
    return isStale ? null : cached;
  }

  // Start periodic health monitoring
  static startHealthMonitoring(): () => void {
    const interval = setInterval(async () => {
      try {
        const healthStatuses = await this.checkAllModulesHealth();
        const unhealthyModules = healthStatuses.filter(h => !h.isHealthy);
        
        if (unhealthyModules.length > 0) {
          console.warn('🚨 Unhealthy modules detected:', unhealthyModules);
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.healthCheckInterval);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  // Get development setup instructions for unhealthy modules
  static getSetupInstructions(unhealthyModules: ModuleHealth[]): string[] {
    const instructions: string[] = [
      '🔧 To fix micro frontend loading issues:',
      '',
      '1. Make sure all micro frontend servers are running:',
    ];

    unhealthyModules.forEach(module => {
      const port = this.extractPortFromUrl(module.url);
      const moduleDir = module.id === 'crm' ? 'crm-module' : 
                       module.id === 'hr' ? 'hr-module' :
                       module.id === 'finance' ? 'finance-module' :
                       module.id === 'inventory' ? 'inventory-module' : module.id;
      
      instructions.push(`   cd apps/${moduleDir} && npm run dev  # Should run on port ${port}`);
    });

    instructions.push(
      '',
      '2. Or start all at once:',
      '   npm run start:dev',
      '',
      '3. Verify servers are running:',
      '   lsof -i :3001,3002,3003,3004',
      '',
      '4. Check if remoteEntry.js files are accessible:',
      ...unhealthyModules.map(m => `   curl -I ${m.url}`)
    );

    return instructions;
  }

  private static extractPortFromUrl(url: string): string {
    const match = url.match(/:(\d+)\//);
    return match ? match[1] : 'unknown';
  }

  // Development helper to show status
  static async showDevelopmentStatus(): Promise<void> {
    const healthStatuses = await this.checkAllModulesHealth();
    const unhealthyModules = healthStatuses.filter(h => !h.isHealthy);

    if (unhealthyModules.length > 0) {
      this.getSetupInstructions(unhealthyModules);
    }
  }
}
