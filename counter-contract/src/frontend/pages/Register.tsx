import { useState } from 'react';
import styled from 'styled-components';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { theme } from '../styles/theme';

const RegisterContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text};
`;

const Form = styled.form`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};

  &:focus {
    border-color: ${theme.colors.white};
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  min-height: 100px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: background-color ${theme.transitions.base};

  &:hover {
    background-color: ${theme.colors.lightest};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Register = () => {
  const { connected } = useWallet();
  const { registerUser, loading, error } = useContract();

  // Form state
  const [role, setRole] = useState<'mentor' | 'mentee'>('mentee');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await registerUser(role, { name, skills, bio });

      alert('Registration transaction submitted!');
      setName('');
      setSkills('');
      setBio('');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <RegisterContainer>
      <Title>Create Your Profile</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>I want to join as a:</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="mentee">Mentee (seeking guidance)</option>
            <option value="mentor">Mentor (offering guidance)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Display Name (Public)</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alice"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Skills {role === 'mentor' ? '(Offering)' : '(Seeking)'}</Label>
          <Input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Rust, Leadership"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Bio / Goals</Label>
          <TextArea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </FormGroup>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <SubmitButton type="submit" disabled={loading || !connected}>
          {loading ? 'Registering on Blockchain...' : 'Register Profile'}
        </SubmitButton>
      </Form>
    </RegisterContainer>
  );
};
