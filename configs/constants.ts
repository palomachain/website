const Networks = {
  "1": "Ethereum",
  "10": "Optimism",
  "56": "BNB",
  "8453": "Base",
  "137": "Polygon",
  "42161": "Arbitrum",
};

const AddNetwork = {
  "10": {
    chainName: "OP Mainnet",
    nativeCurrency: { decimals: 18, symbol: "ETH" },
    rpcUrls: ["https://mainnet.optimism.io/"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  "56": {
    chainName: "BNB Mainnet",
    nativeCurrency: { decimals: 18, symbol: "BNB" },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  "137": {
    chainName: "Polygon Mainnet",
    nativeCurrency: { decimals: 18, symbol: "MATIC" },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  "8453": {
    chainName: "Base",
    nativeCurrency: { decimals: 18, symbol: "ETH" },
    rpcUrls: ["https://mainnet.base.org/"],
    blockExplorerUrls: ["https://basescan.org/"],
  },
  "42161": {
    chainName: "Arbitrum One",
    nativeCurrency: { decimals: 18, symbol: "ETH" },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
  },
};

const DEFAULT_MAIN_CHAINS = [
  // mainnets
  "eip155:1",
  "eip155:10",
  "eip155:100",
  "eip155:137",
  "eip155:42161",
  "eip155:42220",
];

export { AddNetwork, DEFAULT_MAIN_CHAINS, Networks };

