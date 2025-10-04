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
import { useModuleNavigate, FinanceService } from '@shared/utils';
import { useAppStore } from '@shared/state';

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

interface FinanceMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashFlow: number;
  profitMargin: number;
}

const Dashboard = () => {
  const moduleNavigate = useModuleNavigate();
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [metrics, setMetrics] = useState<FinanceMetrics | null>(null);
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
        const financeData = await FinanceService.loadCompanyFinanceData(selectedCompany.id);
        setMetrics((financeData as any).metrics);
      } catch (error) {
        console.error('Failed to load Finance metrics:', error);
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
    { number: formatCurrency(metrics.totalRevenue), label: 'Total Revenue' },
    { number: formatCurrency(metrics.monthlyRevenue), label: 'Monthly Revenue' },
    { number: formatCurrency(metrics.totalExpenses), label: 'Total Expenses' },
    { number: formatCurrency(metrics.netProfit), label: 'Net Profit' },
    { number: metrics.pendingInvoices.toString(), label: 'Pending Invoices' },
    { number: metrics.overdueInvoices.toString(), label: 'Overdue Invoices' },
    { number: formatCurrency(metrics.accountsReceivable), label: 'Accounts Receivable' },
    { number: `${metrics.profitMargin}%`, label: 'Profit Margin' }
  ] : [];

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

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Finance Dashboard</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view finance metrics.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Finance Dashboard</PageTitle>
      
      {loading ? (
        <CenteredMessage>
          <p>Loading finance metrics...</p>
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
