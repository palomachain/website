import React from 'react';
import cn from 'classnames';
import style from 'components/Modal/ModalHeader.module.scss';

interface ModalHeaderProps {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
}

const ModalHeader = ({ title, onBack, onClose }: ModalHeaderProps) => (
  <section className={style.container}>
    {onBack && (
      <div className={cn(style.actionBtn, style.back)} onClick={(e) => onBack()}>
        <img src="/assets/images/Back.svg" alt="" />
      </div>
    )}
    {onClose && (
      <div className={cn(style.actionBtn, style.close)} onClick={(e) => onClose()}>
        <img src="/assets/icons/close-black.png" alt="" width={13} height={13} />
      </div>
    )}
    <h2 className={style.title}>{title}</h2>
  </section>
);

export default ModalHeader;
