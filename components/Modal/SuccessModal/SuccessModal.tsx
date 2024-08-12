import React from 'react';
import Link from 'next/link';
import { StaticLink } from 'configs/links';
import { envParam } from 'configs/constants';
import Modal from 'components/Modal';
// import StepperWizard from 'components/Stepper';

import style from './SuccessModal.module.scss';

interface SuccessRampProps {
  show?: boolean;
  isStepWizard?: boolean;
  steps?: string[];
  activeStep?: number;
  onClose?: () => void;
}

const SuccessRamp = ({ show, isStepWizard = false, steps, activeStep, onClose }: SuccessRampProps) => {
  if (!show) return null;

  return (
    <Modal className={style.container} onClose={onClose}>
      <img className={style.loadingImage} src="/assets/images/Pigeon_success.svg" />
      <h3 className={style.title}>Bot Successfully Created!</h3>
      <p className={style.text}>
        {isStepWizard
          ? "Now that your EURe tokens are in your Gnosis Address, it's time to transfer them to your bank account using Monerium."
          : 'Activate Telegram alerts to know when your position is exited'}
      </p>
      <Link href={StaticLink.REGISTER}>
        <p className={style.mybots}>Continue to Registration</p>
      </Link>
    </Modal>
  );
};

export default SuccessRamp;
