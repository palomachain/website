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
          <img className={style.staticImage} src="/assets/images/Pigeon_static.svg" width={94} height={100} />
          <img className={style.loadingBar} src="/assets/images/Loading_bar.svg" />
        </div>
      ) : (
        <div className="flex-column">
          <img className={style.loadingImage} src="/assets/images/Pigeon_loading_2.svg" width={94} height={100} />
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
