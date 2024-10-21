import { ChainId, Currency } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v4-sdk';
import { Options as RetryOptions } from 'async-retry';
import { IMulticallProvider, Result } from '../multicall-provider';
import { ProviderConfig } from '../provider';
import { ILiquidity, ISlot0, PoolProvider } from '../pool-provider';
declare type V4ISlot0 = ISlot0 & {
    poolId: string;
    protocolFee: number;
    lpFee: number;
};
declare type V4ILiquidity = ILiquidity;
export interface IV4PoolProvider {
    getPools(currencyPairs: V4PoolConstruct[], providerConfig?: ProviderConfig): Promise<V4PoolAccessor>;
    getPoolId(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string): {
        poolId: string;
        currency0: Currency;
        currency1: Currency;
    };
}
export declare type V4PoolAccessor = {
    getPool: (currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string) => Pool | undefined;
    getPoolById: (poolId: string) => Pool | undefined;
    getAllPools: () => Pool[];
};
export declare type V4PoolRetryOptions = RetryOptions;
export declare type V4PoolConstruct = [Currency, Currency, number, number, string];
export declare function sortsBefore(currencyA: Currency, currencyB: Currency): boolean;
export declare class V4PoolProvider extends PoolProvider<Currency, V4PoolConstruct, V4ISlot0, V4ILiquidity, V4PoolAccessor> implements IV4PoolProvider {
    private POOL_ID_CACHE;
    /**
     * Creates an instance of V4PoolProvider.
     * @param chainId The chain id to use.
     * @param multicall2Provider The multicall provider to use to get the pools.
     * @param retryOptions The retry options for each call to the multicall.
     */
    constructor(chainId: ChainId, multicall2Provider: IMulticallProvider, retryOptions?: V4PoolRetryOptions);
    getPools(currencyPairs: V4PoolConstruct[], providerConfig?: ProviderConfig): Promise<V4PoolAccessor>;
    getPoolId(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string): {
        poolId: string;
        currency0: Currency;
        currency1: Currency;
    };
    protected getLiquidityFunctionName(): string;
    protected getSlot0FunctionName(): string;
    protected getPoolsData<TReturn>(poolIds: string[], functionName: string, providerConfig?: ProviderConfig): Promise<Result<TReturn>[]>;
    protected getPoolIdentifier(pool: V4PoolConstruct): {
        poolIdentifier: string;
        currency0: Currency;
        currency1: Currency;
    };
    protected instantiatePool(pool: V4PoolConstruct, slot0: V4ISlot0, liquidity: V4ILiquidity): Pool;
    protected instantiatePoolAccessor(poolIdentifierToPool: {
        [p: string]: Pool;
    }): V4PoolAccessor;
}
export {};
