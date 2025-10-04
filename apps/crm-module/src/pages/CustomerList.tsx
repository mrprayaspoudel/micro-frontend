import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';

const CustomerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const CustomerCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const CustomerName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CustomerInfo = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0;
`;

const ActionButtonsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

// Mock customer data
const mockCustomers = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+1-555-0123',
    status: 'Active',
    lastContact: '2024-01-15'
  },
  {
    id: '2',
    name: 'Global Manufacturing Inc',
    email: 'info@globalmanuf.com',
    phone: '+1-555-0456',
    status: 'Active',
    lastContact: '2024-01-12'
  },
  {
    id: '3',
    name: 'HealthCare Plus',
    email: 'admin@healthcareplus.com',
    phone: '+1-555-0789',
    status: 'Prospect',
    lastContact: '2024-01-10'
  }
];

const CustomerList = () => {
  return (
    <PageContainer>
      <PageTitle>Customer Management</PageTitle>
      
      <CustomerGrid>
        {mockCustomers.map((customer) => (
          <CustomerCard key={customer.id}>
            <CustomerName>{customer.name}</CustomerName>
            <CustomerInfo><strong>Email:</strong> {customer.email}</CustomerInfo>
            <CustomerInfo><strong>Phone:</strong> {customer.phone}</CustomerInfo>
            <CustomerInfo><strong>Status:</strong> {customer.status}</CustomerInfo>
            <CustomerInfo><strong>Last Contact:</strong> {customer.lastContact}</CustomerInfo>
            
            <ActionButtonsContainer>
              <Button size="sm" variant="primary">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Contact
              </Button>
            </ActionButtonsContainer>
          </CustomerCard>
        ))}
      </CustomerGrid>
    </PageContainer>
  );
};

export default CustomerList;
