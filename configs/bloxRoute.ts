import { ChainID, ChainRPC } from 'configs/chains';

const ethProtect = {
  chainId: '0x1',
  rpcUrls: [ChainRPC.ETHEREUM_MAIN],
  chainName: 'ETH MEV Protected',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://etherscan.io/'],
};

const bscProtect = {
  chainId: '0x38',
  rpcUrls: [ChainRPC.BSC_MAIN],
  chainName: 'BSC MEV Protected',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  blockExplorerUrls: ['https://bscscan.com/'],
};

const polygonProtect = {
  chainId: '0x89',
  rpcUrls: ['https://volume.liquify.com/api=0440032/polygon'],
  chainName: 'Polygon MEV Protected',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrls: ['https://polygonscan.com/'],
};

export const bloxRouteCustomProtectNetworks = {
  [ChainID.ETHEREUM_MAIN]: ethProtect,
  [ChainID.BSC_MAIN]: bscProtect,
  [ChainID.POLYGON_MAIN]: polygonProtect,
};
