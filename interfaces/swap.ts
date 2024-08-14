import BigNumber from 'bignumber.js';

interface IChain {
  icon?: string;
  chainName: string;
  chainId: string | number;
  rpc?: string;
}

interface IToken {
  id?: string; // coingecko
  chainId?: string | number;
  icon?: string;
  displayName: string;
  symbol: string | null;
  address: string | null;
  decimals?: number;
  balance?: string;
  usdAmount?: string;
  amount?: '0' | string;
}

interface IBalance {
  raw: BigNumber;
  format: string;
}

interface ITokenBalance {
  chain?: IChain;
  token: IToken;
  balance?: IBalance;
  exchangeRate?: BigNumber;
}

interface IUniswapRouteAndToken {
  output?: string;
  route: string[];
  token: IToken;
}

interface ISelectToken {
  token?: ITokenBalance;
  amount?: IBalance;
  swapPath?: {
    routes: any[];
    amount: {
      raw: BigNumber;
      format: string;
    };
  };
}

interface ITwapCount {
  exchangeAmount: number;
  estimateGas: number;
  serviceGasFee: number;
  outputCoin: string;
  maxTry?: number;
}

export type { IChain, IToken, IBalance, ITokenBalance, ISelectToken, IUniswapRouteAndToken, ITwapCount };
