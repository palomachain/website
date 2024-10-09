import React from 'react';
import Link from 'next/link';
import { StaticLink } from 'configs/links';
import Modal from 'components/Modal';
import { useRouter } from 'next/router';

import style from './SuccessModal.module.scss';

interface SuccessModalProps {
  show?: boolean;
  isStepWizard?: boolean;
  steps?: string[];
  activeStep?: number;
  onClose?: () => void;
}

const SuccessModal = ({ show, isStepWizard = false, steps, activeStep, onClose }: SuccessModalProps) => {
  if (!show) return null;

  const router = useRouter();

  const onClick = () => {
    router.push(StaticLink.INSTRUCTIONS);
  };

  return (
    <Modal className={style.container} onClose={onClose}>
      <img className={style.loadingImage} src="/assets/icons/success.svg" />
      <h3 className={style.title}>Paloma LightNodes successfully purchased</h3>
      <p className={style.text}>
        Your LightNode transaction has been successfully processed. Please register your nodes for software support
        before downloading the Paloma LightNode Client.
      </p>
      <div onClick={onClick} className={style.gotoBtn}>
        Continue
      </div>
    </Modal>
  );
};

export default SuccessModal;
