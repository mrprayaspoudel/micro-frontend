
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
import { useModuleNavigate, CRMService } from '@shared/utils';
import { useAppStore } from '@shared/state';

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

interface CRMMetrics {
  totalCustomers: number;
  activeCustomers: number;
  totalLeads: number;
  qualifiedLeads: number;
  openOpportunities: number;
  totalOpportunityValue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageDealSize: number;
  activitiesThisMonth: number;
}

const Dashboard = () => {
  const moduleNavigate = useModuleNavigate();
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [metrics, setMetrics] = useState<CRMMetrics | null>(null);
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
        const crmData = await CRMService.loadCompanyCRMData(selectedCompany.id);
        setMetrics((crmData as any).metrics);
      } catch (error) {
        console.error('Failed to load CRM metrics:', error);
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
    { number: metrics.totalCustomers.toString(), label: 'Total Customers' },
    { number: metrics.totalLeads.toString(), label: 'Active Leads' },
    { number: metrics.openOpportunities.toString(), label: 'Open Opportunities' },
    { number: formatCurrency(metrics.monthlyRevenue), label: 'Monthly Revenue' },
    { number: metrics.qualifiedLeads.toString(), label: 'Qualified Leads' },
    { number: formatCurrency(metrics.totalOpportunityValue), label: 'Total Pipeline Value' },
    { number: `${metrics.conversionRate}%`, label: 'Conversion Rate' },
    { number: formatCurrency(metrics.averageDealSize), label: 'Average Deal Size' }
  ] : [];

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

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>CRM Dashboard</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view CRM metrics.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>CRM Dashboard</PageTitle>
      
      {loading ? (
        <CenteredMessage>
          <p>Loading CRM metrics...</p>
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
