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
    { number: '$2.4M', label: 'Total Revenue' },
    { number: '$180K', label: 'Monthly Expenses' },
    { number: '45', label: 'Pending Invoices' },
    { number: '12', label: 'Overdue Payments' }
  ];

  const quickActions = [
    {
      title: 'Account Management',
      description: 'View and manage financial accounts',
      action: () => moduleNavigate('/accounts'),
      buttonText: 'View Accounts'
    },
    {
      title: 'Invoice Management',
      description: 'Create and track invoices',
      action: () => moduleNavigate('/invoices'),
      buttonText: 'Manage Invoices'
    },
    {
      title: 'Financial Reports',
      description: 'Generate financial reports and insights',
      action: () => moduleNavigate('/reports'),
      buttonText: 'View Reports'
    },
    {
      title: 'Budget Planning',
      description: 'Plan and track budget allocations',
      action: () => moduleNavigate('/budget'),
      buttonText: 'Manage Budget'
    }
  ];

  return (
    <PageContainer>
      <PageTitle>Finance Dashboard</PageTitle>
      
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
