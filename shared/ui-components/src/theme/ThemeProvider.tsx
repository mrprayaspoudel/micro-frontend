import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme } from '../types/theme';
import { defaultTheme } from './defaultTheme';

// Import styled-components theme declaration
import '../types/styled';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
  moduleTheme?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = defaultTheme,
  moduleTheme 
}) => {
  // Deep merge module theme with global theme, giving priority to module theme
  // Ensure we always have a complete theme by falling back to default theme
  const baseTheme = theme || defaultTheme;
  
  const mergedTheme = moduleTheme 
    ? {
        ...baseTheme,
        ...moduleTheme,
        colors: {
          ...baseTheme.colors,
          ...moduleTheme.colors,
          // Deep merge color objects with proper fallbacks
          primary: { ...baseTheme.colors.primary, ...(moduleTheme.colors?.primary || {}) },
          secondary: { ...baseTheme.colors.secondary, ...(moduleTheme.colors?.secondary || {}) },
          gray: { ...baseTheme.colors.gray, ...(moduleTheme.colors?.gray || {}) },
          background: { ...baseTheme.colors.background, ...(moduleTheme.colors?.background || {}) },
          text: { ...baseTheme.colors.text, ...(moduleTheme.colors?.text || {}) },
          // Ensure all color properties are preserved
          success: moduleTheme.colors?.success || baseTheme.colors.success,
          warning: moduleTheme.colors?.warning || baseTheme.colors.warning,
          error: moduleTheme.colors?.error || baseTheme.colors.error,
          info: moduleTheme.colors?.info || baseTheme.colors.info,
        }
      }
    : baseTheme;

  const setTheme = (newTheme: Theme) => {
    // Implementation for dynamic theme switching

  };

  // Ensure we always provide a valid theme to styled-components
  const styledTheme = mergedTheme || defaultTheme;

  return (
    <ThemeContext.Provider value={{ theme: styledTheme, setTheme }}>
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
