import React from 'react';
import styled from 'styled-components';
import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  onClick?: () => void;
  className?: string;
}

const BadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;

const StyledBellIcon = styled(BellIcon)`
  width: 1.5rem;
  height: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Badge = styled.span`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.375rem;
  min-width: 1.25rem;
  height: 1.25rem;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: white;
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.full};
  border: 2px solid ${props => props.theme.colors.background.primary};
`;

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  onClick,
  className
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <BadgeContainer onClick={onClick} className={className}>
      <IconWrapper>
        <StyledBellIcon />
      </IconWrapper>
      {count > 0 && <Badge>{displayCount}</Badge>}
    </BadgeContainer>
  );
};
