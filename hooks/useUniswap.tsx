import { Protocol } from '@uniswap/router-sdk';
import { Currency, CurrencyAmount, NativeCurrency, Percent, Token, TradeType } from '@uniswap/sdk-core';
import {
  AlphaRouter,
  AlphaRouterConfig,
  SwapOptionsSwapRouter02,
  SwapRoute,
  SwapType,
} from '@uniswap/smart-order-router';
import { Addresses, VETH_ADDRESS } from 'contracts/addresses';
import { IBalance, IToken } from 'interfaces/swap';
import balanceTool from 'utils/balance';
import { convertAddressSlice, parseByte } from 'utils/string';

const useUniswap = ({ provider, wallet }) => {
  /**
   * Not able to use Ether from `@uniswap/sdk-core`, it doesn't support Polygon, Bsc ....
   */
  class Ether extends NativeCurrency {
    protected constructor(chainId: number) {
      super(chainId, 18, 'ETH', 'Ether');
    }

    public get wrapped(): Token {
      const weth9 = new Token(this.chainId, Addresses[this.chainId].weth, 18, 'WETH', 'Wrapped Ether');
      return weth9;
    }

    private static _etherCache: { [chainId: number]: Ether } = {};

    public static onChain(chainId: number): Ether {
      return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Ether(chainId));
    }

    public equals(other: Currency): boolean {
      return other.isNative && other.chainId === this.chainId;
    }
  }

  const generateRoute = async (
    fromToken: IToken,
    fromTokenBalance: IBalance,
    toToken: IToken,
    slippage: number,
    deadline: number,
    chainId: string,
    routerConfig?: Partial<AlphaRouterConfig> | null,
  ) => {
    const router = new AlphaRouter({
      chainId: Number(chainId),
      provider,
    });

    const options: SwapOptionsSwapRouter02 = {
      recipient: wallet.address,
      slippageTolerance: new Percent(slippage * 100, 10_000),
      deadline: Math.floor(Date.now() / 1000 + deadline * 60),
      type: SwapType.SWAP_ROUTER_02,
    };

    const tokenIn = new Token(
      Number(chainId),
      fromToken.address === VETH_ADDRESS ? Addresses[chainId].weth : fromToken.address,
      fromToken.decimals,
      fromToken.symbol,
      fromToken.displayName,
    );
    const tokenOut = new Token(
      Number(chainId),
      toToken.address === VETH_ADDRESS ? Addresses[chainId].weth : toToken.address,
      toToken.decimals,
      toToken.symbol,
      toToken.displayName,
    );

    const currencyIn = Ether.onChain(Number(chainId));
    const currencyOut = Ether.onChain(Number(chainId));

    const route = routerConfig
      ? await router.route(
          CurrencyAmount.fromRawAmount(
            fromToken.address === VETH_ADDRESS ? currencyIn : tokenIn,
            fromTokenBalance.raw.toString(),
          ),
          toToken.address === VETH_ADDRESS ? currencyOut : tokenOut,
          TradeType.EXACT_INPUT,
          options,
          routerConfig,
        )
      : await router.route(
          CurrencyAmount.fromRawAmount(
            fromToken.address === VETH_ADDRESS ? currencyIn : tokenIn,
            fromTokenBalance.raw.toString(),
          ),
          toToken.address === VETH_ADDRESS ? currencyOut : tokenOut,
          TradeType.EXACT_INPUT,
          options,
        );

    return route;
  };

  /**
   *
   * @param poolAddress
   * @param tokenIn
   * @param tokenOut
   * @param tokenInAmount
   * @returns
   */
  const getSwapPath = async (
    fromToken: IToken,
    toToken: IToken,
    tokenInAmount: IBalance,
    slippage: number,
    deadline: number,
    chainId: string | number,
    useV2Only?: boolean,
    useV3Only?: boolean,
  ) => {
    if (!provider) return null;

    try {
      const swapRoute =
        useV2Only === true
          ? await generateRoute(fromToken, tokenInAmount, toToken, slippage, deadline, chainId.toString(), {
              protocols: [Protocol.V2],
            })
          : useV3Only === true
          ? await generateRoute(fromToken, tokenInAmount, toToken, slippage, deadline, chainId.toString(), {
              protocols: [Protocol.V3],
            })
          : await generateRoute(fromToken, tokenInAmount, toToken, slippage, deadline, chainId.toString());

      return swapRoute;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const getQuoteAmount = (swapRoute: SwapRoute | null) => {
    if (swapRoute === null) return null;

    const quote = swapRoute.quote;
    return {
      raw: balanceTool.convertToWei(quote.toExact(), quote.currency.decimals),
      format: quote.toFixed(4),
    };
  };

  const getSwapPathForV3 = (swapRoute: SwapRoute | null, token: IToken) => {
    try {
      let path = '';

      const swapRoutePath = swapRoute?.trade?.routes[0]?.path;
      const pools = swapRoute?.trade?.routes[0]?.pools;

      // For path
      for (let i = 0; i < swapRoutePath.length; i++) {
        path += convertAddressSlice(swapRoutePath[i]['address']);
        if (pools[i] && pools[i]['fee']) path += parseByte(pools[i]['fee']);
      }
      path = '0x' + path;

      return path;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { getSwapPath, getQuoteAmount, getSwapPathForV3 };
};

export default useUniswap;
