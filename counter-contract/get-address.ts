import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { createKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const seed = 'c5e5274a3a572015b37f6fc0fe5176d3dc8bcbb871d6eac7cd6e8c6eed5d206f';

setNetworkId('undeployed');

const hdWallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
if (hdWallet.type !== 'seedOk') throw new Error('Failed to initialize HDWallet from seed');

const result = hdWallet.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);

if (result.type !== 'keysDerived') throw new Error('Failed to derive keys');

const unshieldedKeystore = createKeystore(result.keys[Roles.NightExternal], 'undeployed');
const address = unshieldedKeystore.getBech32Address();

console.log('Wallet Address:', address);
hdWallet.hdWallet.clear();
