import { BigNumber } from '@ethersproject/bignumber';
import { partitionMixedRouteByProtocol } from '@uniswap/router-sdk';
import { Pair } from '@uniswap/v2-sdk';
import { Pool as V3Pool } from '@uniswap/v3-sdk';
import { Pool as V4Pool } from '@uniswap/v4-sdk';
import JSBI from 'jsbi';
import { WRAPPED_NATIVE_CURRENCY } from '../../../..';
import { log } from '../../../../util';
import { CurrencyAmount } from '../../../../util/amounts';
import { getV2NativePool } from '../../../../util/gas-factory-helpers';
import { BASE_SWAP_COST, COST_PER_HOP, COST_PER_INIT_TICK, COST_PER_UNINIT_TICK, } from '../gas-costs';
import { getQuoteThroughNativePool, IOnChainGasModelFactory, } from '../gas-model';
import { BASE_SWAP_COST as BASE_SWAP_COST_V2, COST_PER_EXTRA_HOP as COST_PER_EXTRA_HOP_V2, } from '../v2/v2-heuristic-gas-model';
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
export class MixedRouteHeuristicGasModelFactory extends IOnChainGasModelFactory {
    async buildGasModel({ chainId, gasPriceWei, pools, quoteToken, v2poolProvider: V2poolProvider, providerConfig, }) {
        const nativeCurrency = WRAPPED_NATIVE_CURRENCY[chainId];
        const usdPool = pools.usdPool;
        const usdToken = usdPool.token0.equals(nativeCurrency)
            ? usdPool.token1
            : usdPool.token0;
        let nativeV2Pool;
        // Avoid fetching for a (WETH,WETH) pool here, we handle the quoteToken = wrapped native case in estimateGasCost
        if (!quoteToken.equals(nativeCurrency) && V2poolProvider) {
            /// MixedRoutes
            nativeV2Pool = await getV2NativePool(quoteToken, V2poolProvider, providerConfig);
        }
        const estimateGasCost = (routeWithValidQuote) => {
            var _a;
            const { totalGasCostNativeCurrency, baseGasUse } = this.estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig);
            /** ------ MARK: USD Logic -------- */
            const gasCostInTermsOfUSD = getQuoteThroughNativePool(chainId, totalGasCostNativeCurrency, usdPool);
            /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
            const nativeAndSpecifiedGasTokenPool = pools.nativeAndSpecifiedGasTokenV3Pool;
            let gasCostInTermsOfGasToken = undefined;
            if (nativeAndSpecifiedGasTokenPool) {
                gasCostInTermsOfGasToken = getQuoteThroughNativePool(chainId, totalGasCostNativeCurrency, nativeAndSpecifiedGasTokenPool);
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
                log.info(`Unable to find ${nativeCurrency.symbol} pool with the quote token, ${quoteToken.symbol} to produce gas adjusted costs. Route will not account for gas.`);
                return {
                    gasEstimate: baseGasUse,
                    gasCostInToken: CurrencyAmount.fromRawAmount(quoteToken, 0),
                    gasCostInUSD: CurrencyAmount.fromRawAmount(usdToken, 0),
                };
            }
            /// we will use nativeV2Pool for fallback if nativeV3 does not exist or has 0 liquidity
            /// can use ! here because we return above if v3Pool and v2Pool are null
            const nativePool = (!nativeV3Pool || JSBI.equal(nativeV3Pool.liquidity, JSBI.BigInt(0))) &&
                nativeV2Pool
                ? nativeV2Pool
                : nativeV3Pool;
            const gasCostInTermsOfQuoteToken = getQuoteThroughNativePool(chainId, totalGasCostNativeCurrency, nativePool);
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
        let baseGasUseV2Only = BigNumber.from(0);
        let baseGasUseV3Only = BigNumber.from(0);
        let baseGasUse = BigNumber.from(0);
        let routeContainsV4Pool = false;
        const route = routeWithValidQuote.route;
        const res = partitionMixedRouteByProtocol(route);
        res.map((section) => {
            if (section.every((pool) => pool instanceof V3Pool)) {
                baseGasUseV3Only = baseGasUseV3Only.add(BASE_SWAP_COST(chainId));
                baseGasUseV3Only = baseGasUseV3Only.add(COST_PER_HOP(chainId).mul(section.length));
                baseGasUse = baseGasUse.add(baseGasUseV3Only);
            }
            else if (section.every((pool) => pool instanceof Pair)) {
                baseGasUseV2Only = baseGasUseV2Only.add(BASE_SWAP_COST_V2);
                baseGasUseV2Only = baseGasUseV2Only.add(
                /// same behavior in v2 heuristic gas model factory
                COST_PER_EXTRA_HOP_V2.mul(section.length - 1));
                baseGasUse = baseGasUse.add(baseGasUseV2Only);
            }
            else if (section.every((pool) => pool instanceof V4Pool)) {
                routeContainsV4Pool = true;
            }
        });
        const tickGasUse = COST_PER_INIT_TICK(chainId).mul(totalInitializedTicksCrossed);
        const uninitializedTickGasUse = COST_PER_UNINIT_TICK.mul(0);
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
        const wrappedCurrency = WRAPPED_NATIVE_CURRENCY[chainId];
        const totalGasCostNativeCurrency = CurrencyAmount.fromRawAmount(wrappedCurrency, baseGasCostWei.toString());
        return {
            totalGasCostNativeCurrency,
            totalInitializedTicksCrossed,
            baseGasUse,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQtcm91dGUtaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL21peGVkUm91dGUvbWl4ZWQtcm91dGUtaGV1cmlzdGljLWdhcy1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFcEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxJQUFJLElBQUksTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUFFLElBQUksSUFBSSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRCxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFHeEIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXZFLE9BQU8sRUFDTCxjQUFjLEVBQ2QsWUFBWSxFQUNaLGtCQUFrQixFQUNsQixvQkFBb0IsR0FDckIsTUFBTSxjQUFjLENBQUM7QUFDdEIsT0FBTyxFQUdMLHlCQUF5QixFQUV6Qix1QkFBdUIsR0FDeEIsTUFBTSxjQUFjLENBQUM7QUFDdEIsT0FBTyxFQUNMLGNBQWMsSUFBSSxpQkFBaUIsRUFDbkMsa0JBQWtCLElBQUkscUJBQXFCLEdBQzVDLE1BQU0sOEJBQThCLENBQUM7QUFFdEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxPQUFPLGtDQUFtQyxTQUFRLHVCQUFpRDtJQUNoRyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQ3pCLE9BQU8sRUFDUCxXQUFXLEVBQ1gsS0FBSyxFQUNMLFVBQVUsRUFDVixjQUFjLEVBQUUsY0FBYyxFQUM5QixjQUFjLEdBQ2tCO1FBR2hDLE1BQU0sY0FBYyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sQ0FBRSxDQUFDO1FBQ3pELE1BQU0sT0FBTyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDdEMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTTtZQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUVuQixJQUFJLFlBQXlCLENBQUM7UUFDOUIsZ0hBQWdIO1FBQ2hILElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLGNBQWMsRUFBRTtZQUN4RCxlQUFlO1lBQ2YsWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUNsQyxVQUFVLEVBQ1YsY0FBYyxFQUNkLGNBQWMsQ0FDZixDQUFDO1NBQ0g7UUFFRCxNQUFNLGVBQWUsR0FBRyxDQUN0QixtQkFBNkMsRUFNN0MsRUFBRTs7WUFDRixNQUFNLEVBQUUsMEJBQTBCLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FDakUsbUJBQW1CLEVBQ25CLFdBQVcsRUFDWCxPQUFPLEVBQ1AsY0FBYyxDQUNmLENBQUM7WUFFRixzQ0FBc0M7WUFDdEMsTUFBTSxtQkFBbUIsR0FBRyx5QkFBeUIsQ0FDbkQsT0FBTyxFQUNQLDBCQUEwQixFQUMxQixPQUFPLENBQ1IsQ0FBQztZQUVGLDRFQUE0RTtZQUM1RSxNQUFNLDhCQUE4QixHQUNsQyxLQUFLLENBQUMsZ0NBQWdDLENBQUM7WUFDekMsSUFBSSx3QkFBd0IsR0FBK0IsU0FBUyxDQUFDO1lBQ3JFLElBQUksOEJBQThCLEVBQUU7Z0JBQ2xDLHdCQUF3QixHQUFHLHlCQUF5QixDQUNsRCxPQUFPLEVBQ1AsMEJBQTBCLEVBQzFCLDhCQUE4QixDQUMvQixDQUFDO2FBQ0g7WUFDRCx5RkFBeUY7aUJBQ3BGLElBQUksTUFBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsUUFBUSwwQ0FBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ3pELHdCQUF3QixHQUFHLDBCQUEwQixDQUFDO2FBQ3ZEO1lBRUQsaUZBQWlGO1lBQ2pGLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDckMsT0FBTztvQkFDTCxXQUFXLEVBQUUsVUFBVTtvQkFDdkIsY0FBYyxFQUFFLDBCQUEwQjtvQkFDMUMsWUFBWSxFQUFFLG1CQUFtQjtvQkFDakMsaUJBQWlCLEVBQUUsd0JBQXdCO2lCQUM1QyxDQUFDO2FBQ0g7WUFFRCxtRUFBbUU7WUFFbkUsK0dBQStHO1lBQy9HLDZHQUE2RztZQUM3RyxNQUFNLFlBQVksR0FBa0IsS0FBSyxDQUFDLHlCQUF5QixDQUFDO1lBRXBFLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQ04sa0JBQWtCLGNBQWMsQ0FBQyxNQUFNLCtCQUErQixVQUFVLENBQUMsTUFBTSxpRUFBaUUsQ0FDekosQ0FBQztnQkFDRixPQUFPO29CQUNMLFdBQVcsRUFBRSxVQUFVO29CQUN2QixjQUFjLEVBQUUsY0FBYyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO29CQUMzRCxZQUFZLEVBQUUsY0FBYyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RCxDQUFDO2FBQ0g7WUFFRCx1RkFBdUY7WUFDdkYsd0VBQXdFO1lBQ3hFLE1BQU0sVUFBVSxHQUNkLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckUsWUFBWTtnQkFDVixDQUFDLENBQUMsWUFBWTtnQkFDZCxDQUFDLENBQUMsWUFBYSxDQUFDO1lBRXBCLE1BQU0sMEJBQTBCLEdBQUcseUJBQXlCLENBQzFELE9BQU8sRUFDUCwwQkFBMEIsRUFDMUIsVUFBVSxDQUNYLENBQUM7WUFFRixPQUFPO2dCQUNMLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixjQUFjLEVBQUUsMEJBQTBCO2dCQUMxQyxZQUFZLEVBQUUsbUJBQW9CO2dCQUNsQyxpQkFBaUIsRUFBRSx3QkFBd0I7YUFDNUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLE9BQU87WUFDTCxlQUFlLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDNUMsQ0FBQztJQUNKLENBQUM7SUFFTyxXQUFXLENBQ2pCLG1CQUE2QyxFQUM3QyxXQUFzQixFQUN0QixPQUFnQixFQUNoQixjQUF1QztRQUV2QyxNQUFNLDRCQUE0QixHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FDcEUsbUJBQW1CLENBQUMsMkJBQTJCLENBQ2hELENBQUM7UUFFRjs7O1dBR0c7UUFDSCxJQUFJLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFFaEMsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDO1FBRXhDLE1BQU0sR0FBRyxHQUFHLDZCQUE2QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFnQixFQUFFLEVBQUU7WUFDM0IsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFlBQVksTUFBTSxDQUFDLEVBQUU7Z0JBQ25ELGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDakUsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUNyQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FDMUMsQ0FBQztnQkFDRixVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQy9DO2lCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxZQUFZLElBQUksQ0FBQyxFQUFFO2dCQUN4RCxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDM0QsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsR0FBRztnQkFDckMsbURBQW1EO2dCQUNuRCxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FDOUMsQ0FBQztnQkFDRixVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQy9DO2lCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxFQUFFO2dCQUMxRCxtQkFBbUIsR0FBRyxJQUFJLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FDaEQsNEJBQTRCLENBQzdCLENBQUM7UUFDRixNQUFNLHVCQUF1QixHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1RCxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLGdHQUFnRztZQUNoRyw0RUFBNEU7WUFDNUUscUVBQXFFO1lBQ3JFLDhFQUE4RTtZQUM5RSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDMUU7YUFBTTtZQUNMLGtGQUFrRjtZQUNsRixVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUN0RTtRQUVELElBQUksY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLHFCQUFxQixFQUFFO1lBQ3pDLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVuRCxNQUFNLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUUxRCxNQUFNLDBCQUEwQixHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQzdELGVBQWUsRUFDZixjQUFjLENBQUMsUUFBUSxFQUFFLENBQzFCLENBQUM7UUFFRixPQUFPO1lBQ0wsMEJBQTBCO1lBQzFCLDRCQUE0QjtZQUM1QixVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9