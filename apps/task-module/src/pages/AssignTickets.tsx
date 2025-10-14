import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { useTicketStore } from '../stores/ticketStore';
import { useNotificationStore } from '../stores/notificationStore';
import { TicketCard } from '../components/TicketCard';
import { Ticket, User, UserRole } from '../types';
import {
  PageHeader,
  PageSubtitle,
  Grid,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText
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

const TicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const AssignButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing.sm};
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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const UserItem = styled.div<{ selected: boolean }>`
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  cursor: pointer;
  background-color: ${props => props.selected ? props.theme.colors.primary[50] : 'transparent'};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};

  &:hover {
    background-color: ${props => props.selected ? props.theme.colors.primary[50] : props.theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

// Mock users - in real app, fetch from API
const mockUsers: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: UserRole.USER },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: UserRole.USER },
  { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', role: UserRole.USER },
  { id: 'user-4', name: 'Alice Brown', email: 'alice@example.com', role: UserRole.USER },
];

export const AssignTickets: React.FC = () => {
  const { tickets, fetchTickets, assignTicket, getUnassignedTickets } = useTicketStore();
  const { addNotification } = useNotificationStore();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const unassignedTickets = getUnassignedTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleOpenDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
    setSelectedUser('');
  };

  const handleAssign = () => {
    if (selectedTicket && selectedUser) {
      assignTicket(selectedTicket.id, selectedUser);
      
      // Create notification for the user
      const notification = {
        id: `notif-${Date.now()}`,
        userId: selectedUser,
        ticketId: selectedTicket.id,
        type: 'assigned' as const,
        message: `You have been assigned ticket: ${selectedTicket.title}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      addNotification(notification);
      
      handleCloseDialog();
    }
  };

  return (
    <Container>
      <PageHeader>
        <Title>Assign Tickets</Title>
        <PageSubtitle>Assign unassigned tickets to team members</PageSubtitle>
      </PageHeader>

      <Grid>
        {unassignedTickets.map((ticket) => (
          <TicketContainer key={ticket.id}>
            <TicketCard ticket={ticket} />
            <AssignButton
              variant="primary"
              onClick={() => handleOpenDialog(ticket)}
            >
              Assign Ticket
            </AssignButton>
          </TicketContainer>
        ))}
        {unassignedTickets.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>🎫</EmptyStateIcon>
            <EmptyStateTitle>No unassigned tickets</EmptyStateTitle>
            <EmptyStateText>All tickets have been assigned</EmptyStateText>
          </EmptyState>
        )}
      </Grid>

      <Modal isOpen={openDialog} onClick={handleCloseDialog}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Assign Ticket: {selectedTicket?.title}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <SectionTitle>Select a team member to assign this ticket:</SectionTitle>
            <UserList>
              {mockUsers.map((user) => (
                <UserItem
                  key={user.id}
                  selected={selectedUser === user.id}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <Avatar>{user.name.charAt(0)}</Avatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                </UserItem>
              ))}
            </UserList>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedUser}
            >
              Assign
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AssignTickets;
