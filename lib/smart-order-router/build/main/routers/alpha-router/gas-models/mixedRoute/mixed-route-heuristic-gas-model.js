"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixedRouteHeuristicGasModelFactory = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const router_sdk_1 = require("@uniswap/router-sdk");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
const jsbi_1 = __importDefault(require("jsbi"));
const __1 = require("../../../..");
const util_1 = require("../../../../util");
const amounts_1 = require("../../../../util/amounts");
const gas_factory_helpers_1 = require("../../../../util/gas-factory-helpers");
const gas_costs_1 = require("../gas-costs");
const gas_model_1 = require("../gas-model");
const v2_heuristic_gas_model_1 = require("../v2/v2-heuristic-gas-model");
/**
 * Computes a gas estimate for a mixed route swap using heuristics.
 * Considers number of hops in the route, number of ticks crossed
 * and the typical base cost for a swap.
 *
 * We get the number of ticks crossed in a swap from the MixedRouteQuoterV1
 * contract.
 *
 * We compute gas estimates off-chain because
 *  1/ Calling eth_estimateGas for a swaps requires the caller to have
 *     the full balance token being swapped, and approvals.
 *  2/ Tracking gas used using a wrapper contract is not accurate with Multicall
 *     due to EIP-2929. We would have to make a request for every swap we wanted to estimate.
 *  3/ For V2 we simulate all our swaps off-chain so have no way to track gas used.
 *
 * @export
 * @class MixedRouteHeuristicGasModelFactory
 */
class MixedRouteHeuristicGasModelFactory extends gas_model_1.IOnChainGasModelFactory {
    async buildGasModel({ chainId, gasPriceWei, pools, quoteToken, v2poolProvider: V2poolProvider, providerConfig, }) {
        const nativeCurrency = __1.WRAPPED_NATIVE_CURRENCY[chainId];
        const usdPool = pools.usdPool;
        const usdToken = usdPool.token0.equals(nativeCurrency)
            ? usdPool.token1
            : usdPool.token0;
        let nativeV2Pool;
        // Avoid fetching for a (WETH,WETH) pool here, we handle the quoteToken = wrapped native case in estimateGasCost
        if (!quoteToken.equals(nativeCurrency) && V2poolProvider) {
            /// MixedRoutes
            nativeV2Pool = await (0, gas_factory_helpers_1.getV2NativePool)(quoteToken, V2poolProvider, providerConfig);
        }
        const estimateGasCost = (routeWithValidQuote) => {
            var _a;
            const { totalGasCostNativeCurrency, baseGasUse } = this.estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig);
            /** ------ MARK: USD Logic -------- */
            const gasCostInTermsOfUSD = (0, gas_model_1.getQuoteThroughNativePool)(chainId, totalGasCostNativeCurrency, usdPool);
            /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
            const nativeAndSpecifiedGasTokenPool = pools.nativeAndSpecifiedGasTokenV3Pool;
            let gasCostInTermsOfGasToken = undefined;
            if (nativeAndSpecifiedGasTokenPool) {
                gasCostInTermsOfGasToken = (0, gas_model_1.getQuoteThroughNativePool)(chainId, totalGasCostNativeCurrency, nativeAndSpecifiedGasTokenPool);
            }
            // if the gasToken is the native currency, we can just use the totalGasCostNativeCurrency
            else if ((_a = providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.gasToken) === null || _a === void 0 ? void 0 : _a.equals(nativeCurrency)) {
                gasCostInTermsOfGasToken = totalGasCostNativeCurrency;
            }
            /** ------ MARK: return early if quoteToken is wrapped native currency ------- */
            if (quoteToken.equals(nativeCurrency)) {
                return {
                    gasEstimate: baseGasUse,
                    gasCostInToken: totalGasCostNativeCurrency,
                    gasCostInUSD: gasCostInTermsOfUSD,
                    gasCostInGasToken: gasCostInTermsOfGasToken,
                };
            }
            /** ------ MARK: Main gas logic in terms of quote token -------- */
            // If the quote token is not in the native currency, we convert the gas cost to be in terms of the quote token.
            // We do this by getting the highest liquidity <quoteToken>/<nativeCurrency> pool. eg. <quoteToken>/ETH pool.
            const nativeV3Pool = pools.nativeAndQuoteTokenV3Pool;
            if (!nativeV3Pool && !nativeV2Pool) {
                util_1.log.info(`Unable to find ${nativeCurrency.symbol} pool with the quote token, ${quoteToken.symbol} to produce gas adjusted costs. Route will not account for gas.`);
                return {
                    gasEstimate: baseGasUse,
                    gasCostInToken: amounts_1.CurrencyAmount.fromRawAmount(quoteToken, 0),
                    gasCostInUSD: amounts_1.CurrencyAmount.fromRawAmount(usdToken, 0),
                };
            }
            /// we will use nativeV2Pool for fallback if nativeV3 does not exist or has 0 liquidity
            /// can use ! here because we return above if v3Pool and v2Pool are null
            const nativePool = (!nativeV3Pool || jsbi_1.default.equal(nativeV3Pool.liquidity, jsbi_1.default.BigInt(0))) &&
                nativeV2Pool
                ? nativeV2Pool
                : nativeV3Pool;
            const gasCostInTermsOfQuoteToken = (0, gas_model_1.getQuoteThroughNativePool)(chainId, totalGasCostNativeCurrency, nativePool);
            return {
                gasEstimate: baseGasUse,
                gasCostInToken: gasCostInTermsOfQuoteToken,
                gasCostInUSD: gasCostInTermsOfUSD,
                gasCostInGasToken: gasCostInTermsOfGasToken,
            };
        };
        return {
            estimateGasCost: estimateGasCost.bind(this),
        };
    }
    estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig) {
        const totalInitializedTicksCrossed = this.totalInitializedTicksCrossed(routeWithValidQuote.initializedTicksCrossedList);
        /**
         * Since we must make a separate call to multicall for each v3 and v2 section, we will have to
         * add the BASE_SWAP_COST to each section.
         */
        let baseGasUseV2Only = bignumber_1.BigNumber.from(0);
        let baseGasUseV3Only = bignumber_1.BigNumber.from(0);
        let baseGasUse = bignumber_1.BigNumber.from(0);
        let routeContainsV4Pool = false;
        const route = routeWithValidQuote.route;
        const res = (0, router_sdk_1.partitionMixedRouteByProtocol)(route);
        res.map((section) => {
            if (section.every((pool) => pool instanceof v3_sdk_1.Pool)) {
                baseGasUseV3Only = baseGasUseV3Only.add((0, gas_costs_1.BASE_SWAP_COST)(chainId));
                baseGasUseV3Only = baseGasUseV3Only.add((0, gas_costs_1.COST_PER_HOP)(chainId).mul(section.length));
                baseGasUse = baseGasUse.add(baseGasUseV3Only);
            }
            else if (section.every((pool) => pool instanceof v2_sdk_1.Pair)) {
                baseGasUseV2Only = baseGasUseV2Only.add(v2_heuristic_gas_model_1.BASE_SWAP_COST);
                baseGasUseV2Only = baseGasUseV2Only.add(
                /// same behavior in v2 heuristic gas model factory
                v2_heuristic_gas_model_1.COST_PER_EXTRA_HOP.mul(section.length - 1));
                baseGasUse = baseGasUse.add(baseGasUseV2Only);
            }
            else if (section.every((pool) => pool instanceof v4_sdk_1.Pool)) {
                routeContainsV4Pool = true;
            }
        });
        const tickGasUse = (0, gas_costs_1.COST_PER_INIT_TICK)(chainId).mul(totalInitializedTicksCrossed);
        const uninitializedTickGasUse = gas_costs_1.COST_PER_UNINIT_TICK.mul(0);
        if (routeContainsV4Pool) {
            // If the route contains a V4 pool, we know we are hitting mixed quoter V2, not mixed quoter V1,
            // Hence we already know the v3 and v4 hops part of the quoter gas estimate.
            // We only need to add the base gas use for the v2 part of the route,
            // because mixed quoter doesn't have a way to estimate gas for v2 pools swaps.
            baseGasUse = baseGasUseV2Only.add(routeWithValidQuote.quoterGasEstimate);
        }
        else {
            // base estimate gas used based on chainId estimates for hops and ticks gas useage
            baseGasUse = baseGasUse.add(tickGasUse).add(uninitializedTickGasUse);
        }
        if (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.additionalGasOverhead) {
            baseGasUse = baseGasUse.add(providerConfig.additionalGasOverhead);
        }
        const baseGasCostWei = gasPriceWei.mul(baseGasUse);
        const wrappedCurrency = __1.WRAPPED_NATIVE_CURRENCY[chainId];
        const totalGasCostNativeCurrency = amounts_1.CurrencyAmount.fromRawAmount(wrappedCurrency, baseGasCostWei.toString());
        return {
            totalGasCostNativeCurrency,
            totalInitializedTicksCrossed,
            baseGasUse,
        };
    }
}
exports.MixedRouteHeuristicGasModelFactory = MixedRouteHeuristicGasModelFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQtcm91dGUtaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL21peGVkUm91dGUvbWl4ZWQtcm91dGUtaGV1cmlzdGljLWdhcy1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBcUQ7QUFDckQsb0RBQW9FO0FBRXBFLDRDQUF1QztBQUN2Qyw0Q0FBaUQ7QUFDakQsNENBQWlEO0FBQ2pELGdEQUF3QjtBQUd4QixtQ0FBc0Q7QUFDdEQsMkNBQXVDO0FBQ3ZDLHNEQUEwRDtBQUMxRCw4RUFBdUU7QUFFdkUsNENBS3NCO0FBQ3RCLDRDQU1zQjtBQUN0Qix5RUFHc0M7QUFFdEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBYSxrQ0FBbUMsU0FBUSxtQ0FBaUQ7SUFDaEcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixPQUFPLEVBQ1AsV0FBVyxFQUNYLEtBQUssRUFDTCxVQUFVLEVBQ1YsY0FBYyxFQUFFLGNBQWMsRUFDOUIsY0FBYyxHQUNrQjtRQUdoQyxNQUFNLGNBQWMsR0FBRywyQkFBdUIsQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUN6RCxNQUFNLE9BQU8sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztZQUNwRCxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU07WUFDaEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFbkIsSUFBSSxZQUF5QixDQUFDO1FBQzlCLGdIQUFnSDtRQUNoSCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxjQUFjLEVBQUU7WUFDeEQsZUFBZTtZQUNmLFlBQVksR0FBRyxNQUFNLElBQUEscUNBQWUs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