import BigNumber from 'bignumber.js';
import cn from 'classnames';
import Button from 'components/Button';
import { IPriceTier } from 'interfaces/nodeSale';
import { IToken } from 'interfaces/swap';
import React, { useMemo } from 'react';

import styles from './PurchaseButton.module.scss';

interface PurchaseWithFiatButtonProps {
  isLoggedIn: boolean;
  support?: number;
  promoCode?: string;
  step: number;
  fromToken?: IToken;
  fromTokenExchangeRate?: BigNumber;
  generatingWallet: boolean;
  fetchingBuyNow: boolean;
  fiatWallet?: string;
  selectedChain?: string;
  priceTiers?: IPriceTier[] | null | undefined;
  className?: string;
  onClickStart: () => void;
  buttonText: string;
}

const PurchaseWithFiatButton = ({
  isLoggedIn,
  support,
  promoCode,
  step,
  fromToken,
  fromTokenExchangeRate,
  generatingWallet,
  fetchingBuyNow,
  fiatWallet,
  selectedChain,
  priceTiers,
  className,
  onClickStart,
  buttonText = 'Buy Now',
}: PurchaseWithFiatButtonProps) => {
  const buttonStatus = useMemo(() => {
    if (generatingWallet) {
      return {
        disabled: true,
        text: 'Generating a new wallet...',
        style: styles.disabled,
        isLoading: true,
        onClick: () => {},
      };
    }

    if (fetchingBuyNow) {
      return {
        disabled: true,
        text: 'Processing Transaction...',
        style: styles.disabled,
        isLoading: true,
        onClick: () => {},
      };
    }

    // if (!isLoggedIn) {
    //   return {
    //     disabled: false,
    //     text: 'Log in',
    //     style: styles.success,
    //     onClick: onClickStart,
    //   };
    // }

    return {
      disabled: false,
      text: buttonText,
      style: styles.success,
      onClick: onClickStart,
    };
  }, [
    isLoggedIn,
    support,
    promoCode,
    step,
    fromToken,
    fromTokenExchangeRate,
    generatingWallet,
    fetchingBuyNow,
    fiatWallet,
    selectedChain,
    priceTiers,
  ]);

  return (
    <Button
      type="green"
      className={cn(
        styles.container,
        className,
        buttonStatus.style,
        !buttonStatus.disabled ? styles.cursor : undefined,
      )}
      full
      onClick={() => buttonStatus.onClick()}
      disabled={buttonStatus.disabled}
    >
      <>
        {buttonStatus.isLoading && (
          <img
            src="/assets/icons/loading_circle.svg"
            alt="loading"
            width={40}
            height={36}
            style={{ marginTop: '6px' }}
          />
        )}
        {buttonStatus.text}
      </>
    </Button>
  );
};

export default PurchaseWithFiatButton;
