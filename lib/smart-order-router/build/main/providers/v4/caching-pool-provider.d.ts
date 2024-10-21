import { ChainId, Currency } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v4-sdk';
import { ICache } from '../cache';
import { ProviderConfig } from '../provider';
import { IV4PoolProvider, V4PoolAccessor } from './pool-provider';
export declare class CachingV4PoolProvider implements IV4PoolProvider {
    protected chainId: ChainId;
    protected poolProvider: IV4PoolProvider;
    private cache;
    private POOL_KEY;
    /**
     * Creates an instance of CachingV4PoolProvider.
     * @param chainId The chain id to use.
     * @param poolProvider The provider to use to get the pools when not in the cache.
     * @param cache Cache instance to hold cached pools.
     */
    constructor(chainId: ChainId, poolProvider: IV4PoolProvider, cache: ICache<Pool>);
    getPools(currencyPairs: [Currency, Currency, number, number, string][], providerConfig?: ProviderConfig): Promise<V4PoolAccessor>;
    getPoolId(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string): {
        poolId: string;
        currency0: Currency;
        currency1: Currency;
    };
}
