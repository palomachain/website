import classNames from 'classnames';
import Button from 'components/Button';
import Command from 'components/Command';
import { ZERO_ADDRESS_PALOMA } from 'contracts/addresses';
import useNodeSale from 'hooks/useNodeSale';
import useProvider from 'hooks/useProvider';
import { useWallet } from 'hooks/useWallet';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { hexToStringWithBech, parseIntString, shortenString, stringToHexWithBech } from 'utils/string';

import style from './activate.module.scss';
import { purchaseSupportedNetworks } from 'configs/constants';

const STEPS = {
  CONNECT_WALLET: 1,
  ACTIVATE_PALOMA: 2,
  ACTIVATED: 3,
  TERMINAL: 4,
};

const shCommand = {
  command: (
    <p>
      sh $HOME/Downloads/setup.sh <span>activate</span>
    </p>
  ),
  copyCommand: 'sh $HOME/Downloads/setup.sh activate',
};

const Activate = () => {
  const { connectMetaMask, connectWalletConnect, disconnectWallet, wallet } = useWallet();
  const provider = useProvider(wallet);
  const { getActivate, activateWallet } = useNodeSale({ provider, wallet });
  const [steps, setSteps] = useState(STEPS.CONNECT_WALLET);
  const [activatedPalomaAddress, setActivatedPalomaAddress] = useState<string>();

  const [loadingMetamask, setLoadingMetamask] = useState(false);
  const [loadingWalletconnect, setLoadingWalletconnect] = useState(false);

  const [palomaAddress, setPalomaAddress] = useState<string>();
  const [activating, setActivating] = useState(false);

  const handleChooseMetamask = async () => {
    if (!loadingMetamask) {
      setLoadingMetamask(true);
      const isConnectedWallet = await connectMetaMask();
      !isConnectedWallet && setLoadingMetamask(false);
    }
  };

  const handleChooseWalletConnect = async () => {
    if (!loadingWalletconnect) {
      setLoadingWalletconnect(true);
      await connectWalletConnect();
      setLoadingWalletconnect(false);
    }
  };

  const checkActivate = async () => {
    const activateAddress: string = await getActivate();

    const isActivated = activateAddress && activateAddress !== ZERO_ADDRESS_PALOMA;
    if (isActivated) {
      setSteps(STEPS.ACTIVATED);
      setActivatedPalomaAddress(hexToStringWithBech(activateAddress));
    } else {
      setSteps(STEPS.ACTIVATE_PALOMA);
    }

    setLoadingMetamask(false);
    setLoadingWalletconnect(false);
  };

  useEffect(() => {
    if (wallet && parseIntString(wallet.network) in purchaseSupportedNetworks) {
      checkActivate();
    } else {
      setSteps(STEPS.CONNECT_WALLET);
    }
  }, [wallet, provider]);

  const isValidPalomaWallet = useMemo(() => {
    if (palomaAddress && palomaAddress.length === 45) {
      const hexValue = stringToHexWithBech(palomaAddress);
      if (hexValue !== ZERO_ADDRESS_PALOMA) return true;
      else {
        toast.error('Invalid paloma address.');
        return false;
      }
    }

    return false;
  }, [palomaAddress]);

  const onClickActivate = async () => {
    if (activating) return;
    try {
      setActivating(true);

      const activate = await activateWallet(stringToHexWithBech(palomaAddress));
      if (activate) {
        setSteps(STEPS.ACTIVATED);
        setActivatedPalomaAddress(palomaAddress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActivating(false);
    }
  };

  const onClickClose = () => {
    disconnectWallet();
    setSteps(STEPS.CONNECT_WALLET);
  };

  return (
    <section className={style.container}>
      <div className={classNames(style.walletModal, steps === STEPS.TERMINAL ? style.terminalModal : undefined)}>
        {steps === STEPS.CONNECT_WALLET && (
          <>
            <h1 className={style.title}>Activate your Paloma LightNode</h1>
            <p>
              After downloading the Paloma LightNode client, activate your Paloma address to start minting GRAINs. To
              complete activation, connect your EVM wallet used to purchase your LightNodes.
            </p>
            <div className={style.walletBtns}>
              <p className={style.chooseWallet}>Choose a Wallet</p>
              <Button className={style.connectWalletBtn} type="grey" onClick={() => handleChooseMetamask()}>
                {loadingMetamask ? (
                  <img src="/assets/icons/loading_circle.svg" height="33px" style={{ marginTop: 5, marginLeft: 6 }} />
                ) : (
                  <img src="/assets/wallets/metamask.svg" alt="" />
                )}
              </Button>
              <Button className={style.connectWalletBtn} type="grey" onClick={() => handleChooseWalletConnect()}>
                {loadingWalletconnect ? (
                  <img src="/assets/icons/loading_circle.svg" height="33px" style={{ marginTop: 5, marginLeft: 6 }} />
                ) : (
                  <img src="/assets/wallets/walletconnect.svg" alt="" />
                )}
              </Button>
            </div>
          </>
        )}
        {steps === STEPS.ACTIVATE_PALOMA && (
          <>
            <div className={style.walletItem}>
              <div className={style.activeRound} />
              <p>{shortenString(wallet.account, 6, 6)}</p>
              <img
                src="/assets/icons/close-black.png"
                alt="close-wallet"
                width={10}
                onClick={() => onClickClose()}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <h1 className="mt-">Activate your Paloma LightNode</h1>
            <p>
              To finalize activation, simply copy and paste the Paloma Address created in the Paloma LightNode client
              here. This will link your EVM Wallet to your Paloma Address and your purchased Nodes.
            </p>
            <h3 className={style.palomaAddress}>Paloma Address</h3>
            <input
              value={palomaAddress}
              onChange={(e) => setPalomaAddress(e.target.value)}
              className={style.inputWallet}
              placeholder="paloma1234...1234"
            />
            <button
              className={classNames(style.activateBtn, !isValidPalomaWallet ? style.invalid : undefined)}
              onClick={onClickActivate}
            >
              {activating ? (
                <img src="/assets/icons/loading_circle.svg" height="33px" style={{ marginTop: 5, marginLeft: 6 }} />
              ) : (
                'Activate'
              )}
            </button>
          </>
        )}
        {steps === STEPS.ACTIVATED && (
          <>
            <img className={style.loadingImage} src="/assets/icons/success.svg" alt="success" />
            <h1>Your Paloma LightNode Was Successfully Activated</h1>
            <p>
              Your LightNode transaction has been successfully processed. Please register your nodes for software
              support before downloading the Paloma LightNode Client.
            </p>
            <div className={style.activeWallets}>
              <div className={style.walletItem}>
                <div className={style.activeRound} />
                <p>{shortenString(wallet.account, 6, 6)}</p>
              </div>
              <div className={style.walletItem}>
                <img src="/assets/icons/connect.svg" alt="connect" />
              </div>
              <div className={style.walletItem}>
                <div className={style.activeRound} />
                <p>{shortenString(activatedPalomaAddress, 8, 6)}</p>
              </div>
            </div>
            <button className={style.activateBtn} onClick={() => setSteps(STEPS.TERMINAL)}>
              Continue
            </button>
          </>
        )}
        {steps === STEPS.TERMINAL && (
          <>
            <h1>Return to your Light Node</h1>
            <div className={style.terminal}>
              <div className={style.terminal__round}>1</div>
              <div className={style.terminal__item}>
                <p>After activating your LightNode, open the Terminal application found in the Utilities folder.</p>
                <Command command={shCommand.command} copyCommand={shCommand.copyCommand} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Activate;
