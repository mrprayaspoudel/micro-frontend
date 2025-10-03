import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Company } from '@shared/state';
import { MockApiService } from '@shared/utils';
import { useAppStore } from '@shared/state';
import { Button } from '@shared/ui-components';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const SearchHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const SearchQuery = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
`;

const SearchResults = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const CompanyCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

const CompanyName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CompanyInfo = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing.xs} 0;
`;

const CompanyDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
  margin: ${props => props.theme.spacing.sm} 0;
  line-height: 1.4;
`;

const ActionButtonsContainer = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const { setSelectedCompany } = useAppStore();

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const companiesData = await MockApiService.get<Company[]>('/companies');
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to load companies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery && companies.length > 0) {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  }, [searchQuery, companies]);

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    navigate(`/company/${company.id}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <h2>Searching companies...</h2>
          <p>Please wait while we search for "{searchQuery}"</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SearchHeader>
        <SearchTitle>Search Results</SearchTitle>
        <SearchQuery>
          {searchQuery ? (
            filteredCompanies.length > 0 ? (
              `Found ${filteredCompanies.length} companies matching "${searchQuery}"`
            ) : (
              `No companies found matching "${searchQuery}"`
            )
          ) : (
            'Please enter a search query'
          )}
        </SearchQuery>
      </SearchHeader>

      {filteredCompanies.length > 0 ? (
        <SearchResults>
          {filteredCompanies.map((company) => (
            <CompanyCard 
              key={company.id}
              onClick={() => handleCompanyClick(company)}
            >
              <CompanyName>{company.name}</CompanyName>
              <CompanyInfo><strong>Industry:</strong> {company.industry}</CompanyInfo>
              <CompanyInfo><strong>Employees:</strong> {company.employees}</CompanyInfo>
              <CompanyInfo><strong>Email:</strong> {company.email}</CompanyInfo>
              <CompanyInfo><strong>Founded:</strong> {company.founded}</CompanyInfo>
              <CompanyDescription>{company.description}</CompanyDescription>
              
              <ActionButtonsContainer>
                <Button 
                  size="sm" 
                  variant="primary"
                  onClick={() => handleCompanyClick(company)}
                >
                  View Profile
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`mailto:${company.email}`, '_blank')}
                >
                  Contact
                </Button>
              </ActionButtonsContainer>
            </CompanyCard>
          ))}
        </SearchResults>
      ) : searchQuery && !loading ? (
        <NoResultsContainer>
          <h3>No companies found</h3>
          <p>Try searching with different keywords such as:</p>
          <ul>
            <li>Company name (e.g., "TechCorp", "Global")</li>
            <li>Industry (e.g., "Technology", "Manufacturing")</li>
            <li>Email domain (e.g., "techcorp.com")</li>
          </ul>
        </NoResultsContainer>
      ) : null}
    </PageContainer>
  );
};

export default SearchResultsPage;
