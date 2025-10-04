import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MenuItem } from '@shared/state';
import { MockApiService } from '@shared/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ModuleMenuProps {
  moduleId: string;
}

const MenuContainer = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding: 0 ${props => props.theme.spacing.lg};
`;

const MenuList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${props => props.theme.spacing.md};
`;

const MenuItemContainer = styled.li`
  position: relative;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  
  svg {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ease;
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
  min-width: 200px;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 10;
`;

const DropdownItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
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

const ModuleMenu: React.FC<ModuleMenuProps> = ({ moduleId }) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const loadModuleMenus = async () => {
      try {
        const modules = await MockApiService.get<Record<string, any>>('/modules');
        const moduleData = modules[moduleId];
        if (moduleData && moduleData.menus) {
          setMenus(moduleData.menus);
        }
      } catch (error) {
        // Failed to load module menus
      }
    };

    if (moduleId) {
      loadModuleMenus();
    }
  }, [moduleId]);

  const handleMenuClick = (menuItem: MenuItem) => {
    if (menuItem.children && menuItem.children.length > 0) {
      setOpenDropdown(openDropdown === menuItem.id ? null : menuItem.id);
    } else {
      // Navigate to the menu item path

    }
  };

  return (
    <MenuContainer>
      <MenuList>
        {menus.map((menuItem) => (
          <MenuItemContainer key={menuItem.id}>
            <MenuButton
              onClick={() => handleMenuClick(menuItem)}
            >
              {menuItem.label}
              {menuItem.children && menuItem.children.length > 0 && (
                <ChevronDownIcon 
                  style={{ 
                    transform: openDropdown === menuItem.id ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              )}
            </MenuButton>
            
            {menuItem.children && menuItem.children.length > 0 && (
              <Dropdown $isOpen={openDropdown === menuItem.id}>
                {menuItem.children.map((child) => (
                  <DropdownItem
                    key={child.id}
                    href={child.path}
                    onClick={(e) => {
                      e.preventDefault();

                      setOpenDropdown(null);
                    }}
                  >
                    {child.label}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </MenuItemContainer>
        ))}
      </MenuList>
    </MenuContainer>
  );
};

export default ModuleMenu;
