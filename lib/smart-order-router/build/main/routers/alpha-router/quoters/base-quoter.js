"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQuoter = void 0;
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../../../util");
/**
 * Interface for a Quoter.
 * Defines the base dependencies, helper methods and interface for how to fetch quotes.
 *
 * @abstract
 * @template CandidatePools
 * @template Route
 */
class BaseQuoter {
    constructor(tokenProvider, chainId, protocol, blockedTokenListProvider, tokenValidatorProvider) {
        this.tokenProvider = tokenProvider;
        this.chainId = chainId;
        this.protocol = protocol;
        this.blockedTokenListProvider = blockedTokenListProvider;
        this.tokenValidatorProvider = tokenValidatorProvider;
    }
    /**
     * Public method which would first get the routes and then get the quotes.
     *
     * @param tokenIn The token that the user wants to provide
     * @param tokenOut The token that the usaw wants to receive
     * @param amounts the list of amounts to query for EACH route.
     * @param percents the percentage of each amount.
     * @param quoteToken
     * @param candidatePools
     * @param tradeType
     * @param routingConfig
     * @param gasModel the gasModel to be used for estimating gas cost
     * @param gasPriceWei instead of passing gasModel, gasPriceWei is used to generate a gasModel
     */
    getRoutesThenQuotes(tokenIn, tokenOut, amount, amounts, percents, quoteToken, candidatePools, tradeType, routingConfig, gasModel, gasPriceWei) {
        return this.getRoutes(tokenIn, tokenOut, candidatePools, tradeType, routingConfig).then((routesResult) => {
            if (routesResult.routes.length == 1) {
                util_1.metric.putMetric(`${this.protocol}QuoterSingleRoute`, 1, util_1.MetricLoggerUnit.Count);
                percents = [100];
                amounts = [amount];
            }
            if (routesResult.routes.length > 0) {
                util_1.metric.putMetric(`${this.protocol}QuoterRoutesFound`, routesResult.routes.length, util_1.MetricLoggerUnit.Count);
            }
            else {
                util_1.metric.putMetric(`${this.protocol}QuoterNoRoutesFound`, routesResult.routes.length, util_1.MetricLoggerUnit.Count);
            }
            return this.getQuotes(routesResult.routes, amounts, percents, quoteToken, tradeType, routingConfig, routesResult.candidatePools, gasModel, gasPriceWei);
        });
    }
    async applyTokenValidatorToPools(pools, isInvalidFn) {
        if (!this.tokenValidatorProvider) {
            return pools;
        }
        util_1.log.info(`Running token validator on ${pools.length} pools`);
        const tokens = lodash_1.default.flatMap(pools, (pool) => [pool.token0, pool.token1]);
        const tokenValidationResults = await this.tokenValidatorProvider.validateTokens(tokens.map((token) => token.wrapped));
        const poolsFiltered = lodash_1.default.filter(pools, (pool) => {
            const token0Validation = tokenValidationResults.getValidationByToken(pool.token0.wrapped);
            const token1Validation = tokenValidationResults.getValidationByToken(pool.token1.wrapped);
            const token0Invalid = isInvalidFn(pool.token0, token0Validation);
            const token1Invalid = isInvalidFn(pool.token1, token1Validation);
            if (token0Invalid || token1Invalid) {
                util_1.log.info(`Dropping pool ${(0, util_1.poolToString)(pool)} because token is invalid. ${pool.token0.symbol}: ${token0Validation}, ${pool.token1.symbol}: ${token1Validation}`);
            }
            return !token0Invalid && !token1Invalid;
        });
        return poolsFiltered;
    }
}
exports.BaseQuoter = BaseQuoter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1xdW90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcm91dGVycy9hbHBoYS1yb3V0ZXIvcXVvdGVycy9iYXNlLXF1b3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSxvREFBdUI7QUFRdkIsd0NBTXVCO0FBaUJ2Qjs7Ozs7OztHQU9HO0FBQ0gsTUFBc0IsVUFBVTtJQWtCOUIsWUFDRSxhQUE2QixFQUM3QixPQUFnQixFQUNoQixRQUFrQixFQUNsQix3QkFBNkMsRUFDN0Msc0JBQWdEO1FBRWhELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyx3QkFBd0IsR0FBRyx3QkFBd0IsQ0FBQztRQUN6RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUM7SUFDdkQsQ0FBQztJQWdERDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksbUJBQW1CLENBQ3hCLE9BQWtCLEVBQ2xCLFFBQW1CLEVBQ25CLE1BQXNCLEVBQ3RCLE9BQXlCLEVBQ3pCLFFBQWtCLEVBQ2xCLFVBQXFCLEVBQ3JCLGNBQThCLEVBQzlCLFNBQW9CLEVBQ3BCLGFBQWdDLEVBQ2hDLFFBQXlDLEVBQ3pDLFdBQXVCO1FBRXZCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FDbkIsT0FBTyxFQUNQLFFBQVEsRUFDUixjQUFjLEVBQ2QsU0FBUyxFQUNULGFBQWEsQ0FDZCxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ3RCLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNuQyxhQUFNLENBQUMsU0FBUyxDQUNkLEdBQUcsSUFBSSxDQUFDLFFBQVEsbUJBQW1CLEVBQ25DLENBQUMsRUFDRCx1QkFBZ0IsQ0FB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