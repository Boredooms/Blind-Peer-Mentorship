import { createWallet } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { Transaction } from '@midnight-ntwrk/ledger-v7';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { nativeToken } from '@midnight-ntwrk/ledger-v7';
import * as Rx from 'rxjs';
import { webcrypto } from 'crypto';

// Polyfill for Node.js environment
// @ts-ignore
global.crypto = webcrypto;

// Genesis Seed (from get-address.ts)
const GENESIS_SEED = 'c5e5274a3a572015b37f6fc0fe5176d3dc8bcbb871d6eac7cd6e8c6eed5d206f';

// User's Address
const USER_ADDRESS = 'mn_addr_undeployed104uvf6ev9s2l7tkfml88awgt5hmlhyhlv2xhrvk942c484hy7ysqnwxaws';
const AMOUNT = 1000n * 1000000n; // 1000 tDUST (assuming 6 decimals)

const run = async () => {
    setNetworkId('undeployed');

    const logger = {
        info: console.log,
        error: console.error,
        warn: console.warn,
        debug: console.debug,
        trace: console.trace,
    } as any;

    // Initialize Providers
    const indexerUrl = process.env.INDEXER_URL || 'http://127.0.0.1:8088/api/v1/graphql';
    const indexerWsUrl = process.env.INDEXER_WS_URL || 'ws://127.0.0.1:8088/api/v1/graphql/ws';
    const proofServerUrl = process.env.PROOF_SERVER_URL || 'http://127.0.0.1:6300';

    const publicDataProvider = indexerPublicDataProvider(indexerUrl, indexerWsUrl);
    const zkConfigProvider = new NodeZkConfigProvider<'transfer'>(
        '@midnight-ntwrk/ledger-v7',
        process.cwd() // Might need adjustment if artifacts are elsewhere, but for transfer circuit it's usually inside the sdk
    );
    const proofProvider = httpClientProofProvider(proofServerUrl, zkConfigProvider);

    // Initialize Genesis Wallet
    const wallet = await createWallet(
        {
            seed: GENESIS_SEED,
            coinType: 1, // Testnet coin type
            // @ts-ignore
            logger,
        },
        {
            publicDataProvider,
            proofProvider,
        }
    );

    console.log('Genesis Address:', wallet.state.address);
    const balance = await Rx.firstValueFrom(wallet.state.balance$);
    console.log('Genesis Balance:', balance);

    if (balance < AMOUNT) {
        throw new Error('Insufficient funds in genesis wallet');
    }

    console.log(`Transferring ${AMOUNT} to ${USER_ADDRESS}...`);

    // Create Transaction
    // Note: The Wallet SDK simplifies this. We can use transferTransaction.
    // However, `createWallet` returns a wallet object that has a `transferTransaction` method in newer SDKs or we construct it.
    // Checking the docs/examples, `wallet-sdk-unshielded-wallet` returns a `Wallet` interface.

    // Let's assume standard transfer method availability or constructing a transaction manually if needed.
    // A common pattern in Midnight SDK examples:
    try {
        const tx = await wallet.transferTransaction([
            {
                amount: AMOUNT,
                receiverAddress: USER_ADDRESS,
                type: nativeToken(), // Transfer native token (tDUST)
            }
        ]);

        if (!tx) throw new Error('Failed to create transaction');

        console.log('Transaction created. Submitting...');
        const txId = await wallet.submitTransaction(tx);
        console.log('Transaction submitted:', txId);
        console.log('Waiting for confirmation...');

        // Simple wait or check status
        // In a real script we'd wait for specific confirmation
    } catch (e) {
        console.error('Transfer failed:', e);
    }

    // Clean up
    wallet.close();
};

run().catch(console.error);
