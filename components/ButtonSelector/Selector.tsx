import { ConnectWallet } from '@thirdweb-dev/react';
import cn from 'classnames';
import { useWallet } from 'hooks/useWallet';
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
  const { wallet } = useWallet();

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
                <ConnectWallet
                  className={style.thirdwebConnect}
                  btnTitle={list['name']}
                  showThirdwebBranding={false}
                  modalTitle="Connect"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Selector;
