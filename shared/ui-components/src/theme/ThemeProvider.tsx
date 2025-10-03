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
  const mergedTheme = moduleTheme 
    ? {
        ...theme,
        ...moduleTheme,
        colors: {
          ...theme.colors,
          ...moduleTheme.colors,
          // Deep merge color objects
          primary: { ...theme.colors.primary, ...moduleTheme.colors?.primary },
          secondary: { ...theme.colors.secondary, ...moduleTheme.colors?.secondary },
          gray: { ...theme.colors.gray, ...moduleTheme.colors?.gray },
          background: { ...theme.colors.background, ...moduleTheme.colors?.background },
          text: { ...theme.colors.text, ...moduleTheme.colors?.text },
        }
      }
    : theme;

  const setTheme = (newTheme: Theme) => {
    // Implementation for dynamic theme switching
    console.log('Setting theme:', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: mergedTheme, setTheme }}>
      <StyledThemeProvider theme={mergedTheme}>
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
