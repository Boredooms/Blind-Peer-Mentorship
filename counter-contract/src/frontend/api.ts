import { type WalletProvider } from '@midnight-ntwrk/midnight-js-types';
import {
    Transaction,
    type TransactionId,
} from '@midnight-ntwrk/ledger-v7';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { Contract } from '../managed/blind-mentorship/contract/index.js';
import { config } from './config';

// --- Type Definitions for DApp Connector ---
interface WalletConnectedAPI {
    balanceUnsealedTransaction(tx: string): Promise<{ tx: string }>;
    submitTransaction(tx: string): Promise<void>;
    getShieldedAddresses(): Promise<{ shieldedCoinPublicKey: string; shieldedEncryptionPublicKey: string }>;
}

// Helper to convert Uint8Array to Hex String
const toHex = (bytes: Uint8Array): string =>
    Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

// Helper to convert Hex String to Uint8Array
const fromHex = (hex: string): Uint8Array => {
    if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
};

// --- WalletProvider Adapter ---
export class DAppConnectorWalletProvider implements WalletProvider {
    constructor(private walletApi: WalletConnectedAPI) { }

    async balanceTx(
        tx: Transaction<import('@midnight-ntwrk/ledger-v7').SignatureEnabled, import('@midnight-ntwrk/ledger-v7').Proof, import('@midnight-ntwrk/ledger-v7').PreBinding>,
        _ttl?: Date
    ): Promise<import('@midnight-ntwrk/ledger-v7').FinalizedTransaction> {
        const txBytes = tx.serialize();
        const txHex = toHex(txBytes);

        const { tx: balancedTxHex } = await this.walletApi.balanceUnsealedTransaction(txHex);

        const balancedTxBytes = fromHex(balancedTxHex);

        // Deserialize as FinalizedTransaction
        return Transaction.deserialize(
            'signature', // SignatureEnabled
            'proof',     // Proof
            'binding',   // Binding
            balancedTxBytes
        ) as unknown as import('@midnight-ntwrk/ledger-v7').FinalizedTransaction;
    }

    // Synchronous getters requiring pre-fetched state
    private coinPublicKey: string = '';
    private encryptionPublicKey: string = '';

    setCointPublicKey(key: string) {
        this.coinPublicKey = key;
    }

    setEncryptionPublicKey(key: string) {
        this.encryptionPublicKey = key;
    }

    getCoinPublicKey(): string {
        return this.coinPublicKey;
    }

    getEncryptionPublicKey(): string {
        return this.encryptionPublicKey;
    }
}

// --- Contract Client Factory ---

// Define the precise circuit ID type to satisfy TypeScript
type BlindMentorshipContract = Contract<any>;
type BlindMentorshipCircuitId = keyof BlindMentorshipContract['impureCircuits'];

export const createContractClient = async (walletApi: WalletConnectedAPI): Promise<FoundContract<Contract>> => {
    // 1. Initialize Providers
    const publicDataProvider = indexerPublicDataProvider(config.indexerUrl, config.indexerWsUrl);

    // The ZK config provider fetches the .zkir and .prover files
    // We explicitly type it to match the contract's impure circuits
    const zkConfigProvider = new FetchZkConfigProvider<BlindMentorshipCircuitId>(
        window.location.origin + '/zk-config'
    );

    // Proof provider requires the ZK config provider
    const proofProvider = httpClientProofProvider(config.proofServerUrl, zkConfigProvider);

    const privateStateProvider = levelPrivateStateProvider({
        privateStateStoreName: 'blind-mentorship-private-state',
    });

    // 2. Setup Wallet Provider Adapter
    const walletProvider = new DAppConnectorWalletProvider(walletApi);

    // Pre-fetch keys needed for synchronous getters
    const { shieldedCoinPublicKey, shieldedEncryptionPublicKey } = await walletApi.getShieldedAddresses();
    walletProvider.setCointPublicKey(shieldedCoinPublicKey);
    walletProvider.setEncryptionPublicKey(shieldedEncryptionPublicKey);

    // 3. Locate the Deployed Contract
    const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');

    const compiledContract = CompiledContract.make('blind-mentorship', Contract).pipe(
        CompiledContract.withVacantWitnesses
    );

    try {
        const contractClient = await findDeployedContract<Contract>(
            {
                walletProvider: walletProvider as unknown as WalletProvider,
                publicDataProvider,
                privateStateProvider,
                proofProvider,
                zkConfigProvider,
                midnightProvider: {
                    submitTx: async (tx: import('@midnight-ntwrk/ledger-v7').FinalizedTransaction): Promise<TransactionId> => {
                        const txBytes = tx.serialize();
                        const txHex = toHex(txBytes);
                        await walletApi.submitTransaction(txHex);
                        return tx.identifiers()[0];
                    }
                },
            },
            {
                contractAddress: config.contractAddress,
                compiledContract: compiledContract as any,
            }
        );

        console.log('Contract client initialized successfully');
        return contractClient;
    } catch (error) {
        console.error('Failed to initialize contract client:', error);
        throw error;
    }
};
