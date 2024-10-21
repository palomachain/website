import { BigNumber } from '@ethersproject/bignumber';
import { CurrencyAmount, WRAPPED_NATIVE_CURRENCY } from '../../../../util';
import { TickBasedHeuristicGasModelFactory } from '../tick-based-heuristic-gas-model';
export class V4HeuristicGasModelFactory extends TickBasedHeuristicGasModelFactory {
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
            .add((_a = providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.additionalGasOverhead) !== null && _a !== void 0 ? _a : BigNumber.from(0));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjQtaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL3Y0L3Y0LWhldXJpc3RpYy1nYXMtbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXJELE9BQU8sRUFBRSxjQUFjLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQVEzRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUl0RixNQUFNLE9BQU8sMEJBQ1gsU0FBUSxpQ0FBd0Q7SUFHaEUsWUFBWSxRQUFzQjtRQUNoQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFDekIsT0FBTyxFQUNQLFdBQVcsRUFDWCxLQUFLLEVBQ0wsV0FBVyxFQUNYLFVBQVUsRUFDVixjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLGNBQWMsR0FDa0I7UUFHaEMsT0FBTyxNQUFNLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztZQUN2QyxPQUFPO1lBQ1AsV0FBVztZQUNYLEtBQUs7WUFDTCxXQUFXO1lBQ1gsVUFBVTtZQUNWLGNBQWM7WUFDZCxpQkFBaUI7WUFDakIsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFa0IsV0FBVyxDQUM1QixtQkFBMEMsRUFDMUMsV0FBc0IsRUFDdEIsT0FBZ0IsRUFDaEIsY0FBdUM7O1FBRXZDLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUNwRSxtQkFBbUIsQ0FBQywyQkFBMkIsQ0FDaEQsQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLGlCQUFpQjtZQUN0RCxtSEFBbUg7YUFDbEgsR0FBRyxDQUFDLE1BQUEsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLHFCQUFxQixtQ0FBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkUsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVuRCxNQUFNLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUUxRCxNQUFNLDBCQUEwQixHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQzdELGVBQWUsRUFDZixjQUFjLENBQUMsUUFBUSxFQUFFLENBQzFCLENBQUM7UUFFRixPQUFPO1lBQ0wsMEJBQTBCO1lBQzFCLDRCQUE0QjtZQUM1QixVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9