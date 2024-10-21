import { Protocol } from '@uniswap/router-sdk';
import { ChainId, Currency, Token } from '@uniswap/sdk-core';
import { SubgraphPool } from '../routers/alpha-router/functions/get-candidate-pools';
import { ICache } from './cache';
import { ProviderConfig } from './provider';
import { V3SubgraphPool } from './v3/subgraph-provider';
declare type ChainTokenList = {
    readonly [chainId in ChainId]: Currency[];
};
export declare const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList;
export interface IV3SubgraphProvider {
    getPools(tokenIn?: Token, tokenOut?: Token, providerConfig?: ProviderConfig): Promise<V3SubgraphPool[]>;
}
export interface ISubgraphProvider<TSubgraphPool extends SubgraphPool> {
    getPools(tokenIn?: Token, tokenOut?: Token, providerConfig?: ProviderConfig): Promise<TSubgraphPool[]>;
}
export declare abstract class CachingSubgraphProvider<TSubgraphPool extends SubgraphPool> implements ISubgraphProvider<TSubgraphPool> {
    private chainId;
    protected subgraphProvider: ISubgraphProvider<TSubgraphPool>;
    private cache;
    private protocol;
    private SUBGRAPH_KEY;
    /**
     * Creates an instance of CachingV3SubgraphProvider.
     * @param chainId The chain id to use.
     * @param subgraphProvider The provider to use to get the subgraph pools when not in the cache.
     * @param cache Cache instance to hold cached pools.
     * @param protocol Subgraph protocol version
     */
    constructor(chainId: ChainId, subgraphProvider: ISubgraphProvider<TSubgraphPool>, cache: ICache<TSubgraphPool[]>, protocol: Protocol);
    getPools(): Promise<TSubgraphPool[]>;
}
export {};
