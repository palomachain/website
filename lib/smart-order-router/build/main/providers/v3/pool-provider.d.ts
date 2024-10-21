import { BigNumber } from '@ethersproject/bignumber';
import { ChainId, Token } from '@uniswap/sdk-core';
import { FeeAmount, Pool } from '@uniswap/v3-sdk';
import { Options as RetryOptions } from 'async-retry';
import { IMulticallProvider, Result } from '../multicall-provider';
import { ILiquidity, ISlot0, PoolProvider } from '../pool-provider';
import { ProviderConfig } from '../provider';
declare type V3ISlot0 = ISlot0 & {
    sqrtPriceX96: BigNumber;
    tick: number;
};
declare type V3ILiquidity = ILiquidity;
/**
 * Provider or getting V3 pools.
 *
 * @export
 * @interface IV3PoolProvider
 */
export interface IV3PoolProvider {
    /**
     * Gets the specified pools.
     *
     * @param tokenPairs The token pairs and fee amount of the pools to get.
     * @param [providerConfig] The provider config.
     * @returns A pool accessor with methods for accessing the pools.
     */
    getPools(tokenPairs: [Token, Token, FeeAmount][], providerConfig?: ProviderConfig): Promise<V3PoolAccessor>;
    /**
     * Gets the pool address for the specified token pair and fee tier.
     *
     * @param tokenA Token A in the pool.
     * @param tokenB Token B in the pool.
     * @param feeAmount The fee amount of the pool.
     * @returns The pool address and the two tokens.
     */
    getPoolAddress(tokenA: Token, tokenB: Token, feeAmount: FeeAmount): {
        poolAddress: string;
        token0: Token;
        token1: Token;
    };
}
export declare type V3PoolAccessor = {
    getPool: (tokenA: Token, tokenB: Token, feeAmount: FeeAmount) => Pool | undefined;
    getPoolByAddress: (address: string) => Pool | undefined;
    getAllPools: () => Pool[];
};
export declare type V3PoolRetryOptions = RetryOptions;
export declare type V3PoolConstruct = [Token, Token, FeeAmount];
export declare class V3PoolProvider extends PoolProvider<Token, V3PoolConstruct, V3ISlot0, V3ILiquidity, V3PoolAccessor> implements IV3PoolProvider {
    private POOL_ADDRESS_CACHE;
    /**
     * Creates an instance of V4PoolProvider.
     * @param chainId The chain id to use.
     * @param multicall2Provider The multicall provider to use to get the pools.
     * @param retryOptions The retry options for each call to the multicall.
     */
    constructor(chainId: ChainId, multicall2Provider: IMulticallProvider, retryOptions?: V3PoolRetryOptions);
    getPools(tokenPairs: V3PoolConstruct[], providerConfig?: ProviderConfig): Promise<V3PoolAccessor>;
    getPoolAddress(tokenA: Token, tokenB: Token, feeAmount: FeeAmount): {
        poolAddress: string;
        token0: Token;
        token1: Token;
    };
    protected getLiquidityFunctionName(): string;
    protected getSlot0FunctionName(): string;
    protected getPoolsData<TReturn>(poolAddresses: string[], functionName: string, providerConfig?: ProviderConfig): Promise<Result<TReturn>[]>;
    protected getPoolIdentifier(pool: V3PoolConstruct): {
        poolIdentifier: string;
        currency0: Token;
        currency1: Token;
    };
    protected instantiatePool(pool: V3PoolConstruct, slot0: V3ISlot0, liquidity: V3ILiquidity): Pool;
    protected instantiatePoolAccessor(poolIdentifierToPool: {
        [p: string]: Pool;
    }): V3PoolAccessor;
}
export {};
