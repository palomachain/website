import { ChainId, Token } from '@uniswap/sdk-core';
import { ProviderConfig } from '../provider';
import { SubgraphProvider } from '../subgraph-provider';
export interface V3SubgraphPool {
    id: string;
    feeTier: string;
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
export declare type V3RawSubgraphPool = {
    id: string;
    feeTier: string;
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
 * Provider for getting V3 pools from the Subgraph
 *
 * @export
 * @interface IV3SubgraphProvider
 */
export interface IV3SubgraphProvider {
    getPools(tokenIn?: Token, tokenOut?: Token, providerConfig?: ProviderConfig): Promise<V3SubgraphPool[]>;
}
export declare class V3SubgraphProvider extends SubgraphProvider<V3RawSubgraphPool, V3SubgraphPool> implements IV3SubgraphProvider {
    constructor(chainId: ChainId, retries?: number, timeout?: number, rollback?: boolean, trackedEthThreshold?: number, untrackedUsdThreshold?: number, subgraphUrlOverride?: string);
    protected subgraphQuery(blockNumber?: number): string;
    protected mapSubgraphPool(rawPool: V3RawSubgraphPool): V3SubgraphPool;
}
