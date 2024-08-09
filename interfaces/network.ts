export type EthNetwork = "mainnet" | "optimism" | "bsc" | "polygon" | "arbitrum";
export type NetworkIds = "1" | "10" | "56" | "137" | "42161" | null;
export type Provider = "metamask" | "walletconnect" | "frame";
export interface Wallet {
  account: `0x${string}` | null;
  providerName: Provider | null;
  provider: any | null;
  network: string | null;
}

export interface EVMChain {
  icon: string;
  chainName: string;
  chainId: string | number;
  rpc: string;
  blockExplorerUrl: string;
}
