import Button from "components/Button";
import Modal from "components/Modal";
import { ITokenBalance } from "interfaces/swap";
import React from "react";
import TokenAmountView from "./TokenAmountView";

import style from "./StartBotModal.module.scss";

interface StartBotModalProps {
  show?: boolean;
  fromToken: ITokenBalance;
  minToToken: ITokenBalance;
  maxToToken: ITokenBalance;
  profitTaking: string;
  stopLoss: string;
  onClose: () => void;
  onConfirmStartBot: () => void;
}

const StartBotUniswapModal = ({
  show = true,
  onClose,
  onConfirmStartBot,
  fromToken,
  minToToken,
  maxToToken,
  profitTaking,
  stopLoss,
}: StartBotModalProps) => {
  if (!show) return null;

  return (
    <Modal
      title="Confirm Start a Bot"
      onClose={onClose}
      className={style.container}
    >
      <section className={style.container}>
        <TokenAmountView className={style.token} token={fromToken} />
        <div className={style.label}>
          <p>Profit taking</p>
          <p>{profitTaking}%</p>
        </div>
        <TokenAmountView className={style.token} token={minToToken} />
        <div className={style.label}>
          <p>Stop Loss</p>
          <p>{stopLoss}%</p>
        </div>
        <TokenAmountView className={style.token} token={maxToToken} />

        <Button
          type="pink"
          className={style.swapButton}
          full
          onClick={onConfirmStartBot}
        >
          <span>Confirm Start a Bot</span>
        </Button>
      </section>
    </Modal>
  );
};

export default StartBotUniswapModal;
