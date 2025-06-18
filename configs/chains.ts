import { EVMChain } from 'interfaces/network';

export const NO_CHAIN_SELECTED = '0';

export enum ChainID {
  PALOMA_MAIN = 'messenger',

  CREDIT_CARD = '0000',
  BANK_ACCOUNT = '0001',
  COINBASE_ONRAMP = '0002',
  ETHEREUM_MAIN = '1',
  OPTIMISM_MAIN = '10',
  BSC_MAIN = '56',
  POLYGON_MAIN = '137',
  BASE_MAIN = '8453',
  ARBITRUM_MAIN = '42161',
  GNOSIS_MAIN = '100',
}

export const ChainRPCs = {
  [ChainID.ETHEREUM_MAIN]: [
    'https://eth.llamarpc.com',
    'https://ethereum-rpc.publicnode.com',
    'https://1rpc.io/eth',
    'https://mainnet.infura.io',
  ],
  [ChainID.OPTIMISM_MAIN]: [
    'https://mainnet.optimism.io/',
    'https://1rpc.io/op',
    'https://optimism-rpc.publicnode.com',
    'https://optimism-mainnet.public.blastapi.io',
  ],
  [ChainID.BSC_MAIN]: [
    'https://binance.llamarpc.com',
    'https://1rpc.io/bnb',
    'https://bsc-rpc.publicnode.com',
    'https://bsc.rpc.blxrbdn.com',
  ],
  [ChainID.POLYGON_MAIN]: [
    'https://polygon-rpc.com',
    'https://1rpc.io/matic',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://polygon-bor-rpc.publicnode.com',
  ],
  [ChainID.BASE_MAIN]: [
    'https://base.llamarpc.com',
    'https://mainnet.base.org',
    'https://1rpc.io/base',
    'https://base-rpc.publicnode.com',
  ],
  [ChainID.ARBITRUM_MAIN]: [
    'https://arb1.arbitrum.io/rpc',
    'https://1rpc.io/arb',
    'https://arbitrum-one-rpc.publicnode.com',
    'https://arb-pokt.nodies.app',
  ],
  [ChainID.GNOSIS_MAIN]: [
    'https://rpc.gnosischain.com',
    'https://gnosis-rpc.publicnode.com',
    'https://1rpc.io/gnosis',
    'https://gnosis-pokt.nodies.app',
  ],
};

export const allEVMChains: { [key: string]: EVMChain } = {
  [ChainID.ETHEREUM_MAIN]: {
    icon: '/assets/chains/ethereum.svg',
    chainName: 'Ethereum',
    chainId: ChainID.ETHEREUM_MAIN,
    rpc: ChainRPCs[ChainID.ETHEREUM_MAIN][0],
    blockExplorerUrl: 'https://etherscan.io/',
    hex: '0x1',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [ChainID.OPTIMISM_MAIN]: {
    icon: '/assets/chains/optimism.svg',
    chainName: 'Optimism',
    chainId: ChainID.OPTIMISM_MAIN,
    rpc: ChainRPCs[ChainID.OPTIMISM_MAIN][0],
    blockExplorerUrl: 'https://optimistic.etherscan.io/',
    hex: '0xa',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [ChainID.BSC_MAIN]: {
    icon: '/assets/chains/binance.svg',
    chainName: 'BNB',
    chainId: ChainID.BSC_MAIN,
    rpc: ChainRPCs[ChainID.BSC_MAIN][0],
    blockExplorerUrl: 'https://bscscan.com/',
    hex: '0x38',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  [ChainID.ARBITRUM_MAIN]: {
    icon: '/assets/chains/arbitrum.svg',
    chainName: 'Arbitrum',
    chainId: ChainID.ARBITRUM_MAIN,
    rpc: ChainRPCs[ChainID.ARBITRUM_MAIN][0],
    blockExplorerUrl: 'https://arbiscan.io/',
    hex: '0xa4b1',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [ChainID.POLYGON_MAIN]: {
    icon: `/assets/chains/polygon.svg`,
    chainName: 'Polygon',
    chainId: ChainID.POLYGON_MAIN,
    rpc: ChainRPCs[ChainID.POLYGON_MAIN][0],
    blockExplorerUrl: 'https://polygonscan.com/',
    hex: '0x89',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  [ChainID.BASE_MAIN]: {
    icon: `/assets/chains/base.svg`,
    chainName: 'Base',
    chainId: ChainID.BASE_MAIN,
    rpc: ChainRPCs[ChainID.BASE_MAIN][0],
    blockExplorerUrl: 'https://basescan.org/',
    hex: '0x2105',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const allChains: { [key: string]: EVMChain } = {
  [ChainID.CREDIT_CARD]: {
    icon: '/assets/chains/credit card.svg',
    chainName: 'Credit Card',
    chainId: ChainID.CREDIT_CARD,
    rpc: '',
    blockExplorerUrl: '',
  },
  [ChainID.BANK_ACCOUNT]: {
    icon: '/assets/chains/bank account.svg',
    chainName: 'Bank Account',
    chainId: ChainID.BANK_ACCOUNT,
    rpc: '',
    blockExplorerUrl: '',
  },
  [ChainID.COINBASE_ONRAMP]: {
    icon: '/assets/chains/coinbase wallet.svg',
    chainName: 'Coinbase Wallet',
    chainId: ChainID.COINBASE_ONRAMP,
    rpc: '',
    blockExplorerUrl: '',
  },
  ...allEVMChains,
};
