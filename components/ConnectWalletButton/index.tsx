import React, { useState, useEffect, useRef } from "react";
import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Button from "components/Button";
import { ModalContainer, ModalSelectWallet } from "components/Modal";

import { getWalletAddressEllipsis } from "utils/common";
import { getBalance, formatBalance } from "utils/wasm";
import { addresses } from "utils/constants";
import { useLCDClient, useOutsideAlerter } from "hooks";

import cn from "classnames";

const ConnectWalletButton = ({ className = "", children = null }) => {
  const {
    status,
    network,
    wallets,
    availableInstallTypes,
    connect,
    disconnect,
  } = useWallet();

  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [copied, setCopied] = useState(false);

  const [balance, setBalance] = useState({
    ust: "0.0",
    luna: "0.0",
    bLUNA: "0.0",
  });

  const fetchBalances = async () => {
    if (connectedWallet && lcd && network) {
      lcd.bank.balance(connectedWallet.walletAddress).then(async ([coins]) => {
        const bLunaBalance = await getBalance(
          addresses.contracts.bLuna.address,
          connectedWallet.walletAddress,
        );

        const ustBalance =
          "uusd" in coins._coins ? coins._coins.uusd.amount : 0;

        const lunaBalance =
          "uluna" in coins._coins ? coins._coins.uluna.amount : 0;

        setBalance({
          ust: formatBalance(ustBalance, 1),
          luna: formatBalance(lunaBalance, 1),
          bLUNA: formatBalance(bLunaBalance["balance"], 1),
        });
      });
    } else {
      setBalance({
        ust: "0.000",
        luna: "0.000",
        bLUNA: "0.000",
      });
    }
  };

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      fetchBalances();
    }, 3000);

    return () => clearInterval(interval);
  }, [connectedWallet, lcd, network]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  const [showChooseWalletModal, setShowChooseWalletModal] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setShowWalletInfo(false);
  });

  const handleConnectTerraStationWallet = async () => {
    if (availableInstallTypes.includes(ConnectType.EXTENSION)) {
      window.open(
        "https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp"
      );
    } else {
      setShowWalletInfo(false);
      setShowChooseWalletModal(false);
      connect(ConnectType.EXTENSION);
    }
  };

  const handleConnectWalletConnect = () => {
    setShowWalletInfo(false);
    setShowChooseWalletModal(false);
    connect(ConnectType.WALLETCONNECT);
  };

  return (
    <div
      className={cn("connnect-wallet-button-container", className)}
      ref={wrapperRef}
    >
      {status === WalletStatus.WALLET_NOT_CONNECTED &&
        (children ? (
          <div
            onClick={(e) => {
              setShowChooseWalletModal(true);
            }}
            style={{ cursor: "pointer", width: "100%" }}
          >
            {children}
          </div>
        ) : (
          <Button
            className="wallet-button not-connected"
            onClick={(e) => setShowChooseWalletModal(true)}
          >
            Connect Wallet
          </Button>
        ))}
      {status === WalletStatus.WALLET_CONNECTED && (
        <>
          <Button
            className="wallet-button connected"
            onClick={(e) => setShowWalletInfo(!showWalletInfo)}
          >
            <span>
              {getWalletAddressEllipsis(wallets[0].terraAddress, 10, 5)}
            </span>
            <img src="/assets/terra-station.png" />
          </Button>
          {showWalletInfo && (
            <div className="wallet-info">
              <div className="wallet-info-address">
                <div className="circle"></div>
                <span className="address">
                  {copied ? 'Copied' : getWalletAddressEllipsis(wallets[0].terraAddress, 5, 10)}
                </span>
                <CopyToClipboard
                  text={wallets[0].terraAddress}
                  onCopy={() => setCopied(true)}
                >
                  <img className="copy-icon" src="/assets/copy.png" />
                </CopyToClipboard>
              </div>

              <div className="wallet-info-divider">{` `}</div>

              <div className="wallet-balance">
                <div className="wallet-balance-token">
                  <span className="token-name">UST</span>
                  <span className="token-value">{balance.ust}</span>
                </div>
                <div className="wallet-balance-token">
                  <span className="token-name">LUNA</span>
                  <span className="token-value">{balance.luna}</span>
                </div>
                <div className="wallet-balance-token">
                  <span className="token-name">bLUNA</span>
                  <span className="token-value">{balance.bLUNA}</span>
                </div>
              </div>

              <Button
                className="wallet-disconnect-button"
                onClick={(e) => {
                  disconnect();
                  setShowWalletInfo(false);
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </>
      )}
      {showChooseWalletModal && (
        <ModalContainer onClose={() => setShowChooseWalletModal(false)}>
          <ModalSelectWallet
            onChooseTerraWallet={() => handleConnectTerraStationWallet()}
            onChooseWalletConnect={() => handleConnectWalletConnect()}
          />
        </ModalContainer>
      )}
    </div>
  );
};

export default ConnectWalletButton;
