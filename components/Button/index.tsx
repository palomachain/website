import cn from 'classnames';
import style from 'components/Button/Button.module.scss';
import React, { PropsWithChildren } from 'react';

interface ButtonProps {
  type: 'pink' | 'blue' | 'yellow' | 'dark' | 'grey' | 'green' | 'default' | 'disabled' | 'outline' | 'text';
  className?: string;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
}

const Button = ({
  type,
  className,
  onClick = () => {},
  children,
  full,
  disabled = false,
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={cn(style.container, className, {
      [style[type]]: true,
      [style.full]: full,
    })}
    onClick={(e) => onClick()}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
