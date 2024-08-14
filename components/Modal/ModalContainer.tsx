import React, { ReactElement } from "react";
import cn from "classnames";

import style from "components/Modal/ModalContainer.module.scss";

interface ModalContainerProps {
  className?: string;
  children: ReactElement | ReactElement[];
}

const ModalContainer = ({ className, children }: ModalContainerProps) => (
  <section className={style.container}>
    <section className={style.mask} />
    <section className={style.content}>
      <section className={cn(style.dialog, className)}>{children}</section>
    </section>
  </section>
);

export default ModalContainer;
