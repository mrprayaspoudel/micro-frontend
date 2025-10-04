import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { CRMService } from '@shared/utils';
import { useAppStore } from '@shared/state';

const SearchContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  width: 300px;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const TableContainer = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.gray[50]};
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => 
    props.status === 'active' 
      ? props.theme.colors.primary[100] 
      : props.status === 'prospect'
      ? props.theme.colors.secondary[100]
      : props.theme.colors.gray[100]
  };
  color: ${props => 
    props.status === 'active' 
      ? props.theme.colors.primary[800] 
      : props.status === 'prospect'
      ? props.theme.colors.secondary[800]
      : props.theme.colors.gray[800]
  };
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
}

const CustomerList = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      if (!selectedCompany) {
        setCustomers([]);
        setFilteredCustomers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const customerData = await CRMService.getCustomers(selectedCompany.id);
        setCustomers(customerData);
        setFilteredCustomers(customerData);
      } catch (error) {
        console.error('Failed to load customers:', error);
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [selectedCompany]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Customer Management</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view customers.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Customer Management</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search customers by name, email, industry, or assigned to..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Add Customer
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading customers...</p>
        </CenteredMessage>
      ) : filteredCustomers.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm ? 'No customers found matching your search.' : 'No customers found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>Industry</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Assigned To</TableHeaderCell>
                <TableHeaderCell>Last Contact</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <strong>{customer.name}</strong>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.industry}</TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status.toLowerCase()}>
                      {customer.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{customer.assignedTo}</TableCell>
                  <TableCell>{formatDate(customer.lastContact)}</TableCell>
                  <TableCell>
                    <ActionButtonsContainer>
                      <Button size="sm" variant="primary">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </ActionButtonsContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default CustomerList;
