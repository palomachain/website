export type EthNetwork = 'mainnet' | 'optimism' | 'bsc' | 'polygon' | 'arbitrum' | 'base';
export type NetworkIds = '1' | '10' | '56' | '137' | '8453' | '42161' | null;
export type Provider = 'metamask' | 'walletconnect' | 'frame';
export interface Wallet {
  account: `0x${string}` | null;
  providerName: string;
  provider: any | null;
  network: string | null;
}

export const initialWalletState: Wallet = {
  account: null,
  provider: null,
  providerName: null,
  network: null,
};

export interface INativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface EVMChain {
  icon: string;
  chainName: string;
  chainId: string | number;
  hex?: string;
  nativeCurrency?: INativeCurrency;
  rpc: string;
  blockExplorerUrl: string;
}
