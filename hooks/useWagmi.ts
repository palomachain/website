import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { arbitrum, base, bsc, gnosis, mainnet, optimism, polygon } from 'wagmi/chains';

const useWagmi = () => {
  const chains = [arbitrum, base, bsc, gnosis, mainnet, optimism, polygon];
  const projectId = process.env.WALLETCONNECT_PROJECT_ID;

  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    enableCoinbase: false,
    enableEIP6963: false,
    enableEmail: false,
    enableInjected: false,
    enableWalletConnect: true,
  });

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });

  return {
    projectId,
    wagmiConfig,
  };
};

export default useWagmi;
