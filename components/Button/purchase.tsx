import classNames from 'classnames';
import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import React from 'react';

import style from 'components/Button/Purchase.module.scss';

interface PurchaseButtonProps {
  type?: 'pink';
  className?: string;
  text?: string;
  disable?: boolean;
}

const Purchase = ({ type, className, text = 'Purchase your LightNode', disable = false }: PurchaseButtonProps) => {
  const router = useRouter();

  return (
    <button
      className={classNames(className, 'purchase-button', {
        [style[type]]: true,
      })}
      onClick={() => router.push(StaticLink.PURCHASE)}
      disabled={disable}
    >
      {text}
    </button>
  );
};

export default Purchase;
