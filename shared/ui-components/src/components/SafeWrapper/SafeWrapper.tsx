import React, { useEffect, useState } from 'react';

interface SafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * SafeWrapper prevents React hook errors in module federation
 * by ensuring proper React context initialization
 */
const SafeWrapper: React.FC<SafeWrapperProps> = ({ children, fallback = null }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure React context is fully initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SafeWrapper;
