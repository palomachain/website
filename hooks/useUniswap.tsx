import { Protocol } from '@uniswap/router-sdk';
import { Currency, CurrencyAmount, NativeCurrency, Percent, Token, TradeType } from '@uniswap/sdk-core';
import {
  AlphaRouter,
  AlphaRouterConfig,
  SwapOptionsSwapRouter02,
  SwapRoute,
  SwapType,
} from '@uniswap/smart-order-router';
import BigNumber from 'bignumber.js';
import { ChainID, allChains } from 'configs/chains';
import uniswapV3FactoryAbi from 'contracts/abi/uniswapV3Factory.abi.json';
import pairAbi from 'contracts/abi/uniswapV3Pair.abi.json';
import { Addresses, VETH_ADDRESS } from 'contracts/addresses';
import { ethers } from 'ethers';
import { IBalance, IToken } from 'interfaces/swap';
import balanceTool from 'utils/balance';
import { convertAddressSlice, parseByte } from 'utils/string';

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

const useUniswap = ({ provider, wallet }) => {
  // const [registerClaim] = usePostRegisterClaimMutation();

  const generateRoute = async (
    fromToken: IToken,
    fromTokenBalance: IBalance,
    toToken: IToken,
    slippage: number,
    deadline: number,
    chainId: string,
    routerConfig?: Partial<AlphaRouterConfig> | null,
  ) => {
    const provider = new ethers.providers.JsonRpcProvider(
      chainId ? allChains[chainId].rpc : allChains[ChainID.ETHEREUM_MAIN].rpc,
    );

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
          TradeType.EXACT_OUTPUT,
          options,
          routerConfig,
        )
      : await router.route(
          CurrencyAmount.fromRawAmount(
            fromToken.address === VETH_ADDRESS ? currencyIn : tokenIn,
            fromTokenBalance.raw.toString(),
          ),
          toToken.address === VETH_ADDRESS ? currencyOut : tokenOut,
          TradeType.EXACT_OUTPUT,
          options,
        );

    return route;
  };

  /**
   * Get pool address from UniswapV3Factory
   *
   * @param token0 Pool token0 address
   * @param token1 Pool token0 address
   * @param fee Pool fee - 500: 0.05%
   * @returns
   */
  const getPool = async (token0, token1, fee) => {
    const contract = new ethers.Contract(Addresses[wallet.network].uniswapV3Factory, uniswapV3FactoryAbi, provider);

    const pool = await contract.getPool(token0, token1, fee);

    return pool;
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

  const getSwapPaths = async (
    selectedTokens: IToken[],
    toToken: IToken,
    slippage: number,
    deadline: number,
    chainId: string | number,
    useV2Only?: boolean,
  ) => {
    if (!provider) return null;

    try {
      const swapRoutes = await Promise.all(
        selectedTokens.map(async (token) => {
          if (token && Number(token?.amount) > 0) {
            const tokenInAmount: IBalance = {
              raw: balanceTool.convertToWei(token.amount, token.decimals),
              format: token.amount,
            };

            const swapRoute =
              useV2Only === true
                ? await generateRoute(token, tokenInAmount, toToken, slippage, deadline, chainId.toString(), {
                    protocols: [Protocol.V2],
                  })
                : await generateRoute(token, tokenInAmount, toToken, slippage, deadline, chainId.toString(), {
                    protocols: [Protocol.V3],
                  });

            return { swapRoute, token };
          }
        }),
      );

      return swapRoutes;
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

  interface ISwapPaths {
    swapRoute: SwapRoute;
    token: IToken;
  }

  const getQuoteAmounts = async (swapRoutes: ISwapPaths[], decimals: number, isV2Only: boolean = true) => {
    const res = {
      routes: [],
      amount: {
        raw: new BigNumber(0),
        format: '',
      },
    };

    try {
      if (swapRoutes.length === 0) return null;

      const quotes = await Promise.all(
        swapRoutes.map(async (route) => {
          if (route.swapRoute === null) return null;
          return route.swapRoute.quote;
        }),
      );
      const totalAmount = quotes.reduce((acc, quote) => acc + Number(quote.toFixed(6)), 0);

      const swapPaths = swapRoutes.map((uniswapPath) => {
        const swapRoutePath = uniswapPath?.swapRoute?.trade?.routes[0]?.path;
        let path: any;
        if (isV2Only) {
          path = new Array(swapRoutePath.length);
          for (let i = 0; i < swapRoutePath.length; i++) {
            path[i] = swapRoutePath[i]['address'];
          }
          if (uniswapPath.token.address === VETH_ADDRESS) path[0] = VETH_ADDRESS;
        } else {
          path = '';
          if (uniswapPath.token.address === VETH_ADDRESS) path += convertAddressSlice(VETH_ADDRESS);
          const pools = uniswapPath?.swapRoute?.trade?.routes[0]?.pools;
          for (let i = 0; i < swapRoutePath.length; i++) {
            path += convertAddressSlice(swapRoutePath[i]['address']);
            if (pools[i] && pools[i]['fee']) path += parseByte(pools[i]['fee']);
          }
          if (uniswapPath?.swapRoute?.trade?.routes[0]?.output.isNative) path += convertAddressSlice(VETH_ADDRESS);
          path = '0x' + path;
        }

        return {
          token: uniswapPath.token,
          route: path,
          output: uniswapPath.swapRoute.quote.toFixed(6),
        };
      });

      res.amount = {
        raw: balanceTool.convertToWei(totalAmount, decimals),
        format: totalAmount.toFixed(4),
      };
      res.routes = swapPaths;
    } catch (error) {
      console.log(error);
    } finally {
      return res;
    }
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

  /**
   *
   * @param poolAddress
   * @param fromToken
   * @param fromTokenAmount
   * @param toToken
   * @param toTokenAmont
   * @returns
   */
  const getPriceImpact = async (poolAddress: string, fromToken: IToken, fromTokenAmount: IBalance) => {
    if (!provider) return;

    let priceImpact = new BigNumber(0);

    try {
      const tokenIn = fromToken.address === VETH_ADDRESS ? Addresses[wallet.network].weth : fromToken.address;

      const pairContract = new ethers.Contract(poolAddress, pairAbi, provider);
      const reserves = await pairContract.getReserves();

      const pairToken0 = await pairContract.token0();

      const reserveA =
        pairToken0.toLowerCase() === tokenIn.toLowerCase()
          ? new BigNumber(reserves[0].toString())
          : new BigNumber(reserves[1].toString());
      const reserveB =
        pairToken0.toLowerCase() === tokenIn.toLowerCase()
          ? new BigNumber(reserves[1].toString())
          : new BigNumber(reserves[0].toString());

      const constantProduct = reserveA.multipliedBy(reserveB);
      const marketPrice = reserveA.dividedBy(reserveB);

      const newFromTokenAmount = fromTokenAmount.raw.plus(reserveA);
      const newToTokenAmount = constantProduct.dividedBy(newFromTokenAmount);
      const addedToTokenAmount = reserveB.minus(newToTokenAmount);
      const pricePaidPerToToken = fromTokenAmount.raw.dividedBy(addedToTokenAmount);

      priceImpact = new BigNumber(1).minus(marketPrice.dividedBy(pricePaidPerToToken));
    } catch (e) {
    } finally {
      return priceImpact;
    }
  };

  return {
    generateRoute,
    getPool,
    getSwapPath,
    getSwapPaths,
    getSwapPathForV3,
    getQuoteAmount,
    getQuoteAmounts,
    getPriceImpact,
  };
};

export default useUniswap;
