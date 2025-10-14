import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { useTicketStore } from '../stores/ticketStore';
import { useStageStore } from '../stores/stageStore';
import { useAuthStore } from '../stores/authStore';
import { TicketPriority, TicketStatus } from '../types';
import {
  PageHeader,
  PageSubtitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  FormHint,
  FormError,
  Card,
  Alert
} from '../components/CommonControls';

const FormContainer = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  overflow: hidden;
`;

const FormSection = styled.div`
  padding: ${props => props.theme.spacing['2xl']};
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SectionIcon = styled.span`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const FullWidthTextArea = styled(TextArea)`
  width: 100%;
  min-height: 200px;
  resize: vertical;
`;

const FullWidthInput = styled(Input)`
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing['2xl']};
  background-color: ${props => props.theme.colors.gray[50]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

const RequiredLabel = styled(Label)`
  &::after {
    content: ' *';
    color: ${props => props.theme.colors.error[500]};
    margin-left: ${props => props.theme.spacing.xs};
  }
`;

const CharCount = styled.span<{ $isError?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.$isError 
    ? props.theme.colors.error[500] 
    : props.theme.colors.text.tertiary};
  float: right;
`;

interface FormErrors {
  title?: string;
  description?: string;
  module?: string;
  stageId?: string;
  dueDate?: string;
  estimatedHours?: string;
}

const AVAILABLE_MODULES = [
  { id: 'crm', name: 'CRM', description: 'Customer Relationship Management' },
  { id: 'inventory', name: 'Inventory', description: 'Inventory Management' },
  { id: 'hr', name: 'HR', description: 'Human Resources' },
  { id: 'finance', name: 'Finance', description: 'Financial Management' },
  { id: 'task', name: 'Task', description: 'Task Management' }
];

export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { addTicket } = useTicketStore();
  const { stages, fetchStages } = useStageStore();
  const { currentUser } = useAuthStore();
  
  // Refs for uncontrolled form
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const moduleRef = useRef<HTMLSelectElement>(null);
  const stageRef = useRef<HTMLSelectElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const estimatedHoursRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  // Auto-select first stage when stages are loaded
  useEffect(() => {
    if (stages.length > 0 && stageRef.current && !stageRef.current.value) {
      const firstStage = [...stages].sort((a, b) => a.order - b.order)[0];
      if (firstStage) {
        stageRef.current.value = firstStage.id;
      }
    }
  }, [stages]);

  const handleTitleChange = () => {
    if (titleRef.current) {
      setTitleLength(titleRef.current.value.length);
      if (errors.title) {
        setErrors(prev => ({ ...prev, title: undefined }));
      }
    }
  };

  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      setDescriptionLength(descriptionRef.current.value.length);
      if (errors.description) {
        setErrors(prev => ({ ...prev, description: undefined }));
      }
    }
  };

  const handleFieldChange = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const title = titleRef.current?.value.trim() || '';
    const description = descriptionRef.current?.value.trim() || '';
    const module = moduleRef.current?.value || '';
    const stageId = stageRef.current?.value || '';
    const dueDate = dueDateRef.current?.value || '';
    const estimatedHours = estimatedHoursRef.current?.value || '';

    if (!title) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!description) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!module) {
      newErrors.module = 'Module is required';
    }

    if (!stageId) {
      newErrors.stageId = 'Stage is required';
    }

    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDateObj < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (estimatedHours) {
      const hours = parseFloat(estimatedHours);
      if (isNaN(hours) || hours <= 0) {
        newErrors.estimatedHours = 'Estimated hours must be a positive number';
      } else if (hours > 1000) {
        newErrors.estimatedHours = 'Estimated hours cannot exceed 1000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const title = titleRef.current?.value.trim() || '';
      const description = descriptionRef.current?.value.trim() || '';
      const priority = (priorityRef.current?.value || TicketPriority.MEDIUM) as TicketPriority;
      const stageId = stageRef.current?.value || '';
      const dueDate = dueDateRef.current?.value || '';
      const estimatedHours = estimatedHoursRef.current?.value || '';
      const tags = tagsRef.current?.value || '';

      const newTicket = {
        id: `ticket-${Date.now()}`,
        title,
        description,
        priority,
        status: TicketStatus.NOT_ASSIGNED,
        stageId,
        createdBy: currentUser?.id || 'anonymous',
        assignedTo: null,
        pickedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId: 'company-1',
        ...(dueDate && { dueDate }),
        ...(estimatedHours && { estimatedHours: parseFloat(estimatedHours) }),
        ...(tags && { tags: tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) })
      };

      addTicket(newTicket);
      setSuccessMessage('Ticket created successfully!');
      
      // Reset form
      setTimeout(() => {
        navigate('/task/all-tickets');
      }, 1500);
      
    } catch (error) {
      setErrors({ title: 'Failed to create ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate(-1);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Create New Ticket</PageTitle>
        <PageSubtitle>Fill in the details below to create a new support ticket</PageSubtitle>
      </PageHeader>

      {successMessage && (
        <Alert $variant="success" style={{ marginBottom: '1.5rem' }}>
          ✓ {successMessage}
        </Alert>
      )}

      <FormContainer>
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <FormSection>
            <SectionTitle>
              <SectionIcon>📝</SectionIcon>
              Basic Information
            </SectionTitle>
            
            <FullWidthFormGroup>
              <RequiredLabel>
                Ticket Title
                <CharCount $isError={!!errors.title || titleLength > 100}>
                  {titleLength}/100
                </CharCount>
              </RequiredLabel>
              <FullWidthInput
                ref={titleRef}
                type="text"
                onChange={handleTitleChange}
                placeholder="Brief description of the issue (e.g., Login button not working on mobile)"
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.title && <FormError>{errors.title}</FormError>}
              {!errors.title && <FormHint>A clear, concise title that summarizes the issue</FormHint>}
            </FullWidthFormGroup>

            <FullWidthFormGroup>
              <RequiredLabel>
                Description
                <CharCount $isError={!!errors.description || descriptionLength > 2000}>
                  {descriptionLength}/2000
                </CharCount>
              </RequiredLabel>
              <FullWidthTextArea
                ref={descriptionRef}
                onChange={handleDescriptionChange}
                placeholder="Detailed description of the issue:
• What happened?
• Steps to reproduce
• Expected behavior vs actual behavior
• Any error messages
• Screenshots or logs (if applicable)"
                disabled={isSubmitting}
                maxLength={2000}
              />
              {errors.description && <FormError>{errors.description}</FormError>}
              {!errors.description && <FormHint>Provide as much detail as possible to help resolve the issue quickly</FormHint>}
            </FullWidthFormGroup>
          </FormSection>

          {/* Categorization Section */}
          <FormSection>
            <SectionTitle>
              <SectionIcon>🏷️</SectionIcon>
              Categorization
            </SectionTitle>
            
            <FormRow>
              <FormGroup>
                <RequiredLabel>Module</RequiredLabel>
                <Select
                  ref={moduleRef}
                  onChange={() => handleFieldChange('module')}
                  disabled={isSubmitting}
                >
                  <option value="">-- Select a module --</option>
                  {AVAILABLE_MODULES.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name} - {module.description}
                    </option>
                  ))}
                </Select>
                {errors.module && <FormError>{errors.module}</FormError>}
                {!errors.module && <FormHint>Which module is this ticket related to?</FormHint>}
              </FormGroup>

              <FormGroup>
                <RequiredLabel>Priority Level</RequiredLabel>
                <Select
                  ref={priorityRef}
                  defaultValue={TicketPriority.MEDIUM}
                  disabled={isSubmitting}
                >
                  <option value={TicketPriority.LOW}>🟢 Low - Can wait</option>
                  <option value={TicketPriority.MEDIUM}>🟡 Medium - Normal priority</option>
                  <option value={TicketPriority.HIGH}>🟠 High - Important</option>
                  <option value={TicketPriority.URGENT}>🔴 Urgent - Critical issue</option>
                </Select>
                <FormHint>How urgent is this issue?</FormHint>
              </FormGroup>

              <FormGroup>
                <RequiredLabel>Initial Workflow Stage</RequiredLabel>
                <Select
                  ref={stageRef}
                  onChange={() => handleFieldChange('stageId')}
                  disabled={isSubmitting || stages.length === 0}
                >
                  {stages.length === 0 ? (
                    <option value="">Loading stages...</option>
                  ) : (
                    <>
                      <option value="">-- Select a stage --</option>
                      {stages
                        .sort((a, b) => a.order - b.order)
                        .map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.order}. {stage.name}
                          </option>
                        ))}
                    </>
                  )}
                </Select>
                {errors.stageId && <FormError>{errors.stageId}</FormError>}
                {!errors.stageId && <FormHint>Select the initial workflow stage for this ticket</FormHint>}
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Additional Details Section */}
          <FormSection>
            <SectionTitle>
              <SectionIcon>⏰</SectionIcon>
              Additional Details
            </SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label>Due Date</Label>
                <Input
                  ref={dueDateRef}
                  type="date"
                  onChange={() => handleFieldChange('dueDate')}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                />
                {errors.dueDate && <FormError>{errors.dueDate}</FormError>}
                {!errors.dueDate && <FormHint>Optional: Target completion date</FormHint>}
              </FormGroup>

              <FormGroup>
                <Label>Estimated Hours</Label>
                <Input
                  ref={estimatedHoursRef}
                  type="number"
                  onChange={() => handleFieldChange('estimatedHours')}
                  placeholder="e.g., 2.5"
                  step="0.5"
                  min="0"
                  max="1000"
                  disabled={isSubmitting}
                />
                {errors.estimatedHours && <FormError>{errors.estimatedHours}</FormError>}
                {!errors.estimatedHours && <FormHint>Optional: Estimated time to complete (in hours)</FormHint>}
              </FormGroup>

              <FormGroup>
                <Label>Tags</Label>
                <Input
                  ref={tagsRef}
                  type="text"
                  placeholder="bug, feature, urgent, frontend"
                  disabled={isSubmitting}
                />
                <FormHint>Optional: Comma-separated tags for easier searching</FormHint>
              </FormGroup>
            </FormRow>
          </FormSection>

          <ButtonGroup>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Creating...' : '✓ Create Ticket'}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default CreateTicket;
