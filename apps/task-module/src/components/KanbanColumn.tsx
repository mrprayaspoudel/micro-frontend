import React from 'react';
import styled from 'styled-components';
import { useDrop, useDrag } from 'react-dnd';
import { Stage, Ticket, TicketPriority } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface KanbanColumnProps {
  stage: Stage;
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

interface DraggableTicketCardProps {
  ticket: Ticket;
  onClick?: (ticket: Ticket) => void;
}

const ColumnContainer = styled.div`
  min-width: 300px;
  flex-shrink: 0;
`;

const ColumnPaper = styled.div<{ isOver: boolean }>`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.isOver ? props.theme.colors.gray[50] : props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  transition: background-color 0.2s ease;
  height: 100%;
`;

const ColumnHeader = styled.div<{ borderColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 3px solid ${props => props.borderColor};
`;

const ColumnTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CountBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[800]};
`;

const ColumnDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`;

const TicketsContainer = styled.div`
  min-height: 400px;
`;

const DraggableCard = styled.div<{ isDragging: boolean }>`
  margin-bottom: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => props.theme.spacing.md};
  cursor: grab;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  transition: box-shadow 0.2s ease, opacity 0.2s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active {
    cursor: grabbing;
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
  gap: ${props => props.theme.spacing.sm};
`;

const TicketTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  flex: 1;
`;

const PriorityBadge = styled.span<{ priority: TicketPriority }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => {
    switch (props.priority) {
      case TicketPriority.URGENT:
        return '#fee2e2';
      case TicketPriority.HIGH:
        return '#fef3c7';
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
        return '#991b1b';
      case TicketPriority.HIGH:
        return '#92400e';
      case TicketPriority.MEDIUM:
        return props.theme.colors.primary[800];
      case TicketPriority.LOW:
      default:
        return props.theme.colors.gray[800];
    }
  }};
  white-space: nowrap;
`;

const TicketDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: 1.5;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  color: ${props => props.theme.colors.text.secondary};
`;

const Timestamp = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  display: block;
  margin-top: ${props => props.theme.spacing.sm};
`;

const EmptyState = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.gray[50]};
`;

const EmptyStateText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const DraggableTicketCard: React.FC<DraggableTicketCardProps> = ({ ticket, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TICKET',
    item: { id: ticket.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [ticket.id]);

  return (
    <DraggableCard
      ref={drag}
      isDragging={isDragging}
      onClick={() => onClick && onClick(ticket)}
    >
      <TicketHeader>
        <TicketTitle>{ticket.title}</TicketTitle>
        <PriorityBadge priority={ticket.priority}>
          {ticket.priority}
        </PriorityBadge>
      </TicketHeader>

      <TicketDescription>
        {ticket.description.length > 100
          ? `${ticket.description.substring(0, 100)}...`
          : ticket.description}
      </TicketDescription>

      <TagsContainer>
        {ticket.tags?.slice(0, 2).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagsContainer>

      <Timestamp>
        {formatDistanceToNow(new Date(ticket.updatedAt))} ago
      </Timestamp>
    </DraggableCard>
  );
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, tickets, onTicketClick }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TICKET',
    drop: () => ({ stageId: stage.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [stage.id]);

  return (
    <ColumnContainer>
      <ColumnPaper ref={drop} isOver={isOver}>
        <ColumnHeader borderColor={stage.color}>
          <ColumnTitle>{stage.name}</ColumnTitle>
          <CountBadge>{tickets.length}</CountBadge>
        </ColumnHeader>

        {stage.description && (
          <ColumnDescription>{stage.description}</ColumnDescription>
        )}

        <TicketsContainer>
          {tickets.map((ticket) => (
            <DraggableTicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketClick}
            />
          ))}

          {tickets.length === 0 && (
            <EmptyState>
              <EmptyStateText>No tickets in this stage</EmptyStateText>
            </EmptyState>
          )}
        </TicketsContainer>
      </ColumnPaper>
    </ColumnContainer>
  );
};
