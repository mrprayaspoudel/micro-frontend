import React from 'react';
import styled from 'styled-components';

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
  padding: ${props => props.theme.spacing.xl};
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

const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Dashboard</PageTitle>
      
      <WelcomeCard>
        <h2>Welcome to the Enterprise Platform</h2>
        <p>Manage your business operations across multiple modules from this unified dashboard.</p>
      </WelcomeCard>
      
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
    </PageContainer>
  );
};

export default Dashboard;
