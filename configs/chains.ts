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
}

export enum ChainRPC {
  ETHEREUM_MAIN = 'https://serene-divine-crater.quiknode.pro/',
  OPTIMISM_MAIN = 'https://mainnet.optimism.io/',
  BSC_MAIN = 'https://magical-virulent-star.bsc.quiknode.pro/3a2d527fd1a932d0ce5f3b87c4d9cfab670cb9ba/',
  POLYGON_MAIN = 'https://attentive-long-wish.matic.quiknode.pro/c0451a8083b075b8c1eeb3c9d6b7ecabeb9583ac/',
  BASE_MAIN = 'https://mainnet.base.org/',
  ARBITRUM_MAIN = 'https://necessary-green-silence.arbitrum-mainnet.quiknode.pro/17b0421095485a691d7ff378e2243c5b0a8792df/',
}

export const allEVMChains: { [key: string]: EVMChain } = {
  [ChainID.ETHEREUM_MAIN]: {
    icon: '/assets/chains/ethereum.svg',
    chainName: 'Ethereum',
    chainId: ChainID.ETHEREUM_MAIN,
    rpc: ChainRPC.ETHEREUM_MAIN,
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
    rpc: ChainRPC.OPTIMISM_MAIN,
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
    rpc: ChainRPC.BSC_MAIN,
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
    rpc: ChainRPC.ARBITRUM_MAIN,
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
    rpc: ChainRPC.POLYGON_MAIN,
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
    rpc: ChainRPC.BASE_MAIN,
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
