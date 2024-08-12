import React, { useMemo } from "react";
import classNames from "classnames";
import balanceTool from "utils/balance";
import { ITokenBalance } from "interfaces/swap";

import style from "./TokenAmountView.module.scss";

interface TokenAmountViewProps {
  title?: string;
  className?: string;
  token: ITokenBalance;
}

const TokenAmountView = ({ token, title, className }: TokenAmountViewProps) => {
  const usdAmount = useMemo(() => {
    if (!token) return 0;

    const usd = balanceTool.convertToDollar(
      token.balance.format,
      token.exchangeRate
    );
    return usd;
  }, [token]);

  return (
    <section className={classNames(style.container, className)}>
      {title && <h3 className={style.title}>{title}</h3>}
      <section className={style.tokenAmountWrapper}>
        <section className={style.tokenWrapper}>
          <img src={token.token.icon} alt={token.token.displayName} />
          <span>{token.token.symbol}</span>
        </section>
        <section className={style.amountWrapper}>
          <div className={style.amount}>{token.balance.format}</div>
          <div className={style.usd}>{`$${usdAmount}`}</div>
        </section>
      </section>
    </section>
  );
};

export default TokenAmountView;
