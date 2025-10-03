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
    { number: '1,247', label: 'Total Products' },
    { number: '89', label: 'Low Stock Items' },
    { number: '$125K', label: 'Inventory Value' },
    { number: '23', label: 'Out of Stock' }
  ];

  const quickActions = [
    {
      title: 'Product Management',
      description: 'View and manage product catalog',
      action: () => navigate('/products'),
      buttonText: 'View Products'
    },
    {
      title: 'Stock Management',
      description: 'Monitor and manage stock levels',
      action: () => navigate('/stock'),
      buttonText: 'Manage Stock'
    },
    {
      title: 'Inventory Reports',
      description: 'Generate inventory analytics and reports',
      action: () => navigate('/reports'),
      buttonText: 'View Reports'
    },
    {
      title: 'Purchase Orders',
      description: 'Create and track purchase orders',
      action: () => navigate('/orders'),
      buttonText: 'Manage Orders'
    }
  ];

  return (
    <PageContainer>
      <PageTitle>Inventory Dashboard</PageTitle>
      
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
