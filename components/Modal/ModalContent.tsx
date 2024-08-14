import React, { ReactElement } from 'react';

import style from 'components/Modal/ModalContent.module.scss';

interface ModalContentProps {
  children: ReactElement | ReactElement[];
}

const ModalContent = ({ children }: ModalContentProps) => <section className={style.container}>{children}</section>;

export default ModalContent;
