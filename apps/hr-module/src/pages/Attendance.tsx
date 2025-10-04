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
  width: 200px;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const DateInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  width: 150px;
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
    props.status === 'present' 
      ? props.theme.colors.primary[100] 
      : props.status === 'absent'
      ? '#fca5a5'
      : props.theme.colors.secondary[100]
  };
  color: ${props => 
    props.status === 'present' 
      ? props.theme.colors.primary[800] 
      : props.status === 'absent'
      ? '#7f1d1d'
      : props.theme.colors.secondary[800]
  };
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface AttendanceRecord {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: string;
}

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
}

const Attendance = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) {
        setAttendance([]);
        setEmployees([]);
        setFilteredAttendance([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [attendanceData, employeeData] = await Promise.all([
          HRService.getAttendance(selectedCompany.id),
          HRService.getEmployees(selectedCompany.id)
        ]);
        setAttendance(attendanceData);
        setEmployees(employeeData);
        setFilteredAttendance(attendanceData);
      } catch (error) {
        console.error('Failed to load attendance data:', error);
        setAttendance([]);
        setEmployees([]);
        setFilteredAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCompany]);

  useEffect(() => {
    let filtered = attendance;

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
        const employeeId = employee ? employee.employeeId : '';
        
        return (
          employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredAttendance(filtered);
  }, [searchTerm, selectedDate, attendance, employees]);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const getEmployeeDetails = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Attendance Management</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view attendance records.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Attendance Management</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by employee name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DateInput
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Mark Attendance
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading attendance records...</p>
        </CenteredMessage>
      ) : filteredAttendance.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm || selectedDate ? 'No attendance records found for the selected criteria.' : 'No attendance records found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Employee Name</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Check In</TableHeaderCell>
                <TableHeaderCell>Check Out</TableHeaderCell>
                <TableHeaderCell>Hours Worked</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record, index) => {
                const employee = getEmployeeDetails(record.employeeId);
                return (
                  <TableRow key={`${record.employeeId}-${record.date}-${index}`}>
                    <TableCell>
                      <strong>{employee?.employeeId || record.employeeId}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{getEmployeeName(record.employeeId)}</strong>
                    </TableCell>
                    <TableCell>{employee?.department || '-'}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.checkIn || '-'}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>
                      <strong>{record.hoursWorked.toFixed(2)}h</strong>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status}>
                        {record.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default Attendance;
