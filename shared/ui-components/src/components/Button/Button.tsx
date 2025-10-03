import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const getButtonStyles = (theme: DefaultTheme, variant: ButtonProps['variant'], size: ButtonProps['size']) => {
  const variants = {
    primary: `
      background-color: ${theme.colors.primary[600]};
      color: white;
      border: 1px solid ${theme.colors.primary[600]};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[700]};
        border-color: ${theme.colors.primary[700]};
      }
    `,
    secondary: `
      background-color: ${theme.colors.secondary[100]};
      color: ${theme.colors.secondary[900]};
      border: 1px solid ${theme.colors.secondary[200]};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondary[200]};
      }
    `,
    outline: `
      background-color: transparent;
      color: ${theme.colors.primary[600]};
      border: 1px solid ${theme.colors.primary[600]};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[50]};
      }
    `,
    ghost: `
      background-color: transparent;
      color: ${theme.colors.text.primary};
      border: 1px solid transparent;
      &:hover:not(:disabled) {
        background-color: ${theme.colors.gray[100]};
      }
    `
  };

  const sizes = {
    sm: `
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.typography.fontSize.sm};
    `,
    md: `
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.base};
    `,
    lg: `
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.lg};
    `
  };

  return `
    ${variants[variant || 'primary']}
    ${sizes[size || 'md']}
  `;
};

const StyledButton = styled.button<{ variant: ButtonProps['variant']; size: ButtonProps['size'] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  ${props => getButtonStyles(props.theme, props.variant, props.size)}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {loading && <span>Loading...</span>}
      {children}
    </StyledButton>
  );
};
