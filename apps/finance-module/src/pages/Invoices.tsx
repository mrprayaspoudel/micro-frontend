import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { FinanceService } from '@shared/utils';
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
    props.status === 'paid' 
      ? props.theme.colors.primary[100] 
      : props.status === 'pending'
      ? props.theme.colors.secondary[100]
      : '#fca5a5'
  };
  color: ${props => 
    props.status === 'paid' 
      ? props.theme.colors.primary[800] 
      : props.status === 'pending'
      ? props.theme.colors.secondary[800]
      : '#7f1d1d'
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const Invoices = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      if (!selectedCompany) {
        setInvoices([]);
        setFilteredInvoices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const invoiceData = await FinanceService.getInvoices(selectedCompany.id);
        setInvoices(invoiceData);
        setFilteredInvoices(invoiceData);
      } catch (error) {
        console.error('Failed to load invoices:', error);
        setInvoices([]);
        setFilteredInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [selectedCompany]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Invoice Management</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view invoices.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Invoice Management</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search invoices by number, customer, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Create Invoice
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading invoices...</p>
        </CenteredMessage>
      ) : filteredInvoices.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm ? 'No invoices found matching your search.' : 'No invoices found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Invoice #</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Issue Date</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
                <TableHeaderCell>Paid Date</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <strong>{invoice.invoiceNumber}</strong>
                  </TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>
                    <strong>{formatCurrency(invoice.amount, invoice.currency)}</strong>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status}>
                      {invoice.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>{invoice.paidDate ? formatDate(invoice.paidDate) : '-'}</TableCell>
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

export default Invoices;
