import React from 'react';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const EmployeeCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const ActionButtonsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const mockEmployees = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0001',
    startDate: '2022-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Product Manager',
    department: 'Product',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1-555-0002',
    startDate: '2021-03-20'
  },
  {
    id: '3',
    name: 'Mike Brown',
    position: 'UX Designer',
    department: 'Design',
    email: 'mike.brown@techcorp.com',
    phone: '+1-555-0003',
    startDate: '2023-02-10'
  }
];

const EmployeeList: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Employee Management</PageTitle>
      
      <EmployeeGrid>
        {mockEmployees.map((employee) => (
          <EmployeeCard key={employee.id}>
            <h3>{employee.name}</h3>
            <p><strong>Position:</strong> {employee.position}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Start Date:</strong> {employee.startDate}</p>
            
            <ActionButtonsContainer>
              <Button size="sm" variant="primary">
                View Profile
              </Button>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </ActionButtonsContainer>
          </EmployeeCard>
        ))}
      </EmployeeGrid>
    </PageContainer>
  );
};

export default EmployeeList;
