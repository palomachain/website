"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixedQuoter = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const lodash_1 = __importDefault(require("lodash"));
const providers_1 = require("../../../providers");
const util_1 = require("../../../util");
const entities_1 = require("../entities");
const compute_all_routes_1 = require("../functions/compute-all-routes");
const get_candidate_pools_1 = require("../functions/get-candidate-pools");
const base_quoter_1 = require("./base-quoter");
class MixedQuoter extends base_quoter_1.BaseQuoter {
    constructor(v4SubgraphProvider, v4PoolProvider, v3SubgraphProvider, v3PoolProvider, v2SubgraphProvider, v2PoolProvider, onChainQuoteProvider, tokenProvider, chainId, blockedTokenListProvider, tokenValidatorProvider) {
        super(tokenProvider, chainId, router_sdk_1.Protocol.MIXED, blockedTokenListProvider, tokenValidatorProvider);
        this.v4SubgraphProvider = v4SubgraphProvider;
        this.v4PoolProvider = v4PoolProvider;
        this.v3SubgraphProvider = v3SubgraphProvider;
        this.v3PoolProvider = v3PoolProvider;
        this.v2SubgraphProvider = v2SubgraphProvider;
        this.v2PoolProvider = v2PoolProvider;
        this.onChainQuoteProvider = onChainQuoteProvider;
    }
    async getRoutes(currencyIn, currencyOut, v4v3v2candidatePools, tradeType, routingConfig) {
        var _a, _b, _c;
        const beforeGetRoutes = Date.now();
        if (tradeType != sdk_core_1.TradeType.EXACT_INPUT) {
            throw new Error('Mixed route quotes are not supported for EXACT_OUTPUT');
        }
        const [v4CandidatePools, v3CandidatePools, v2CandidatePools, crossLiquidityPools,] = v4v3v2candidatePools;
        const { V2poolAccessor, V3poolAccessor, V4poolAccessor, candidatePools: mixedRouteCandidatePools, } = await (0, get_candidate_pools_1.getMixedRouteCandidatePools)({
            v4CandidatePools,
            v3CandidatePools,
            v2CandidatePools,
            crossLiquidityPools,
            tokenProvider: this.tokenProvider,
            v4PoolProvider: this.v4PoolProvider,
            v3poolProvider: this.v3PoolProvider,
            v2poolProvider: this.v2PoolProvider,
            routingConfig,
            chainId: this.chainId,
        });
        const V4poolsRaw = V4poolAccessor.getAllPools();
        const V3poolsRaw = V3poolAccessor.getAllPools();
        const V2poolsRaw = V2poolAccessor.getAllPools();
        const poolsRaw = [];
        if (!((_a = routingConfig.excludedProtocolsFromMixed) === null || _a === void 0 ? void 0 : _a.includes(router_sdk_1.Protocol.V4))) {
            poolsRaw.push(...V4poolsRaw);
        }
        if (!((_b = routingConfig.excludedProtocolsFromMixed) === null || _b === void 0 ? void 0 : _b.includes(router_sdk_1.Protocol.V3))) {
            poolsRaw.push(...V3poolsRaw);
        }
        if (!((_c = routingConfig.excludedProtocolsFromMixed) === null || _c === void 0 ? void 0 : _c.includes(router_sdk_1.Protocol.V2))) {
            poolsRaw.push(...V2poolsRaw);
        }
        const candidatePools = mixedRouteCandidatePools;
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
            if (tokenValidation == providers_1.TokenValidationResult.STF &&
                (token.equals(currencyIn) || token.equals(currencyOut))) {
                return false;
            }
            return (tokenValidation == providers_1.TokenValidationResult.FOT ||
                tokenValidation == providers_1.TokenValidationResult.STF);
        });
        const { maxSwapsPerPath } = routingConfig;
        const routes = (0, compute_all_routes_1.computeAllMixedRoutes)(currencyIn, currencyOut, pools, maxSwapsPerPath);
        util_1.metric.putMetric('MixedGetRoutesLoad', Date.now() - beforeGetRoutes, util_1.MetricLoggerUnit.Milliseconds);
        return {
            routes: routes,
            candidatePools,
        };
    }
    async getQuotes(routes, amounts, percents, quoteCurrency, tradeType, routingConfig, candidatePools, gasModel) {
        const beforeGetQuotes = Date.now();
        util_1.log.info('Starting to get mixed quotes');
        if (gasModel === undefined) {
            throw new Error('GasModel for MixedRouteWithValidQuote is required to getQuotes');
        }
        if (routes.length == 0) {
            return { routesWithValidQuotes: [], candidatePools };
        }
        // For all our routes, and all the fractional amounts, fetch quotes on-chain.
        const quoteFn = this.onChainQuoteProvider.getQuotesManyExactIn.bind(this.onChainQuoteProvider);
        const beforeQuotes = Date.now();
        util_1.log.info(`Getting quotes for mixed for ${routes.length} routes with ${amounts.length} amounts per route.`);
        const { routesWithQuotes } = await quoteFn(amounts, routes, routingConfig);
        util_1.metric.putMetric('MixedQuotesLoad', Date.now() - beforeQuotes, util_1.MetricLoggerUnit.Milliseconds);
        util_1.metric.putMetric('MixedQuotesFetched', (0, lodash_1.default)(routesWithQuotes)
            .map(([, quotes]) => quotes.length)
            .sum(), util_1.MetricLoggerUnit.Count);
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
                    util_1.log.debug({
                        route: (0, util_1.routeToString)(route),
                        amountQuote,
                    }, 'Dropping a null mixed quote for route.');
                    continue;
                }
                const routeWithValidQuote = new entities_1.MixedRouteWithValidQuote({
                    route,
                    rawQuote: quote,
                    amount,
                    percent,
                    sqrtPriceX96AfterList,
                    initializedTicksCrossedList,
                    quoterGasEstimate: gasEstimate,
                    mixedRouteGasModel: gasModel,
                    quoteToken: quoteCurrency.wrapped,
                    tradeType,
                    v4PoolProvider: this.v4PoolProvider,
                    v3PoolProvider: this.v3PoolProvider,
                    v2PoolProvider: this.v2PoolProvider,
                });
                routesWithValidQuotes.push(routeWithValidQuote);
            }
        }
        util_1.metric.putMetric('MixedGetQuotesLoad', Date.now() - beforeGetQuotes, util_1.MetricLoggerUnit.Milliseconds);
        return {
            routesWithValidQuotes,
            candidatePools,
        };
    }
}
exports.MixedQuoter = MixedQuoter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQtcXVvdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL3F1b3RlcnMvbWl4ZWQtcXVvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUErQztBQUMvQyxnREFBaUU7QUFDakUsb0RBQXVCO0FBRXZCLGtEQVk0QjtBQUM1Qix3Q0FNdUI7QUFHdkIsMENBQXVEO0FBQ3ZELHdFQUF3RTtBQUN4RSwwRUFPMEM7QUFHMUMsK0NBQTJDO0FBRzNDLE1BQWEsV0FBWSxTQUFRLHdCQVNoQztJQVNDLFlBQ0Usa0JBQXVDLEVBQ3ZDLGNBQStCLEVBQy9CLGtCQUF1QyxFQUN2QyxjQUErQixFQUMvQixrQkFBdUMsRUFDdkMsY0FBK0IsRUFDL0Isb0JBQTJDLEVBQzNDLGFBQTZCLEVBQzdCLE9BQWdCLEVBQ2hCLHdCQUE2QyxFQUM3QyxzQkFBZ0Q7UUFFaEQsS0FBSyxDQUNILGFBQWEsRUFDYixPQUFPLEVBQ1AscUJBQVEsQ0FBQyxLQUFLLEVBQ2Qsd0JBQXdCLEVBQ3hCLHNCQUFzQixDQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFDN0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO0lBQ25ELENBQUM7SUFFUyxLQUFLLENBQUMsU0FBUyxDQUN2QixVQUFvQixFQUNwQixXQUFxQixFQUNyQixvQkFLQyxFQUNELFNBQW9CLEVBQ3BCLGFBQWdDOztRQUVoQyxN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