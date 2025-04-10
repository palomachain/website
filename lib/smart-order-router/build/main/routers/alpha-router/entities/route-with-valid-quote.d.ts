import { BigNumber } from '@ethersproject/bignumber';
import { Protocol } from '@uniswap/router-sdk';
import { Currency, Token, TradeType } from '@uniswap/sdk-core';
import { IV4PoolProvider } from '../../../providers';
import { IV2PoolProvider } from '../../../providers/v2/pool-provider';
import { IV3PoolProvider } from '../../../providers/v3/pool-provider';
import { CurrencyAmount } from '../../../util/amounts';
import { MixedRoute, SupportedRoutes, V2Route, V3Route, V4Route } from '../../router';
import { IGasModel } from '../gas-models/gas-model';
/**
 * Represents a route, a quote for swapping some amount on it, and other
 * metadata used by the routing algorithm.
 *
 * @export
 * @interface IRouteWithValidQuote
 * @template Route
 */
export interface IRouteWithValidQuote<Route extends SupportedRoutes> {
    amount: CurrencyAmount;
    percent: number;
    quoteAdjustedForGas: CurrencyAmount;
    quote: CurrencyAmount;
    route: Route;
    gasEstimate: BigNumber;
    gasCostInToken: CurrencyAmount;
    gasCostInUSD: CurrencyAmount;
    gasCostInGasToken?: CurrencyAmount;
    tradeType: TradeType;
    poolIdentifiers: string[];
    tokenPath: Currency[];
}
export declare type IV2RouteWithValidQuote = {
    protocol: Protocol.V2;
} & IRouteWithValidQuote<V2Route>;
export declare type IV3RouteWithValidQuote = {
    protocol: Protocol.V3;
} & IRouteWithValidQuote<V3Route>;
export declare type IV4RouteWithValidQuote = {
    protocol: Protocol.V4;
} & IRouteWithValidQuote<V4Route>;
export declare type IMixedRouteWithValidQuote = {
    protocol: Protocol.MIXED;
} & IRouteWithValidQuote<MixedRoute>;
export declare type RouteWithValidQuote = V2RouteWithValidQuote | V3RouteWithValidQuote | V4RouteWithValidQuote | MixedRouteWithValidQuote;
export declare type V2RouteWithValidQuoteParams = {
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    percent: number;
    route: V2Route;
    gasModel: IGasModel<V2RouteWithValidQuote>;
    quoteToken: Token;
    tradeType: TradeType;
    v2PoolProvider: IV2PoolProvider;
};
/**
 * Represents a quote for swapping on a V2 only route. Contains all information
 * such as the route used, the amount specified by the user, the type of quote
 * (exact in or exact out), the quote itself, and gas estimates.
 *
 * @export
 * @class V2RouteWithValidQuote
 */
export declare class V2RouteWithValidQuote implements IV2RouteWithValidQuote {
    readonly protocol = Protocol.V2;
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    quote: CurrencyAmount;
    quoteAdjustedForGas: CurrencyAmount;
    percent: number;
    route: V2Route;
    quoteToken: Token;
    gasModel: IGasModel<V2RouteWithValidQuote>;
    gasEstimate: BigNumber;
    gasCostInToken: CurrencyAmount;
    gasCostInUSD: CurrencyAmount;
    gasCostInGasToken?: CurrencyAmount;
    tradeType: TradeType;
    poolIdentifiers: string[];
    tokenPath: Token[];
    toString(): string;
    constructor({ amount, rawQuote, percent, route, gasModel, quoteToken, tradeType, v2PoolProvider, }: V2RouteWithValidQuoteParams);
}
export declare type V3RouteWithValidQuoteParams = {
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    sqrtPriceX96AfterList: BigNumber[];
    initializedTicksCrossedList: number[];
    quoterGasEstimate: BigNumber;
    percent: number;
    route: V3Route;
    gasModel: IGasModel<V3RouteWithValidQuote>;
    quoteToken: Token;
    tradeType: TradeType;
    v3PoolProvider: IV3PoolProvider;
};
/**
 * Represents a quote for swapping on a V3 only route. Contains all information
 * such as the route used, the amount specified by the user, the type of quote
 * (exact in or exact out), the quote itself, and gas estimates.
 *
 * @export
 * @class V3RouteWithValidQuote
 */
export declare class V3RouteWithValidQuote implements IV3RouteWithValidQuote {
    readonly protocol = Protocol.V3;
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    quote: CurrencyAmount;
    quoteAdjustedForGas: CurrencyAmount;
    sqrtPriceX96AfterList: BigNumber[];
    initializedTicksCrossedList: number[];
    quoterGasEstimate: BigNumber;
    percent: number;
    route: V3Route;
    quoteToken: Token;
    gasModel: IGasModel<V3RouteWithValidQuote>;
    gasEstimate: BigNumber;
    gasCostInToken: CurrencyAmount;
    gasCostInUSD: CurrencyAmount;
    gasCostInGasToken?: CurrencyAmount;
    tradeType: TradeType;
    poolIdentifiers: string[];
    tokenPath: Token[];
    toString(): string;
    constructor({ amount, rawQuote, sqrtPriceX96AfterList, initializedTicksCrossedList, quoterGasEstimate, percent, route, gasModel, quoteToken, tradeType, v3PoolProvider, }: V3RouteWithValidQuoteParams);
}
export declare type V4RouteWithValidQuoteParams = {
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    sqrtPriceX96AfterList: BigNumber[];
    initializedTicksCrossedList: number[];
    quoterGasEstimate: BigNumber;
    percent: number;
    route: V4Route;
    quoteToken: Token;
    gasModel: IGasModel<V4RouteWithValidQuote>;
    tradeType: TradeType;
    v4PoolProvider: IV4PoolProvider;
};
export declare class V4RouteWithValidQuote implements IV4RouteWithValidQuote {
    readonly protocol = Protocol.V4;
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    quote: CurrencyAmount;
    quoteAdjustedForGas: CurrencyAmount;
    sqrtPriceX96AfterList: BigNumber[];
    initializedTicksCrossedList: number[];
    quoterGasEstimate: BigNumber;
    percent: number;
    route: V4Route;
    quoteToken: Token;
    gasModel: IGasModel<V4RouteWithValidQuote>;
    gasEstimate: BigNumber;
    gasCostInToken: CurrencyAmount;
    gasCostInUSD: CurrencyAmount;
    gasCostInGasToken?: CurrencyAmount;
    tradeType: TradeType;
    poolIdentifiers: string[];
    tokenPath: Currency[];
    toString(): string;
    constructor({ amount, rawQuote, sqrtPriceX96AfterList, initializedTicksCrossedList, quoterGasEstimate, percent, route, gasModel, quoteToken, tradeType, v4PoolProvider, }: V4RouteWithValidQuoteParams);
}
export declare type MixedRouteWithValidQuoteParams = {
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    sqrtPriceX96AfterList: BigNumber[];
    initializedTicksCrossedList: number[];
    quoterGasEstimate: BigNumber;
    percent: number;
    route: MixedRoute;
    mixedRouteGasModel: IGasModel<MixedRouteWithValidQuote>;
    quoteToken: Token;
    tradeType: TradeType;
    v4PoolProvider: IV4PoolProvider;
    v3PoolProvider: IV3PoolProvider;
    v2PoolProvider: IV2PoolProvider;
};
/**
 * Represents a quote for swapping on a Mixed Route. Contains all information
 * such as the route used, the amount specified by the user, the type of quote
 * (exact in or exact out), the quote itself, and gas estimates.
 *
 * @export
 * @class MixedRouteWithValidQuote
 */
export declare class MixedRouteWithValidQuote implements IMixedRouteWithValidQuote {
    readonly protocol = Protocol.MIXED;
    amount: CurrencyAmount;
    rawQuote: BigNumber;
    quote: CurrencyAmount;
    quoteAdjustedForGas: CurrencyAmount;
    sqrtPriceX96AfterList: BigNumber[];
    initializedTicksCrossedList: number[];
    quoterGasEstimate: BigNumber;
    percent: number;
    route: MixedRoute;
    quoteToken: Token;
    gasModel: IGasModel<MixedRouteWithValidQuote>;
    gasEstimate: BigNumber;
    gasCostInToken: CurrencyAmount;
    gasCostInUSD: CurrencyAmount;
    gasCostInGasToken?: CurrencyAmount;
    tradeType: TradeType;
    poolIdentifiers: string[];
    tokenPath: Currency[];
    toString(): string;
    constructor({ amount, rawQuote, sqrtPriceX96AfterList, initializedTicksCrossedList, quoterGasEstimate, percent, route, mixedRouteGasModel, quoteToken, tradeType, v4PoolProvider, v3PoolProvider, v2PoolProvider, }: MixedRouteWithValidQuoteParams);
}
