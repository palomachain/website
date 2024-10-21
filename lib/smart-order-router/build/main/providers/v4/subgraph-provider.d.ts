import { ChainId, Currency } from '@uniswap/sdk-core';
import { ProviderConfig } from '../provider';
import { SubgraphProvider } from '../subgraph-provider';
export interface V4SubgraphPool {
    id: string;
    feeTier: string;
    tickSpacing: string;
    hooks: string;
    liquidity: string;
    token0: {
        id: string;
    };
    token1: {
        id: string;
    };
    tvlETH: number;
    tvlUSD: number;
}
export declare type V4RawSubgraphPool = {
    id: string;
    feeTier: string;
    tickSpacing: string;
    hooks: string;
    liquidity: string;
    token0: {
        symbol: string;
        id: string;
    };
    token1: {
        symbol: string;
        id: string;
    };
    totalValueLockedUSD: string;
    totalValueLockedETH: string;
    totalValueLockedUSDUntracked: string;
};
/**
 * Provider for getting V4 pools from the Subgraph
 *
 * @export
 * @interface IV4SubgraphProvider
 */
export interface IV4SubgraphProvider {
    getPools(currencyIn?: Currency, currencyOut?: Currency, providerConfig?: ProviderConfig): Promise<V4SubgraphPool[]>;
}
export declare class V4SubgraphProvider extends SubgraphProvider<V4RawSubgraphPool, V4SubgraphPool> implements IV4SubgraphProvider {
    constructor(chainId: ChainId, retries?: number, timeout?: number, rollback?: boolean, trackedEthThreshold?: number, untrackedUsdThreshold?: number, subgraphUrlOverride?: string);
    protected subgraphQuery(blockNumber?: number): string;
    protected mapSubgraphPool(rawPool: V4RawSubgraphPool): V4SubgraphPool;
}
