import styled from 'styled-components';
import { theme } from '../styles/theme';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  background: linear-gradient(180deg, ${theme.colors.black} 0%, ${theme.colors.darkest} 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes['6xl']};
  font-weight: 700;
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.lighter} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['4xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.textSecondary};
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${theme.spacing['2xl']};
  line-height: 1.8;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CTAButton = styled.button`
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  border: 2px solid ${theme.colors.white};
  
  &:hover {
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing['4xl']};
`;

const FeatureCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  transition: all ${theme.transitions.base};
  
  &:hover {
    background-color: ${theme.colors.surfaceHover};
    border-color: ${theme.colors.medium};
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  margin-bottom: ${theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text};
`;

const FeatureDescription = styled.p`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background-color: ${theme.colors.darkest};
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.border};
  border-bottom: 1px solid ${theme.colors.border};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.fontSizes['4xl']};
  font-weight: 700;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.mono};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

interface HomeProps {
  onConnectWallet: () => void;
}

export const Home: React.FC<HomeProps> = ({ onConnectWallet }) => {
  return (
    <>
      <HeroSection>
        <Container>
          <Title>Blind Peer Mentorship</Title>
          <Subtitle>
            Get matched with mentors based on proven skill gaps—without revealing your employer, seniority level, or personal identity upfront.
          </Subtitle>
          <CTAButton onClick={onConnectWallet}>
            Connect Wallet to Start
          </CTAButton>

          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>🎭</FeatureIcon>
              <FeatureTitle>Anonymous Profiles</FeatureTitle>
              <FeatureDescription>
                Register skill gaps without revealing your identity. No employer or seniority information exposed.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>Zero-Knowledge Proofs</FeatureTitle>
              <FeatureDescription>
                Prove you have skill gaps without disclosing specifics. Built on Midnight blockchain technology.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>Skill-Based Matching</FeatureTitle>
              <FeatureDescription>
                Get matched purely on complementary skills. Identities revealed only after mutual consent.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>⭐</FeatureIcon>
              <FeatureTitle>Private Reputation</FeatureTitle>
              <FeatureDescription>
                Build credibility through anonymous feedback. Session completion tracked on-chain privately.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </HeroSection>

      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Total Matches</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Completed Sessions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Active Sessions</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>
    </>
  );
};
