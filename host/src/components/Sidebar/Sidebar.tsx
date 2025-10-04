import React from 'react';
import styled from 'styled-components';
import { Company } from '@shared/state';
import { RuntimeModuleLoader } from '../../utils/RuntimeModuleLoader';
import { useNavigate } from 'react-router-dom';
import { getEnabledModulesForCompany } from '../../constants/modules';
import CompanySearchSection from '../CompanySearchSection/CompanySearchSection';
import { useAppStore } from '@shared/state';

interface SidebarProps {
  isOpen: boolean;
  selectedCompany: Company | null;
  onCompanySelect: (companyId: string) => void;
}

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '280px' : '0'};
  background-color: ${props => props.theme.colors.background.primary};
  border-right: 1px solid ${props => props.theme.colors.gray[200]};
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const SidebarContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
  width: 280px;
  overflow-y: auto;
  flex: 1;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.gray[400]};
  }
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &.with-margin-top {
    margin-top: 2rem;
  }
`;

const HelpText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
`;

const ModuleList = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const ModuleItem = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:hover {
    background-color: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[200]};
    transform: translateX(2px);
  }
`;

const ModuleName = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
`;

const ModuleDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, selectedCompany, onCompanySelect }) => {
  const navigate = useNavigate();
  const { setSelectedCompany } = useAppStore();
  
  // Get enabled modules for the selected company
  const enabledModules = selectedCompany 
    ? getEnabledModulesForCompany(selectedCompany.modules)
    : [];

  const handleModuleClick = (moduleId: string) => {
    // Navigate to the full-page module dashboard (same as company profile)
    navigate(`/${moduleId}`);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    navigate(`/company/${company.id}`);
  };

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarContent>
        <CompanySearchSection 
          selectedCompany={selectedCompany}
          onCompanySelect={handleCompanySelect}
        />
        
        <SectionTitle>
          {selectedCompany ? 'Available Modules' : 'Modules'}
        </SectionTitle>
        
        <ModuleList>
          {selectedCompany ? (
            enabledModules.length > 0 ? (
              enabledModules.map((module) => (
                <ModuleItem 
                  key={module.id} 
                  onClick={() => handleModuleClick(module.id)}
                >
                  <ModuleName>{module.name}</ModuleName>
                  <ModuleDescription>{module.description}</ModuleDescription>
                </ModuleItem>
              ))
            ) : (
              <HelpText>
                No modules are enabled for this company. Contact your administrator to enable modules.
              </HelpText>
            )
          ) : (
            <HelpText>
              Please select a company to view available modules.
            </HelpText>
          )}
        </ModuleList>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
