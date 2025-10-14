import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook that provides context-aware navigation for micro frontends
 * Handles both standalone and embedded modes correctly
 * 
 * In embedded mode (when loaded in host app):
 * - Detects the current module prefix from the URL
 * - Prefixes navigation paths with the module name
 * 
 * In standalone mode (when accessed directly):
 * - Uses paths as-is with the configured basename
 */
export const useModuleNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect if we're in embedded mode by checking if the pathname starts with any module prefix
  const isEmbedded = location.pathname.startsWith('/crm') || 
                    location.pathname.startsWith('/inventory') ||
                    location.pathname.startsWith('/hr') ||
                    location.pathname.startsWith('/finance') ||
                    location.pathname.startsWith('/task');
  
  // Get the module prefix from current path
  const getModulePrefix = () => {
    if (!isEmbedded) return '';
    
    const pathSegments = location.pathname.split('/');
    const moduleSegment = pathSegments[1]; // /crm/dashboard -> crm
    return `/${moduleSegment}`;
  };
  
  const moduleNavigate = (path: string, options?: any) => {
    const modulePrefix = getModulePrefix();
    const fullPath = isEmbedded ? `${modulePrefix}${path}` : path;
    navigate(fullPath, options);
  };
  
  return moduleNavigate;
};
