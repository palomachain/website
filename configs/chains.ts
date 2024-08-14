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
}

export const allChains: { [key: string]: EVMChain } = {
  [ChainID.ETHEREUM_MAIN]: {
    icon: '/assets/chains/ethereum.png',
    chainName: 'Ethereum',
    chainId: ChainID.ETHEREUM_MAIN,
    rpc: 'https://serene-divine-crater.quiknode.pro/',
    blockExplorerUrl: 'https://etherscan.io/',
  },
  [ChainID.OPTIMISM_MAIN]: {
    icon: '/assets/chains/optimism.png',
    chainName: 'Optimism',
    chainId: ChainID.OPTIMISM_MAIN,
    rpc: 'https://mainnet.optimism.io/',
    blockExplorerUrl: 'https://optimistic.etherscan.io/',
  },
  [ChainID.BSC_MAIN]: {
    icon: '/assets/chains/bnb.png',
    chainName: 'BNB',
    chainId: ChainID.BSC_MAIN,
    rpc: 'https://volume.liquify.com/api=0440032/bsc',
    blockExplorerUrl: 'https://bscscan.com/',
  },
  [ChainID.ARBITRUM_MAIN]: {
    icon: '/assets/chains/arbitrum.png',
    chainName: 'Arbitrum',
    chainId: ChainID.ARBITRUM_MAIN,
    rpc: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io/',
  },
  [ChainID.POLYGON_MAIN]: {
    icon: `/assets/chains/polygon.png`,
    chainName: 'Polygon',
    chainId: ChainID.POLYGON_MAIN,
    rpc: 'https://polygon.rpc.blxrbdn.com/',
    blockExplorerUrl: 'https://polygonscan.com/',
  },
  [ChainID.BASE_MAIN]: {
    icon: `/assets/chains/base.png`,
    chainName: 'Base',
    chainId: ChainID.BASE_MAIN,
    rpc: 'https://mainnet.base.org/',
    blockExplorerUrl: 'https://basescan.org/',
  },
};
