import BigNumber from 'bignumber.js';
import cn from 'classnames';
import Button from 'components/Button';
import { NO_CHAIN_SELECTED } from 'configs/chains';
import { useWallet } from 'hooks/useWallet';
import { IPriceTiers } from 'interfaces/nodeSale';
import { IBalance, IToken } from 'interfaces/swap';
import React, { useMemo } from 'react';
import { purchaseSupportedNetworks } from 'configs/constants';

import styles from './PurchaseButton.module.scss';

interface PurchaseButtonProps {
  chainId: string;
  full?: boolean;
  isValidTokenAmount: boolean;
  isTxLoading: boolean;
  isFetchingPriceLoading: boolean;
  isAllAgree?: boolean;
  support?: number;
  promoCode?: string;
  step: number;
  fromToken?: IToken;
  fromTokenExchangeRate?: BigNumber;
  totalSupportPrice?: number;
  expectedAmount?: IBalance;
  quoteAmount?: IBalance;
  swapPath?: string;
  priceTiers?: IPriceTiers[];
  className?: string;
  onClickStart: () => void;
  buttonText: string;
}

const PurchaseButton = ({
  chainId,
  full,
  isValidTokenAmount,
  isTxLoading,
  isFetchingPriceLoading,
  isAllAgree,
  support,
  promoCode,
  step,
  fromToken,
  fromTokenExchangeRate,
  totalSupportPrice,
  expectedAmount,
  quoteAmount,
  swapPath,
  priceTiers,
  className,
  onClickStart,
  buttonText = 'Start Bot',
}: PurchaseButtonProps) => {
  const { openConnectionModal } = useWallet();

  const buttonStatus = useMemo(() => {
    if (!chainId) {
      return {
        disabled: false,
        text: 'Connect Wallet',
        style: '',
        onClick: () => {
          openConnectionModal();
          onClickStart();
        },
      };
    }

    if (!isAllAgree) {
      return {
        disabled: true,
        text: buttonText,
        style: styles.disabled,
        onClick: () => {},
      };
    }

    if (!isValidTokenAmount) {
      return {
        disabled: true,
        text: 'Input Node Quantity',
        style: styles.disabled,
        onClick: () => {},
      };
    }

    if (step !== 1) {
      if (chainId.toString() === NO_CHAIN_SELECTED || !(chainId in purchaseSupportedNetworks)) {
        return {
          disabled: true,
          text: `Select Correct Chain`,
          style: styles.disabled,
          onClick: () => {},
        };
      }

      if (!fromToken || fromToken.address === '') {
        return {
          disabled: true,
          text: 'Select Token',
          style: styles.disabled,
          onClick: () => {},
        };
      }

      if (expectedAmount.raw.comparedTo(0) > 0 && expectedAmount.raw.comparedTo(BigNumber(fromToken.balance)) > 0) {
        return {
          disabled: true,
          text: 'Insufficient Token Amount',
          style: styles.disabled,
          onClick: () => {},
        };
      }

      if (isFetchingPriceLoading || isTxLoading) {
        return {
          disabled: true,
          text: 'Loading...',
          style: styles.disabled,
          isLoading: true,
          onClick: () => {},
        };
      }
    }

    return {
      disabled: false,
      text: buttonText,
      style: styles.success,
      onClick: onClickStart,
    };
  }, [
    isValidTokenAmount,
    isTxLoading,
    isAllAgree,
    support,
    promoCode,
    step,
    chainId,
    fromTokenExchangeRate,
    totalSupportPrice,
    expectedAmount,
    quoteAmount,
    isFetchingPriceLoading,
    swapPath,
    priceTiers,
  ]);

  return (
    <Button
      type="dark"
      className={cn(
        styles.container,
        className,
        buttonStatus.style,
        !buttonStatus.disabled ? styles.cursor : undefined,
      )}
      full={full}
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

export default PurchaseButton;
