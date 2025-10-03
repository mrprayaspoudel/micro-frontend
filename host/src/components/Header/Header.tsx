import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  CpuChipIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { NotificationBadge } from '@shared/ui-components';
import { User, Company } from '@shared/state';
import { useAppStore, useAuthStore } from '@shared/state';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import ProfileModal from '../ProfileModal/ProfileModal';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: User | null;
  company: Company | null;
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  height: 64px;
  background-color: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[600]};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
  }
`;

const MenuButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const IconButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;

const UserAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 50;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
  
  &:first-child {
    border-top-left-radius: ${props => props.theme.borderRadius.lg};
    border-top-right-radius: ${props => props.theme.borderRadius.lg};
  }
  
  &:last-child {
    border-bottom-left-radius: ${props => props.theme.borderRadius.lg};
    border-bottom-right-radius: ${props => props.theme.borderRadius.lg};
  }
`;

const Header: React.FC<HeaderProps> = ({ user, company, onSearch, onToggleSidebar }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { unreadNotificationsCount, setSelectedCompany } = useAppStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    navigate(`/company/${company.id}`);
  };

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    navigate('/login');
  };

  const handleProfileSettings = () => {
    setUserDropdownOpen(false);
    setProfileModalOpen(true);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <Bars3Icon />
        </MenuButton>
        
        <LogoSection onClick={() => navigate('/dashboard')}>
          <CpuChipIcon style={{ width: '2rem', height: '2rem' }} />
          Enterprise Platform
        </LogoSection>
      </LeftSection>

      <SearchDropdown
        placeholder="Search companies..."
        onCompanySelect={handleCompanySelect}
        onSearch={handleSearch}
      />

      <RightSection>
        <IconButton title="Knowledge Base">
          <QuestionMarkCircleIcon />
        </IconButton>
        
        <IconButton title="AI Assistant">
          <CpuChipIcon />
        </IconButton>
        
        <NotificationBadge 
          count={unreadNotificationsCount}
          onClick={() => console.log('Show notifications')}
        />
        
        {user && (
          <UserDropdown ref={userDropdownRef}>
            <UserButton onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <UserAvatar 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`} 
                alt={`${user.firstName} ${user.lastName}`} 
              />
              <UserName>{user.firstName} {user.lastName}</UserName>
              <ChevronDownIcon style={{ width: '1rem', height: '1rem' }} />
            </UserButton>
            
            <DropdownMenu $isOpen={userDropdownOpen}>
              <DropdownItem onClick={handleProfileSettings}>Profile Settings</DropdownItem>
              <DropdownItem onClick={handleProfileSettings}>Change Password</DropdownItem>
              <DropdownItem onClick={handleProfileSettings}>Preferences</DropdownItem>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          </UserDropdown>
        )}
      </RightSection>
      
      <ProfileModal 
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />
    </HeaderContainer>
  );
};

export default Header;
