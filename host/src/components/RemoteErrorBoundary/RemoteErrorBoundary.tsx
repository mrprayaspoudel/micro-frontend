import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';
import { ModuleHealthChecker } from '../../utils/ModuleHealthChecker';

interface RemoteErrorBoundaryProps {
  remoteName: string;
  children: ReactNode;
  onRetry?: () => void;
}

interface RemoteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isCheckingHealth: boolean;
  developmentInstructions?: string[];
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.error}11;
  color: ${props => props.theme.colors.error};
`;

const ErrorTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const ErrorDetails = styled.pre`
  margin: 0;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  max-height: 200px;
  overflow: auto;
`;

const WarningMessage = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: #fff3cd;
  color: #856404;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

export class RemoteErrorBoundary extends React.Component<RemoteErrorBoundaryProps, RemoteErrorBoundaryState> {
  state: RemoteErrorBoundaryState = {
    hasError: false,
    isCheckingHealth: false,
  };

  static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      isCheckingHealth: false,
      developmentInstructions: undefined
    };
  }

  async componentDidCatch(error: Error) {
    const { remoteName } = this.props;
    console.error(`[RemoteErrorBoundary] Failed to load remote "${remoteName}"`, error);
    
    // Perform health check and show development instructions
    if (process.env.NODE_ENV === 'development') {
      this.setState({ isCheckingHealth: true });
      
      try {
        const moduleId = remoteName.toLowerCase();
        const health = await ModuleHealthChecker.checkModuleHealth(moduleId);
        
        if (!health.isHealthy) {
          const instructions = ModuleHealthChecker.getSetupInstructions([health]);
          this.setState({ developmentInstructions: instructions });
        }
      } catch (healthError) {
        console.warn('Health check failed:', healthError);
      } finally {
        this.setState({ isCheckingHealth: false });
      }
    }
  }

  componentDidUpdate(prevProps: RemoteErrorBoundaryProps) {
    if (prevProps.remoteName !== this.props.remoteName && this.state.hasError) {
      this.reset();
    }
  }

  private reset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined,
      isCheckingHealth: false,
      developmentInstructions: undefined 
    });
  };

  private handleRetry = () => {
    const { onRetry } = this.props;
    this.reset();
    onRetry?.();
  };

  render() {
    const { hasError, error, isCheckingHealth, developmentInstructions } = this.state;
    const { children, remoteName } = this.props;

    if (hasError) {
      return (
        <ErrorContainer role="alert">
          <ErrorTitle>Unable to load the {remoteName} module</ErrorTitle>
          <ErrorDetails>
            {error?.message || 'An unexpected error occurred while loading the remote module.'}
            
            {error?.message?.includes('Failed to fetch') && (
              <WarningMessage>
                <strong>💡 Common Solution:</strong> This usually means the {remoteName} server isn't running.
              </WarningMessage>
            )}
          </ErrorDetails>
          
          {isCheckingHealth && (
            <div>🔍 Checking module health...</div>
          )}
          
          {developmentInstructions && (
            <ErrorDetails>
              <strong>Development Setup Instructions:</strong>
              {developmentInstructions.map((instruction, i) => (
                <div key={i}>{instruction}</div>
              ))}
            </ErrorDetails>
          )}
          
          <div>
            <Button variant="primary" onClick={this.handleRetry}>
              Retry loading {remoteName}
            </Button>
          </div>
        </ErrorContainer>
      );
    }

    return <>{children}</>;
  }
}

export default RemoteErrorBoundary;
