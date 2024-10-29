import { useAddress, useChainId, useConnectionStatus, useDisconnect, useSwitchChain } from '@thirdweb-dev/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { USER_ACCESS_TOKEN } from 'configs/constants';
import { StaticLink } from 'configs/links';
import { supportedNetworks } from 'configs/networks';
import WalletSelectModal from 'containers/wallet/WalletSelectModal';
import { NetworkIds, Provider, Wallet } from 'interfaces/network';
import { useRouter } from 'next/router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLazyGetStatusQuery, usePostAddAddrMutation } from 'services/api/nodesale';
import Cookies from 'universal-cookie';
import { errorMessage } from 'utils/errorMessage';
import { checksumAddress, parseIntString, parseOxString } from 'utils/string';
import useCookie from './useCookie';

const cookies = new Cookies();

type WalletContextType = {
  ethereum?: any;
  wallet: Wallet;
  connectMetaMask: (e?: string) => Promise<boolean>;
  connectWalletConnect: () => Promise<void>;
  disconnectWallet: () => void;
  openConnectionModal: () => void;
  handleConnectMetamask: () => void;
  requestSwitchNetwork: (chainId: string, isMetaMask?: boolean) => Promise<boolean>;
  requestAddNetwork: (chainId: number | string) => void;
  networkSelect: (defaultChain: number | string, supportChains: object) => Promise<boolean>;
  error: Error | null;
  availableProviders: { [providerName in Provider]: boolean };
};

const initialWallet = {
  ethereum: null,
  wallet: {
    account: null,
    provider: null,
    providerName: null,
    network: null,
  },
  error: null,
};
export const WalletContext = createContext<Partial<WalletContextType>>(initialWallet);

const initialWalletState: Wallet = {
  account: null,
  provider: null,
  providerName: null,
  network: null,
};

export const WalletProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const ethereum = (window as any).ethereum;

  const windowUrl = window.location.pathname;

  const { open } = useWeb3Modal();

  const connectedAddress = useAddress();
  const connectionStatus = useConnectionStatus();
  const connectedChainId = useChainId();
  const switchChain = useSwitchChain();
  const disconnect = useDisconnect();

  const [web3ModalLoading, setWeb3ModalLoading] = useState(false);

  const [getStatus] = useLazyGetStatusQuery();
  const [postAddAddr] = usePostAddAddrMutation();
  const { getStoredData } = useCookie();
  const router = useRouter();

  const availableProviders = {
    metamask: ethereum?.isMetaMask,
    walletconnect: true,
    frame: ethereum?.isFrame,
  };

  const [wallet, setWallet] = useState<Wallet>(initialWalletState);
  const [error, setError] = useState<Error | null>(null);

  const [showChooseWalletModal, setShowChooseWalletModal] = useState(false);
  const [showConnecting, setShowConnecting] = useState<boolean>(false);

  const disconnectWallet = useCallback(async () => {
    await disconnect();

    cookies.remove('current_wallet', { path: '/' });
    setWallet({
      account: null,
      providerName: null,
      provider: null,
      network: null,
    });

    setShowChooseWalletModal(false);
    setShowConnecting(false);
  }, [wallet.account, wallet.providerName]);

  // Subscribe to updates (do this before calling connection in case we load from cookies)
  useEffect(() => {
    if (ethereum) {
      const handleNetworkChange = (networkId: NetworkIds) => {
        if (wallet?.providerName !== 'metamask') return;

        setWallet({ ...wallet, network: networkId });
      };

      const handleAccountChange = async (accounts: `0x${string}`[]) => {
        // If we are not currently connected with metamask, then no-op
        if (wallet.providerName !== 'metamask') return;

        const [account] = accounts;
        if (account) {
          const walletObj: Wallet = {
            account,
            providerName: 'metamask',
            provider: (window as any).ethereum,
            network: parseIntString(await ethereum.request({ method: 'net_version' })) || '1',
          };

          setWallet(walletObj);
        } else {
          disconnectWallet();
        }
      };
      ethereum.on('accountsChanged', handleAccountChange);

      ethereum.on('chainChanged', handleNetworkChange);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountChange);
        ethereum.removeListener('chainChanged', handleNetworkChange);
      };
    }
  }, [disconnectWallet, ethereum, wallet]);

  // Check and Register wallet address
  const registerAddress = async (account: string) => {
    // Check login token
    const myToken = await getStoredData(USER_ACCESS_TOKEN);
    let token = '';
    if (myToken.data) {
      token = myToken.data;
    } else {
      router.push(`${StaticLink.LOGIN}/?redirect=${StaticLink.BUYMOREBOARD}`);
      return;
    }

    const status = await getStatus({ buyer: checksumAddress(account) });
    // Has purchased history
    if (status?.isSuccess && status?.data && status?.data.length > 0) {
      // Register address
      await postAddAddr({ addr: checksumAddress(account), token: token });
    }
  };

  const connectMetaMask = async (network = '1') => {
    if (!ethereum) return;

    // For Firefox browser
    try {
      // handle choose wallet after disconnect current wallet
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      const [account] = accounts;
      const walletObj: Wallet = {
        account,
        providerName: 'metamask',
        provider: (window as any).ethereum,
        network: parseIntString(network),
      };

      cookies.set(
        'current_wallet',
        {
          account,
          providerName: walletObj.providerName,
          network: walletObj.network,
        },
        {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          path: '/',
        },
      );

      const changedNetwork = await requestSwitchNetwork(network);

      if (changedNetwork) {
        setWallet(walletObj);
        setShowChooseWalletModal(false);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('error', error);
      toast.info(errorMessage(error), { toastId: 'wallet-warning' });
      setShowConnecting(false);
      return false;
    }
  };

  //re-set cookie when wallet state changes
  useEffect(() => {
    try {
      if (wallet && wallet?.account) {
        cookies.remove('current_wallet', { path: '/' });
        const walletFromCookie: Partial<Wallet> = cookies.get('current_wallet');
        if (
          !walletFromCookie ||
          (walletFromCookie.account !== wallet.account && walletFromCookie.network !== wallet.network)
        ) {
          cookies.set(
            'current_wallet',
            {
              account: wallet.account,
              providerName: wallet.providerName,
              network: parseIntString(wallet.network),
            },
            {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              path: '/',
            },
          );
        }

        // Register wallet address
        if (windowUrl.toLowerCase().includes(StaticLink.BUYMOREBOARD)) {
          registerAddress(wallet.account);
        }
      }
    } catch (e) {
      setError(e);
    }
  }, [wallet]);

  const handleConnectMetamask = async () => {
    const network = await window.ethereum.request({ method: 'net_version' });
    await connectMetaMask(network);
  };

  const connectWalletConnect = async () => {
    await disconnect();
    setWeb3ModalLoading(true);

    await open();

    setWeb3ModalLoading(false);
  };

  useEffect(() => {
    if (connectedAddress && connectedChainId && connectionStatus === 'connected') {
      cookies.set(
        'current_wallet',
        {
          account: connectedAddress,
          providerName: '',
          network: String(connectedChainId),
        },
        {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          path: '/',
        },
      );

      setWallet({
        account: parseOxString(connectedAddress),
        providerName: null,
        provider: (window as any).ethereum,
        network: String(connectedChainId),
      });

      setShowChooseWalletModal(false);
    } else {
      cookies.remove('current_wallet', { path: '/' });
      setWallet({
        account: null,
        providerName: null,
        provider: null,
        network: null,
      });
    }
  }, [connectedAddress, connectedChainId, connectionStatus]);

  const openConnectionModal = () => {
    if (!wallet || !wallet.account) {
      setShowChooseWalletModal(true);
    }
  };

  const requestSwitchNetwork = async (chainId: string, isMetaMask = true) => {
    try {
      if (chainId !== wallet.network) {
        const data = await switchChain(Number(parseIntString(chainId)));
      }
    } catch (error) {
      console.log('error', error);
      return false;
    }

    return true;
  };

  const requestAddNetwork = async (chainId: string) => {
    // TODO: disable custom rpc endpoints to user's wallet
    // const network = supportedNetworks[chainId];
    // await ethereum.request({
    //   method: 'wallet_addEthereumChain',
    //   params: [network],
    // });
  };

  const networkSelect = async (defaultChain: string, supportChains: object = supportedNetworks) => {
    if (!wallet || !wallet.network) {
      const result = await connectMetaMask(defaultChain);
      if (result) return true;
      return false;
    }

    const connectNetwork = parseIntString(wallet.network);
    if (connectNetwork in supportChains) {
      return true;
    } else {
      const result = await requestSwitchNetwork(defaultChain);
      if (result) return true;
    }

    return false;
  };

  return (
    <WalletContext.Provider
      value={{
        ethereum,
        wallet,
        connectMetaMask,
        connectWalletConnect,
        disconnectWallet,
        openConnectionModal,
        handleConnectMetamask,
        requestSwitchNetwork,
        requestAddNetwork,
        networkSelect,
        availableProviders,
        error,
      }}
    >
      {children}
      {showChooseWalletModal && (
        <WalletSelectModal
          onClose={() => setShowChooseWalletModal(false)}
          onChooseMetamask={() => handleConnectMetamask()}
          // onChooseFrame={() => handleConnectFrame()}
          onChooseWalletConnect={() => connectWalletConnect()}
          showConnecting={showConnecting}
          setShowConnecting={setShowConnecting}
          web3ModalLoading={web3ModalLoading}
          // frameLoading={frameLoading}
        />
      )}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  return useContext(WalletContext) as WalletContextType;
};
