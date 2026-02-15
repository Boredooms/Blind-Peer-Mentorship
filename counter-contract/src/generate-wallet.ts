import { generateRandomSeed, HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { createKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

const seed = toHex(Buffer.from(generateRandomSeed()));
console.log('Seed generated');

const hdWalletResult = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
if (hdWalletResult.type !== 'seedOk') {
    throw new Error('Failed to create HDWallet from seed');
}
console.log('HDWallet created');

const keysResult = hdWalletResult.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.NightExternal])
    .deriveKeysAt(0);

if (keysResult.type !== 'keysDerived') {
    throw new Error('Failed to derive keys');
}

console.log('Keys derived');
const key = keysResult.keys[Roles.NightExternal];
console.log('Key type:', typeof key, Buffer.isBuffer(key) || key instanceof Uint8Array);

const unshieldedKeystore = createKeystore(key, 'undeployed');
console.log('Keystore created');

console.log('\n--- Wallet Info ---');
console.log(`Seed: ${seed}`);
console.log(`Address: ${unshieldedKeystore.getBech32Address()}`);
console.log('-------------------\n');
