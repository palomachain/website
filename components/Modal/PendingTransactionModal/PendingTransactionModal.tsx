import React from 'react';
import Modal from 'components/Modal';

import style from './PendingTransactionModal.module.scss';

interface PendingTransactionModalProps {
  show?: boolean;
  onClose?: () => void;
  title?: string;
  text?: string;
  txHash?: string;
  isProcessing?: boolean;
  blockExplorer: (txHash) => string;
}

const PendingTransactionModal = ({
  show,
  onClose,
  title,
  text,
  txHash,
  isProcessing,
  blockExplorer,
}: PendingTransactionModalProps) => {
  if (!show) return null;

  return (
    <Modal className={style.container} onClose={onClose}>
      {isProcessing ? (
        <div className="flex-column">
          <img className={style.loadingBar} src="/assets/icons/loading_bar.svg" />
        </div>
      ) : (
        <div className="flex-column">
          <img className={style.loadingImage} src="/assets/icons/loading.svg" />
        </div>
      )}
      <h3 className={style.title}>{title}</h3>
      <p className={style.text}>{text}</p>
      {txHash && (
        // <a className={style.tx} href={blockExplorer(txHash)} target="_blank">
        //   TX: {stringTool.shortenString(txHash, 30)}
        // </a>
        <p className={style.tx}>{txHash}</p>
      )}
    </Modal>
  );
};

export default PendingTransactionModal;
