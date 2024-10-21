"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickBasedHeuristicGasModelFactory = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const sdk_core_1 = require("@uniswap/sdk-core");
const util_1 = require("../../../util");
const gas_factory_helpers_1 = require("../../../util/gas-factory-helpers");
const gas_costs_1 = require("./gas-costs");
const gas_model_1 = require("./gas-model");
class TickBasedHeuristicGasModelFactory extends gas_model_1.IOnChainGasModelFactory {
    constructor(provider) {
        super();
        this.provider = provider;
    }
    async buildGasModelInternal({ chainId, gasPriceWei, pools, amountToken, quoteToken, l2GasDataProvider, providerConfig, }) {
        const l2GasData = l2GasDataProvider
            ? await l2GasDataProvider.getGasData(providerConfig)
            : undefined;
        const usdPool = pools.usdPool;
        const calculateL1GasFees = async (route) => {
            return await (0, gas_factory_helpers_1.calculateL1GasFeesHelper)(route, chainId, usdPool, quoteToken, pools.nativeAndQuoteTokenV3Pool, this.provider, l2GasData, providerConfig);
        };
        const nativeCurrency = util_1.WRAPPED_NATIVE_CURRENCY[chainId];
        let nativeAmountPool = null;
        if (!amountToken.equals(nativeCurrency)) {
            nativeAmountPool = pools.nativeAndAmountTokenV3Pool;
        }
        const usdToken = usdPool.token0.equals(nativeCurrency)
            ? usdPool.token1
            : usdPool.token0;
        const estimateGasCost = (routeWithValidQuote) => {
            var _a;
            const { totalGasCostNativeCurrency, baseGasUse } = this.estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig);
            /** ------ MARK: USD logic  -------- */
            // We only need to go through V2 and V3 USD pools for now,
            // because v4 pools don't have deep liquidity yet.
            // If one day, we see v3 usd pools have much deeper liquidity than v2/v3 usd pools, then we will add v4 pools for gas cost
            const gasCostInTermsOfUSD = (0, gas_model_1.getQuoteThroughNativePool)(chainId, totalGasCostNativeCurrency, usdPool);
            /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
            const nativeAndSpecifiedGasTokenPool = pools.nativeAndSpecifiedGasTokenV3Pool;
            let gasCostInTermsOfGasToken = undefined;
            // we don't want to fetch the gasToken pool if the gasToken is the native currency
            if (nativeAndSpecifiedGasTokenPool) {
                // We only need to go through V2 and V3 USD pools for now,
                // because v4 pools don't have deep liquidity yet.
                // If one day, we see v3 usd pools have much deeper liquidity than v2/v3 usd pools, then we will add v4 pools for gas cost
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
            // Since the quote token is not in the native currency, we convert the gas cost to be in terms of the quote token.
            // We do this by getting the highest liquidity <quoteToken>/<nativeCurrency> pool. eg. <quoteToken>/ETH pool.
            const nativeAndQuoteTokenPool = pools.nativeAndQuoteTokenV3Pool;
            let gasCostInTermsOfQuoteToken = null;
            if (nativeAndQuoteTokenPool) {
                // We only need to go through V2 and V3 USD pools for now,
                // because v4 pools don't have deep liquidity yet.
                // If one day, we see v3 usd pools have much deeper liquidity than v2/v3 usd pools, then we will add v4 pools for gas cost
                gasCostInTermsOfQuoteToken = (0, gas_model_1.getQuoteThroughNativePool)(chainId, totalGasCostNativeCurrency, nativeAndQuoteTokenPool);
            }
            // We may have a nativeAmountPool, but not a nativePool
            else {
                util_1.log.info(`Unable to find ${nativeCurrency.symbol} pool with the quote token, ${quoteToken.symbol} to produce gas adjusted costs. Using amountToken to calculate gas costs.`);
            }
            /** ------ MARK: (V3 and V4 ONLY) Logic for calculating synthetic gas cost in terms of amount token -------- */
            // TODO: evaluate effectiveness and potentially refactor
            // Highest liquidity pool for the non quote token / ETH
            // A pool with the non quote token / ETH should not be required and errors should be handled separately
            if (nativeAmountPool) {
                // get current execution price (amountToken / quoteToken)
                const executionPrice = new sdk_core_1.Price(routeWithValidQuote.amount.currency, routeWithValidQuote.quote.currency, routeWithValidQuote.amount.quotient, routeWithValidQuote.quote.quotient);
                const inputIsToken0 = nativeAmountPool.token0.address == nativeCurrency.address;
                // ratio of input / native
                const nativeAndAmountTokenPrice = inputIsToken0
                    ? nativeAmountPool.token0Price
                    : nativeAmountPool.token1Price;
                const gasCostInTermsOfAmountToken = nativeAndAmountTokenPrice.quote(totalGasCostNativeCurrency);
                // Convert gasCostInTermsOfAmountToken to quote token using execution price
                let syntheticGasCostInTermsOfQuoteToken;
                try {
                    syntheticGasCostInTermsOfQuoteToken = executionPrice.quote(gasCostInTermsOfAmountToken);
                }
                catch (err) {
                    if (err instanceof RangeError &&
                        err.message.includes('Division by zero')) {
                        // If the quote fails (division by zero), set syntheticGasCostInTermsOfQuoteToken to null
                        syntheticGasCostInTermsOfQuoteToken = null;
                    }
                    else {
                        // any other error, throw
                        throw err;
                    }
                }
                // Note that the syntheticGasCost being lessThan the original quoted value is not always strictly better
                // e.g. the scenario where the amountToken/ETH pool is very illiquid as well and returns an extremely small number
                // however, it is better to have the gasEstimation be almost 0 than almost infinity, as the user will still receive a quote
                if (syntheticGasCostInTermsOfQuoteToken !== null &&
                    (gasCostInTermsOfQuoteToken === null ||
                        syntheticGasCostInTermsOfQuoteToken.lessThan(gasCostInTermsOfQuoteToken.asFraction))) {
                    util_1.log.info({
                        nativeAndAmountTokenPrice: nativeAndAmountTokenPrice.toSignificant(6),
                        gasCostInTermsOfQuoteToken: gasCostInTermsOfQuoteToken
                            ? gasCostInTermsOfQuoteToken.toExact()
                            : 0,
                        gasCostInTermsOfAmountToken: gasCostInTermsOfAmountToken.toExact(),
                        executionPrice: executionPrice.toSignificant(6),
                        syntheticGasCostInTermsOfQuoteToken: syntheticGasCostInTermsOfQuoteToken === null || syntheticGasCostInTermsOfQuoteToken === void 0 ? void 0 : syntheticGasCostInTermsOfQuoteToken.toSignificant(6),
                    }, 'New gasCostInTermsOfQuoteToken calculated with synthetic quote token price is less than original');
                    gasCostInTermsOfQuoteToken = syntheticGasCostInTermsOfQuoteToken;
                }
            }
            // If gasCostInTermsOfQuoteToken is null, both attempts to calculate gasCostInTermsOfQuoteToken failed (nativePool and amountNativePool)
            if (gasCostInTermsOfQuoteToken === null) {
                util_1.log.info(`Unable to find ${nativeCurrency.symbol} pool with the quote token, ${quoteToken.symbol}, or amount Token, ${amountToken.symbol} to produce gas adjusted costs. Route will not account for gas.`);
                return {
                    gasEstimate: baseGasUse,
                    gasCostInToken: util_1.CurrencyAmount.fromRawAmount(quoteToken, 0),
                    gasCostInUSD: util_1.CurrencyAmount.fromRawAmount(usdToken, 0),
                };
            }
            return {
                gasEstimate: baseGasUse,
                gasCostInToken: gasCostInTermsOfQuoteToken,
                gasCostInUSD: gasCostInTermsOfUSD,
                gasCostInGasToken: gasCostInTermsOfGasToken,
            };
        };
        return {
            estimateGasCost: estimateGasCost.bind(this),
            calculateL1GasFees,
        };
    }
    estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig) {
        var _a;
        const totalInitializedTicksCrossed = this.totalInitializedTicksCrossed(routeWithValidQuote.initializedTicksCrossedList);
        const totalHops = bignumber_1.BigNumber.from(routeWithValidQuote.route.pools.length);
        let hopsGasUse = (0, gas_costs_1.COST_PER_HOP)(chainId).mul(totalHops);
        // We have observed that this algorithm tends to underestimate single hop swaps.
        // We add a buffer in the case of a single hop swap.
        if (totalHops.eq(1)) {
            hopsGasUse = hopsGasUse.add((0, gas_costs_1.SINGLE_HOP_OVERHEAD)(chainId));
        }
        // Some tokens have extremely expensive transferFrom functions, which causes
        // us to underestimate them by a large amount. For known tokens, we apply an
        // adjustment.
        const tokenOverhead = (0, gas_costs_1.TOKEN_OVERHEAD)(chainId, routeWithValidQuote.route);
        const tickGasUse = (0, gas_costs_1.COST_PER_INIT_TICK)(chainId).mul(totalInitializedTicksCrossed);
        const uninitializedTickGasUse = gas_costs_1.COST_PER_UNINIT_TICK.mul(0);
        /*
        // Eventually we can just use the quoter gas estimate for the base gas use
        // It will be more accurate than doing the offchain gas estimate like below
        // It will become more critical when we are going to support v4 hookful routing,
        // where we have no idea how much gas the hook(s) will cost.
        // const baseGasUse = routeWithValidQuote.quoterGasEstimate
        */
        // base estimate gas used based on chainId estimates for hops and ticks gas useage
        const baseGasUse = (0, gas_costs_1.BASE_SWAP_COST)(chainId)
            .add(hopsGasUse)
            .add(tokenOverhead)
            .add(tickGasUse)
            .add(uninitializedTickGasUse)
            .add((_a = providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.additionalGasOverhead) !== null && _a !== void 0 ? _a : bignumber_1.BigNumber.from(0));
        const baseGasCostWei = gasPriceWei.mul(baseGasUse);
        const wrappedCurrency = util_1.WRAPPED_NATIVE_CURRENCY[chainId];
        const totalGasCostNativeCurrency = util_1.CurrencyAmount.fromRawAmount(wrappedCurrency, baseGasCostWei.toString());
        return {
            totalGasCostNativeCurrency,
            totalInitializedTicksCrossed,
            baseGasUse,
        };
    }
}
exports.TickBasedHeuristicGasModelFactory = TickBasedHeuristicGasModelFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay1iYXNlZC1oZXVyaXN0aWMtZ2FzLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvdGljay1iYXNlZC1oZXVyaXN0aWMtZ2FzLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUFxRDtBQUVyRCxnREFBbUQ7QUFFbkQsd0NBQTZFO0FBQzdFLDJFQUE2RTtBQUU3RSwyQ0FPcUI7QUFDckIsMkNBTXFCO0FBRXJCLE1BQXNCLGlDQUVwQixTQUFRLG1DQUE2QztJQUdyRCxZQUFzQixRQUFzQjtRQUMxQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFUyxLQUFLLENBQUMscUJBQXFCLENBQUMsRUFDcEMsT0FBTyxFQUNQLFdBQVcsRUFDWCxLQUFLLEVBQ0wsV0FBVyxFQUNYLFVBQVUsRUFDVixpQkFBaUIsRUFDakIsY0FBYyxHQUNrQjtRQUdoQyxNQUFNLFNBQVMsR0FBRyxpQkFBaUI7WUFDakMsQ0FBQyxDQUFDLE1BQU0saUJBQWlCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztZQUNwRCxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRWQsTUFBTSxPQUFPLEdBQVMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUVwQyxNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFDOUIsS0FBNkIsRUFNNUIsRUFBRTtZQUNILE9BQU8sTUFBTSxJQUFBLDhDQUF3QixFQUNuQyxLQUFLLEVBQ0wsT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEVBQ1YsS0FBSyxDQUFDLHlCQUF5QixFQUMvQixJQUFJLENBQUMsUUFBUSxFQUNiLFNBQVMsRUFDVCxjQUFjLENBQ2YsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLE1BQU0sY0FBYyxHQUFHLDhCQUF1QixDQUFDLE9BQU8sQ0FBRSxDQUFDO1FBQ3pELElBQUksZ0JBQWdCLEdBQWdCLElBQUksQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN2QyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsMEJBQTBCLENBQUM7U0FDckQ7UUFFRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7WUFDcEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRW5CLE1BQU0sZUFBZSxHQUFHLENBQ3RCLG1CQUF5QyxFQU16QyxFQUFFOztZQUNGLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUNqRSxtQkFBbUIsRUFDbkIsV0FBVyxFQUNYLE9BQU8sRUFDUCxjQUFjLENBQ2YsQ0FBQztZQUVGLHVDQUF1QztZQUN2QywwREFBMEQ7WUFDMUQsa0RBQWtEO1lBQ2xELDBIQUEwSDtZQUMxSCxNQUFNLG1CQUFtQixHQUFHLElBQUEscUNBQXlCLEVBQ25ELE9BQU8sRUFDUCwwQkFBMEIsRUFDMUIsT0FBTyxDQUNSLENBQUM7WUFFRiw0RUFBNEU7WUFDNUUsTUFBTSw4QkFBOEIsR0FDbEMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDO1lBQ3pDLElBQUksd0JBQXdCLEdBQStCLFNBQVMsQ0FBQztZQUNyRSxrRkFBa0Y7WUFDbEYsSUFBSSw4QkFBOEIsRUFBRTtnQkFDbEMsMERBQTBEO2dCQUMxRCxrREFBa0Q7Z0JBQ2xELDBIQUEwSDtnQkFDMUgsd0JBQXdCLEdBQUcsSUFBQSxxQ0FBeUIsRUFDbEQsT0FBTyxFQUNQLDBCQUEwQixFQUMxQiw4QkFBOEIsQ0FDL0IsQ0FBQzthQUNIO1lBQ0QseUZBQXlGO2lCQUNwRixJQUFJLE1BQUEsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLFFBQVEsMENBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUN6RCx3QkFBd0IsR0FBRywwQkFBMEIsQ0FBQzthQUN2RDtZQUVELGlGQUFpRjtZQUNqRixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU87b0JBQ0wsV0FBVyxFQUFFLFVBQVU7b0JBQ3ZCLGNBQWMsRUFBRSwwQkFBMEI7b0JBQzFDLFlBQVksRUFBRSxtQkFBbUI7b0JBQ2pDLGlCQUFpQixFQUFFLHdCQUF3QjtpQkFDNUMsQ0FBQzthQUNIO1lBRUQsbUVBQW1FO1lBRW5FLGtIQUFrSDtZQUNsSCw2R0FBNkc7WUFDN0csTUFBTSx1QkFBdUIsR0FDM0IsS0FBSyxDQUFDLHlCQUF5QixDQUFDO1lBRWxDLElBQUksMEJBQTBCLEdBQTBCLElBQUksQ0FBQztZQUM3RCxJQUFJLHVCQUF1QixFQUFFO2dCQUMzQiwwREFBMEQ7Z0JBQzFELGtEQUFrRDtnQkFDbEQsMEhBQTBIO2dCQUMxSCwwQkFBMEIsR0FBRyxJQUFBLHFDQUF5QixFQUNwRCxPQUFPLEVBQ1AsMEJBQTBCLEVBQzFCLHVCQUF1QixDQUN4QixDQUFDO2FBQ0g7WUFDRCx1REFBdUQ7aUJBQ2xEO2dCQUNILFVBQUcsQ0FBQyxJQUFJLENBQ04sa0JBQWtCLGNBQWMsQ0FBQyxNQUFNLCtCQUErQixVQUFVLENBQUMsTUFBTSwyRUFBMkUsQ0FDbkssQ0FBQzthQUNIO1lBRUQsK0dBQStHO1lBQy9HLHdEQUF3RDtZQUV4RCx1REFBdUQ7WUFDdkQsdUdBQXVHO1lBQ3ZHLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ3BCLHlEQUF5RDtnQkFDekQsTUFBTSxjQUFjLEdBQUcsSUFBSSxnQkFBSyxDQUM5QixtQkFBbUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUNuQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUNsQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUNuQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUNuQyxDQUFDO2dCQUVGLE1BQU0sYUFBYSxHQUNqQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUM7Z0JBQzVELDBCQUEwQjtnQkFDMUIsTUFBTSx5QkFBeUIsR0FBRyxhQUFhO29CQUM3QyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsV0FBVztvQkFDOUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQztnQkFFakMsTUFBTSwyQkFBMkIsR0FBRyx5QkFBeUIsQ0FBQyxLQUFLLENBQ2pFLDBCQUEwQixDQUNULENBQUM7Z0JBRXBCLDJFQUEyRTtnQkFDM0UsSUFBSSxtQ0FBMEQsQ0FBQztnQkFDL0QsSUFBSTtvQkFDRixtQ0FBbUMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUN4RCwyQkFBMkIsQ0FDNUIsQ0FBQztpQkFDSDtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixJQUNFLEdBQUcsWUFBWSxVQUFVO3dCQUN6QixHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUN4Qzt3QkFDQSx5RkFBeUY7d0JBQ3pGLG1DQUFtQyxHQUFHLElBQUksQ0FBQztxQkFDNUM7eUJBQU07d0JBQ0wseUJBQXlCO3dCQUN6QixNQUFNLEdBQUcsQ0FBQztxQkFDWDtpQkFDRjtnQkFFRCx3R0FBd0c7Z0JBQ3hHLGtIQUFrSDtnQkFDbEgsMkhBQTJIO2dCQUMzSCxJQUNFLG1DQUFtQyxLQUFLLElBQUk7b0JBQzVDLENBQUMsMEJBQTBCLEtBQUssSUFBSTt3QkFDbEMsbUNBQW1DLENBQUMsUUFBUSxDQUMxQywwQkFBMEIsQ0FBQyxVQUFVLENBQ3RDLENBQUMsRUFDSjtvQkFDQSxVQUFHLENBQUMsSUFBSSxDQUNOO3dCQUNFLHlCQUF5QixFQUN2Qix5QkFBeUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO3dCQUM1QywwQkFBMEIsRUFBRSwwQkFBMEI7NEJBQ3BELENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLEVBQUU7NEJBQ3RDLENBQUMsQ0FBQyxDQUFDO3dCQUNMLDJCQUEyQixFQUN6QiwyQkFBMkIsQ0FBQyxPQUFPLEVBQUU7d0JBQ3ZDLGNBQWMsRUFBRSxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsbUNBQW1DLEVBQ2pDLG1DQUFtQyxhQUFuQyxtQ0FBbUMsdUJBQW5DLG1DQUFtQyxDQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7cUJBQ3hELEVBQ0Qsa0dBQWtHLENBQ25HLENBQUM7b0JBRUYsMEJBQTBCLEdBQUcsbUNBQW1DLENBQUM7aUJBQ2xFO2FBQ0Y7WUFFRCx3SUFBd0k7WUFDeEksSUFBSSwwQkFBMEIsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZDLFVBQUcsQ0FBQyxJQUFJLENBQ04sa0JBQWtCLGNBQWMsQ0FBQyxNQUFNLCtCQUErQixVQUFVLENBQUMsTUFBTSxzQkFBc0IsV0FBVyxDQUFDLE1BQU0saUVBQWlFLENBQ2pNLENBQUM7Z0JBQ0YsT0FBTztvQkFDTCxXQUFXLEVBQUUsVUFBVTtvQkFDdkIsY0FBYyxFQUFFLHFCQUFjLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7b0JBQzNELFlBQVksRUFBRSxxQkFBYyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RCxDQUFDO2FBQ0g7WUFFRCxPQUFPO2dCQUNMLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixjQUFjLEVBQUUsMEJBQTBCO2dCQUMxQyxZQUFZLEVBQUUsbUJBQW9CO2dCQUNsQyxpQkFBaUIsRUFBRSx3QkFBd0I7YUFDNUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLE9BQU87WUFDTCxlQUFlLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDM0Msa0JBQWtCO1NBQ25CLENBQUM7SUFDSixDQUFDO0lBRVMsV0FBVyxDQUNuQixtQkFBeUMsRUFDekMsV0FBc0IsRUFDdEIsT0FBZ0IsRUFDaEIsY0FBdUM7O1FBRXZDLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUNwRSxtQkFBbUIsQ0FBQywyQkFBMkIsQ0FDaEQsQ0FBQztRQUNGLE1BQU0sU0FBUyxHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFekUsSUFBSSxVQUFVLEdBQUcsSUFBQSx3QkFBWSxFQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV0RCxnRkFBZ0Y7UUFDaEYsb0RBQW9EO1FBQ3BELElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuQixVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFBLCtCQUFtQixFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDM0Q7UUFFRCw0RUFBNEU7UUFDNUUsNEVBQTRFO1FBQzVFLGNBQWM7UUFDZCxNQUFNLGFBQWEsR0FBRyxJQUFBLDBCQUFjLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpFLE1BQU0sVUFBVSxHQUFHLElBQUEsOEJBQWtCLEVBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUNoRCw0QkFBNEIsQ0FDN0IsQ0FBQztRQUNGLE1BQU0sdUJBQXVCLEdBQUcsZ0NBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVEOzs7Ozs7VUFNRTtRQUVGLGtGQUFrRjtRQUNsRixNQUFNLFVBQVUsR0FBRyxJQUFBLDBCQUFjLEVBQUMsT0FBTyxDQUFDO2FBQ3ZDLEdBQUcsQ0FBQyxVQUFVLENBQUM7YUFDZixHQUFHLENBQUMsYUFBYSxDQUFDO2FBQ2xCLEdBQUcsQ0FBQyxVQUFVLENBQUM7YUFDZixHQUFHLENBQUMsdUJBQXVCLENBQUM7YUFDNUIsR0FBRyxDQUFDLE1BQUEsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLHFCQUFxQixtQ0FBSSxxQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFbkQsTUFBTSxlQUFlLEdBQUcsOEJBQXVCLENBQUMsT0FBTyxDQUFFLENBQUM7UUFFMUQsTUFBTSwwQkFBMEIsR0FBRyxxQkFBYyxDQUFDLGFBQWEsQ0FDN0QsZUFBZSxFQUNmLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FDMUIsQ0FBQztRQUVGLE9BQU87WUFDTCwwQkFBMEI7WUFDMUIsNEJBQTRCO1lBQzVCLFVBQVU7U0FDWCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBelNELDhFQXlTQyJ9