import coinbaseWalletModule from '@web3-onboard/coinbase';
import * as web3Onboard from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import ledgerModule from '@web3-onboard/ledger';
import metamaskSDK from '@web3-onboard/metamask';
import trezorModule from '@web3-onboard/trezor';
import frameModule from '@web3-onboard/frame';
import walletConnectModule from '@web3-onboard/walletconnect';
import { allEVMChains } from 'configs/chains';
import { useConnectWallet as useOnboardWallet } from '@web3-onboard/react';
import { OnboardAPI } from '@web3-onboard/core';
import { initialWalletState, Wallet } from 'interfaces/network';
import { parseDexString, parseIntString } from 'utils/string';
import { useEffect, useState } from 'react';

const WALLET_CONNECT_PROJECT_ID = 'c685334a8b28bf7c733632a5c49de23f';

const wallets = [
  injectedModule(),
  trezorModule({
    email: 'info@volume.finance',
    appUrl: 'https://www.palomachain.com/',
  }),
  ledgerModule({
    walletConnectVersion: 2,
    projectId: WALLET_CONNECT_PROJECT_ID,
  }),
  coinbaseWalletModule({ darkMode: true }),
  walletConnectModule({
    projectId: WALLET_CONNECT_PROJECT_ID,
    dappUrl: 'https://www.palomachain.com/',
  }),
  metamaskSDK({
    options: {
      extensionOnly: false,
      dappMetadata: {
        url: 'https://www.palomachain.com/',
        name: 'Curve',
        iconUrl: '/favicon.ico',
      },
    },
  }),
  frameModule(),
];

const initOnboard = () =>
  web3Onboard.init({
    wallets,
    chains: Object.values(allEVMChains).map(({ hex, rpc, chainName, nativeCurrency }) => ({
      id: hex,
      token: nativeCurrency.symbol,
      label: chainName,
      rpcUrl: rpc,
    })),
    appMetadata: {
      name: 'Paloma-website',
      icon: '/favicon.ico',
      description: 'Paloma Website',
    },
    disableFontDownload: true,
    notify: {
      desktop: {
        enabled: true,
        position: 'topRight',
      },
    },
    accountCenter: {
      desktop: {
        enabled: false,
      },
      mobile: {
        enabled: false,
      },
    },
    connect: {
      autoConnectLastWallet: true,
    },
  });

let onboard: OnboardAPI | null = null;

export const useWeb3Onboard = () => {
  if (!onboard) {
    onboard = initOnboard();
  }

  const [{ wallet: onboardWallet, connecting }, connect, disconnect] = useOnboardWallet();
  const [wallet, setWallet] = useState(initialWalletState);

  useEffect(() => {
    if (onboardWallet) {
      setWallet({
        ...wallet,
        account: onboardWallet.accounts[0].address,
        providerName: onboardWallet.label,
        provider: onboardWallet.provider,
        network: parseIntString(onboardWallet.chains[0].id),
      });
    } else {
      setWallet({ ...initialWalletState });
    }
  }, [onboardWallet]);

  const requestSwitchNetwork = async (chainId: string) => {
    try {
      if (chainId !== wallet.network) {
        const result = await onboard.setChain({ chainId: parseDexString(chainId) });
        return result;
      }
    } catch (error) {
      console.log('error', error);
      return false;
    }
  };

  const disconnectWallet = async () => {
    await onboard.disconnectWallet({ label: wallet.providerName });
  };

  const connectWallet = async () => {
    await connect();
  };

  return {
    wallet,
    connecting,
    connectWallet,
    disconnect,
    onboard,
    initOnboard,
    requestSwitchNetwork,
    disconnectWallet,
  };
};
