
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
import { useModuleNavigate, HRService } from '@shared/utils';
import { useAppStore } from '@shared/state';

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

interface HRMetrics {
  totalEmployees: number;
  activeEmployees: number;
  newHiresThisMonth: number;
  departmentCount: number;
  averageSalary: number;
  attendanceRate: number;
  pendingLeaveRequests: number;
  approvedLeaveRequests: number;
  employeeTurnoverRate: number;
  totalPayroll: number;
  vacancyRate: number;
  trainingHoursThisMonth: number;
}

const Dashboard = () => {
  const moduleNavigate = useModuleNavigate();
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [metrics, setMetrics] = useState<HRMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!selectedCompany) {
        setMetrics(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const hrData = await HRService.loadCompanyHRData(selectedCompany.id);
        setMetrics((hrData as any).metrics);
      } catch (error) {
        console.error('Failed to load HR metrics:', error);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [selectedCompany]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = metrics ? [
    { number: metrics.totalEmployees.toString(), label: 'Total Employees' },
    { number: metrics.activeEmployees.toString(), label: 'Active Employees' },
    { number: `${metrics.attendanceRate}%`, label: 'Attendance Rate' },
    { number: metrics.newHiresThisMonth.toString(), label: 'New Hires This Month' },
    { number: metrics.pendingLeaveRequests.toString(), label: 'Pending Leave Requests' },
    { number: formatCurrency(metrics.averageSalary), label: 'Average Salary' },
    { number: `${metrics.employeeTurnoverRate}%`, label: 'Turnover Rate' },
    { number: formatCurrency(metrics.totalPayroll), label: 'Total Payroll' }
  ] : [];

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

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>HR Dashboard</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view HR metrics.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>HR Dashboard</PageTitle>
      
      {loading ? (
        <CenteredMessage>
          <p>Loading HR metrics...</p>
        </CenteredMessage>
      ) : (
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      )}

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
