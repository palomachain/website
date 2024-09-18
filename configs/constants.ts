const envParam = {
  palomaNestServiceAPIBaseUrl: process.env.PALOMA_NEST_SERVICE_API_BASE_URL || '',
  onramperApiKey: process.env.ONRAMPER_API_KEY || '',
  palomaExtensionId: process.env.PALOMA_EXTENSION_ID || 'cjmmdephaciiailjnoikekdebkcbcfmi',
  MORALIS_SERVICE_API_KEY: process.env.MORALIS_SERVICE_API_KEY || '',
  nodeSale_eth: process.env.NODESALE_CONTRACT_ETH || '',
  nodeSale_bnb: process.env.NODESALE_CONTRACT_BNB || '',
  nodeSale_base: process.env.NODESALE_CONTRACT_BASE || '',
  nodeSale_arb: process.env.NODESALE_CONTRACT_ARB || '',
  nodeSale_op: process.env.NODESALE_CONTRACT_OP || '',
  nodeSale_polygon: process.env.NODESALE_CONTRACT_POLYGON || '',
  PASSCODE: process.env.PASSCODE || '',
  thirdWebApiKey: process.env.THIRDWEB_API_KEY || '',
  transakApiKey: process.env.TRANSAK_API_KEY || '',
};

const purchaseSupportedNetworks = {
  '0000': 'Credit Card',
  '0001': 'Bank Account',
  '1': 'Ethereum',
  '10': 'Optimism',
  '56': 'BNB',
  '137': 'Polygon',
  '8453': 'Base',
  '42161': 'Arbitrum',
};

const AddNetwork = {
  '10': {
    chainName: 'OP Mainnet',
    nativeCurrency: { decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://mainnet.optimism.io/'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  '56': {
    chainName: 'BNB Mainnet',
    nativeCurrency: { decimals: 18, symbol: 'BNB' },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  '137': {
    chainName: 'Polygon Mainnet',
    nativeCurrency: { decimals: 18, symbol: 'MATIC' },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  '8453': {
    chainName: 'Base',
    nativeCurrency: { decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://mainnet.base.org/'],
    blockExplorerUrls: ['https://basescan.org/'],
  },
  '42161': {
    chainName: 'Arbitrum One',
    nativeCurrency: { decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
};

const DEFAULT_MAIN_CHAINS = [
  // mainnets
  'eip155:1',
  'eip155:10',
  'eip155:100',
  'eip155:137',
  'eip155:42161',
  'eip155:42220',
];

enum WalletProfiles {
  CopyAddress = 'Copy address',
  CopiedAddress = 'Copied address!',
  OpenExplorer = 'Open in Explorer',
  Disconnect = 'Disconnect',
}

const SLIPPAGE_DOMINATOR = 1000;
const SLIPPAGE_PERCENTAGE = 1; // default slippage is 1%
const DEADLINE = 5; // 5 MIN

const USER_ACCESS_TOKEN = 'user_access_token';
const PURCHASE_INFO = 'my_purchase_info';
const PURCHASED_WALLET = 'my_recent_token_purchased_wallet';

export {
  AddNetwork,
  DEADLINE,
  DEFAULT_MAIN_CHAINS,
  purchaseSupportedNetworks,
  SLIPPAGE_DOMINATOR,
  SLIPPAGE_PERCENTAGE,
  envParam,
  USER_ACCESS_TOKEN,
  PURCHASE_INFO,
  PURCHASED_WALLET,
  WalletProfiles,
};
