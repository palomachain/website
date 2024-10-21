import { BigNumber } from '@ethersproject/bignumber';
import { ChainId, TradeType } from '@uniswap/sdk-core';
import { IPortionProvider } from '../../../providers/portion-provider';
import { ProviderConfig } from '../../../providers/provider';
import { CurrencyAmount } from '../../../util/amounts';
import { SwapOptions } from '../../router';
import { AlphaRouterConfig } from '../alpha-router';
import { IGasModel } from '../gas-models';
import { RouteWithValidQuote, V2RouteWithValidQuote, V3RouteWithValidQuote, V4RouteWithValidQuote } from './../entities/route-with-valid-quote';
export declare type BestSwapRoute = {
    quote: CurrencyAmount;
    quoteGasAdjusted: CurrencyAmount;
    estimatedGasUsed: BigNumber;
    estimatedGasUsedUSD: CurrencyAmount;
    estimatedGasUsedQuoteToken: CurrencyAmount;
    estimatedGasUsedGasToken?: CurrencyAmount;
    routes: RouteWithValidQuote[];
};
export declare function getBestSwapRoute(amount: CurrencyAmount, percents: number[], routesWithValidQuotes: RouteWithValidQuote[], routeType: TradeType, chainId: ChainId, routingConfig: AlphaRouterConfig, portionProvider: IPortionProvider, v2GasModel?: IGasModel<V2RouteWithValidQuote>, v3GasModel?: IGasModel<V3RouteWithValidQuote>, v4GasModel?: IGasModel<V4RouteWithValidQuote>, swapConfig?: SwapOptions, providerConfig?: ProviderConfig): Promise<BestSwapRoute | null>;
export declare function getBestSwapRouteBy(routeType: TradeType, percentToQuotes: {
    [percent: number]: RouteWithValidQuote[];
}, percents: number[], chainId: ChainId, by: (routeQuote: RouteWithValidQuote) => CurrencyAmount, routingConfig: AlphaRouterConfig, portionProvider: IPortionProvider, v2GasModel?: IGasModel<V2RouteWithValidQuote>, v3GasModel?: IGasModel<V3RouteWithValidQuote>, v4GasModel?: IGasModel<V4RouteWithValidQuote>, swapConfig?: SwapOptions, providerConfig?: ProviderConfig): Promise<BestSwapRoute | undefined>;
