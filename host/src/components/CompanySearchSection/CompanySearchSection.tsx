import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Company } from '@shared/state';
import { MockApiService } from '@shared/utils';
import { MagnifyingGlassIcon, ChevronDownIcon, BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDropdownManager } from '../../hooks/useDropdownManager';

interface CompanySearchSectionProps {
  selectedCompany: Company | null;
  onCompanySelect: (company: Company) => void;
  onCompanyReset?: () => void;
}

const SearchSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: ${props => props.theme.colors.gray[100]};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 5;
  
  &.visible {
    opacity: 1;
    visibility: visible;
  }
  
  &:hover {
    background: ${props => props.theme.colors.gray[200]};
    transform: translateY(-50%) scale(1.1);
  }
  
  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const CompanyResetButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  width: 2rem;
  height: 2rem;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);
  
  &:hover {
    opacity: 1;
    transform: scale(1);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
    color: ${props => props.theme.colors.primary[600]};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: 2.5rem;
  padding-right: 4rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary[400]};
    background-color: ${props => props.theme.colors.background.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[100]};
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
  width: 1rem;
  height: 1rem;
  color: ${props => props.theme.colors.text.tertiary};
  pointer-events: none;
`;

const DropdownButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  
  svg {
    width: 1rem;
    height: 1rem;
    color: ${props => props.theme.colors.text.secondary};
    transition: transform 0.2s ease;
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  
  /* Custom scrollbar for dropdown */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: 2px;
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[50]};
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
  line-height: 1.3;
`;

const CurrentCompanyCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[50]} 0%, ${props => props.theme.colors.primary[100]} 100%);
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary[400]} 0%, ${props => props.theme.colors.primary[600]} 100%);
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    ${CompanyResetButton} {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CompanyIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]} 0%, ${props => props.theme.colors.primary[600]} 100%);
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: white;
  }
`;

const CompanyDetails = styled.div`
  flex: 1;
`;

const SelectedCompanyName = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary[700]};
  margin: 0 0 2px 0;
  line-height: 1.3;
`;

const CompanyMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const MetaItem = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.primary[600]};
  line-height: 1.2;
`;

const NoCompanyCard = styled.div`
  background-color: ${props => props.theme.colors.gray[50]};
  border: 1px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
`;

const NoCompanyText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const CompanySearchSection: React.FC<CompanySearchSectionProps> = ({ 
  selectedCompany, 
  onCompanySelect,
  onCompanyReset
}) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the dropdown manager for coordinated dropdown behavior
  const containerRef = useDropdownManager('company-search-dropdown', dropdownOpen, () => setDropdownOpen(false));

  // Load companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesData = await MockApiService.get<Company[]>('/companies');
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };
    loadCompanies();
  }, []);

  // Filter companies based on query
  useEffect(() => {
    if (companies.length > 0) {
      const filtered = query.trim() 
        ? companies.filter(company => 
            company.name.toLowerCase().includes(query.toLowerCase()) ||
            company.email.toLowerCase().includes(query.toLowerCase()) ||
            company.industry.toLowerCase().includes(query.toLowerCase())
          )
        : companies;
      setFilteredCompanies(filtered);
    }
  }, [query, companies]);



  const handleCompanySelect = (company: Company) => {
    onCompanySelect(company);
    setQuery('');
    setDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!dropdownOpen) setDropdownOpen(true);
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    if (onCompanyReset) {
      onCompanyReset();
    }
  };

  return (
    <SearchSection>
      <SearchContainer ref={containerRef}>
        <SearchIcon />
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Search companies..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setDropdownOpen(true)}
        />
        
        <ClearSearchButton 
          className={selectedCompany ? 'visible' : ''}
          onClick={handleReset}
          title="Clear company selection"
        >
          <XMarkIcon />
        </ClearSearchButton>
        
        <DropdownButton 
          onClick={handleDropdownToggle}
          style={{ transform: `translateY(-50%) rotate(${dropdownOpen ? '180deg' : '0deg'})` }}
        >
          <ChevronDownIcon />
        </DropdownButton>
        
        <Dropdown $isOpen={dropdownOpen}>
          {filteredCompanies.map((company) => (
            <DropdownItem
              key={company.id}
              onClick={() => handleCompanySelect(company)}
            >
              <CompanyName>{company.name}</CompanyName>
              <CompanyInfo>
                {company.industry} • {company.employees} employees
              </CompanyInfo>
            </DropdownItem>
          ))}
          {filteredCompanies.length === 0 && query && (
            <DropdownItem disabled>
              <CompanyInfo>No companies found for "{query}"</CompanyInfo>
            </DropdownItem>
          )}
        </Dropdown>
      </SearchContainer>

      {selectedCompany ? (
        <CurrentCompanyCard>
          <CompanyResetButton 
            onClick={handleReset}
            title="Clear company selection"
          >
            <XMarkIcon />
          </CompanyResetButton>
          
          <CompanyHeader>
            <CompanyIcon>
              <BuildingOfficeIcon />
            </CompanyIcon>
            <CompanyDetails>
              <SelectedCompanyName>{selectedCompany.name}</SelectedCompanyName>
              <CompanyMeta>
                <MetaItem>{selectedCompany.industry}</MetaItem>
                <MetaItem>{selectedCompany.employees} employees</MetaItem>
              </CompanyMeta>
            </CompanyDetails>
          </CompanyHeader>
        </CurrentCompanyCard>
      ) : (
        <NoCompanyCard>
          <NoCompanyText>Select a company to view modules</NoCompanyText>
        </NoCompanyCard>
      )}
    </SearchSection>
  );
};

export default CompanySearchSection;
