import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@shared/state';
import { Company } from '@shared/state';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import RemoteErrorBoundary from '../RemoteErrorBoundary/RemoteErrorBoundary';
import { DynamicModule, useDynamicModule } from '../../utils/RuntimeModuleLoader';
import { SharedModuleLoader } from '../../utils/SharedModuleLoader';

// Your existing styled components...
const PanelOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const PanelContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-100%'};
  width: 100%;
  max-width: 1200px;
  height: 100%;
  background-color: ${props => props.theme.colors.background.primary};
  transition: right 0.3s ease-in-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  background-color: ${props => props.theme.colors.background.secondary};
`;

const PanelTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.gray[500]};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;

const ModuleStatus = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

const StatusLabel = styled.div`
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: #666;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
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

const LoadingModeSelector = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  background: ${props => props.$active ? props.theme.colors.primary[100] : 'white'};
  color: ${props => props.$active ? props.theme.colors.primary[800] : props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary[200] : props.theme.colors.gray[50]};
  }
`;

interface EnhancedModulePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: Company | null;
}

type LoadingMode = 'static' | 'dynamic' | 'hybrid';

const EnhancedModulePanel: React.FC<EnhancedModulePanelProps> = ({ 
  isOpen, 
  onClose, 
  selectedCompany 
}) => {
  const { activeModule } = useAppStore();
  const [loadingMode, setLoadingMode] = useState<LoadingMode>('static');
  const [moduleError, setModuleError] = useState<string | null>(null);

  // Demonstrate different loading approaches
  const { module: dynamicModule, loading: dynamicLoading, error: dynamicError } = useDynamicModule(
    loadingMode === 'dynamic' ? activeModule || '' : ''
  );

  useEffect(() => {
    setModuleError(null);
  }, [activeModule, loadingMode]);

  const handleRetry = () => {
    setModuleError(null);
    // Force refresh based on loading mode
    if (loadingMode === 'dynamic') {
      // Dynamic reload will be handled by the hook
    }
  };

  const renderModuleContent = () => {
    if (!activeModule) {
      return (
        <ErrorContainer>
          <h3>No Module Selected</h3>
          <p>Please select a company and module to get started.</p>
        </ErrorContainer>
      );
    }

    if (!selectedCompany) {
      return (
        <ErrorContainer>
          <h3>No Company Selected</h3>
          <p>Please select a company first to access modules.</p>
        </ErrorContainer>
      );
    }

    // Different loading modes demonstration
    switch (loadingMode) {
      case 'static':
        return renderStaticModule();
      case 'dynamic':
        return renderDynamicModule();
      case 'hybrid':
        return renderHybridModule();
      default:
        return renderStaticModule();
    }
  };

  // Static loading approach using shared module loader
  const renderStaticModule = () => {

    switch (activeModule) {
      case 'crm':
        return (
          <RemoteErrorBoundary remoteName="CRM" onRetry={handleRetry}>
            <Suspense fallback={<LoadingSpinner />}>
              <SharedModuleLoader.CRMApp />
            </Suspense>
          </RemoteErrorBoundary>
        );
      case 'inventory':
        return (
          <RemoteErrorBoundary remoteName="Inventory" onRetry={handleRetry}>
            <Suspense fallback={<LoadingSpinner />}>
              <SharedModuleLoader.InventoryApp />
            </Suspense>
          </RemoteErrorBoundary>
        );
      case 'hr':
        return (
          <RemoteErrorBoundary remoteName="HR" onRetry={handleRetry}>
            <Suspense fallback={<LoadingSpinner />}>
              <SharedModuleLoader.HRApp />
            </Suspense>
          </RemoteErrorBoundary>
        );
      case 'finance':
        return (
          <RemoteErrorBoundary remoteName="Finance" onRetry={handleRetry}>
            <Suspense fallback={<LoadingSpinner />}>
              <SharedModuleLoader.FinanceApp />
            </Suspense>
          </RemoteErrorBoundary>
        );
      default:
        return <ErrorContainer><h3>Unknown module: {activeModule}</h3></ErrorContainer>;
    }
  };

  // Pure dynamic loading using the runtime loader
  const renderDynamicModule = () => {
    if (dynamicLoading) {
      return <LoadingSpinner />;
    }

    if (dynamicError) {
      return (
        <ErrorContainer>
          <h3>Failed to load {activeModule}</h3>
          <p>{dynamicError}</p>
          <button onClick={handleRetry}>Retry</button>
        </ErrorContainer>
      );
    }

    return (
      <DynamicModule
        moduleId={activeModule || ''}
        fallback={<LoadingSpinner />}
        onError={(error) => setModuleError(error)}
      />
    );
  };

  // Hybrid approach - try dynamic first, fallback to static
  const renderHybridModule = () => {
    return (
      <DynamicModule
        moduleId={activeModule || ''}
        fallback={<LoadingSpinner />}
        onError={(error) => {
          // Dynamic loading failed, using static fallback
          // Could implement fallback to static here
          setModuleError(error);
        }}
      />
    );
  };

  return (
    <>
      <PanelOverlay $isOpen={isOpen} onClick={onClose} />
      <PanelContainer $isOpen={isOpen}>
        <PanelHeader>
          <div>
            <PanelTitle>
              {activeModule ? `${activeModule.toUpperCase()} Module` : 'Module Panel'}
            </PanelTitle>
            {selectedCompany && activeModule && (
              <ModuleStatus>
                Module: {activeModule}
              </ModuleStatus>
            )}
          </div>
          
          {/* Loading Mode Selector for demonstration */}
          <div>
                        <StatusLabel>
              Status:
            </StatusLabel>
            <LoadingModeSelector>
              <ModeButton 
                $active={loadingMode === 'static'}
                onClick={() => setLoadingMode('static')}
              >
                Static
              </ModeButton>
              <ModeButton 
                $active={loadingMode === 'dynamic'}
                onClick={() => setLoadingMode('dynamic')}
              >
                Dynamic
              </ModeButton>
              <ModeButton 
                $active={loadingMode === 'hybrid'}
                onClick={() => setLoadingMode('hybrid')}
              >
                Hybrid
              </ModeButton>
            </LoadingModeSelector>
          </div>

          <CloseButton onClick={onClose}>
            <XMarkIcon />
          </CloseButton>
        </PanelHeader>
        
        <PanelContent>
          {renderModuleContent()}
        </PanelContent>
      </PanelContainer>
    </>
  );
};

export default EnhancedModulePanel;
