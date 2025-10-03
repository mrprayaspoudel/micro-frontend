import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const StatNumber = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[600]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ActionCard = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const ActionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '247', label: 'Total Customers' },
    { number: '89', label: 'Active Leads' },
    { number: '34', label: 'Open Opportunities' },
    { number: '$1.2M', label: 'Monthly Revenue' }
  ];

  const quickActions = [
    {
      title: 'Customer Management',
      description: 'View and manage your customer database',
      action: () => navigate('/customers'),
      buttonText: 'View Customers'
    },
    {
      title: 'Lead Tracking',
      description: 'Track and nurture your sales leads',
      action: () => navigate('/leads'),
      buttonText: 'Manage Leads'
    },
    {
      title: 'Opportunities',
      description: 'Monitor sales opportunities and deals',
      action: () => navigate('/opportunities'),
      buttonText: 'View Opportunities'
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate insights from your CRM data',
      action: () => navigate('/reports'),
      buttonText: 'View Reports'
    }
  ];

  return (
    <PageContainer>
      <PageTitle>CRM Dashboard</PageTitle>
      
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard key={index}>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
            <Button onClick={action.action} variant="primary" size="sm">
              {action.buttonText}
            </Button>
          </ActionCard>
        ))}
      </QuickActionsGrid>
    </PageContainer>
  );
};

export default Dashboard;
