import React, { useState, Suspense } from 'react';
import styled from 'styled-components';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@shared/ui-components';
import { User } from '@shared/state';

// Lazy load the components to avoid circular dependencies
const ProfileSettings = React.lazy(() => import('./ProfileSettings'));
const ChangePassword = React.lazy(() => import('./ChangePassword'));
const Preferences = React.lazy(() => import('./Preferences'));

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

type TabType = 'profile' | 'password' | 'preferences';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  transform: scale(${props => props.$isOpen ? 1 : 0.9});
  transition: transform 0.3s ease-in-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  background-color: ${props => props.theme.colors.background.primary};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$isActive' && prop !== 'isActive'
})<{ $isActive: boolean }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  background: ${props => props.$isActive ? props.theme.colors.background.primary : 'transparent'};
  color: ${props => props.$isActive ? props.theme.colors.primary[600] : props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.$isActive ? props.theme.typography.fontWeight.medium : props.theme.typography.fontWeight.normal};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.$isActive ? props.theme.colors.primary[600] : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.primary};
    color: ${props => props.theme.colors.primary[600]};
  }
`;

const ModalContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-height: 400px;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Suspense fallback={<LoadingContainer>Loading...</LoadingContainer>}>
            <ProfileSettings user={user} onClose={onClose} />
          </Suspense>
        );
      case 'password':
        return (
          <Suspense fallback={<LoadingContainer>Loading...</LoadingContainer>}>
            <ChangePassword user={user} onClose={onClose} />
          </Suspense>
        );
      case 'preferences':
        return (
          <Suspense fallback={<LoadingContainer>Loading...</LoadingContainer>}>
            <Preferences user={user} onClose={onClose} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>Account Settings</ModalTitle>
          <CloseButton onClick={onClose}>
            <XMarkIcon />
          </CloseButton>
        </ModalHeader>
        
        <TabContainer>
          <Tab 
            $isActive={activeTab === 'profile'} 
            onClick={() => handleTabChange('profile')}
          >
            Profile Settings
          </Tab>
          <Tab 
            $isActive={activeTab === 'password'} 
            onClick={() => handleTabChange('password')}
          >
            Change Password
          </Tab>
          <Tab 
            $isActive={activeTab === 'preferences'} 
            onClick={() => handleTabChange('preferences')}
          >
            Preferences
          </Tab>
        </TabContainer>
        
        <ModalContent>
          {renderTabContent()}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProfileModal;
