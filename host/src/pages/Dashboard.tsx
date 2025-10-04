import React from 'react';
import styled from 'styled-components';
import { useAppStore } from '@shared/state';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const WelcomeCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[600]};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const InfoBox = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

const InfoTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InfoText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.5;
`;

const CompanyBadge = styled.div`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[800]};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Dashboard: React.FC = () => {
  const { selectedCompany } = useAppStore();

  return (
    <PageContainer>
      <WelcomeCard>
        <h3>Welcome to the Enterprise Platform</h3>
        <p>Manage your business operations across multiple modules from this unified dashboard.</p>
        
        {selectedCompany && (
          <CompanyBadge>
            Current Company: {selectedCompany.name}
          </CompanyBadge>
        )}
      </WelcomeCard>
      
      {selectedCompany ? (
        <StatsGrid>
          <StatCard>
            <StatValue>1,234</StatValue>
            <StatLabel>Total Customers</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>567</StatValue>
            <StatLabel>Active Leads</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>89</StatValue>
            <StatLabel>Open Opportunities</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>$234,567</StatValue>
            <StatLabel>Monthly Revenue</StatLabel>
          </StatCard>
        </StatsGrid>
      ) : (
        <InfoBox>
          <InfoTitle>📋 Get Started</InfoTitle>
          <InfoText>
            Please select a company first to use the system. Use the search bar in the sidebar to find and select your company.
            Once you select a company, you'll be able to access the modules available for that company.
          </InfoText>
        </InfoBox>
      )}
    </PageContainer>
  );
};

export default Dashboard;
