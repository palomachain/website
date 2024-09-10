import { EVMChain } from 'interfaces/network';

export const NO_CHAIN_SELECTED = '0';

export enum ChainID {
  PALOMA_MAIN = 'messenger',

  ETHEREUM_MAIN = '1',
  OPTIMISM_MAIN = '10',
  BSC_MAIN = '56',
  POLYGON_MAIN = '137',
  BASE_MAIN = '8453',
  ARBITRUM_MAIN = '42161',
  CREDIT_CARD = '000',
}

export enum ChainRPC {
  ETHEREUM_MAIN = 'https://serene-divine-crater.quiknode.pro/',
  OPTIMISM_MAIN = 'https://mainnet.optimism.io/',
  BSC_MAIN = 'https://magical-virulent-star.bsc.quiknode.pro/3a2d527fd1a932d0ce5f3b87c4d9cfab670cb9ba/',
  POLYGON_MAIN = 'https://polygon.rpc.blxrbdn.com/',
  BASE_MAIN = 'https://mainnet.base.org/',
  ARBITRUM_MAIN = 'https://arb1.arbitrum.io/rpc',
}

export const allChains: { [key: string]: EVMChain } = {
  [ChainID.ETHEREUM_MAIN]: {
    icon: '/assets/chains/ethereum.svg',
    chainName: 'Ethereum',
    chainId: ChainID.ETHEREUM_MAIN,
    rpc: ChainRPC.ETHEREUM_MAIN,
    blockExplorerUrl: 'https://etherscan.io/',
  },
  [ChainID.OPTIMISM_MAIN]: {
    icon: '/assets/chains/optimism.svg',
    chainName: 'Optimism',
    chainId: ChainID.OPTIMISM_MAIN,
    rpc: ChainRPC.OPTIMISM_MAIN,
    blockExplorerUrl: 'https://optimistic.etherscan.io/',
  },
  [ChainID.BSC_MAIN]: {
    icon: '/assets/chains/binance.svg',
    chainName: 'BNB',
    chainId: ChainID.BSC_MAIN,
    rpc: ChainRPC.BSC_MAIN,
    blockExplorerUrl: 'https://bscscan.com/',
  },
  [ChainID.ARBITRUM_MAIN]: {
    icon: '/assets/chains/arbitrum.svg',
    chainName: 'Arbitrum',
    chainId: ChainID.ARBITRUM_MAIN,
    rpc: ChainRPC.ARBITRUM_MAIN,
    blockExplorerUrl: 'https://arbiscan.io/',
  },
  [ChainID.POLYGON_MAIN]: {
    icon: `/assets/chains/polygon.svg`,
    chainName: 'Polygon',
    chainId: ChainID.POLYGON_MAIN,
    rpc: ChainRPC.POLYGON_MAIN,
    blockExplorerUrl: 'https://polygonscan.com/',
  },
  [ChainID.BASE_MAIN]: {
    icon: `/assets/chains/base.svg`,
    chainName: 'Base',
    chainId: ChainID.BASE_MAIN,
    rpc: ChainRPC.BASE_MAIN,
    blockExplorerUrl: 'https://basescan.org/',
  },
  [ChainID.CREDIT_CARD]: {
    icon: '/assets/chains/credit card.svg',
    chainName: 'Credit Card',
    chainId: ChainID.CREDIT_CARD,
    rpc: '',
    blockExplorerUrl: '',
  },
};
