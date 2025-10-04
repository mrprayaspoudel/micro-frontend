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

const TypeBadge = styled.span<{ type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => 
    props.type === 'asset' 
      ? props.theme.colors.primary[100] 
      : props.type === 'liability'
      ? props.theme.colors.secondary[100]
      : props.type === 'revenue'
      ? '#dcfce7'
      : props.theme.colors.gray[100]
  };
  color: ${props => 
    props.type === 'asset' 
      ? props.theme.colors.primary[800] 
      : props.type === 'liability'
      ? props.theme.colors.secondary[800]
      : props.type === 'revenue'
      ? '#166534'
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

interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

const Accounts = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAccounts = async () => {
      if (!selectedCompany) {
        setAccounts([]);
        setFilteredAccounts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const accountData = await FinanceService.getAccounts(selectedCompany.id);
        setAccounts(accountData);
        setFilteredAccounts(accountData);
      } catch (error) {
        console.error('Failed to load accounts:', error);
        setAccounts([]);
        setFilteredAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, [selectedCompany]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(account => 
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  }, [searchTerm, accounts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Chart of Accounts</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view accounts.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Chart of Accounts</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search accounts by name, number, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Add Account
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading accounts...</p>
        </CenteredMessage>
      ) : filteredAccounts.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm ? 'No accounts found matching your search.' : 'No accounts found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Account #</TableHeaderCell>
                <TableHeaderCell>Account Name</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Balance</TableHeaderCell>
                <TableHeaderCell>Currency</TableHeaderCell>
                <TableHeaderCell>Last Updated</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <strong>{account.accountNumber}</strong>
                  </TableCell>
                  <TableCell>{account.accountName}</TableCell>
                  <TableCell>
                    <TypeBadge type={account.accountType}>
                      {account.accountType}
                    </TypeBadge>
                  </TableCell>
                  <TableCell>
                    <strong>{formatCurrency(account.balance)}</strong>
                  </TableCell>
                  <TableCell>{account.currency}</TableCell>
                  <TableCell>{formatDate(account.lastUpdated)}</TableCell>
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

export default Accounts;
