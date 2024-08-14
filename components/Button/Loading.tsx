import cn from 'classnames';
import React, { ReactElement } from 'react';

import style from './Button.module.scss';

interface LoadingButtonProps {
  className?: string;
  children?: ReactElement | String;
  disable?: boolean;
}

const LoadingBtn = ({ className, children, disable = false }: LoadingButtonProps) => (
  <section className={cn(disable ? style.loadingDisable : undefined, style.loading, className)}>{children}</section>
);

export default LoadingBtn;
