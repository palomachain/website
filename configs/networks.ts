import { ChainID } from "configs/chains";

import { bloxRouteCustomProtectNetworks } from "configs/bloxRoute";

const arbitrum = {
  chainId: "0xa4b1",
  rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  chainName: "Arbitrum",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://arbiscan.io/"],
};

const optimism = {
  chainId: "0xa",
  rpcUrls: ["https://mainnet.optimism.io/"],
  chainName: "Optimism",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://optimistic.etherscan.io/"],
};

const base = {
  chainId: "0x2105",
  rpcUrls: ["https://mainnet.base.org/"],
  chainName: "Base",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://basescan.org/"],
};

export const supportedNetworks = {
  [ChainID.ARBITRUM_MAIN]: arbitrum,
  [ChainID.OPTIMISM_MAIN]: optimism,
  [ChainID.BASE_MAIN]: base,
  ...bloxRouteCustomProtectNetworks,
};
