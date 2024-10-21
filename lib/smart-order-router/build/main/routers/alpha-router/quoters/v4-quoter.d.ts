import { ChainId, Currency, TradeType } from '@uniswap/sdk-core';
import { IOnChainQuoteProvider, ITokenListProvider, ITokenProvider, ITokenValidatorProvider, IV4PoolProvider, IV4SubgraphProvider } from '../../../providers';
import { CurrencyAmount } from '../../../util';
import { V4Route } from '../../router';
import { AlphaRouterConfig } from '../alpha-router';
import { RouteWithValidQuote } from '../entities';
import { CandidatePoolsBySelectionCriteria, V4CandidatePools } from '../functions/get-candidate-pools';
import { IGasModel } from '../gas-models';
import { BaseQuoter } from './base-quoter';
import { GetQuotesResult, GetRoutesResult } from './model';
export declare class V4Quoter extends BaseQuoter<V4CandidatePools, V4Route, Currency> {
    protected v4SubgraphProvider: IV4SubgraphProvider;
    protected v4PoolProvider: IV4PoolProvider;
    protected onChainQuoteProvider: IOnChainQuoteProvider;
    constructor(v4SubgraphProvider: IV4SubgraphProvider, v4PoolProvider: IV4PoolProvider, onChainQuoteProvider: IOnChainQuoteProvider, tokenProvider: ITokenProvider, chainId: ChainId, blockedTokenListProvider?: ITokenListProvider, tokenValidatorProvider?: ITokenValidatorProvider);
    protected getRoutes(currencyIn: Currency, currencyOut: Currency, v4CandidatePools: V4CandidatePools, _tradeType: TradeType, routingConfig: AlphaRouterConfig): Promise<GetRoutesResult<V4Route>>;
    getQuotes(routes: V4Route[], amounts: CurrencyAmount[], percents: number[], quoteCurrency: Currency, tradeType: TradeType, routingConfig: AlphaRouterConfig, candidatePools?: CandidatePoolsBySelectionCriteria, gasModel?: IGasModel<RouteWithValidQuote>): Promise<GetQuotesResult>;
}
