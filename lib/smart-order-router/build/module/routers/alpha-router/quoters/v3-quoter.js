import { Protocol } from '@uniswap/router-sdk';
import { TradeType } from '@uniswap/sdk-core';
import _ from 'lodash';
import { TokenValidationResult, } from '../../../providers';
import { log, metric, MetricLoggerUnit, routeToString, } from '../../../util';
import { V3RouteWithValidQuote } from '../entities';
import { computeAllV3Routes } from '../functions/compute-all-routes';
import { BaseQuoter } from './base-quoter';
export class V3Quoter extends BaseQuoter {
    constructor(v3SubgraphProvider, v3PoolProvider, onChainQuoteProvider, tokenProvider, chainId, blockedTokenListProvider, tokenValidatorProvider) {
        super(tokenProvider, chainId, Protocol.V3, blockedTokenListProvider, tokenValidatorProvider);
        this.v3SubgraphProvider = v3SubgraphProvider;
        this.v3PoolProvider = v3PoolProvider;
        this.onChainQuoteProvider = onChainQuoteProvider;
    }
    async getRoutes(tokenIn, tokenOut, v3CandidatePools, _tradeType, routingConfig) {
        const beforeGetRoutes = Date.now();
        // Fetch all the pools that we will consider routing via. There are thousands
        // of pools, so we filter them to a set of candidate pools that we expect will
        // result in good prices.
        const { poolAccessor, candidatePools } = v3CandidatePools;
        const poolsRaw = poolAccessor.getAllPools();
        // Drop any pools that contain fee on transfer tokens (not supported by v3) or have issues with being transferred.
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
                (token.equals(tokenIn) || token.equals(tokenOut))) {
                return false;
            }
            return (tokenValidation == TokenValidationResult.FOT ||
                tokenValidation == TokenValidationResult.STF);
        });
        // Given all our candidate pools, compute all the possible ways to route from tokenIn to tokenOut.
        const { maxSwapsPerPath } = routingConfig;
        const routes = computeAllV3Routes(tokenIn, tokenOut, pools, maxSwapsPerPath);
        metric.putMetric('V3GetRoutesLoad', Date.now() - beforeGetRoutes, MetricLoggerUnit.Milliseconds);
        return {
            routes,
            candidatePools,
        };
    }
    async getQuotes(routes, amounts, percents, quoteToken, tradeType, routingConfig, candidatePools, gasModel) {
        const beforeGetQuotes = Date.now();
        log.info('Starting to get V3 quotes');
        if (gasModel === undefined) {
            throw new Error('GasModel for V3RouteWithValidQuote is required to getQuotes');
        }
        if (routes.length == 0) {
            return { routesWithValidQuotes: [], candidatePools };
        }
        // For all our routes, and all the fractional amounts, fetch quotes on-chain.
        const quoteFn = tradeType == TradeType.EXACT_INPUT
            ? this.onChainQuoteProvider.getQuotesManyExactIn.bind(this.onChainQuoteProvider)
            : this.onChainQuoteProvider.getQuotesManyExactOut.bind(this.onChainQuoteProvider);
        const beforeQuotes = Date.now();
        log.info(`Getting quotes for V3 for ${routes.length} routes with ${amounts.length} amounts per route.`);
        const { routesWithQuotes } = await quoteFn(amounts, routes, routingConfig);
        metric.putMetric('V3QuotesLoad', Date.now() - beforeQuotes, MetricLoggerUnit.Milliseconds);
        metric.putMetric('V3QuotesFetched', _(routesWithQuotes)
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
                    }, 'Dropping a null V3 quote for route.');
                    continue;
                }
                const routeWithValidQuote = new V3RouteWithValidQuote({
                    route,
                    rawQuote: quote,
                    amount,
                    percent,
                    sqrtPriceX96AfterList,
                    initializedTicksCrossedList,
                    quoterGasEstimate: gasEstimate,
                    gasModel,
                    quoteToken,
                    tradeType,
                    v3PoolProvider: this.v3PoolProvider,
                });
                routesWithValidQuotes.push(routeWithValidQuote);
            }
        }
        metric.putMetric('V3GetQuotesLoad', Date.now() - beforeGetQuotes, MetricLoggerUnit.Milliseconds);
        return {
            routesWithValidQuotes,
            candidatePools,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjMtcXVvdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL3F1b3RlcnMvdjMtcXVvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMvQyxPQUFPLEVBQTRCLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3hFLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUV2QixPQUFPLEVBT0wscUJBQXFCLEdBQ3RCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUVMLEdBQUcsRUFDSCxNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFPckUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQyxNQUFNLE9BQU8sUUFBUyxTQUFRLFVBQTRDO0lBS3hFLFlBQ0Usa0JBQXVDLEVBQ3ZDLGNBQStCLEVBQy9CLG9CQUEyQyxFQUMzQyxhQUE2QixFQUM3QixPQUFnQixFQUNoQix3QkFBNkMsRUFDN0Msc0JBQWdEO1FBRWhELEtBQUssQ0FDSCxhQUFhLEVBQ2IsT0FBTyxFQUNQLFFBQVEsQ0FBQyxFQUFFLEVBQ1gsd0JBQXdCLEVBQ3hCLHNCQUFzQixDQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztJQUNuRCxDQUFDO0lBRVMsS0FBSyxDQUFDLFNBQVMsQ0FDdkIsT0FBYyxFQUNkLFFBQWUsRUFDZixn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