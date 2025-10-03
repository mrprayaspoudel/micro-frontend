import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Company } from '@shared/state';
import { MockApiService } from '@shared/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchDropdownProps {
  placeholder?: string;
  onCompanySelect: (company: Company) => void;
  onSearch: (query: string) => void;
}

const SearchContainer = styled.div`
  position: relative;
  width: 400px;
  
  @media (max-width: 768px) {
    width: 300px;
  }
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
  outline: none;
  transition: all 0.2s ease-in-out;
  
  &:focus {
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
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: ${props => props.theme.colors.text.tertiary};
  pointer-events: none;
`;

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-top: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const SearchResultItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CompanyName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 2px;
`;

const CompanyInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const NoResults = styled.div`
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ViewAllResults = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background-color: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  text-align: center;
  cursor: pointer;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[100]};
  }
`;

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  placeholder = "Search companies...",
  onCompanySelect,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load companies on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesData = await MockApiService.get<Company[]>('/companies');
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };

    loadCompanies();
  }, []);

  // Filter companies based on search query
  useEffect(() => {
    if (query.trim().length >= 2 && companies.length > 0) {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.email.toLowerCase().includes(query.toLowerCase()) ||
        company.industry.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 results in dropdown
      
      setFilteredCompanies(filtered);
      setIsOpen(true);
    } else {
      setFilteredCompanies([]);
      setIsOpen(false);
    }
  }, [query, companies]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query);
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleCompanyClick = (company: Company) => {
    onCompanySelect(company);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      onSearch(query);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <SearchContainer ref={containerRef}>
      <SearchIcon />
      <SearchInputField
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length >= 2 && filteredCompanies.length > 0) {
            setIsOpen(true);
          }
        }}
      />
      
  <DropdownContainer $isOpen={isOpen}>
        {filteredCompanies.length > 0 ? (
          <>
            {filteredCompanies.map((company) => (
              <SearchResultItem
                key={company.id}
                onClick={() => handleCompanyClick(company)}
              >
                <CompanyName>{company.name}</CompanyName>
                <CompanyInfo>
                  {company.industry} • {company.employees} employees • {company.email}
                </CompanyInfo>
              </SearchResultItem>
            ))}
            
            {companies.filter(company => 
              company.name.toLowerCase().includes(query.toLowerCase()) ||
              company.email.toLowerCase().includes(query.toLowerCase()) ||
              company.industry.toLowerCase().includes(query.toLowerCase())
            ).length > 5 && (
              <ViewAllResults onClick={handleViewAllResults}>
                View all results for "{query}"
              </ViewAllResults>
            )}
          </>
        ) : query.trim().length >= 2 ? (
          <NoResults>
            No companies found for "{query}"
          </NoResults>
        ) : null}
      </DropdownContainer>
    </SearchContainer>
  );
};

export default SearchDropdown;
