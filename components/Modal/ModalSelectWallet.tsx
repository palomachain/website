import React from "react";
import { isBrowser } from 'react-device-detect';

const ModalSelectWallet = ({ onChooseTerraWallet, onChooseWalletConnect }) => {
  // const [val, setVal] = useState("");

  return (
    <div className="modal-select-wallet">
      <span className="modal-view-title">Select a Wallet</span>
      <div className="modal-choose-wallet-list">
        {isBrowser && (
          <div className="wallet-choose-item" onClick={(e) => onChooseTerraWallet()}>
            <img src="/assets/terra-station.png" style={{ width: 50, height: 51 }} />
            <div className="wallet-choose-item-text">
              <span className="wallet-choose-item-name">Terra Station</span>
              <span className="wallet-choose-item-sub">Connect with Terra Station Chrome Extention </span>
            </div>
          </div>
        )}

        <div className="wallet-choose-item" onClick={(e) => onChooseWalletConnect()}>
          <img src="/assets/wallet-connect.svg" style={{ width: 59, height: 36 }} />
          <div className="wallet-choose-item-text">
            <span className="wallet-choose-item-name">Wallet Connect</span>
            <span className="wallet-choose-item-sub">Scan with WalletConnect to connect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSelectWallet;
