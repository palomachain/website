import React, { ReactElement } from 'react';
import cn from 'classnames';
import style from 'components/ButtonSelector/ButtonSelector.module.scss';

interface ButtonProps {
  className?: string;
  children: ReactElement | String;
}

const ButtonSelector = ({ className, children }: ButtonProps) => (
  <section className={cn(style.selectList, className)}>{children}</section>
);

export default ButtonSelector;
