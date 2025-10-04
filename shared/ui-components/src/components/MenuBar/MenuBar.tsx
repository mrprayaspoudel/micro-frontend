import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useModuleMenus, useModuleNavigate } from '@shared/utils';
import type { MenuItem } from '@shared/utils';

interface MenuBarProps {
  moduleId: string;
  currentPath?: string;
}

const MenuBarContainer = styled.nav`
  background-color: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding: 0;
`;

const MenuList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0 ${props => props.theme.spacing.sm};
  gap: 0;
`;

const MenuItemContainer = styled.li`
  position: relative;
`;

const MenuButton = styled.button<{ $isActive?: boolean; $hasChildren?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.$isActive 
    ? props.theme.colors.primary[100] 
    : 'transparent'};
  color: ${props => props.$isActive 
    ? props.theme.colors.primary[700] 
    : props.theme.colors.text.primary};
  border: 1px solid ${props => props.$isActive 
    ? props.theme.colors.primary[300] 
    : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[700]};
    border-color: ${props => props.theme.colors.primary[200]};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  margin-top: ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.$isActive 
    ? props.theme.colors.primary[50] 
    : 'transparent'};
  color: ${props => props.$isActive 
    ? props.theme.colors.primary[700] 
    : props.theme.colors.text.primary};
  border: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary[50]};
    color: ${props => props.theme.colors.primary[700]};
  }

  &:first-child {
    border-top-left-radius: ${props => props.theme.borderRadius.md};
    border-top-right-radius: ${props => props.theme.borderRadius.md};
  }

  &:last-child {
    border-bottom-left-radius: ${props => props.theme.borderRadius.md};
    border-bottom-right-radius: ${props => props.theme.borderRadius.md};
  }
`;



const MenuBarComponent: React.FC<MenuBarProps> = ({ 
  moduleId, 
  currentPath = '/' 
}) => {
  const { menus, loading, error } = useModuleMenus(moduleId);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const moduleNavigate = useModuleNavigate();

  const toggleDropdown = (menuId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(menuId)) {
      newOpenDropdowns.delete(menuId);
    } else {
      newOpenDropdowns.add(menuId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.children && menu.children.length > 0) {
      toggleDropdown(menu.id);
    } else if (menu.path) {
      moduleNavigate(menu.path);
      // Close all dropdowns after navigation
      setOpenDropdowns(new Set());
    }
  };

  const handleDropdownItemClick = (menu: MenuItem) => {
    if (menu.path) {
      moduleNavigate(menu.path);
      setOpenDropdowns(new Set());
    }
  };

  const isMenuActive = (menu: MenuItem): boolean => {
    if (menu.path === currentPath) return true;
    if (menu.children) {
      return menu.children.some(child => isMenuActive(child));
    }
    return false;
  };

  if (loading) {
    return (
      <MenuBarContainer>
        <MenuList>
          <li>Loading menus...</li>
        </MenuList>
      </MenuBarContainer>
    );
  }

  if (error) {
    return (
      <MenuBarContainer>
        <MenuList>
          <li>{error}</li>
        </MenuList>
      </MenuBarContainer>
    );
  }

  return (
    <MenuBarContainer>
      <MenuList>
        {menus.map((menu: MenuItem) => (
          <MenuItemContainer key={menu.id}>
            <MenuButton
              $isActive={isMenuActive(menu)}
              $hasChildren={!!(menu.children && menu.children.length > 0)}
              onClick={() => handleMenuClick(menu)}
            >
              {menu.label}
              {menu.children && menu.children.length > 0 && (
                openDropdowns.has(menu.id) ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronRightIcon />
                )
              )}
            </MenuButton>
            
            {menu.children && menu.children.length > 0 && (
              <DropdownContainer $isOpen={openDropdowns.has(menu.id)}>
                {menu.children.map((child: MenuItem) => (
                  <DropdownItem
                    key={child.id}
                    $isActive={child.path === currentPath}
                    onClick={() => handleDropdownItemClick(child)}
                  >
                    {child.label}
                  </DropdownItem>
                ))}
              </DropdownContainer>
            )}
          </MenuItemContainer>
        ))}
      </MenuList>
    </MenuBarContainer>
  );
};

export default MenuBarComponent;
