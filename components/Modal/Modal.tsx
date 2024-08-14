import React, { ReactElement } from 'react';
import ModalContainer from 'components/Modal/ModalContainer';
import ModalHeader from 'components/Modal/ModalHeader';
import ModalContent from 'components/Modal/ModalContent';

interface ModalProps {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
  showHeader?: boolean;
  children: ReactElement | ReactElement[];
}

const Modal = ({ title, onBack, onClose, className, children, showHeader = true }: ModalProps) => (
  <ModalContainer className={className}>
    {showHeader && <ModalHeader title={title} onBack={onBack} onClose={onClose} />}
    <ModalContent>{children}</ModalContent>
  </ModalContainer>
);

export default Modal;
