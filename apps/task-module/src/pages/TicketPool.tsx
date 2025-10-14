import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { useTicketStore } from '../stores/ticketStore';
import { useStageStore } from '../stores/stageStore';
import { TicketCard } from '../components/TicketCard';
import { Ticket } from '../types';
import {
  PageHeader,
  PageSubtitle,
  Grid,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText
} from '../components/CommonControls';

export const TicketPool: React.FC = () => {
  const { tickets, fetchTickets, getUnassignedTickets } = useTicketStore();
  const { stages, fetchStages } = useStageStore();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const unassignedTickets = getUnassignedTickets();

  useEffect(() => {
    fetchTickets();
    fetchStages();
  }, [fetchTickets, fetchStages]);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Unassigned Ticket Pool</PageTitle>
        <PageSubtitle>
          {unassignedTickets.length} tickets waiting to be assigned
        </PageSubtitle>
      </PageHeader>

      <Grid>
        {unassignedTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => setSelectedTicket(ticket)}
          />
        ))}
        {unassignedTickets.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>🎫</EmptyStateIcon>
            <EmptyStateTitle>No unassigned tickets</EmptyStateTitle>
            <EmptyStateText>All tickets have been assigned!</EmptyStateText>
          </EmptyState>
        )}
      </Grid>
    </PageContainer>
  );
};

export default TicketPool;
