import cn from 'classnames';
import Button from 'components/Button';
import { useWallet } from 'hooks/useWallet';
import React, { useMemo } from 'react';

import styles from './PurchaseButton.module.scss';

interface PurchaseButtonProps {
  chainId: string;
  botChain: string;
  full?: boolean;
  isValidTokenAmount: boolean;
  isAmountInputLoading?: boolean;
  isTxLoading: boolean;
  className?: string;
  onClickStart: () => void;
  buttonText: string;
}

const PurchaseButton = ({
  chainId,
  botChain,
  full,
  isValidTokenAmount,
  isAmountInputLoading,
  isTxLoading,
  className,
  onClickStart,
  buttonText = 'Start Bot',
}: PurchaseButtonProps) => {
  const { openConnectionModal, requestSwitchNetwork } = useWallet();

  const buttonStatus = useMemo(() => {
    if (!chainId) {
      return {
        disabled: false,
        text: 'Connect Wallet',
        style: '',
        onClick: () => {
          openConnectionModal();
        },
      };
    }

    if (isAmountInputLoading) {
      return {
        disabled: true,
        text: 'Fetching Prices',
        style: styles.disabled,
        isLoading: true,
        onClick: () => {},
      };
    }

    if (!isValidTokenAmount) {
      return {
        disabled: true,
        text: 'Input Deposit Token Amount',
        style: styles.disabled,
        onClick: () => {},
      };
    }

    if (isTxLoading) {
      return {
        disabled: true,
        text: 'Loading...',
        style: styles.disabled,
        isLoading: true,
        onClick: () => {},
      };
    }

    return {
      disabled: false,
      text: buttonText,
      style: styles.success,
      onClick: onClickStart,
    };
  }, [
    isValidTokenAmount,
    isAmountInputLoading,
    isTxLoading,
    chainId,
    botChain,
  ]);

  return (
    <Button
      type="blue"
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
            src="/assets/images/Loading_circle.svg"
            alt="loading"
            width={40}
            height={36}
            style={{ marginTop: '6px' }}
          />
        )}
        <span>{buttonStatus.text}</span>
      </>
    </Button>
  );
};

export default PurchaseButton;
