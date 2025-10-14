import React, { useEffect } from 'react';
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
import { useModuleNavigate } from '@shared/utils';
import { useAppStore } from '@shared/state';
import { useTicketStore } from '../stores/ticketStore';
import { useStageStore } from '../stores/stageStore';
import { TicketStatus } from '../types';

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

export const Dashboard: React.FC = () => {
  const moduleNavigate = useModuleNavigate();
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const { tickets, fetchTickets, loading } = useTicketStore();
  const { stages, fetchStages } = useStageStore();

  useEffect(() => {
    if (selectedCompany) {
      fetchTickets();
      fetchStages();
    }
  }, [selectedCompany, fetchTickets, fetchStages]);

  if (!selectedCompany) {
    return (
      <PageContainer>
        <CenteredMessage>
          Please select a company from the dropdown above to view task management data.
        </CenteredMessage>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <CenteredMessage>Loading task data...</CenteredMessage>
      </PageContainer>
    );
  }

  const stats = [
    { 
      number: tickets.length.toString(), 
      label: 'Total Tickets' 
    },
    { 
      number: tickets.filter(t => t.status === TicketStatus.NOT_ASSIGNED).length.toString(), 
      label: 'Unassigned' 
    },
    { 
      number: tickets.filter(t => t.status === TicketStatus.IN_QUEUE || t.status === TicketStatus.PICKED).length.toString(), 
      label: 'In Progress' 
    },
    { 
      number: tickets.filter(t => t.status === TicketStatus.COMPLETED).length.toString(), 
      label: 'Completed' 
    },
  ];

  const quickActions = [
    {
      title: 'Create New Ticket',
      description: 'Create a new task or ticket for your team',
      action: () => moduleNavigate('/create-ticket'),
      buttonText: 'Create Ticket'
    },
    {
      title: 'My Tickets',
      description: 'View and manage tickets assigned to you',
      action: () => moduleNavigate('/my-tickets'),
      buttonText: 'View My Tickets'
    },
    {
      title: 'Ticket Queue',
      description: 'Pick up tickets from your queue',
      action: () => moduleNavigate('/ticket-queue'),
      buttonText: 'View Queue'
    },
    {
      title: 'All Tickets',
      description: 'View all tickets in the system',
      action: () => moduleNavigate('/all-tickets'),
      buttonText: 'View All'
    },
  ];

  return (
    <PageContainer>
      <PageTitle>Task Management Dashboard</PageTitle>

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
            <Button onClick={action.action}>{action.buttonText}</Button>
          </ActionCard>
        ))}
      </QuickActionsGrid>
    </PageContainer>
  );
};

export default Dashboard;
