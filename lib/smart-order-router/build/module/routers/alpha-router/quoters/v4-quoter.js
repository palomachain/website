import { Protocol } from '@uniswap/router-sdk';
import { TradeType } from '@uniswap/sdk-core';
import _ from 'lodash';
import { TokenValidationResult, } from '../../../providers';
import { log, metric, MetricLoggerUnit, routeToString, } from '../../../util';
import { V4RouteWithValidQuote } from '../entities';
import { computeAllV4Routes } from '../functions/compute-all-routes';
import { BaseQuoter } from './base-quoter';
export class V4Quoter extends BaseQuoter {
    constructor(v4SubgraphProvider, v4PoolProvider, onChainQuoteProvider, tokenProvider, chainId, blockedTokenListProvider, tokenValidatorProvider) {
        super(tokenProvider, chainId, Protocol.V4, blockedTokenListProvider, tokenValidatorProvider);
        this.v4SubgraphProvider = v4SubgraphProvider;
        this.v4PoolProvider = v4PoolProvider;
        this.onChainQuoteProvider = onChainQuoteProvider;
    }
    async getRoutes(currencyIn, currencyOut, v4CandidatePools, _tradeType, routingConfig) {
        const beforeGetRoutes = Date.now();
        // Fetch all the pools that we will consider routing via. There are thousands
        // of pools, so we filter them to a set of candidate pools that we expect will
        // result in good prices.
        const { poolAccessor, candidatePools } = v4CandidatePools;
        const poolsRaw = poolAccessor.getAllPools();
        // Drop any pools that contain fee on transfer tokens (not supported by v4) or have issues with being transferred.
        const pools = await this.applyTokenValidatorToPools(poolsRaw, (token, tokenValidation) => {
            // If there is no available validation result we assume the token is fine.
            if (!tokenValidation) {
                return false;
            }
            // Only filters out *intermediate* pools that involve tokens that we detect
            // cant be transferred. This prevents us trying to route through tokens that may
            // not be transferrable, but allows users to still swap those tokens if they
            // specify.
            //
            if (tokenValidation == TokenValidationResult.STF &&
                (token.equals(currencyIn) || token.equals(currencyOut))) {
                return false;
            }
            return (tokenValidation == TokenValidationResult.FOT ||
                tokenValidation == TokenValidationResult.STF);
        });
        // Given all our candidate pools, compute all the possible ways to route from currencyIn to tokenOut.
        const { maxSwapsPerPath } = routingConfig;
        const routes = computeAllV4Routes(currencyIn, currencyOut, pools, maxSwapsPerPath);
        metric.putMetric('V4GetRoutesLoad', Date.now() - beforeGetRoutes, MetricLoggerUnit.Milliseconds);
        return {
            routes,
            candidatePools,
        };
    }
    async getQuotes(routes, amounts, percents, quoteCurrency, tradeType, routingConfig, candidatePools, gasModel) {
        const beforeGetQuotes = Date.now();
        log.info('Starting to get V4 quotes');
        if (gasModel === undefined) {
            throw new Error('GasModel for V4RouteWithValidQuote is required to getQuotes');
        }
        if (routes.length == 0) {
            return { routesWithValidQuotes: [], candidatePools };
        }
        // For all our routes, and all the fractional amounts, fetch quotes on-chain.
        const quoteFn = tradeType == TradeType.EXACT_INPUT
            ? this.onChainQuoteProvider.getQuotesManyExactIn.bind(this.onChainQuoteProvider)
            : this.onChainQuoteProvider.getQuotesManyExactOut.bind(this.onChainQuoteProvider);
        const beforeQuotes = Date.now();
        log.info(`Getting quotes for V4 for ${routes.length} routes with ${amounts.length} amounts per route.`);
        const { routesWithQuotes } = await quoteFn(amounts, routes, routingConfig);
        metric.putMetric('V4QuotesLoad', Date.now() - beforeQuotes, MetricLoggerUnit.Milliseconds);
        metric.putMetric('V4QuotesFetched', _(routesWithQuotes)
            .map(([, quotes]) => quotes.length)
            .sum(), MetricLoggerUnit.Count);
        const routesWithValidQuotes = [];
        for (const routeWithQuote of routesWithQuotes) {
            const [route, quotes] = routeWithQuote;
            for (let i = 0; i < quotes.length; i++) {
                const percent = percents[i];
                const amountQuote = quotes[i];
                const { quote, amount, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate, } = amountQuote;
                if (!quote ||
                    !sqrtPriceX96AfterList ||
                    !initializedTicksCrossedList ||
                    !gasEstimate) {
                    log.debug({
                        route: routeToString(route),
                        amountQuote,
                    }, 'Dropping a null V4 quote for route.');
                    continue;
                }
                const routeWithValidQuote = new V4RouteWithValidQuote({
                    route,
                    rawQuote: quote,
                    amount,
                    percent,
                    sqrtPriceX96AfterList,
                    initializedTicksCrossedList,
                    quoterGasEstimate: gasEstimate,
                    gasModel,
                    // TODO: ROUTE-306 make it unwrapped, once v4 gas model supports native quote currency
                    // For now it's ok to keep it wrapped,
                    // because the quote is the fairly accurate quote from the native currency routing
                    quoteToken: quoteCurrency.wrapped,
                    tradeType,
                    v4PoolProvider: this.v4PoolProvider,
                });
                routesWithValidQuotes.push(routeWithValidQuote);
            }
        }
        metric.putMetric('V4GetQuotesLoad', Date.now() - beforeGetQuotes, MetricLoggerUnit.Milliseconds);
        return {
            routesWithValidQuotes,
            candidatePools,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjQtcXVvdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL3F1b3RlcnMvdjQtcXVvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMvQyxPQUFPLEVBQXFCLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2pFLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUV2QixPQUFPLEVBT0wscUJBQXFCLEdBQ3RCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUVMLEdBQUcsRUFDSCxNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQXVCLHFCQUFxQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBT3JFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsTUFBTSxPQUFPLFFBQVMsU0FBUSxVQUErQztJQUszRSxZQUNFLGtCQUF1QyxFQUN2QyxjQUErQixFQUMvQixvQkFBMkMsRUFDM0MsYUFBNkIsRUFDN0IsT0FBZ0IsRUFDaEIsd0JBQTZDLEVBQzdDLHNCQUFnRDtRQUVoRCxLQUFLLENBQ0gsYUFBYSxFQUNiLE9BQU8sRUFDUCxRQUFRLENBQUMsRUFBRSxFQUNYLHdCQUF3QixFQUN4QixzQkFBc0IsQ0FDdkIsQ0FBQztRQUNGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7SUFDbkQsQ0FBQztJQUVTLEtBQUssQ0FBQyxTQUFTLENBQ3ZCLFVBQW9CLEVBQ3BCLFdBQXFCLEVB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