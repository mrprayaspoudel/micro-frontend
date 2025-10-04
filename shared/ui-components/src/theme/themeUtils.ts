import { defaultTheme } from './defaultTheme';
import type { Theme } from '../types/theme';

/**
 * Safely access theme properties with fallbacks
 * Prevents runtime errors when theme is undefined or incomplete
 */
export const safeTheme = {
  /**
   * Get background color with fallback
   */
  background: (theme: Theme | undefined, variant: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
    return theme?.colors?.background?.[variant] || defaultTheme.colors.background[variant];
  },

  /**
   * Get text color with fallback
   */
  text: (theme: Theme | undefined, variant: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
    return theme?.colors?.text?.[variant] || defaultTheme.colors.text[variant];
  },

  /**
   * Get primary color with fallback
   */
  primary: (theme: Theme | undefined, shade: keyof Theme['colors']['primary'] = 500) => {
    return theme?.colors?.primary?.[shade] || defaultTheme.colors.primary[shade];
  },

  /**
   * Get secondary color with fallback
   */
  secondary: (theme: Theme | undefined, shade: keyof Theme['colors']['secondary'] = 500) => {
    return theme?.colors?.secondary?.[shade] || defaultTheme.colors.secondary[shade];
  },

  /**
   * Get gray color with fallback
   */
  gray: (theme: Theme | undefined, shade: keyof Theme['colors']['gray'] = 500) => {
    return theme?.colors?.gray?.[shade] || defaultTheme.colors.gray[shade];
  },

  /**
   * Get spacing value with fallback
   */
  spacing: (theme: Theme | undefined, size: keyof Theme['spacing'] = 'md') => {
    return theme?.spacing?.[size] || defaultTheme.spacing[size];
  },

  /**
   * Get border radius with fallback
   */
  borderRadius: (theme: Theme | undefined, size: keyof Theme['borderRadius'] = 'md') => {
    return theme?.borderRadius?.[size] || defaultTheme.borderRadius[size];
  },

  /**
   * Get shadow with fallback
   */
  shadow: (theme: Theme | undefined, size: keyof Theme['shadows'] = 'md') => {
    return theme?.shadows?.[size] || defaultTheme.shadows[size];
  },

  /**
   * Get typography value with fallback
   */
  fontSize: (theme: Theme | undefined, size: keyof Theme['typography']['fontSize'] = 'base') => {
    return theme?.typography?.fontSize?.[size] || defaultTheme.typography.fontSize[size];
  },

  /**
   * Get font weight with fallback
   */
  fontWeight: (theme: Theme | undefined, weight: keyof Theme['typography']['fontWeight'] = 'normal') => {
    return theme?.typography?.fontWeight?.[weight] || defaultTheme.typography.fontWeight[weight];
  },
};

/**
 * Higher order function to create theme-safe styled component accessors
 */
export const withTheme = <T>(accessor: (theme: Theme) => T) => {
  return (props: { theme?: Theme }) => {
    try {
      const theme = props.theme || defaultTheme;
      return accessor(theme);
    } catch (error) {
      // Fallback to default theme if accessor fails
      return accessor(defaultTheme);
    }
  };
};
