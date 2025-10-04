
import {
  Button,
  PageContainer,
  PageTitle,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  QuickActionsGrid,
  ActionCard,
  ActionTitle,
  ActionDescription
} from '@shared/ui-components';
import { useModuleNavigate } from '@shared/utils';

const Dashboard = () => {
  const moduleNavigate = useModuleNavigate();

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
      action: () => moduleNavigate('/products'),
      buttonText: 'View Products'
    },
    {
      title: 'Stock Management',
      description: 'Monitor and manage stock levels',
      action: () => moduleNavigate('/stock'),
      buttonText: 'Manage Stock'
    },
    {
      title: 'Inventory Reports',
      description: 'Generate inventory analytics and reports',
      action: () => moduleNavigate('/reports'),
      buttonText: 'View Reports'
    },
    {
      title: 'Purchase Orders',
      description: 'Create and track purchase orders',
      action: () => moduleNavigate('/orders'),
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
