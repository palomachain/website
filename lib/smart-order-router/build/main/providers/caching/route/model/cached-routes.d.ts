import { Protocol } from '@uniswap/router-sdk';
import { ChainId, Currency, TradeType } from '@uniswap/sdk-core';
import { RouteWithValidQuote, SupportedRoutes } from '../../../../routers';
import { CachedRoute } from './cached-route';
interface CachedRoutesParams {
    routes: CachedRoute<SupportedRoutes>[];
    chainId: ChainId;
    currencyIn: Currency;
    currencyOut: Currency;
    protocolsCovered: Protocol[];
    blockNumber: number;
    tradeType: TradeType;
    originalAmount: string;
    blocksToLive?: number;
}
/**
 * Class defining the route to cache
 *
 * @export
 * @class CachedRoute
 */
export declare class CachedRoutes {
    readonly routes: CachedRoute<SupportedRoutes>[];
    readonly chainId: ChainId;
    readonly currencyIn: Currency;
    readonly currencyOut: Currency;
    readonly protocolsCovered: Protocol[];
    readonly blockNumber: number;
    readonly tradeType: TradeType;
    readonly originalAmount: string;
    blocksToLive: number;
    /**
     * @param routes
     * @param chainId
     * @param currencyIn
     * @param currencyOut
     * @param protocolsCovered
     * @param blockNumber
     * @param tradeType
     * @param originalAmount
     * @param blocksToLive
     */
    constructor({ routes, chainId, currencyIn, currencyOut, protocolsCovered, blockNumber, tradeType, originalAmount, blocksToLive, }: CachedRoutesParams);
    /**
     * Factory method that creates a `CachedRoutes` object from an array of RouteWithValidQuote.
     *
     * @public
     * @static
     * @param routes
     * @param chainId
     * @param currencyIn
     * @param currencyOut
     * @param protocolsCovered
     * @param blockNumber
     * @param tradeType
     * @param originalAmount
     */
    static fromRoutesWithValidQuotes(routes: RouteWithValidQuote[], chainId: ChainId, currencyIn: Currency, currencyOut: Currency, protocolsCovered: Protocol[], blockNumber: number, tradeType: TradeType, originalAmount: string): CachedRoutes | undefined;
    /**
     * Function to determine if, given a block number, the CachedRoute is expired or not.
     *
     * @param currentBlockNumber
     * @param optimistic
     */
    notExpired(currentBlockNumber: number, optimistic?: boolean): boolean;
}
export {};
