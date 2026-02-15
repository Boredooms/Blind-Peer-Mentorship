import * as Rx from 'rxjs';
import { WebSocket } from 'ws';
import * as ledger from '@midnight-ntwrk/ledger-v7';
import {
    createKeystore,
    InMemoryTransactionHistoryStorage,
    PublicKey,
    UnshieldedWallet,
} from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { getNetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { nativeToken } from '@midnight-ntwrk/ledger-v7';

// @ts-expect-error: needed for apollo WS transport
globalThis.WebSocket = WebSocket;

const INDEXER = process.env.INDEXER_URL ?? 'http://127.0.0.1:8088/api/v3/graphql';
const INDEXER_WS = process.env.INDEXER_WS_URL ?? 'ws://127.0.0.1:8088/api/v3/graphql/ws';
const NODE = process.env.NODE_URL ?? 'http://127.0.0.1:9944';
const PROOF_SERVER = process.env.PROOF_SERVER_URL ?? 'http://127.0.0.1:6300';
const NETWORK_ID = 'undeployed';

const GENESIS_SEED = '3565970f068d349d5263efc0f796e377eee916d8a7ec7e8f9a47113eeb09327a';
const USER_ADDRESS = 'mn_addr_undeployed104uvf6ev9s2l7tkfml88awgt5hmlhyhlv2xhrvk942c484hy7ysqnwxaws';
const AMOUNT = 10n * 1000000n; // 10 tokens

setNetworkId(NETWORK_ID);

function deriveKeysFromSeed(seed: string) {
    const hdWallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
    if (hdWallet.type !== 'seedOk') throw new Error('Failed to initialize HDWallet from seed');

    const result = hdWallet.hdWallet
        .selectAccount(0)
        .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
        .deriveKeysAt(0);

    if (result.type !== 'keysDerived') throw new Error('Failed to derive keys');
    hdWallet.hdWallet.clear();
    return result.keys;
}

async function main() {
    try {
        console.log('Building Genesis Wallet...');
        const keys = deriveKeysFromSeed(GENESIS_SEED);
        const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
        const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);
        const unshieldedKeystore = createKeystore(keys[Roles.NightExternal], getNetworkId());

        const shieldedWallet = ShieldedWallet({
            networkId: getNetworkId(),
            indexerClientConnection: { indexerHttpUrl: INDEXER, indexerWsUrl: INDEXER_WS },
            provingServerUrl: new URL(PROOF_SERVER),
            relayURL: new URL(NODE.replace(/^http/, 'ws')),
        }).startWithSecretKeys(shieldedSecretKeys);

        const unshieldedWallet = UnshieldedWallet({
            networkId: getNetworkId(),
            indexerClientConnection: { indexerHttpUrl: INDEXER, indexerWsUrl: INDEXER_WS },
            txHistoryStorage: new InMemoryTransactionHistoryStorage(),
        }).startWithPublicKey(PublicKey.fromKeyStore(unshieldedKeystore));

        const dustWallet = DustWallet({
            networkId: getNetworkId(),
            costParameters: { additionalFeeOverhead: 300_000_000_000_000n, feeBlocksMargin: 5 },
            indexerClientConnection: { indexerHttpUrl: INDEXER, indexerWsUrl: INDEXER_WS },
            provingServerUrl: new URL(PROOF_SERVER),
            relayURL: new URL(NODE.replace(/^http/, 'ws')),
        } as any).startWithSecretKey(dustSecretKey, ledger.LedgerParameters.initialParameters().dust);

        const wallet = new WalletFacade(shieldedWallet, unshieldedWallet, dustWallet);
        await wallet.start(shieldedSecretKeys, dustSecretKey);
        console.log('Wallet started. Waiting for sync...');

        // @ts-ignore
        await wallet.waitForSyncedState();
        console.log('Synced!');

        const state = await Rx.firstValueFrom(wallet.state());
        const balance = (state.unshielded?.balances[nativeToken().raw] ?? 0n);
        console.log('Genesis Balance:', balance);

        if (balance < AMOUNT) {
            throw new Error('Insufficient funds in Genesis wallet');
        }

        console.log(`Sending ${AMOUNT} to ${USER_ADDRESS}...`);

        // @ts-ignore
        const recipe = await wallet.transferTransaction([
            {
                amount: AMOUNT,
                receiverAddress: USER_ADDRESS,
                type: nativeToken(),
            }
        ]);

        if (!recipe) throw new Error('Failed to create transfer recipe');

        // Sign function
        const signFn = (payload: Uint8Array) => unshieldedKeystore.signData(payload);

        // Helper to sign intents
        function signTransactionIntents(
            tx: { intents?: Map<number, any> },
            signFn: (payload: Uint8Array) => ledger.Signature,
            proofMarker: 'proof' | 'pre-proof',
        ): void {
            if (!tx.intents || tx.intents.size === 0) return;
            for (const segment of tx.intents.keys()) {
                const intent = tx.intents.get(segment);
                if (!intent) continue;
                const cloned = ledger.Intent.deserialize<ledger.SignatureEnabled, ledger.Proofish, ledger.PreBinding>(
                    'signature', proofMarker, 'pre-binding', intent.serialize(),
                );
                const sigData = cloned.signatureData(segment);
                const signature = signFn(sigData);

                if (cloned.fallibleUnshieldedOffer) {
                    const sigs = cloned.fallibleUnshieldedOffer.inputs.map(
                        (_: any, i: number) => cloned.fallibleUnshieldedOffer!.signatures.at(i) ?? signature,
                    );
                    cloned.fallibleUnshieldedOffer = cloned.fallibleUnshieldedOffer.addSignatures(sigs);
                }
                if (cloned.guaranteedUnshieldedOffer) {
                    const sigs = cloned.guaranteedUnshieldedOffer.inputs.map(
                        (_: any, i: number) => cloned.guaranteedUnshieldedOffer!.signatures.at(i) ?? signature,
                    );
                    cloned.guaranteedUnshieldedOffer = cloned.guaranteedUnshieldedOffer.addSignatures(sigs);
                }

                tx.intents.set(segment, cloned);
            }
        }

        // Use recipe.transaction if available, or recipe.baseTransaction
        // @ts-ignore
        const txToSign = recipe.transaction || recipe.baseTransaction;
        if (txToSign) {
            signTransactionIntents(txToSign, signFn, 'proof');
        }

        // @ts-ignore
        if (recipe.balancingTransaction) {
            // @ts-ignore
            signTransactionIntents(recipe.balancingTransaction, signFn, 'pre-proof');
        }

        const finalized = await wallet.finalizeRecipe(recipe);
        const txId = await wallet.submitTransaction(finalized);

        console.log('Transaction submitted:', txId);
        console.log('Done!');

        await wallet.stop();
        process.exit(0);

    } catch (err: any) {
        console.error('Main error details:');
        if (err instanceof Error) {
            console.error(err.message);
            console.error(err.stack);
        } else {
            console.error(JSON.stringify(err, null, 2));
        }
        process.exit(1);
    }
}

main();
