import { ChainId, Currency, TradeType } from '@uniswap/sdk-core';
import { IOnChainQuoteProvider, ITokenListProvider, ITokenProvider, ITokenValidatorProvider, IV2PoolProvider, IV2SubgraphProvider, IV3PoolProvider, IV3SubgraphProvider, IV4PoolProvider, IV4SubgraphProvider } from '../../../providers';
import { CurrencyAmount } from '../../../util';
import { MixedRoute } from '../../router';
import { AlphaRouterConfig } from '../alpha-router';
import { MixedRouteWithValidQuote } from '../entities';
import { CandidatePoolsBySelectionCriteria, CrossLiquidityCandidatePools, V2CandidatePools, V3CandidatePools, V4CandidatePools } from '../functions/get-candidate-pools';
import { IGasModel } from '../gas-models';
import { BaseQuoter } from './base-quoter';
import { GetQuotesResult, GetRoutesResult } from './model';
export declare class MixedQuoter extends BaseQuoter<[
    V4CandidatePools,
    V3CandidatePools,
    V2CandidatePools,
    CrossLiquidityCandidatePools
], MixedRoute, Currency> {
    protected v4SubgraphProvider: IV4SubgraphProvider;
    protected v4PoolProvider: IV4PoolProvider;
    protected v3SubgraphProvider: IV3SubgraphProvider;
    protected v3PoolProvider: IV3PoolProvider;
    protected v2SubgraphProvider: IV2SubgraphProvider;
    protected v2PoolProvider: IV2PoolProvider;
    protected onChainQuoteProvider: IOnChainQuoteProvider;
    constructor(v4SubgraphProvider: IV4SubgraphProvider, v4PoolProvider: IV4PoolProvider, v3SubgraphProvider: IV3SubgraphProvider, v3PoolProvider: IV3PoolProvider, v2SubgraphProvider: IV2SubgraphProvider, v2PoolProvider: IV2PoolProvider, onChainQuoteProvider: IOnChainQuoteProvider, tokenProvider: ITokenProvider, chainId: ChainId, blockedTokenListProvider?: ITokenListProvider, tokenValidatorProvider?: ITokenValidatorProvider);
    protected getRoutes(currencyIn: Currency, currencyOut: Currency, v4v3v2candidatePools: [
        V4CandidatePools,
        V3CandidatePools,
        V2CandidatePools,
        CrossLiquidityCandidatePools
    ], tradeType: TradeType, routingConfig: AlphaRouterConfig): Promise<GetRoutesResult<MixedRoute>>;
    getQuotes(routes: MixedRoute[], amounts: CurrencyAmount[], percents: number[], quoteCurrency: Currency, tradeType: TradeType, routingConfig: AlphaRouterConfig, candidatePools?: CandidatePoolsBySelectionCriteria, gasModel?: IGasModel<MixedRouteWithValidQuote>): Promise<GetQuotesResult>;
}
