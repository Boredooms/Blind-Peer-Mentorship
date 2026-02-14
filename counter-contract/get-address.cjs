const { HDWallet, Roles } = require('@midnight-ntwrk/wallet-sdk-hd');
const { createKeystore } = require('@midnight-ntwrk/wallet-sdk-unshielded-wallet');
const { setNetworkId } = require('@midnight-ntwrk/midnight-js-network-id');

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

console.log('\n===========================================');
console.log('WALLET ADDRESS:', address);
console.log('===========================================\n');

hdWallet.hdWallet.clear();
