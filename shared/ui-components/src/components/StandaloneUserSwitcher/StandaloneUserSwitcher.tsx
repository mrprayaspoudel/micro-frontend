import React, { useState } from 'react';
import styled from 'styled-components';
import { useStandaloneAuth } from '../StandaloneAuth';

const UserSwitcherContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const StyledSelect = styled.select`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

const CurrentUser = styled.div`
  margin-top: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
`;

// Test users for standalone mode
const testUsers = [
  { email: 'admin@techcorp.com', name: 'Admin User', label: '👑 Admin (All Access)' },
  { email: 'manager@techcorp.com', name: 'Manager User', label: '👔 Manager (Most Access)' },
  { email: 'sales@techcorp.com', name: 'Sales Rep', label: '💼 Sales (CRM Focus)' },
  { email: 'hr@techcorp.com', name: 'HR Specialist', label: '👥 HR (HR Focus)' },
  { email: 'finance@techcorp.com', name: 'Finance Analyst', label: '💰 Finance (Finance Focus)' },
  { email: 'inventory@techcorp.com', name: 'Inventory Manager', label: '📦 Inventory (Inventory Focus)' }
];

/**
 * User switcher for standalone module development
 * Allows developers to test different user roles and permissions
 */
const StandaloneUserSwitcher: React.FC = () => {
  const { user, login } = useStandaloneAuth();
  const [isVisible, setIsVisible] = useState(true);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const email = event.target.value;
    if (email) {
      login(email);
    }
  };

  if (!isVisible) {
    return null;
  }

  const selectId = 'test-user-select';
  const labelId = 'test-user-label';

  return (
    <UserSwitcherContainer>
      <Label id={labelId} htmlFor={selectId}>👤 Test User:</Label>
      <StyledSelect 
        id={selectId}
        name="testUserSelect"
        value={user?.email || ''} 
        onChange={handleUserChange}
        title="Select test user for development"
        aria-label="Test user selector"
        aria-labelledby={labelId}
        aria-describedby="current-user-info"
      >
        <option value="">Select a test user...</option>
        {testUsers.map(testUser => (
          <option key={testUser.email} value={testUser.email}>
            {testUser.label}
          </option>
        ))}
      </StyledSelect>
      <CurrentUser id="current-user-info">
        Current: {user?.name || 'None'}
      </CurrentUser>
    </UserSwitcherContainer>
  );
};

export default StandaloneUserSwitcher;
