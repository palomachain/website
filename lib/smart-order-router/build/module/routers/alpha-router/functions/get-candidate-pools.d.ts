import { Protocol } from '@uniswap/router-sdk';
import { ChainId, Currency, Token, TradeType } from '@uniswap/sdk-core';
import { ITokenListProvider, IV2SubgraphProvider, IV4PoolProvider, IV4SubgraphProvider, V2SubgraphPool, V4PoolAccessor, V4SubgraphPool } from '../../../providers';
import { ITokenProvider } from '../../../providers/token-provider';
import { IV2PoolProvider, V2PoolAccessor } from '../../../providers/v2/pool-provider';
import { IV3PoolProvider, V3PoolAccessor } from '../../../providers/v3/pool-provider';
import { IV3SubgraphProvider, V3SubgraphPool } from '../../../providers/v3/subgraph-provider';
import { AlphaRouterConfig } from '../alpha-router';
export declare type SubgraphPool = V2SubgraphPool | V3SubgraphPool | V4SubgraphPool;
export declare type CandidatePoolsBySelectionCriteria = {
    protocol: Protocol;
    selections: CandidatePoolsSelections;
};
export declare type SupportedCandidatePools = V2CandidatePools | V3CandidatePools | V4CandidatePools;
export declare type CandidatePoolsSelections = {
    topByBaseWithTokenIn: SubgraphPool[];
    topByBaseWithTokenOut: SubgraphPool[];
    topByDirectSwapPool: SubgraphPool[];
    topByEthQuoteTokenPool: SubgraphPool[];
    topByTVL: SubgraphPool[];
    topByTVLUsingTokenIn: SubgraphPool[];
    topByTVLUsingTokenOut: SubgraphPool[];
    topByTVLUsingTokenInSecondHops: SubgraphPool[];
    topByTVLUsingTokenOutSecondHops: SubgraphPool[];
};
export declare type MixedCrossLiquidityCandidatePoolsParams = {
    tokenIn: Token;
    tokenOut: Token;
    v2SubgraphProvider: IV2SubgraphProvider;
    v3SubgraphProvider: IV3SubgraphProvider;
    v2Candidates?: V2CandidatePools;
    v3Candidates?: V3CandidatePools;
    v4Candidates?: V4CandidatePools;
    blockNumber?: number | Promise<number>;
};
export declare type V4GetCandidatePoolsParams = {
    currencyIn: Currency;
    currencyOut: Currency;
    routeType: TradeType;
    routingConfig: AlphaRouterConfig;
    subgraphProvider: IV4SubgraphProvider;
    tokenProvider: ITokenProvider;
    poolProvider: IV4PoolProvider;
    blockedTokenListProvider?: ITokenListProvider;
    chainId: ChainId;
    v4PoolParams?: Array<[number, number, string]>;
};
export declare type V3GetCandidatePoolsParams = {
    tokenIn: Token;
    tokenOut: Token;
    routeType: TradeType;
    routingConfig: AlphaRouterConfig;
    subgraphProvider: IV3SubgraphProvider;
    tokenProvider: ITokenProvider;
    poolProvider: IV3PoolProvider;
    blockedTokenListProvider?: ITokenListProvider;
    chainId: ChainId;
};
export declare type V2GetCandidatePoolsParams = {
    tokenIn: Token;
    tokenOut: Token;
    routeType: TradeType;
    routingConfig: AlphaRouterConfig;
    subgraphProvider: IV2SubgraphProvider;
    tokenProvider: ITokenProvider;
    poolProvider: IV2PoolProvider;
    blockedTokenListProvider?: ITokenListProvider;
    chainId: ChainId;
};
export declare type MixedRouteGetCandidatePoolsParams = {
    v4CandidatePools: V4CandidatePools;
    v3CandidatePools: V3CandidatePools;
    v2CandidatePools: V2CandidatePools;
    crossLiquidityPools: CrossLiquidityCandidatePools;
    routingConfig: AlphaRouterConfig;
    tokenProvider: ITokenProvider;
    v2poolProvider: IV2PoolProvider;
    v3poolProvider: IV3PoolProvider;
    v4PoolProvider: IV4PoolProvider;
    blockedTokenListProvider?: ITokenListProvider;
    chainId: ChainId;
};
export declare type CrossLiquidityCandidatePools = {
    v2Pools: V2SubgraphPool[];
    v3Pools: V3SubgraphPool[];
};
/**
 * Function that finds any missing pools that were not selected by the heuristic but that would
 *   create a route with the topPool by TVL with either tokenIn or tokenOut across protocols.
 *
 *   e.g. In V2CandidatePools we found that wstETH/DOG is the most liquid pool,
 *        then in V3CandidatePools ETH/wstETH is *not* the most liquid pool, so it is not selected
 *        This process will look for that pool in order to complete the route.
 *
 */
export declare function getMixedCrossLiquidityCandidatePools({ tokenIn, tokenOut, blockNumber, v2SubgraphProvider, v3SubgraphProvider, v2Candidates, v3Candidates, }: MixedCrossLiquidityCandidatePoolsParams): Promise<CrossLiquidityCandidatePools>;
export declare type V4CandidatePools = {
    poolAccessor: V4PoolAccessor;
    candidatePools: CandidatePoolsBySelectionCriteria;
    subgraphPools: V4SubgraphPool[];
};
export declare function getV4CandidatePools({ currencyIn, currencyOut, routeType, routingConfig, subgraphProvider, tokenProvider, poolProvider, blockedTokenListProvider, chainId, v4PoolParams, }: V4GetCandidatePoolsParams): Promise<V4CandidatePools>;
export declare type V3CandidatePools = {
    poolAccessor: V3PoolAccessor;
    candidatePools: CandidatePoolsBySelectionCriteria;
    subgraphPools: V3SubgraphPool[];
};
export declare function getV3CandidatePools({ tokenIn, tokenOut, routeType, routingConfig, subgraphProvider, tokenProvider, poolProvider, blockedTokenListProvider, chainId, }: V3GetCandidatePoolsParams): Promise<V3CandidatePools>;
export declare type V2CandidatePools = {
    poolAccessor: V2PoolAccessor;
    candidatePools: CandidatePoolsBySelectionCriteria;
    subgraphPools: V2SubgraphPool[];
};
export declare function getV2CandidatePools({ tokenIn, tokenOut, routeType, routingConfig, subgraphProvider, tokenProvider, poolProvider, blockedTokenListProvider, chainId, }: V2GetCandidatePoolsParams): Promise<V2CandidatePools>;
export declare type MixedCandidatePools = {
    V2poolAccessor: V2PoolAccessor;
    V3poolAccessor: V3PoolAccessor;
    V4poolAccessor: V4PoolAccessor;
    candidatePools: CandidatePoolsBySelectionCriteria;
    subgraphPools: SubgraphPool[];
};
export declare function getMixedRouteCandidatePools({ v4CandidatePools, v3CandidatePools, v2CandidatePools, crossLiquidityPools, routingConfig, tokenProvider, v4PoolProvider, v3poolProvider, v2poolProvider, }: MixedRouteGetCandidatePoolsParams): Promise<MixedCandidatePools>;
