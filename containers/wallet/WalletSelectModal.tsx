import { ConnectWallet } from '@thirdweb-dev/react';
import cn from 'classnames';
import Button from 'components/Button';
import LoadingBtn from 'components/Button/Loading';
import Modal from 'components/Modal';
import { useWallet } from 'hooks/useWallet';
import React from 'react';

import style from 'containers/wallet/WalletSelectModal.module.scss';

interface WalletSelectModalProps {
  onClose: () => void;
  onChooseMetamask: () => void;
  // onChooseFrame: () => void;
  onChooseWalletConnect: () => void;
  web3ModalLoading: boolean;
  // frameLoading: boolean;
  showConnecting: boolean;
  setShowConnecting: any;
}

const WalletSelectModal = ({
  onClose,
  onChooseMetamask,
  // onChooseFrame,
  onChooseWalletConnect,
  web3ModalLoading,
  // frameLoading,
  showConnecting,
  setShowConnecting,
}: WalletSelectModalProps) => {
  const { wallet } = useWallet();

  const handleChooseMetamask = () => {
    setShowConnecting(true);
    onChooseMetamask();
  };

  const handleChooseWalletConnect = () => {
    onChooseWalletConnect();
  };

  if (wallet.account) {
    return;
  } else
    return (
      <Modal title={showConnecting ? 'Connecting...' : 'Connect Wallet'} onClose={onClose}>
        <section className={style.wizardView}>
          {!showConnecting && (
            <>
              <p className={style.describeBar}>To Complete Your Purchase, Please Connect Your EVM Wallet.</p>
              <p className={style.chooseWallet}>Choose a Wallet</p>

              <Button className={style.connectWalletBtn} type="grey" onClick={() => handleChooseMetamask()}>
                <img src="/assets/wallets/metamask.svg" alt="" />
              </Button>
              <Button
                className={cn(style.connectWalletBtn, style.walletConnect)}
                type={web3ModalLoading ? 'disabled' : 'grey'}
                onClick={() => handleChooseWalletConnect()}
                disabled={web3ModalLoading}
              >
                {web3ModalLoading ? (
                  <>
                    <img src="/assets/icons/loading_circle.svg" height="25px" style={{ marginTop: 5 }} />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <img src="/assets/wallets/walletconnect.svg" alt="" />
                  </>
                )}
              </Button>
              <div className={style.connectWalletBtn}>
                <img src="/assets/wallets/frame.svg" alt="" />
                <ConnectWallet className={style.frameWallet} theme="dark" btnTitle="frame" />
              </div>
              {/* <ConnectWallet btnTitle="Coinbase" /> */}
            </>
          )}
          {showConnecting && (
            <>
              <p className={style.text} style={{ textAlign: 'center' }}>
                Check your Wallet for a connection request.
              </p>
              <LoadingBtn />
              <section className={style.tryAgainWrapper} onClick={onChooseMetamask}>
                <img src="/assets/icons/try_again.svg" alt="" />
                <span className={style.balance}>Try again</span>
              </section>
            </>
          )}
        </section>
      </Modal>
    );
};

export default WalletSelectModal;
