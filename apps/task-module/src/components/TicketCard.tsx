import React from 'react';
import styled from 'styled-components';
import { Ticket, TicketPriority } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: (ticket: Ticket) => void;
}

const Card = styled.div<{ clickable?: boolean }>`
  height: 100%;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => props.theme.spacing.lg};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${props => props.clickable ? props.theme.shadows.lg : props.theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  gap: ${props => props.theme.spacing.sm};
`;

const Title = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
  margin: 0;
`;

const PriorityBadge = styled.span<{ priority: TicketPriority }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => {
    switch (props.priority) {
      case TicketPriority.URGENT:
        return '#fee2e2'; // red-100
      case TicketPriority.HIGH:
        return '#fef3c7'; // yellow-100
      case TicketPriority.MEDIUM:
        return props.theme.colors.primary[100];
      case TicketPriority.LOW:
      default:
        return props.theme.colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case TicketPriority.URGENT:
        return '#991b1b'; // red-800
      case TicketPriority.HIGH:
        return '#92400e'; // yellow-800
      case TicketPriority.MEDIUM:
        return props.theme.colors.primary[800];
      case TicketPriority.LOW:
      default:
        return props.theme.colors.gray[800];
    }
  }};
  white-space: nowrap;
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: 1.5;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: capitalize;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  color: ${props => props.theme.colors.text.secondary};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Timestamp = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const EstimatedHours = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <Card clickable={!!onClick} onClick={() => onClick && onClick(ticket)}>
      <CardHeader>
        <Title>{ticket.title}</Title>
        <PriorityBadge priority={ticket.priority}>
          {ticket.priority}
        </PriorityBadge>
      </CardHeader>

      <Description>{ticket.description}</Description>

      <BadgeContainer>
        <StatusBadge status={ticket.status}>
          {ticket.status.replace('-', ' ')}
        </StatusBadge>
        {ticket.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </BadgeContainer>

      <CardFooter>
        <Timestamp>
          Created {formatDistanceToNow(new Date(ticket.createdAt))} ago
        </Timestamp>
        {ticket.estimatedHours && (
          <EstimatedHours>Est: {ticket.estimatedHours}h</EstimatedHours>
        )}
      </CardFooter>
    </Card>
  );
};
