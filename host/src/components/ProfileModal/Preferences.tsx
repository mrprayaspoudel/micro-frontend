import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';
import { User } from '@shared/state';

interface PreferencesProps {
  user: User | null;
  onClose: () => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding-bottom: ${props => props.theme.spacing.sm};
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

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  accent-color: ${props => props.theme.colors.primary[600]};
`;

const CheckboxLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
`;

const CheckboxDescription = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  display: block;
  margin-left: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
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

const ColorPreview = styled.div<{ color: string }>`
  width: 2rem;
  height: 2rem;
  background-color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 2px solid ${props => props.theme.colors.gray[200]};
  margin-left: ${props => props.theme.spacing.sm};
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background-color: ${props => props.theme.colors.primary[50]};
  }
`;

interface PreferencesState {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    security: boolean;
    marketing: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'company';
    shareAnalytics: boolean;
    allowCookies: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

const Preferences: React.FC<PreferencesProps> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>({
    theme: 'light',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      security: true,
      marketing: false,
      updates: true
    },
    privacy: {
      profileVisibility: 'company',
      shareAnalytics: true,
      allowCookies: true
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 'medium'
    }
  });

  useEffect(() => {
    // Load preferences from localStorage or API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        // Failed to parse saved preferences, using defaults
      }
    }
  }, []);

  const handleSelectChange = (section: keyof PreferencesState, field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...(prev[section] as any), [field]: value }
        : value
    }));
  };

  const handleCheckboxChange = (section: keyof PreferencesState, field: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      setSuccess(true);

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      // Failed to save preferences
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <FormContainer>
      {success && (
        <SuccessMessage>
          Preferences saved successfully!
        </SuccessMessage>
      )}

      <form onSubmit={handleSubmit}>
        {/* Appearance Section */}
        <Section>
          <SectionTitle>Appearance</SectionTitle>
          
          <FormGroup>
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onChange={(e) => handleSelectChange('theme', '', e.target.value as 'light' | 'dark' | 'auto')}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Font Size</Label>
            <Select
              value={preferences.accessibility.fontSize}
              onChange={(e) => handleSelectChange('accessibility', 'fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </FormGroup>
        </Section>

        {/* Localization Section */}
        <Section>
          <SectionTitle>Localization</SectionTitle>
          
          <FormGroup>
            <Label>Language</Label>
            <Select
              value={preferences.language}
              onChange={(e) => handleSelectChange('language', '', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Timezone</Label>
            <Select
              value={preferences.timezone}
              onChange={(e) => handleSelectChange('timezone', '', e.target.value)}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEDT)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Date Format</Label>
            <Select
              value={preferences.dateFormat}
              onChange={(e) => handleSelectChange('dateFormat', '', e.target.value)}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD MMM YYYY">DD MMM YYYY</option>
            </Select>
          </FormGroup>
        </Section>

        {/* Notifications Section */}
        <Section>
          <SectionTitle>Notifications</SectionTitle>
          
          <CheckboxGroup>
            <CheckboxContainer>
              <Checkbox
                checked={preferences.notifications.email}
                onChange={(e) => handleCheckboxChange('notifications', 'email', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Email Notifications</CheckboxLabel>
                <CheckboxDescription>Receive important updates via email</CheckboxDescription>
              </div>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                checked={preferences.notifications.push}
                onChange={(e) => handleCheckboxChange('notifications', 'push', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Push Notifications</CheckboxLabel>
                <CheckboxDescription>Receive real-time notifications in your browser</CheckboxDescription>
              </div>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                checked={preferences.notifications.security}
                onChange={(e) => handleCheckboxChange('notifications', 'security', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Security Alerts</CheckboxLabel>
                <CheckboxDescription>Critical security updates and login alerts</CheckboxDescription>
              </div>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                checked={preferences.notifications.marketing}
                onChange={(e) => handleCheckboxChange('notifications', 'marketing', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Marketing Communications</CheckboxLabel>
                <CheckboxDescription>Product updates and promotional content</CheckboxDescription>
              </div>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                checked={preferences.notifications.updates}
                onChange={(e) => handleCheckboxChange('notifications', 'updates', e.target.checked)}
              />
              <div>
                <CheckboxLabel>System Updates</CheckboxLabel>
                <CheckboxDescription>Platform updates and maintenance notices</CheckboxDescription>
              </div>
            </CheckboxContainer>
          </CheckboxGroup>
        </Section>

        {/* Privacy Section */}
        <Section>
          <SectionTitle>Privacy</SectionTitle>
          
          <FormGroup>
            <Label>Profile Visibility</Label>
            <Select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => handleSelectChange('privacy', 'profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="company">Company Only</option>
              <option value="private">Private</option>
            </Select>
          </FormGroup>

          <CheckboxGroup>
            <CheckboxContainer>
              <Checkbox
                checked={preferences.privacy.shareAnalytics}
                onChange={(e) => handleCheckboxChange('privacy', 'shareAnalytics', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Share Usage Analytics</CheckboxLabel>
                <CheckboxDescription>Help improve the platform by sharing anonymous usage data</CheckboxDescription>
              </div>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                checked={preferences.privacy.allowCookies}
                onChange={(e) => handleCheckboxChange('privacy', 'allowCookies', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Allow Cookies</CheckboxLabel>
                <CheckboxDescription>Enable cookies for improved user experience</CheckboxDescription>
              </div>
            </CheckboxContainer>
          </CheckboxGroup>
        </Section>

        {/* Accessibility Section */}
        <Section>
          <SectionTitle>Accessibility</SectionTitle>
          
          <CheckboxGroup>
            <CheckboxContainer>
              <Checkbox
                checked={preferences.accessibility.reduceMotion}
                onChange={(e) => handleCheckboxChange('accessibility', 'reduceMotion', e.target.checked)}
              />
              <div>
                <CheckboxLabel>Reduce Motion</CheckboxLabel>
                <CheckboxDescription>Minimize animations and transitions</CheckboxDescription>
              </div>
            </CheckboxContainer>

            <CheckboxContainer>
              <Checkbox
                checked={preferences.accessibility.highContrast}
                onChange={(e) => handleCheckboxChange('accessibility', 'highContrast', e.target.checked)}
              />
              <div>
                <CheckboxLabel>High Contrast Mode</CheckboxLabel>
                <CheckboxDescription>Increase color contrast for better visibility</CheckboxDescription>
              </div>
            </CheckboxContainer>
          </CheckboxGroup>
        </Section>

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
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default Preferences;
