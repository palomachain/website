import cn from 'classnames';
import { useWeb3Onboard } from 'hooks/useWeb3Onboard';
import React from 'react';
import { isFiat } from 'utils/string';

import style from 'components/ButtonSelector/Selector.module.scss';

interface ButtonProps {
  selectableList: object[];
  showSelectModal: boolean;
  handleSelect: (e: string | number) => void;
  selected: string;
  className?: string;
}

const Selector = ({ selectableList, showSelectModal, handleSelect, selected, className }: ButtonProps) => {
  const { wallet, connectWallet } = useWeb3Onboard();

  return (
    showSelectModal &&
    selectableList &&
    selectableList.length > 0 && (
      <div className={cn(style.selectList, className)}>
        <div>
          {selectableList.map((list: object, index: number) => (
            <div
              key={index}
              className={cn(style.selectOption, String(selected) !== list['name'] ? style.disabled : '')}
              onClick={() => handleSelect(list['id'])}
            >
              {list && list['icon'] && <img src={list['icon']} width={25} height={25} alt="" />}
              {(wallet && wallet.network) || isFiat(list['id']) ? (
                <span>{list['name']}</span>
              ) : (
                <button className={style.walletConnect} onClick={() => connectWallet()}>
                  {list['name']}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Selector;
