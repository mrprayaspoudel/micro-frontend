import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Company } from '@shared/state';
import { MockApiService } from '@shared/utils';
import { useAppStore } from '@shared/state';
import { getEnabledModulesForCompany } from '../constants/modules';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const ProfileHeader = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CompanyName = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CompanyDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const ModuleCard = styled.div`
  background-color: ${props => props.theme.colors.primary[50]};
  border: 2px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
    transform: translateY(-2px);
  }
`;

const ModuleName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary[700]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CompanyDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
`;

const SectionHeading = styled.h2`
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const ModuleDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
`;

const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedCompany } = useAppStore();

  const searchQuery = searchParams.get('q');

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const companies = await MockApiService.get<Company[]>('/companies');
        
        let foundCompany: Company | null = null;
        
        if (id) {
          foundCompany = companies.find(c => c.id === id) || null;
        } else if (searchQuery) {
          foundCompany = companies.find(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
          ) || null;
        }
        
        setCompany(foundCompany);
        setSelectedCompany(foundCompany);
        setLoading(false);
      } catch (error) {
        // Failed to load company
        setLoading(false);
      }
    };

    loadCompany();
  }, [id, searchQuery, setSelectedCompany]);

  const handleModuleClick = (moduleId: string) => {
    // Navigate to the full-page module dashboard
    navigate(`/${moduleId}`);
  };

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  if (!company) {
    return <PageContainer>Company not found</PageContainer>;
  }

  // Get enabled modules for the company
  const availableModules = getEnabledModulesForCompany(company.modules);

  return (
    <PageContainer>
      <ProfileHeader>
        <CompanyName>{company.name}</CompanyName>
        <CompanyDescription>{company.description}</CompanyDescription>
        
        <CompanyDetailsGrid>
          <DetailItem>
            <strong>Industry:</strong> {company.industry}
          </DetailItem>
          <DetailItem>
            <strong>Employees:</strong> {company.employees}
          </DetailItem>
          <DetailItem>
            <strong>Founded:</strong> {company.founded}
          </DetailItem>
          <DetailItem>
            <strong>Status:</strong> {company.status}
          </DetailItem>
        </CompanyDetailsGrid>
      </ProfileHeader>

      <SectionHeading>Available Modules</SectionHeading>
      
      {availableModules.length > 0 ? (
        <ModulesGrid>
          {availableModules.map((module) => (
            <ModuleCard 
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
            >
              <ModuleName>{module.name}</ModuleName>
              <ModuleDescription>
                {module.description}
              </ModuleDescription>
            </ModuleCard>
          ))}
        </ModulesGrid>
      ) : (
        <CompanyDescription>
          You are not allowed to use any modules. Please ask your administrator to enable modules for your company.
        </CompanyDescription>
      )}
    </PageContainer>
  );
};

export default CompanyProfile;
