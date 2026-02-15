import { useState } from 'react';
import styled from 'styled-components';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { theme } from '../styles/theme';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: transform ${theme.transitions.base}, box-shadow ${theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

const CardTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

const CardDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.5;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${props => props.variant === 'secondary' ? 'transparent' : theme.colors.white};
  color: ${props => props.variant === 'secondary' ? theme.colors.white : theme.colors.black};
  border: 1px solid ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.base};

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? theme.colors.mediumDark : theme.colors.lightest};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Dashboard = () => {
  const { connected } = useWallet();
  const { requestMentorship, loading } = useContract();
  const [skill, setSkill] = useState('');

  const handleRequest = async () => {
    if (!skill.trim()) return;
    try {
      await requestMentorship(skill);
      alert('Mentorship requested!');
      setSkill('');
    } catch (err) {
      console.error(err);
      alert('Failed to request mentorship');
    }
  };

  if (!connected) {
    return (
      <DashboardContainer>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Connect your wallet to access the dashboard.</Subtitle>
        </Header>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back to Blind Peer Mentorship</Subtitle>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Request Mentorship</CardTitle>
          <CardDescription>
            Find a mentor anonymously to help you grow your skills.
          </CardDescription>

          <input
            type="text"
            placeholder="Skill needed (e.g. React)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <Button onClick={handleRequest} disabled={loading || !skill}>
            {loading ? 'Requesting...' : 'Request Mentor'}
          </Button>
        </Card>

        <Card>
          <CardTitle>My Sessions</CardTitle>
          <CardDescription>
            View and manage your active mentorship sessions.
          </CardDescription>
          <Button variant="secondary" as="a" href="/sessions" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
            View Sessions
          </Button>
        </Card>

        <Card>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>
            View global platform statistics.
          </CardDescription>
          <Button variant="secondary" as="a" href="/stats" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
            View Stats
          </Button>
        </Card>
      </Grid>
    </DashboardContainer>
  );
};
