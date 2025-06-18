import { ethers } from 'ethers';
import { Wallet } from 'interfaces/network';
import { useMemo } from 'react';
import { getFirstWorkingRpcUrl } from 'utils/url';

const useProvider = (wallet: Wallet) => {
  const provider = useMemo(() => {
    let provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
    if (wallet?.provider) {
      provider = new ethers.providers.Web3Provider(wallet.provider);
    } else {
      if (wallet.network) {
        const rpcUrl = getFirstWorkingRpcUrl(wallet.network);
        provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      } else {
        provider = null;
      }
    }

    return provider;
  }, [wallet]);

  return provider;
};

export default useProvider;
