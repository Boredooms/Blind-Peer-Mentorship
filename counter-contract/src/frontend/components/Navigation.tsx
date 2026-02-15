import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.mono};
  text-decoration: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  transition: color ${theme.transitions.base};
  
  &:hover {
    color: ${theme.colors.white};
  }
`;

const WalletButton = styled.button<{ connected: boolean }>`
  background-color: ${props => props.connected ? theme.colors.surface : theme.colors.white};
  color: ${props => props.connected ? theme.colors.white : theme.colors.black};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${props => props.connected ? theme.colors.medium : theme.colors.white};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  font-family: ${theme.fonts.mono};
  
  &:hover {
    background-color: ${props => props.connected ? theme.colors.surfaceHover : theme.colors.lightest};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};
`;

const WalletAddress = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  font-family: ${theme.fonts.mono};
`;

const Balance = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textTertiary};
`;

interface NavigationProps {
  walletConnected: boolean;
  isMock: boolean;
  walletAddress?: string;
  balance?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  walletConnected,
  isMock,
  walletAddress,
  balance,
  onConnect,
  onDisconnect,
}) => {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">BLIND_MENTORSHIP</Logo>

        <NavLinks>
          {walletConnected && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/sessions">Sessions</NavLink>
              <NavLink to="/stats">Stats</NavLink>
              <NavLink to="/register">Profile</NavLink>
            </>
          )}
        </NavLinks>

        {walletConnected && walletAddress ? (
          <WalletInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isMock && (
                <span style={{
                  fontSize: '10px',
                  background: theme.colors.white,
                  color: theme.colors.black,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>INTERNAL</span>
              )}
              <WalletAddress>{truncateAddress(walletAddress)}</WalletAddress>
            </div>
            {balance && <Balance>{balance} tNight</Balance>}
            <WalletButton connected={true} onClick={onDisconnect}>
              Disconnect
            </WalletButton>
          </WalletInfo>
        ) : (
          <WalletButton connected={false} onClick={onConnect}>
            Connect Wallet
          </WalletButton>
        )}
      </NavContainer>
    </Nav>
  );
};
