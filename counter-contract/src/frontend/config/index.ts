export const config = {
    // Network Configuration
    networkId: import.meta.env.VITE_NETWORK_ID || 'undeployed',
    nodeUrl: import.meta.env.VITE_NODE_URL || 'http://localhost:9944',
    indexerUrl: import.meta.env.VITE_INDEXER_URL || 'http://localhost:8088',
    indexerWsUrl: import.meta.env.VITE_INDEXER_WS_URL || 'ws://localhost:8088',
    proofServerUrl: import.meta.env.VITE_PROOF_SERVER_URL || 'http://localhost:6300',

    // Smart Contract
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '427f7e23d0ff6f515d5dae7ee5cb91f6c2cc3ceab9275c58111f6204522710b7',
    deploymentDate: import.meta.env.VITE_DEPLOYMENT_DATE || '2026-02-14T17:01:14.279Z',

    // Wallet
    walletAddress: import.meta.env.VITE_WALLET_ADDRESS || '',

    // Application
    appName: import.meta.env.VITE_APP_NAME || 'Blind Peer Mentorship',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

export type Config = typeof config;
