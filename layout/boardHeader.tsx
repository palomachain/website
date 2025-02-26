import Purchase from 'components/Button/purchase';
import WalletSelector from 'components/ButtonSelector/WalletSelector';
import { useOutsideAlerter } from 'hooks';
import { useWeb3Onboard } from 'hooks/useWeb3Onboard';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { shortenString } from 'utils/string';
import BoardMobileMenu from './menu/BoardMobileMenu';

const BoardHeader = () => {
  const ref = useRef(null);
  const { connectWallet, wallet, disconnectWallet } = useWeb3Onboard();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWalletProfileModal, setShowWalletProfileModal] = useState<boolean>(false);

  const handleShowWalletProfileModal = () => {
    setShowWalletProfileModal(!showWalletProfileModal);
  };

  useOutsideAlerter(ref, () => {
    setShowWalletProfileModal(false);
  });

  return (
    <header className="layout-container__header">
      <div className="layout-container__header__logo">
        <Link href="/">
          <img className="" src="/assets/logo/paloma-logotype.svg" alt="Paloma" width={112} />
        </Link>
      </div>
      <div className="layout-container__header__buttons layout-container__header__buttons-board" ref={ref}>
        <Purchase type="pink" text="+ Add a LightNode" />
        {wallet.account ? (
          <div>
            <button onClick={handleShowWalletProfileModal} className="layout-container__header__wallet">
              <>
                <span>{shortenString(wallet.account)}</span>
                <img src="/assets/icons/down.svg" alt="down" />
              </>
            </button>
            {showWalletProfileModal && (
              <WalletSelector wallet={wallet.account} network={wallet.network} disconnectWallet={disconnectWallet} />
            )}
          </div>
        ) : (
          <button className="layout-container__header__wallet" onClick={() => connectWallet()}>
            Connect EVM Wallet
          </button>
        )}
      </div>

      <div className="layout-container__header__hamburger">
        <img src="/assets/icons/hamburger.png" onClick={(e) => setMobileMenuOpen(true)} />
      </div>

      {mobileMenuOpen && (
        <BoardMobileMenu
          onClose={() => {
            setMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default BoardHeader;
