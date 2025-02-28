import classNames from 'classnames';
import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import React from 'react';

import style from 'components/Button/Purchase.module.scss';
import { toast } from 'react-toastify';
import { envParam } from 'configs/constants';

interface PurchaseButtonProps {
  type?: 'pink';
  className?: string;
  text?: string;
  disable?: boolean;
}

const Purchase = ({ type, className, text = 'Purchase your LightNode', disable = false }: PurchaseButtonProps) => {
  const router = useRouter();

  const handlePurchase = () => {
    if (envParam.isNodesaleDisable) {
      return toast.info('Coming Soon!', { toastId: 'redirect-homepage' });
    } else {
      return router.push(StaticLink.PURCHASE);
    }
  };

  return (
    <button
      className={classNames(className, 'purchase-button', {
        [style[type]]: true,
      })}
      onClick={() => handlePurchase()}
      disabled={disable}
    >
      {text}
    </button>
  );
};

export default Purchase;
