import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';
import { User, useAuthStore } from '@shared/state';

interface ProfileSettingsProps {
  user: User | null;
  onClose: () => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.text.tertiary};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s ease;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const AvatarPreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.gray[200]};
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[200]};
  }
`;

const SuccessMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary[50]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.primary[700]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onClose }) => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: '',
    department: '',
    jobTitle: '',
    phoneNumber: '',
    location: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          avatar: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        avatar: formData.avatar
      };

      setUser(updatedUser);
      setSuccess(true);

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <FormContainer>
      {success && (
        <SuccessMessage>
          Profile updated successfully!
        </SuccessMessage>
      )}

      <AvatarSection>
        <AvatarPreview 
          src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=3b82f6&color=fff`} 
          alt="Profile Avatar" 
        />
        <AvatarUpload>
          <FileLabel htmlFor="avatar-upload">
            Change Avatar
          </FileLabel>
          <FileInput
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </AvatarUpload>
      </AvatarSection>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Job Title</Label>
          <Input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="e.g. Software Engineer, Marketing Manager"
          />
        </FormGroup>

        <FormGroup>
          <Label>Department</Label>
          <Select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
            <option value="finance">Finance</option>
            <option value="operations">Operations</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="e.g. +1 (555) 123-4567"
          />
        </FormGroup>

        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g. San Francisco, CA"
          />
        </FormGroup>

        <FormGroup>
          <Label>Bio</Label>
          <TextArea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us a little about yourself..."
          />
        </FormGroup>

        <ButtonContainer>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ProfileSettings;
