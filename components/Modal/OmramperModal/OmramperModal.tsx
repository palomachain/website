import Modal from "components/Modal";
import { envParam } from "configs/constants";
import React from "react";

import style from "./OmramperModal.module.scss";

interface OmramperModalProps {
  show?: boolean;
  onBack: () => void;
}

const OmramperModal = ({ show, onBack }: OmramperModalProps) => {
  if (!show) return null;

  return (
    <Modal title="" onBack={onBack} className={style.container}>
      <iframe
        className={style.widget}
        src={`https://buy.onramper.com?themeName=dark&apiKey=${envParam.onramperApiKey}&defaultCrypto=ETH`}
        title="Onramper Widget"
        height="630px"
        width="100%"
        allow="accelerometer; autoplay; camera; gyroscope; payment"
      />
    </Modal>
  );
};

export default OmramperModal;
