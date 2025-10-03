import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';
import { User } from '@shared/state';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface ChangePasswordProps {
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

const PasswordInputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-right: 3rem;
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

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${props => props.theme.colors.text.tertiary};
  }
  
  &:hover svg {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const PasswordRequirements = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const RequirementsTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const RequirementsList = styled.ul`
  margin: 0;
  padding-left: ${props => props.theme.spacing.md};
  list-style: none;
`;

const RequirementItem = styled.li<{ met: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.met ? props.theme.colors.primary[600] : props.theme.colors.text.tertiary};
  margin-bottom: ${props => props.theme.spacing.xs};
  position: relative;
  
  &::before {
    content: ${props => props.met ? '"✓"' : '"○"'};
    position: absolute;
    left: -1rem;
    color: ${props => props.met ? props.theme.colors.primary[600] : props.theme.colors.text.tertiary};
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

const ErrorMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.gray[50]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ChangePassword: React.FC<ChangePasswordProps> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.newPassword);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (!isPasswordValid) {
      setError('Please ensure your new password meets all requirements.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation - in real app, this would be validated server-side
      if (formData.currentPassword !== 'password123') {
        throw new Error('Current password is incorrect.');
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <FormContainer>
      {success && (
        <SuccessMessage>
          Password changed successfully! You will be automatically signed out of other devices.
        </SuccessMessage>
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Current Password</Label>
          <PasswordInputContainer>
            <Input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <EyeSlashIcon /> : <EyeIcon />}
            </PasswordToggle>
          </PasswordInputContainer>
        </FormGroup>

        <FormGroup>
          <Label>New Password</Label>
          <PasswordInputContainer>
            <Input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <EyeSlashIcon /> : <EyeIcon />}
            </PasswordToggle>
          </PasswordInputContainer>
          
          {formData.newPassword && (
            <PasswordRequirements>
              <RequirementsTitle>Password Requirements:</RequirementsTitle>
              <RequirementsList>
                <RequirementItem met={passwordRequirements.minLength}>
                  At least 8 characters long
                </RequirementItem>
                <RequirementItem met={passwordRequirements.hasUppercase}>
                  Contains uppercase letter
                </RequirementItem>
                <RequirementItem met={passwordRequirements.hasLowercase}>
                  Contains lowercase letter
                </RequirementItem>
                <RequirementItem met={passwordRequirements.hasNumber}>
                  Contains number
                </RequirementItem>
                <RequirementItem met={passwordRequirements.hasSpecialChar}>
                  Contains special character
                </RequirementItem>
              </RequirementsList>
            </PasswordRequirements>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Confirm New Password</Label>
          <PasswordInputContainer>
            <Input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <EyeSlashIcon /> : <EyeIcon />}
            </PasswordToggle>
          </PasswordInputContainer>
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
            disabled={loading || !isPasswordValid}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ChangePassword;
