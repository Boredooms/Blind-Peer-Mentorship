import * as Rx from 'rxjs';
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
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { config } from '../config';

const FUNDED_SEED = '3565970f068d349d5263efc0f796e377eee916d8a7ec7e8f9a47113eeb09327a';

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

export class MockWalletAPI {
    private wallet: WalletFacade | null = null;
    private unshieldedKeystore: any = null;

    async enable() {
        if (this.wallet) return this;

        const keys = deriveKeysFromSeed(FUNDED_SEED);
        const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
        const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);
        this.unshieldedKeystore = createKeystore(keys[Roles.NightExternal], getNetworkId());

        const shieldedWallet = ShieldedWallet({
            networkId: getNetworkId(),
            indexerClientConnection: { indexerHttpUrl: config.indexerUrl, indexerWsUrl: config.indexerWsUrl },
            provingServerUrl: new URL(config.proofServerUrl),
            relayURL: new URL(config.nodeUrl.replace(/^http/, 'ws')),
        }).startWithSecretKeys(shieldedSecretKeys);

        const unshieldedWallet = UnshieldedWallet({
            networkId: getNetworkId(),
            indexerClientConnection: { indexerHttpUrl: config.indexerUrl, indexerWsUrl: config.indexerWsUrl },
            txHistoryStorage: new InMemoryTransactionHistoryStorage(),
        }).startWithPublicKey(PublicKey.fromKeyStore(this.unshieldedKeystore));

        const dustWallet = DustWallet({
            networkId: getNetworkId(),
            costParameters: { additionalFeeOverhead: 300_000_000_000_000n, feeBlocksMargin: 5 },
            indexerClientConnection: { indexerHttpUrl: config.indexerUrl, indexerWsUrl: config.indexerWsUrl },
            provingServerUrl: new URL(config.proofServerUrl),
            relayURL: new URL(config.nodeUrl.replace(/^http/, 'ws')),
        } as any).startWithSecretKey(dustSecretKey, ledger.LedgerParameters.initialParameters().dust);

        this.wallet = new WalletFacade(shieldedWallet, unshieldedWallet, dustWallet);
        await this.wallet.start(shieldedSecretKeys, dustSecretKey);
        // @ts-ignore
        await this.wallet.waitForSyncedState();

        return this;
    }

    async getBalance() {
        if (!this.wallet) throw new Error('Wallet not started');
        const state = await Rx.firstValueFrom(this.wallet.state());
        const balance = (state as any).unshielded?.balances[ledger.nativeToken().raw] ?? 0n;
        return balance.toString();
    }

    async getUsedAddresses() {
        if (!this.unshieldedKeystore) throw new Error('Keystore not ready');
        return [this.unshieldedKeystore.getBech32Address().toString()];
    }

    async getChangeAddress() {
        return this.getUsedAddresses().then(a => a[0]);
    }

    async balanceUnsealedTransaction(txHex: string) {
        if (!this.wallet) throw new Error('Wallet not started');
        const txBytes = fromHex(txHex);
        // Deserialize
        const tx = (ledger.Transaction.deserialize as any)(
            'signature',
            'proof',
            'pre-binding',
            txBytes
        );

        const recipe = await this.wallet.balanceUnboundTransaction(tx);

        // Sign intents
        const signFn = (payload: Uint8Array) => this.unshieldedKeystore.signData(payload);

        const recipeAny = recipe as any;
        const txToSign = recipeAny.transaction || recipeAny.baseTransaction;
        if (txToSign) {
            this.signTransactionIntents(txToSign, signFn, 'proof');
        }

        if (recipeAny.balancingTransaction) {
            this.signTransactionIntents(recipeAny.balancingTransaction, signFn, 'pre-proof');
        }

        const finalized = await this.wallet.finalizeRecipe(recipe);
        return { tx: toHex(finalized.serialize()) };
    }

    private signTransactionIntents(
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

    async getShieldedAddresses() {
        if (!this.wallet) throw new Error('Wallet not started');
        const state = await Rx.firstValueFrom(this.wallet.state());
        const stateAny = state as any;
        return {
            shieldedCoinPublicKey: toHex(stateAny.shielded.publicKey.coinPublicKey),
            shieldedEncryptionPublicKey: toHex(stateAny.shielded.publicKey.encryptionPublicKey),
        };
    }

    async submitTransaction(txHex: string) {
        if (!this.wallet) throw new Error('Wallet not started');
        const txBytes = fromHex(txHex);
        const tx = (ledger.Transaction.deserialize as any)(
            'signature',
            'proof',
            'binding',
            txBytes
        );
        return await this.wallet.submitTransaction(tx);
    }

    async signTransaction(tx: any) {
        return tx;
    }
}

export const mockWalletEntry = {
    name: 'Mock Wallet',
    icon: '🎭',
    apiVersion: '1.0.0',
    enable: async () => {
        const api = new MockWalletAPI();
        return await api.enable();
    },
    isEnabled: async () => true,
};
