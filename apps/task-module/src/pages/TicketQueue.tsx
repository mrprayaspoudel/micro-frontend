import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { useTicketStore } from '../stores/ticketStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { formatDistanceToNow } from 'date-fns';
import {
  PageHeader,
  PageSubtitle,
  Alert,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  Card,
  Badge
} from '../components/CommonControls';

const TicketList = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  overflow: hidden;
`;

const TicketItem = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

const TicketHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TicketTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  flex: 1;
`;

const TicketContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const TicketDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const TicketMeta = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const TicketActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${props => props.theme.spacing.lg};
`;

const TicketRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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

const InfoBox = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: ${props => props.theme.spacing.lg} 0;
`;

const InfoAlert = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.primary[50]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.primary[800]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.lg};
`;

export const TicketQueue: React.FC = () => {
  const { tickets, fetchTickets, pickTicket } = useTicketStore();
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();
  const { currentUser } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTickets();
    if (currentUser) {
      fetchNotifications(currentUser.id);
    }
  }, [fetchTickets, fetchNotifications, currentUser]);

  const assignedToMeTickets = React.useMemo(() => {
    return tickets.filter(
      (t) =>
        t.assignedTo === currentUser?.id &&
        (t.status === TicketStatus.ASSIGNED || t.status === TicketStatus.IN_QUEUE)
    );
  }, [tickets, currentUser]);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const getPriorityVariant = (priority: TicketPriority): 'error' | 'warning' | 'primary' | 'secondary' => {
    switch (priority) {
      case TicketPriority.URGENT:
        return 'error';
      case TicketPriority.HIGH:
        return 'warning';
      case TicketPriority.MEDIUM:
        return 'primary';
      case TicketPriority.LOW:
      default:
        return 'secondary';
    }
  };

  const handleOpenDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const handlePickTicket = () => {
    if (selectedTicket && currentUser) {
      pickTicket(selectedTicket.id, currentUser.id);
      
      // Mark related notification as read
      const relatedNotif = notifications.find((n) => n.ticketId === selectedTicket.id);
      if (relatedNotif) {
        markAsRead(relatedNotif.id);
      }
      
      handleCloseDialog();
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>My Ticket Queue</PageTitle>
        <PageSubtitle>Pick up assigned tickets from your queue</PageSubtitle>
      </PageHeader>

      {unreadNotifications.length > 0 && (
        <Alert $variant="info">
          You have {unreadNotifications.length} new ticket assignment
          {unreadNotifications.length > 1 ? 's' : ''}!
        </Alert>
      )}

      {assignedToMeTickets.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateTitle>No tickets in queue</EmptyStateTitle>
          <EmptyStateText>You have no pending tickets assigned to you</EmptyStateText>
        </EmptyState>
      ) : (
        <TicketList>
          {assignedToMeTickets.map((ticket) => (
            <TicketItem key={ticket.id}>
              <TicketRow>
                <TicketContent>
                  <TicketHeader>
                    <TicketTitle>{ticket.title}</TicketTitle>
                    <Badge $variant={getPriorityVariant(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TicketHeader>
                  <TicketDescription>{ticket.description}</TicketDescription>
                  <TicketMeta>
                    Assigned {formatDistanceToNow(new Date(ticket.updatedAt))} ago
                  </TicketMeta>
                </TicketContent>
                <TicketActions>
                  <Button onClick={() => handleOpenDialog(ticket)}>
                    Pick Up
                  </Button>
                </TicketActions>
              </TicketRow>
            </TicketItem>
          ))}
        </TicketList>
      )}

      <Modal isOpen={openDialog}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Pick Up Ticket</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Are you ready to start working on this ticket?</p>
            <InfoBox>
              <TicketTitle>{selectedTicket?.title}</TicketTitle>
              <TicketDescription>{selectedTicket?.description}</TicketDescription>
            </InfoBox>
            <InfoAlert>
              Once you pick up this ticket, it will be moved to your active tasks and you'll be
              responsible for completing it.
            </InfoAlert>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseDialog} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handlePickTicket}>
              Pick Up Ticket
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default TicketQueue;
