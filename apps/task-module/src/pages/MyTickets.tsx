import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@shared/ui-components';
import { useTicketStore } from '../stores/ticketStore';
import { useStageStore } from '../stores/stageStore';
import { useAuthStore } from '../stores/authStore';
import { KanbanColumn } from '../components/KanbanColumn';
import { Ticket, TicketStatus } from '../types';
import {
  PageHeader,
  PageSubtitle,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  Label,
  TextArea
} from '../components/CommonControls';

const Container = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const KanbanContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  overflow-x: auto;
  padding-bottom: ${props => props.theme.spacing.lg};
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`;

export const MyTickets: React.FC = () => {
  const { tickets, fetchTickets, moveTicketToStage, rerouteTicket } = useTicketStore();
  const { stages, fetchStages } = useStageStore();
  const { currentUser } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openRerouteDialog, setOpenRerouteDialog] = useState(false);
  const [rerouteReason, setRerouteReason] = useState('');

  useEffect(() => {
    fetchTickets();
    fetchStages();
  }, [fetchTickets, fetchStages]);

  const myTickets = React.useMemo(() => {
    return tickets.filter(
      (t) =>
        (t.assignedTo === currentUser?.id || t.pickedBy === currentUser?.id) &&
        t.status === TicketStatus.PICKED
    );
  }, [tickets, currentUser]);

  const kanbanColumns = React.useMemo(() => {
    return stages.map((stage) => ({
      id: stage.id,
      stage,
      tickets: myTickets.filter((t) => t.stageId === stage.id),
    }));
  }, [stages, myTickets]);

  const handleDragEnd = (item: any, monitor: any) => {
    const dropResult = monitor.getDropResult();
    
    if (!dropResult) return;
    
    const ticketId = item.id;
    const newStageId = dropResult.stageId;
    
    moveTicketToStage(ticketId, newStageId);
  };

  const handleOpenRerouteDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenRerouteDialog(true);
  };

  const handleCloseRerouteDialog = () => {
    setOpenRerouteDialog(false);
    setSelectedTicket(null);
    setRerouteReason('');
  };

  const handleReroute = () => {
    if (selectedTicket && rerouteReason.trim()) {
      rerouteTicket(selectedTicket.id, rerouteReason);
      handleCloseRerouteDialog();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <PageHeader>
          <Title>My Active Tickets</Title>
          <PageSubtitle>
            {myTickets.length} active {myTickets.length === 1 ? 'ticket' : 'tickets'}
          </PageSubtitle>
        </PageHeader>

        <KanbanContainer>
          {kanbanColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              stage={column.stage}
              tickets={column.tickets}
              onTicketClick={(ticket: Ticket) => setSelectedTicket(ticket)}
            />
          ))}
        </KanbanContainer>

        {myTickets.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>🎫</EmptyStateIcon>
            <EmptyStateTitle>No active tickets</EmptyStateTitle>
            <EmptyStateText>
              Pick up tickets from your queue to start working
            </EmptyStateText>
          </EmptyState>
        )}

        <Modal isOpen={openRerouteDialog} onClick={handleCloseRerouteDialog}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Reroute Ticket</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Label>Please provide a reason for rerouting this ticket:</Label>
              <TextArea
                value={rerouteReason}
                onChange={(e) => setRerouteReason(e.target.value)}
                placeholder="Explain why you need to reroute this ticket..."
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={handleCloseRerouteDialog}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleReroute}
                disabled={!rerouteReason.trim()}
              >
                Reroute
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </DndProvider>
  );
};

export default MyTickets;
