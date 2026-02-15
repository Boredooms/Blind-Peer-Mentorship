import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Sessions } from './Sessions';
import { Stats } from './Stats';
import { useWallet } from './hooks/useWallet';
import { theme } from './styles/theme';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed navigation */
`;

const ErrorBanner = styled.div`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.medium};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  z-index: 999;
  max-width: 500px;
  text-align: center;
  box-shadow: ${theme.shadows.lg};
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

const InstallLink = styled.a`
  color: ${theme.colors.white};
  text-decoration: underline;
  margin-left: ${theme.spacing.xs};
  
  &:hover {
    opacity: 0.8;
  }
`;

function App() {
    const wallet = useWallet();

    const formatBalance = (balance: string | null) => {
        if (!balance) return undefined;
        // Format balance with commas
        return balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <Router>
            <GlobalStyles />
            <AppContainer>
                <Navigation
                    walletConnected={wallet.connected}
                    walletAddress={wallet.address || undefined}
                    balance={formatBalance(wallet.balance)}
                    onConnect={wallet.connect}
                    onDisconnect={wallet.disconnect}
                />

                {wallet.error && !wallet.isLaceInstalled && (
                    <ErrorBanner>
                        <ErrorText>
                            Lace wallet not detected.
                            <InstallLink
                                href="https://www.lace.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Install Lace Wallet
                            </InstallLink>
                        </ErrorText>
                    </ErrorBanner>
                )}

                {wallet.error && wallet.isLaceInstalled && (
                    <ErrorBanner>
                        <ErrorText>{wallet.error}</ErrorText>
                    </ErrorBanner>
                )}

                <MainContent>
                    <Routes>
                        <Route path="/" element={<Home onConnectWallet={wallet.connect} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/sessions" element={<Sessions />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </MainContent>
            </AppContainer>
        </Router>
    );
}

export default App;
