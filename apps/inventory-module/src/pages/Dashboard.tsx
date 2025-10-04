
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
import { useModuleNavigate, InventoryService } from '@shared/utils';
import { useAppStore } from '@shared/state';

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

interface InventoryMetrics {
  totalProducts: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalSuppliers: number;
  activeSuppliers: number;
  warehouseCount: number;
  warehouseUtilization: number;
  monthlyStockMovements: number;
  topSellingCategory: string;
  averageInventoryTurnover: number;
  stockAccuracy: number;
}

const Dashboard = () => {
  const moduleNavigate = useModuleNavigate();
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
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
        const inventoryData = await InventoryService.loadCompanyInventoryData(selectedCompany.id);
        setMetrics((inventoryData as any).metrics);
      } catch (error) {
        console.error('Failed to load Inventory metrics:', error);
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
    { number: metrics.totalProducts.toString(), label: 'Total Products' },
    { number: metrics.lowStockItems.toString(), label: 'Low Stock Items' },
    { number: formatCurrency(metrics.totalStockValue), label: 'Inventory Value' },
    { number: metrics.outOfStockItems.toString(), label: 'Out of Stock' },
    { number: metrics.totalSuppliers.toString(), label: 'Total Suppliers' },
    { number: metrics.warehouseCount.toString(), label: 'Warehouses' },
    { number: `${metrics.warehouseUtilization}%`, label: 'Warehouse Utilization' },
    { number: `${metrics.stockAccuracy}%`, label: 'Stock Accuracy' }
  ] : [];

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

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Inventory Dashboard</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view inventory metrics.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Inventory Dashboard</PageTitle>
      
      {loading ? (
        <CenteredMessage>
          <p>Loading inventory metrics...</p>
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
