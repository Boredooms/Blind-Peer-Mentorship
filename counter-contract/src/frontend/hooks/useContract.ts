import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { createContractClient } from '../api';
import { type Contract } from '../../managed/blind-mentorship/contract/index';
// @ts-ignore
import { FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

export const useContract = () => {
    const { walletApi, connected } = useWallet();
    const [contractClient, setContractClient] = useState<FoundContract<Contract> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initContract = async () => {
            if (connected && walletApi && !contractClient) {
                try {
                    setLoading(true);
                    const client = await createContractClient(walletApi);
                    setContractClient(client);
                    console.log('Contract client initialized');
                } catch (err: any) {
                    console.error('Failed to initialize contract client:', err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        initContract();
    }, [connected, walletApi, contractClient]);

    const registerUser = async (role: 'mentor' | 'mentee', _profileData: any) => {
        if (!contractClient) throw new Error('Contract not initialized');
        setLoading(true);
        try {
            console.log(`Calling registerUser circuit as ${role}...`);
            const tx = await contractClient.callTx.registerUser();
            console.log('Transaction submitted:', tx);
            return tx;
        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const requestMentorship = async (_skill: string) => {
        if (!contractClient) throw new Error('Contract not initialized');
        setLoading(true);
        try {
            console.log('Calling requestMentorship circuit...');
            const tx = await contractClient.callTx.requestMentorship();
            console.log('Transaction submitted:', tx);
            return tx;
        } catch (err: any) {
            console.error('Request mentorship failed:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completeSession = async (_sessionId: string) => {
        if (!contractClient) throw new Error('Contract not initialized');
        setLoading(true);
        try {
            console.log('Calling completeSession circuit...');
            const tx = await contractClient.callTx.completeSession();
            console.log('Transaction submitted:', tx);
            return tx;
        } catch (err: any) {
            console.error('Complete session failed:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        contractClient,
        loading,
        error,
        registerUser,
        requestMentorship,
        completeSession,
    };
};
