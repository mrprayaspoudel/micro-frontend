import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '@shared/state';
import { CompanyModuleService } from '../../services/CompanyModuleService';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface ProtectedModuleRouteProps {
  moduleId: string;
  children: React.ReactNode;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ErrorTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  max-width: 500px;
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[200]};
  }
`;

const ProtectedModuleRoute: React.FC<ProtectedModuleRouteProps> = ({ moduleId, children }) => {
  const { selectedCompany } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [accessValidation, setAccessValidation] = useState<{
    hasAccess: boolean;
    message?: string;
  }>({ hasAccess: false });

  useEffect(() => {
    const validateAccess = async () => {
      setLoading(true);
      
      try {
        const validation = await CompanyModuleService.validateModuleAccess(
          selectedCompany?.id || null,
          moduleId
        );
        setAccessValidation(validation);
      } catch (error) {
        console.error('Error validating module access:', error);
        setAccessValidation({
          hasAccess: false,
          message: 'An error occurred while checking module access. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, [selectedCompany?.id, moduleId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!accessValidation.hasAccess) {
    const isNoCompanySelected = !selectedCompany;
    
    return (
      <ErrorContainer>
        <ErrorIcon>
          {isNoCompanySelected ? '🏢' : '🔒'}
        </ErrorIcon>
        <ErrorTitle>
          {isNoCompanySelected ? 'No Company Selected' : 'Access Denied'}
        </ErrorTitle>
        <ErrorMessage>
          {accessValidation.message}
        </ErrorMessage>
        {isNoCompanySelected && (
          <ActionButton onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </ActionButton>
        )}
      </ErrorContainer>
    );
  }

  return <>{children}</>;
};

export default ProtectedModuleRoute;
