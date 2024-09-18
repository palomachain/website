import React from 'react';
import Modal from 'components/Modal';

import style from './SuccessModal.module.scss';
import { formatNumber } from 'utils/number';

interface SuccessModalProps {
  show?: boolean;
  amount?: number;
  onClose?: () => void;
}

const SuccessClaimModal = ({ show, amount, onClose }: SuccessModalProps) => {
  if (!show) return null;

  return (
    <Modal className={style.container} onClose={onClose}>
      <img className={style.loadingImage} src="/assets/icons/success.svg" />
      <h3 className={style.title}>Referral Bonus successfully claimed</h3>
      <p className={style.text}>{formatNumber(amount, 0, 2)} USDC</p>
      <div onClick={onClose} className={style.gotoBtn}>
        Return to your LightNodes
      </div>
    </Modal>
  );
};

export default SuccessClaimModal;
