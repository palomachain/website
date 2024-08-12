import React from 'react';
import cn from 'classnames';
import { IToken } from 'interfaces/swap';
import balanceTool from 'utils/balance';

import style from 'containers/common/TokenView/TokenView.module.scss';

interface TokenViewProps {
  token: IToken;
  onClick?: (value: IToken) => void;
  isToken?: boolean;
  selected?: boolean;
  className?: string;
}

const TokenView = ({ token, onClick, isToken = false, selected = false, className }: TokenViewProps) => (
  <section className={selected ? style.selectedToken : undefined} onClick={(e) => onClick(token)}>
    <div className={cn(style.container, className)}>
      <div className={style.tokenWrapper}>
        {isToken && <input type="checkbox" checked={selected} />}
        <img
          src={token.icon ? token.icon : '/assets/images/Empty_ellipse.svg'}
          width={25}
          height={25}
          alt={token.symbol}
        />
        {selected ? (
          <span className={style.selectedTokenText}>{token.symbol}</span>
        ) : (
          <div className={style.name}>
            <span className={style.display}>{token.displayName}</span>
            <span className={style.symbol}>{token.symbol}</span>
          </div>
        )}
      </div>
      {selected ? (
        <span className={style.selectedTokenText}>0.0</span>
      ) : (
        <div className={style.balance}>
          <span className={style.display}>
            {token.balance ? balanceTool.convertFromWei(token.balance, 4, token.decimals) : ''}
          </span>
          <span className={style.symbol}>{token.usdAmount ? 'US' + token.usdAmount : ''}</span>
        </div>
      )}
    </div>
    {selected && (
      <div className="flex-row justify-between">
        <span className={style.selectedTokenNumber}>
          Balance: {token.balance ? balanceTool.convertFromWei(token.balance, 4, token.decimals) : ''} {token.symbol}
        </span>
        <span className={style.selectedTokenNumber}>≈${token.usdAmount ? token.usdAmount : ''}</span>
      </div>
    )}
  </section>
);

export default TokenView;
