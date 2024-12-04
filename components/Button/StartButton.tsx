import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

import style from 'components/Button/StartButton.module.scss';
import { toast } from 'react-toastify';

interface StartButtonProps {
  type?: 'black' | 'white';
  className?: string;
  text: string;
  link: string;
  isExternal?: boolean;
  disable?: boolean;
  onClick?: () => void;
}

const StartButton = ({
  type = 'white',
  className,
  text,
  link,
  isExternal = false,
  disable = false,
  onClick,
}: StartButtonProps) => {
  const router = useRouter();

  const handleAction = (link: string) => {
    if (onClick) {
      return onClick();
    }
    if (link.length > 0) {
      return router.push(link);
    } else {
      toast.info('Coming Soon...');
    }
  };

  return isExternal ? (
    <a
      href={link}
      target="_blank"
      className={classNames(className, style.startBtn, {
        [style[type]]: true,
      })}
    >
      {text}
      <img src={`/assets/arrows/arrow-right-${type}.svg`} alt="arrow-icon" />
    </a>
  ) : (
    <button
      className={classNames(className, style.startBtn, {
        [style[type]]: true,
      })}
      onClick={() => handleAction(link)}
      disabled={disable}
    >
      {text}
      <img src={`/assets/arrows/arrow-right-${type}.svg`} alt="arrow-icon" />
    </button>
  );
};

export default StartButton;
