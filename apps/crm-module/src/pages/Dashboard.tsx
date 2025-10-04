
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
    { number: '247', label: 'Total Customers' },
    { number: '89', label: 'Active Leads' },
    { number: '34', label: 'Open Opportunities' },
    { number: '$1.2M', label: 'Monthly Revenue' }
  ];

  const quickActions = [
    {
      title: 'Customer Management',
      description: 'View and manage your customer database',
      action: () => moduleNavigate('/customers'),
      buttonText: 'View Customers'
    },
    {
      title: 'Lead Tracking',
      description: 'Track and nurture your sales leads',
      action: () => moduleNavigate('/leads'),
      buttonText: 'Manage Leads'
    },
    {
      title: 'Opportunities',
      description: 'Monitor sales opportunities and deals',
      action: () => moduleNavigate('/opportunities'),
      buttonText: 'View Opportunities'
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate insights from your CRM data',
      action: () => moduleNavigate('/reports'),
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
