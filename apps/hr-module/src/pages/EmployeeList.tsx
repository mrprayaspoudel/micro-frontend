import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { HRService } from '@shared/utils';
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
      : props.theme.colors.gray[100]
  };
  color: ${props => 
    props.status === 'active' 
      ? props.theme.colors.primary[800] 
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

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: string;
  manager?: string;
  address: string;
}

const EmployeeList = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadEmployees = async () => {
      if (!selectedCompany) {
        setEmployees([]);
        setFilteredEmployees([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const employeeData = await HRService.getEmployees(selectedCompany.id);
        setEmployees(employeeData);
        setFilteredEmployees(employeeData);
      } catch (error) {
        console.error('Failed to load employees:', error);
        setEmployees([]);
        setFilteredEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [selectedCompany]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee => 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

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
        <PageTitle>Employee Management</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view employees.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Employee Management</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search employees by name, email, department, or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Add Employee
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading employees...</p>
        </CenteredMessage>
      ) : filteredEmployees.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm ? 'No employees found matching your search.' : 'No employees found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Position</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Salary</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Hire Date</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <strong>{employee.employeeId}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{employee.firstName} {employee.lastName}</strong>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{formatCurrency(employee.salary)}</TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status.toLowerCase()}>
                      {employee.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(employee.hireDate)}</TableCell>
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

export default EmployeeList;
