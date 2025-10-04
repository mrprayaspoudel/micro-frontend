// Re-export from the new CompanyModuleService for backward compatibility
export type { ModuleDefinition } from '../services/CompanyModuleService';
export { CompanyModuleService } from '../services/CompanyModuleService';

import { CompanyModuleService } from '../services/CompanyModuleService';

// Backward compatibility functions
export const getEnabledModulesForCompany = (companyModules: string[]) => {
  return CompanyModuleService.getEnabledModulesForCompany(companyModules);
};

export const AVAILABLE_MODULES = CompanyModuleService.getAvailableModules();
