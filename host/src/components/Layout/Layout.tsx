import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore, useAppStore } from '@shared/state';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background.secondary};
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow: auto;
  background-color: ${props => props.theme.colors.background.primary};
`;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, company } = useAuthStore();
  const { selectedCompany } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/company/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <LayoutContainer>
      <Header
        user={user}
        company={company}
        onSearch={handleSearch}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <MainContainer>
        <Sidebar
          isOpen={sidebarOpen}
          selectedCompany={selectedCompany}
          onCompanySelect={handleCompanySelect}
        />
        
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;
