import React, { useState } from 'react';
import styled from 'styled-components';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: 2.5rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  color: ${props => props.theme.colors.text.tertiary};
  pointer-events: none;
`;

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  className
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
    <SearchContainer className={className}>
      <SearchIcon />
      <SearchInputField
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </SearchContainer>
  );
};
