import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@shared/state';
import { Company } from '@shared/state';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import RemoteErrorBoundary from '../RemoteErrorBoundary/RemoteErrorBoundary';

// Lazy load micro frontends
const CRMApp = React.lazy(() => import('crm-app/App'));
const InventoryApp = React.lazy(() => import('inventory-app/App'));
const HRApp = React.lazy(() => import('hr-app/App'));
const FinanceApp = React.lazy(() => import('finance-app/App'));

interface ModulePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: Company | null;
}

const PanelOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const PanelContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  max-width: 1200px;
  background-color: ${props => props.theme.colors.background.primary};
  box-shadow: ${props => props.theme.shadows.xl};
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  background-color: ${props => props.theme.colors.background.primary};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const HeaderTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CompanyInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const CloseButton = styled(ActionButton)`
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
  
  &:hover svg {
    color: ${props => props.theme.colors.gray[600]};
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const ModuleContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ErrorTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const RetryButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[700]};
  }
`;

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  right: ${props => props.$isOpen ? '1200px' : '0'};
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 80px;
  background-color: ${props => props.theme.colors.primary[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md} 0 0 ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: right 0.3s ease-in-out, background-color 0.2s ease;
  box-shadow: ${props => props.theme.shadows.lg};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[700]};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
  
  @media (max-width: 1200px) {
    right: ${props => props.$isOpen ? '100%' : '0'};
  }
`;

const ModulePanel: React.FC<ModulePanelProps> = ({ isOpen, onClose, selectedCompany }) => {
  const { activeModule } = useAppStore();
  const [moduleError, setModuleError] = useState<string | null>(null);

  useEffect(() => {
    // Reset error when module changes
    setModuleError(null);
  }, [activeModule]);

  const handleRetry = () => {
    setModuleError(null);
    // Force re-render by toggling module
    const { setActiveModule } = useAppStore.getState();
    const currentModule = activeModule;
    setActiveModule(null);
    setTimeout(() => setActiveModule(currentModule), 100);
  };

  const renderModule = () => {
    if (!activeModule) {
      return (
        <ErrorContainer>
          <ErrorTitle>No Module Selected</ErrorTitle>
          <ErrorMessage>Please select a company and module to get started.</ErrorMessage>
        </ErrorContainer>
      );
    }

    if (!selectedCompany) {
      return (
        <ErrorContainer>
          <ErrorTitle>No Company Selected</ErrorTitle>
          <ErrorMessage>Please select a company first to access modules.</ErrorMessage>
        </ErrorContainer>
      );
    }

    try {
      switch (activeModule) {
        case 'crm':
          return (
            <RemoteErrorBoundary remoteName="CRM" onRetry={handleRetry}>
              <Suspense fallback={<LoadingSpinner />}>
                <CRMApp />
              </Suspense>
            </RemoteErrorBoundary>
          );
        case 'inventory':
          return (
            <RemoteErrorBoundary remoteName="Inventory" onRetry={handleRetry}>
              <Suspense fallback={<LoadingSpinner />}>
                <InventoryApp />
              </Suspense>
            </RemoteErrorBoundary>
          );
        case 'hr':
          return (
            <RemoteErrorBoundary remoteName="HR" onRetry={handleRetry}>
              <Suspense fallback={<LoadingSpinner />}>
                <HRApp />
              </Suspense>
            </RemoteErrorBoundary>
          );
        case 'finance':
          return (
            <RemoteErrorBoundary remoteName="Finance" onRetry={handleRetry}>
              <Suspense fallback={<LoadingSpinner />}>
                <FinanceApp />
              </Suspense>
            </RemoteErrorBoundary>
          );
        default:
          return (
            <ErrorContainer>
              <ErrorTitle>Unknown Module</ErrorTitle>
              <ErrorMessage>The module "{activeModule}" is not recognized.</ErrorMessage>
              <RetryButton onClick={handleRetry}>Retry</RetryButton>
            </ErrorContainer>
          );
      }
    } catch (error) {
      console.error('Module loading error:', error);
      setModuleError(`Failed to load ${activeModule} module`);
      return (
        <ErrorContainer>
          <ErrorTitle>Module Loading Error</ErrorTitle>
          <ErrorMessage>{moduleError}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Retry</RetryButton>
        </ErrorContainer>
      );
    }
  };

  const getModuleName = () => {
    switch (activeModule) {
      case 'crm': return 'Customer Relationship Management';
      case 'inventory': return 'Inventory Management';
      case 'hr': return 'Human Resources';
      case 'finance': return 'Finance Management';
      default: return 'Unknown Module';
    }
  };

  return (
    <>
      <ToggleButton 
        $isOpen={isOpen} 
        onClick={isOpen ? onClose : () => {}}
        title={isOpen ? 'Close Panel' : 'Open Panel'}
      >
        {isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </ToggleButton>
      
  <PanelOverlay $isOpen={isOpen} onClick={onClose} />
      
  <PanelContainer $isOpen={isOpen}>
        <PanelHeader>
          <HeaderLeft>
            <div>
              <HeaderTitle>{getModuleName()}</HeaderTitle>
              {selectedCompany && (
                <CompanyInfo>{selectedCompany.name}</CompanyInfo>
              )}
            </div>
          </HeaderLeft>
          
          <HeaderActions>
            <CloseButton onClick={onClose} title="Close Panel">
              <XMarkIcon />
            </CloseButton>
          </HeaderActions>
        </PanelHeader>
        
        <PanelContent>
          <ModuleContainer>
            {renderModule()}
          </ModuleContainer>
        </PanelContent>
      </PanelContainer>
    </>
  );
};

export default ModulePanel;
