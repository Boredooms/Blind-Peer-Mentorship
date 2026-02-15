import { useState, useEffect, useCallback } from 'react';
import { mockWalletEntry } from '../mocks/mock-wallet';

// CIP-30 Entry Point
interface WalletEntry {
    enable: () => Promise<WalletAPI>;
    isEnabled: () => Promise<boolean>;
    apiVersion: string;
    name: string;
    icon: string;
}

// CIP-30 Connected API (plus Midnight extensions)
interface WalletAPI {
    getBalance: () => Promise<string>;
    getUsedAddresses: () => Promise<string[]>;
    getChangeAddress: () => Promise<string>;
    signTransaction: (tx: any) => Promise<any>;
    submitTransaction: (tx: any) => Promise<any>;
    // Midnight specific might involve these names or similar
    balanceUnsealedTransaction: (tx: string) => Promise<{ tx: string }>;
    getShieldedAddresses: () => Promise<{ shieldedCoinPublicKey: string; shieldedEncryptionPublicKey: string }>;
}

declare global {
    interface Window {
        cardano?: {
            lace?: WalletEntry;
            [key: string]: any;
        };
    }
}

export interface WalletState {
    connected: boolean;
    isMock: boolean;
    address: string | null;
    balance: string | null;
    loading: boolean;
    error: string | null;
    walletApi: WalletAPI | null;
}

export const useWallet = () => {
    const [state, setState] = useState<WalletState>({
        connected: false,
        isMock: false,
        address: null,
        balance: null,
        loading: false,
        error: null,
        walletApi: null,
    });

    const [isInstalled, setIsInstalled] = useState(false);

    // Initial check and polling for wallet injection
    useEffect(() => {
        const checkWallet = () => {
            if (typeof window !== 'undefined' && window.cardano?.lace) {
                setIsInstalled(true);
                return true;
            }
            return false;
        };

        if (checkWallet()) return;

        const interval = setInterval(() => {
            if (checkWallet()) {
                clearInterval(interval);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const connect = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            if (!isInstalled && !window.cardano?.lace) {
                throw new Error('Lace wallet is not installed. Please use the Mock Wallet or install Lace.');
            }

            const lace = window.cardano!.lace!;
            // enable() returns the API object
            const api = await lace.enable();

            if (!api) {
                throw new Error('User rejected wallet connection or API failed');
            }

            // Get wallet info from the API object
            let address = '';
            try {
                const addresses = await api.getUsedAddresses();
                if (addresses.length > 0) {
                    address = addresses[0];
                }
            } catch (e) {
                console.warn('Could not get used addresses:', e);
            }

            const balance = await api.getBalance();

            setState({
                connected: true,
                isMock: false,
                address,
                balance,
                loading: false,
                error: null,
                walletApi: api,
            });

            console.log('✅ Lace wallet connected');
        } catch (error: any) {
            console.error('❌ Failed to connect wallet:', error);
            setState({
                connected: false,
                isMock: false,
                address: null,
                balance: null,
                loading: false,
                error: error.message || 'Failed to connect wallet',
                walletApi: null,
            });
        }
    }, [isInstalled]);

    const connectMock = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            console.log('🔄 Connecting to Mock Wallet...');
            const api = await mockWalletEntry.enable();

            const address = (await api.getUsedAddresses())[0];
            const balance = await api.getBalance();

            setState({
                connected: true,
                isMock: true,
                address,
                balance,
                loading: false,
                error: null,
                walletApi: api as any,
            });
            console.log('✅ Mock wallet connected');
        } catch (error: any) {
            console.error('❌ Failed to connect mock wallet:', error);
            setState(prev => ({ ...prev, loading: false, error: error.message }));
        }
    }, []);

    const disconnect = useCallback(() => {
        setState({
            connected: false,
            isMock: false,
            address: null,
            balance: null,
            loading: false,
            error: null,
            walletApi: null,
        });
        console.log('🔌 Wallet disconnected');
    }, []);

    const signTransaction = useCallback(async (transaction: any) => {
        if (!state.connected || !state.walletApi) {
            throw new Error('Wallet not connected');
        }

        try {
            const signedTx = await state.walletApi.signTransaction(transaction);
            return signedTx;
        } catch (error: any) {
            console.error('❌ Failed to sign transaction:', error);
            throw error;
        }
    }, [state.connected, state.walletApi]);

    const refreshBalance = useCallback(async () => {
        if (!state.connected || !state.walletApi) {
            return;
        }

        try {
            const balance = await state.walletApi.getBalance();
            setState(prev => ({ ...prev, balance }));
        } catch (error) {
            console.error('Failed to refresh balance:', error);
        }
    }, [state.connected, state.walletApi]);

    // Auto-connect if trusted
    useEffect(() => {
        const checkConnection = async () => {
            if (window.cardano?.lace) {
                try {
                    const lace = window.cardano.lace;
                    const isEnabled = await lace.isEnabled();

                    if (isEnabled) {
                        const api = await lace.enable();

                        let address = '';
                        try {
                            const addresses = await api.getUsedAddresses();
                            if (addresses.length > 0) address = addresses[0];
                        } catch (e) {
                            console.warn(e);
                        }

                        const balance = await api.getBalance();

                        setState({
                            connected: true,
                            isMock: false,
                            address,
                            balance,
                            loading: false,
                            error: null,
                            walletApi: api,
                        });
                        setIsInstalled(true);
                    }
                } catch (error) {
                    // silent
                }
            }
        };

        const t = setTimeout(checkConnection, 1000);
        return () => clearTimeout(t);
    }, []);

    return {
        ...state,
        isLaceInstalled: isInstalled,
        connect,
        connectMock,
        disconnect,
        signTransaction,
        refreshBalance,
        walletApi: state.walletApi,
    };
};
