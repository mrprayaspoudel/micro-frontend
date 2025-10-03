import React from 'react';
import styled from 'styled-components';
import { Company } from '@shared/state';

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
`;

const SidebarContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
  width: 280px;
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

const CompanyCard = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CompanyName = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const CompanyInfo = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, selectedCompany, onCompanySelect }) => {
  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarContent>
        <SectionTitle>Current Company</SectionTitle>
        
        {selectedCompany ? (
          <CompanyCard>
            <CompanyName>{selectedCompany.name}</CompanyName>
            <CompanyInfo>{selectedCompany.industry}</CompanyInfo>
            <CompanyInfo>{selectedCompany.employees} employees</CompanyInfo>
          </CompanyCard>
        ) : (
          <CompanyCard>
            <CompanyInfo>No company selected</CompanyInfo>
          </CompanyCard>
        )}
        
        <SectionTitle className="with-margin-top">Quick Actions</SectionTitle>
        
        <div>
          <HelpText>
            Use the global search to find and select a company
          </HelpText>
        </div>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
