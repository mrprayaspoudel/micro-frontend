
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
    { number: '156', label: 'Total Employees' },
    { number: '89%', label: 'Attendance Rate' },
    { number: '12', label: 'New Hires' },
    { number: '3', label: 'Pending Reviews' }
  ];

  const quickActions = [
    {
      title: 'Employee Management',
      description: 'View and manage employee records',
      action: () => moduleNavigate('/employees'),
      buttonText: 'View Employees'
    },
    {
      title: 'Attendance Tracking',
      description: 'Monitor attendance and time records',
      action: () => moduleNavigate('/attendance'),
      buttonText: 'Track Attendance'
    },
    {
      title: 'Performance Reviews',
      description: 'Manage employee performance evaluations',
      action: () => moduleNavigate('/reviews'),
      buttonText: 'View Reviews'
    },
    {
      title: 'Payroll Management',
      description: 'Process and manage employee payroll',
      action: () => moduleNavigate('/payroll'),
      buttonText: 'Manage Payroll'
    }
  ];

  return (
    <PageContainer>
      <PageTitle>HR Dashboard</PageTitle>
      
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
