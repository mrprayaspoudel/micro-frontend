export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODULES: ModuleDefinition[] = [
  { 
    id: 'crm', 
    name: 'CRM', 
    description: 'Customer Relationship Management' 
  },
  { 
    id: 'inventory', 
    name: 'Inventory', 
    description: 'Inventory Management' 
  },
  { 
    id: 'hr', 
    name: 'HR', 
    description: 'Human Resources' 
  },
  { 
    id: 'finance', 
    name: 'Finance', 
    description: 'Financial Management' 
  }
];

export const getEnabledModulesForCompany = (companyModules: string[]): ModuleDefinition[] => {
  return AVAILABLE_MODULES.filter(module => companyModules.includes(module.id));
};
