import { ConnectWallet } from '@thirdweb-dev/react';
import classNames from 'classnames';
import Button from 'components/Button';
import Command from 'components/Command';
import Modal from 'components/Modal';
import { ZERO_ADDRESS_PALOMA } from 'contracts/addresses';
import useNodeSale from 'hooks/useNodeSale';
import useProvider from 'hooks/useProvider';
import { useWallet } from 'hooks/useWallet';
import { IActivateInfos } from 'interfaces/nodeSale';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useLazyGetIsUsedPalomaAddressQuery, usePostActiveWalletMutation } from 'services/api/nodesale';
import { ActivateInstructionsSteps, SupportSystems } from 'utils/data';
import { isSameContract, parseIntString, shortenString, stringToHexWithBech } from 'utils/string';

import style from './activate.module.scss';

const STEPS = {
  CONNECT_WALLET: 1,
  ACTIVATE_PALOMA: 2,
  ALREADY_USED_PALOMA: 3,
  ACTIVATED: 4,
  TERMINAL: 5,
  INVALID_WALLET: 6,
};

interface IActivate {
  purchaseData: IActivateInfos;
  onClose: () => void;
  className?: string;
}

const Activate = ({ purchaseData, onClose, className }: IActivate) => {
  const { connectWalletConnect, handleConnectMetamask, disconnectWallet, wallet, requestSwitchNetwork } = useWallet();
  const provider = useProvider(wallet);

  const { getActivate, activateWallet } = useNodeSale({ provider, wallet });
  const [fetchIsUsedPalomaAddress] = useLazyGetIsUsedPalomaAddressQuery();
  const [postActivateWallet] = usePostActiveWalletMutation();

  const [steps, setSteps] = useState(STEPS.CONNECT_WALLET);
  const [activatedPalomaAddress, setActivatedPalomaAddress] = useState<string>();

  const [loadingMetamask, setLoadingMetamask] = useState(false);
  const [loadingWalletconnect, setLoadingWalletconnect] = useState(false);

  const [palomaAddress, setPalomaAddress] = useState<string>();
  const [activating, setActivating] = useState(false);

  const [currentTab, setCurrentTab] = useState(SupportSystems.Mac);

  const onChangeTab = (tab: string) => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  };

  const handleChooseMetamask = async () => {
    if (!loadingMetamask) {
      setLoadingMetamask(true);
      await handleConnectMetamask();
      setLoadingMetamask(false);
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
    /** Disabled checking if a Paloma address is already active. Multiple Paloma addresses can be active. */

    // const activateAddress: string = await getActivate();
    // const isActivated = activateAddress && activateAddress !== ZERO_ADDRESS_PALOMA;
    // if (isActivated) {
    //   setSteps(STEPS.ACTIVATED);
    //   setActivatedPalomaAddress(hexToStringWithBech(activateAddress));
    // } else {
    //   setSteps(STEPS.ACTIVATE_PALOMA);
    // }

    setSteps(STEPS.ACTIVATE_PALOMA);
    setLoadingMetamask(false);
    setLoadingWalletconnect(false);
  };

  useEffect(() => {
    if (purchaseData) {
      if (purchaseData.fiat_wallet_address) {
        checkActivate();
      } else if (wallet.account) {
        const call = async () => {
          const result = await requestSwitchNetwork(purchaseData.chain_id.toString());
          if (result) {
            if (isSameContract(wallet.account, purchaseData.buyer)) {
              checkActivate();
            } else {
              setSteps(STEPS.INVALID_WALLET);
              setLoadingMetamask(false);
              setLoadingWalletconnect(false);
            }
          } else {
            onClose();
            setLoadingMetamask(false);
            setLoadingWalletconnect(false);
          }
        };
        call();
      } else {
        setSteps(STEPS.CONNECT_WALLET);
      }
    }
  }, [wallet, purchaseData]);

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
    if (!isValidPalomaWallet) return;

    try {
      setActivating(true);

      /** Check if already used paloma address */
      const isUsedPalomaAddress = await fetchIsUsedPalomaAddress({ paloma: palomaAddress });
      if (isUsedPalomaAddress.isSuccess) {
        if (isUsedPalomaAddress.data) {
          setSteps(STEPS.ALREADY_USED_PALOMA);
          return;
        }
      } else {
        toast.error('Invalid paloma address. Please confirm your paloma address again.');
        return;
      }

      /** Activate paloma address */
      if (purchaseData.fiat_wallet_address) {
        const result = await postActivateWallet({
          token: purchaseData.token,
          paloma: stringToHexWithBech(palomaAddress),
        });
        if (result && result.error) {
          toast.error('Failed. Please try again later.');
        } else {
          setSteps(STEPS.ACTIVATED);
          setActivatedPalomaAddress(palomaAddress);
        }
      } else {
        const activate = await activateWallet(
          stringToHexWithBech(palomaAddress),
          parseIntString(purchaseData.chain_id.toString()),
          purchaseData.contract_ver === 1, // If contract version is 1, true, else false
        );
        if (activate) {
          setSteps(STEPS.ACTIVATED);
          setActivatedPalomaAddress(palomaAddress);
        }
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
    <Modal className={style.container} onClose={onClose}>
      <div className={classNames(style.walletModal, steps === STEPS.TERMINAL ? style.terminalModal : undefined)}>
        {steps === STEPS.CONNECT_WALLET && (
          <>
            <h1 className={style.title}>Activate your Paloma LightNode</h1>
            <p>
              After downloading the Paloma LightNode client, activate your Paloma address to start minting GRAINs. To
              complete activation, connect your EVM wallet used to purchase your LightNodes.
            </p>
            <div className={style.walletBtns}>
              <p className={style.chooseWallet}>
                {wallet && wallet.network ? 'Switch the Network' : 'Choose a Wallet'}
              </p>
              {/* <Button className={style.connectWalletBtn} type="grey" onClick={() => handleChooseMetamask()}>
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
              </Button> */}
              {wallet && wallet.network ? (
                <img
                  src="/assets/icons/loading_circle.svg"
                  height="33px"
                  style={{ marginTop: 5, marginLeft: 6, width: '100%' }}
                />
              ) : (
                <ConnectWallet
                  className={style.connectWalletBtn}
                  btnTitle="Connect EVM Wallet"
                  showThirdwebBranding={false}
                />
              )}
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
        {steps === STEPS.ALREADY_USED_PALOMA && (
          <>
            <img src="/assets/icons/false.svg" alt="false" />
            <h1>This Paloma Wallet is already in use</h1>
            <p>The Paloma wallet you selected is already in use. Please activate your wallet using your LightNode.</p>
            <button className={style.activateBtn} onClick={() => setSteps(STEPS.ACTIVATE_PALOMA)}>
              Connect another Wallet
            </button>
          </>
        )}
        {steps === STEPS.INVALID_WALLET && (
          <>
            <img src="/assets/icons/false.svg" alt="false" />
            <h1>This wallet is not linked to purchased Paloma LightNode</h1>
            <p>
              The selected wallet does not contain the purchased nodes. Please ensure that you connect the wallet with
              which you made the purchase.
            </p>
            <button className={style.activateBtn} onClick={() => setSteps(STEPS.CONNECT_WALLET)}>
              Connect another Wallet
            </button>
          </>
        )}
        {steps === STEPS.ACTIVATED && (
          <>
            <img src="/assets/icons/success.svg" alt="success" />
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
            <div className={style.tabs}>
              {Object.values(SupportSystems).map((system, index) => (
                <div
                  key={index}
                  onClick={() => onChangeTab(system)}
                  className={classNames(style.tab, currentTab === system ? style.active : undefined)}
                >
                  {system}
                </div>
              ))}
            </div>
            {ActivateInstructionsSteps[currentTab].map((step, index) => (
              <div className={style.terminal}>
                <div className={style.terminal__round}>{index + 1}</div>
                <div className={style.terminal__item}>
                  <p>{step.title}</p>
                  {step.commands.map((item, index) => (
                    <Command
                      key={index}
                      step={String.fromCharCode(97 + index)}
                      title={item.name}
                      command={item.command}
                      copyCommand={item.copyCommand}
                      instruction={item.instruction}
                    />
                  ))}
                </div>
              </div>
            ))}
            <button className={classNames(style.activateBtn, style.closeBtn)} onClick={() => onClose()}>
              View your LightNodes
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default Activate;
