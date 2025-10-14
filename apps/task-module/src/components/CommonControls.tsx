import styled from 'styled-components';

// Common Header Components
export const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

export const PageSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing.sm} 0 0 0;
  line-height: 1.6;
`;

// Filter Bar Components
export const FilterBar = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

export const FilterLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
`;

export const Select = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  min-width: 180px;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

export const Input = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover {
    border-color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

export const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: inherit;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  line-height: 1.5;

  &:hover {
    border-color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

// Tab Components
export const TabsContainer = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  margin-bottom: ${props => props.theme.spacing.lg};
  overflow: hidden;
`;

export const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  overflow-x: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: ${props => props.theme.borderRadius.full};
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.text.secondary};
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary[600] : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background-color: ${props => props.theme.colors.gray[50]};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: -2px;
  }
`;

// Grid Layout
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Empty State
export const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: ${props => props.theme.spacing['3xl']};
  text-align: center;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 2px dashed ${props => props.theme.colors.gray[300]};
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

export const EmptyStateText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.tertiary};
  margin: 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

// Alert/Message Box
export const Alert = styled.div<{ $variant?: 'info' | 'success' | 'warning' | 'error' }>`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  ${props => {
    switch (props.$variant) {
      case 'success':
        return `
          background-color: #d1fae5;
          border: 1px solid #6ee7b7;
          color: #065f46;
        `;
      case 'warning':
        return `
          background-color: #fef3c7;
          border: 1px solid #fde047;
          color: #92400e;
        `;
      case 'error':
        return `
          background-color: #fee2e2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        `;
      case 'info':
      default:
        return `
          background-color: ${props.theme.colors.primary[50]};
          border: 1px solid ${props.theme.colors.primary[200]};
          color: ${props.theme.colors.primary[800]};
        `;
    }
  }}
`;

// Form Components
export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const FormHint = styled.span`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  margin-top: ${props => props.theme.spacing.xs};
`;

export const FormError = styled.span`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: #dc2626;
  margin-top: ${props => props.theme.spacing.xs};
`;

// Card Container
export const Card = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => props.theme.spacing.xl};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

// Badge/Tag
export const Badge = styled.span<{ $variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.$variant) {
      case 'success':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'warning':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'error':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[800]};
        `;
      case 'primary':
      default:
        return `
          background-color: ${props.theme.colors.primary[100]};
          color: ${props.theme.colors.primary[800]};
        `;
    }
  }}
`;

// Divider
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  margin: ${props => props.theme.spacing.lg} 0;
`;

// Loading Spinner
export const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.theme.colors.gray[200]};
  border-top-color: ${props => props.theme.colors.primary[600]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.md};
`;

export const LoadingText = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;
