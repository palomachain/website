import React, { ReactElement } from 'react';
import classNames from 'classnames';

import style from 'components/Modal/ModalContent.module.scss';

interface ModalContentProps {
  className?: string;
  children: ReactElement | ReactElement[];
}

const ModalContent = ({ className, children }: ModalContentProps) => (
  <section className={classNames(style.container, className)}>{children}</section>
);

export default ModalContent;
