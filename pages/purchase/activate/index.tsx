import classNames from "classnames";
import Button from "components/Button";
import useNodeSale from "hooks/useNodeSale";
import useProvider from "hooks/useProvider";
import { useWallet } from "hooks/useWallet";
import { useEffect, useMemo, useState } from "react";
import {
  hexToStringWithBech,
  parseIntString,
  shortenString,
  stringToHexWithBech,
} from "utils/string";

import style from "./activate.module.scss";
import { ZERO_ADDRESS_PALOMA } from "contracts/addresses";
import { toast } from "react-toastify";

const mainChain = "42161"; // Arbitrum

const Activate = () => {
  const {
    connectMetaMask,
    connectWalletConnect,
    requestSwitchNetwork,
    disconnectWallet,
    wallet,
  } = useWallet();
  const provider = useProvider(wallet);
  const { getActivate, activateWallet } = useNodeSale({ provider, wallet });
  const [confirmedWallet, setConfirmedWallet] = useState(false);
  const [activated, setActivated] = useState(false);
  const [activatedPalomaAddress, setActivatedPalomaAddress] =
    useState<string>();

  const [loadingMetamask, setLoadingMetamask] = useState(false);
  const [loadingWalletconnect, setLoadingWalletconnect] = useState(false);

  const [palomaAddress, setPalomaAddress] = useState<string>();
  const [activating, setActivating] = useState(false);

  const handleChooseMetamask = async () => {
    if (!loadingMetamask) {
      setLoadingMetamask(true);
      await connectMetaMask(mainChain);
      await requestSwitchNetwork(mainChain);
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

  useEffect(() => {
    if (wallet && parseIntString(wallet.network) === mainChain) {
      const checkActivate = async () => {
        const activateAddress: string = await getActivate();
        const isActivated = activateAddress !== ZERO_ADDRESS_PALOMA;
        setActivated(isActivated);
        isActivated &&
          setActivatedPalomaAddress(hexToStringWithBech(activateAddress));

        setConfirmedWallet(true);
      };
      checkActivate();
    }
  }, [wallet, provider]);

  const isValidPalomaWallet = useMemo(() => {
    if (palomaAddress && palomaAddress.length === 45) {
      const hexValue = stringToHexWithBech(palomaAddress);
      if (hexValue !== ZERO_ADDRESS_PALOMA) return true;
      else {
        toast.error("Invalid paloma address.");
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
        setActivated(true);
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
    setConfirmedWallet(false);
  };

  return (
    <section className={style.container}>
      <div className={style.walletModal}>
        {!confirmedWallet ? (
          <>
            <h1 className={style.title}>Activate your Paloma LightNode</h1>
            <p>
              After downloading the Paloma LightNode client, activate your
              Paloma address to start minting GRAINs. To complete activation,
              connect your EVM wallet used to purchase your LightNodes.
            </p>
            <div className={style.walletBtns}>
              <p className={style.chooseWallet}>Choose a Wallet</p>
              <Button
                className={style.connectWalletBtn}
                type="grey"
                onClick={() => handleChooseMetamask()}
              >
                {loadingMetamask ? (
                  <img
                    src="/assets/icons/loading_circle.svg"
                    height="33px"
                    style={{ marginTop: 5, marginLeft: 6 }}
                  />
                ) : (
                  <img src="/assets/wallets/metamask.svg" alt="" />
                )}
              </Button>
              <Button
                className={style.connectWalletBtn}
                type="grey"
                onClick={() => handleChooseWalletConnect()}
              >
                {loadingWalletconnect ? (
                  <img
                    src="/assets/icons/loading_circle.svg"
                    height="33px"
                    style={{ marginTop: 5, marginLeft: 6 }}
                  />
                ) : (
                  <img src="/assets/wallets/walletconnect.svg" alt="" />
                )}
              </Button>
            </div>
          </>
        ) : activated ? (
          <>
            <img
              className={style.loadingImage}
              src="/assets/icons/success.svg"
              alt="success"
            />
            <h1>Your Paloma LightNode Was Successfully Activated</h1>
            <p>
              Your LightNode transaction has been successfully processed. Please
              register your nodes for software support before downloading the
              Paloma LightNode Client.
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
            <h3>Return to the Paloma LightNode Client and start minting.</h3>
          </>
        ) : (
          <>
            <div className={style.walletItem}>
              <div className={style.activeRound} />
              <p>{shortenString(wallet.account, 6, 6)}</p>
              <img
                src="/assets/icons/close-black.png"
                alt="close-wallet"
                width={10}
                onClick={() => onClickClose()}
                style={{ cursor: "pointer" }}
              />
            </div>
            <h1 className="mt-">Activate your Paloma LightNode</h1>
            <p>
              To finalize activation, simply copy and paste the Paloma Address
              created in the Paloma LightNode client here. This will link your
              EVM Wallet to your Paloma Address and your purchased Nodes.
            </p>
            <h3 className={style.palomaAddress}>Paloma Address</h3>
            <input
              value={palomaAddress}
              onChange={(e) => setPalomaAddress(e.target.value)}
              className={style.inputWallet}
              placeholder="paloma1234...1234"
            />
            <button
              className={classNames(
                style.activateBtn,
                !isValidPalomaWallet ? style.invalid : undefined
              )}
              onClick={onClickActivate}
            >
              {activating ? (
                <img
                  src="/assets/icons/loading_circle.svg"
                  height="33px"
                  style={{ marginTop: 5, marginLeft: 6 }}
                />
              ) : (
                "Activate"
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Activate;
