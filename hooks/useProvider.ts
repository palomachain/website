import { supportedNetworks } from 'configs/networks';
import { ethers } from 'ethers';
import { Wallet } from 'interfaces/network';
import { useMemo } from 'react';

const useProvider = (wallet: Wallet) => {
  const provider = useMemo(() => {
    let provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
    if (wallet?.provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    } else {
      provider = new ethers.providers.JsonRpcProvider(supportedNetworks['1'].rpcUrls[0]);
    }

    return provider;
  }, [wallet?.provider]);

  return provider;
};

export default useProvider;
