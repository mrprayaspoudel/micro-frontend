import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const Reports: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>CRM Reports</PageTitle>
      <p>CRM reports and analytics will be displayed here.</p>
    </PageContainer>
  );
};

export default Reports;
