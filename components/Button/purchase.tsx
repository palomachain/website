import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import React from 'react';

interface PurchaseButtonProps {
  className?: string;
  text?: string;
  disable?: boolean;
}

const Purchase = ({ className, text = 'Purchase your LightNode', disable = false }: PurchaseButtonProps) => {
  const router = useRouter();

  return (
    <button
      className={`${className} purchase-button`}
      onClick={() => router.push(StaticLink.PURCHASE)}
      disabled={disable}
    >
      {text}
    </button>
  );
};

export default Purchase;
