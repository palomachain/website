import Modal from 'components/Modal';
import Link from 'next/link';
import React from 'react';

import style from './SuccessModal.module.scss';

interface PredictionSuccessModalProps {
  show?: boolean;
  onClose?: () => void;
}

const PredictionSuccessModal = ({ show, onClose }: PredictionSuccessModalProps) => {
  if (!show) return null;

  return (
    <Modal className={style.container} onClose={onClose}>
      <img className={style.loadingImage} src="/assets/images/Pigeon_success.svg" />
      <h3 className={style.title}>Congratulations! Your price prediction has been successfully submitted.</h3>
      <p className={style.text}>
        The end of the game is near! Keep your eyes peeled and get ready to claim your victory!
      </p>
      {/* <Link href={StaticLink.MyBots}>
        <p className={style.mybots}>Go to My Bots</p>
      </Link> */}
    </Modal>
  );
};

export default PredictionSuccessModal;
