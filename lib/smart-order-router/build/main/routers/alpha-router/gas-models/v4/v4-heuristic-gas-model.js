"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V4HeuristicGasModelFactory = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const util_1 = require("../../../../util");
const tick_based_heuristic_gas_model_1 = require("../tick-based-heuristic-gas-model");
class V4HeuristicGasModelFactory extends tick_based_heuristic_gas_model_1.TickBasedHeuristicGasModelFactory {
    constructor(provider) {
        super(provider);
    }
    async buildGasModel({ chainId, gasPriceWei, pools, amountToken, quoteToken, v2poolProvider, l2GasDataProvider, providerConfig, }) {
        return await super.buildGasModelInternal({
            chainId,
            gasPriceWei,
            pools,
            amountToken,
            quoteToken,
            v2poolProvider,
            l2GasDataProvider,
            providerConfig,
        });
    }
    estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig) {
        var _a;
        const totalInitializedTicksCrossed = this.totalInitializedTicksCrossed(routeWithValidQuote.initializedTicksCrossedList);
        const baseGasUse = routeWithValidQuote.quoterGasEstimate
            // we still need the gas override for native wrap/unwrap, because quoter doesn't simulate on universal router level
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
exports.V4HeuristicGasModelFactory = V4HeuristicGasModelFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjQtaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL3Y0L3Y0LWhldXJpc3RpYy1nYXMtbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0RBQXFEO0FBRXJELDJDQUEyRTtBQVEzRSxzRkFBc0Y7QUFJdEYsTUFBYSwwQkFDWCxTQUFRLGtFQUF3RDtJQUdoRSxZQUFZLFFBQXNCO1FBQ2hDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixPQUFPLEVBQ1AsV0FBVyxFQUNYLEtBQUssRUFDTCxXQUFXLEVBQ1gsVUFBVSxFQUNWLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsY0FBYyxHQUNrQjtRQUdoQyxPQUFPLE1BQU0sS0FBSyxDQUFDLHFCQUFxQixDQUFDO1lBQ3ZDLE9BQU87WUFDUCxXQUFXO1lBQ1gsS0FBSztZQUNMLFdBQVc7WUFDWCxVQUFVO1lBQ1YsY0FBYztZQUNkLGlCQUFpQjtZQUNqQixjQUFjO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVrQixXQUFXLENBQzVCLG1CQUEwQyxFQUMxQyxXQUFzQixFQUN0QixPQUFnQixFQUNoQixjQUF1Qzs7UUFFdkMsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQ3BFLG1CQUFtQixDQUFDLDJCQUEyQixDQUNoRCxDQUFDO1FBRUYsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsaUJBQWlCO1lBQ3RELG1IQUFtSDthQUNsSCxHQUFHLENBQUMsTUFBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUscUJBQXFCLG1DQUFJLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkUsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVuRCxNQUFNLGVBQWUsR0FBRyw4QkFBdUIsQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUUxRCxNQUFNLDBCQUEwQixHQUFHLHFCQUFjLENBQUMsYUFBYSxDQUM3RCxlQUFlLEVBQ2YsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUMxQixDQUFDO1FBRUYsT0FBTztZQUNMLDBCQUEwQjtZQUMxQiw0QkFBNEI7WUFDNUIsVUFBVTtTQUNYLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUE3REQsZ0VBNkRDIn0=