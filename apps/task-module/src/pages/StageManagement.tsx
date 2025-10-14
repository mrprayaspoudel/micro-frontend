import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { useStageStore } from '../stores/stageStore';
import { Stage } from '../types';
import {
  PageHeader,
  PageSubtitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText
} from '../components/CommonControls';

const defaultColors = [
  '#1976d2',
  '#9c27b0',
  '#2e7d32',
  '#ed6c02',
  '#d32f2f',
  '#0288d1',
  '#7b1fa2',
  '#f57c00',
];

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.lg};
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TableContainer = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.gray[50]};
  border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

const TableCell = styled.td<{ align?: 'left' | 'center' | 'right'; width?: number }>`
  padding: ${props => props.theme.spacing.lg};
  text-align: ${props => props.align || 'left'};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  ${props => props.width && `width: ${props.width}px;`}
`;

const TableHeaderCell = styled.th<{ align?: 'left' | 'center' | 'right'; width?: number }>`
  padding: ${props => props.theme.spacing.lg};
  text-align: ${props => props.align || 'left'};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  ${props => props.width && `width: ${props.width}px;`}
`;

const StageName = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const StageDescription = styled.span`
  color: ${props => props.theme.colors.text.secondary};
`;

const OrderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  padding: 0.25rem 0.5rem;
  background-color: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[800]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 40px;
  height: 24px;
  background-color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: flex-end;
`;

const IconButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const EditButton = styled(IconButton)`
  &:hover {
    color: ${props => props.theme.colors.primary[600]};
    background-color: ${props => props.theme.colors.primary[50]};
  }
`;

const DeleteButton = styled(IconButton)`
  &:hover {
    color: #dc2626;
    background-color: #fee2e2;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`;

const ColorPicker = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const ColorOption = styled.div<{ color: string; selected: boolean }>`
  width: 48px;
  height: 48px;
  background-color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  border: 3px solid ${props => props.selected ? '#000' : 'transparent'};
  transition: border 0.2s ease;

  &:hover {
    border-color: ${props => props.selected ? '#000' : props.theme.colors.gray[400]};
  }
`;

export const StageManagement: React.FC = () => {
  const { stages, addStage, updateStage, deleteStage, fetchStages } = useStageStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: defaultColors[0],
  });

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const handleOpenDialog = (stage?: Stage) => {
    if (stage) {
      setEditingStage(stage);
      setFormData({
        name: stage.name,
        description: stage.description || '',
        color: stage.color,
      });
    } else {
      setEditingStage(null);
      setFormData({
        name: '',
        description: '',
        color: defaultColors[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStage(null);
  };

  const handleSubmit = () => {
    const companyId = localStorage.getItem('selectedCompanyId') || '1';
    
    if (editingStage) {
      updateStage(editingStage.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
    } else {
      const newStage: Stage = {
        id: `stage-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        order: stages.length,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addStage(newStage);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      deleteStage(id);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <PageTitle>Stage Management</PageTitle>
          <PageSubtitle>Create and manage workflow stages for your task management system</PageSubtitle>
        </HeaderContent>
        <Button onClick={() => handleOpenDialog()}>
          Add Stage
        </Button>
      </Header>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell width={50}></TableHeaderCell>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Stage Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Color</TableHeaderCell>
              <TableHeaderCell align="right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stages.map((stage) => (
              <TableRow key={stage.id}>
                <TableCell>
                  <IconButton>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </IconButton>
                </TableCell>
                <TableCell>
                  <OrderBadge>{stage.order + 1}</OrderBadge>
                </TableCell>
                <TableCell>
                  <StageName>{stage.name}</StageName>
                </TableCell>
                <TableCell>
                  <StageDescription>{stage.description || '—'}</StageDescription>
                </TableCell>
                <TableCell>
                  <ColorSwatch color={stage.color} />
                </TableCell>
                <TableCell align="right">
                  <ActionButtons>
                    <EditButton onClick={() => handleOpenDialog(stage)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </EditButton>
                    <DeleteButton onClick={() => handleDelete(stage.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </DeleteButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal isOpen={openDialog}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingStage ? 'Edit Stage' : 'Add New Stage'}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Stage Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter stage name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter stage description (optional)"
              />
            </FormGroup>
            <FormGroup>
              <Label>Select Color</Label>
              <ColorPicker>
                {defaultColors.map((color) => (
                  <ColorOption
                    key={color}
                    color={color}
                    selected={formData.color === color}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </ColorPicker>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseDialog} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              {editingStage ? 'Update' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default StageManagement;
