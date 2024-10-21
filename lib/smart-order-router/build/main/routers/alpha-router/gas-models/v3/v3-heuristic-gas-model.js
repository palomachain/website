"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V3HeuristicGasModelFactory = void 0;
const tick_based_heuristic_gas_model_1 = require("../tick-based-heuristic-gas-model");
/**
 * Computes a gas estimate for a V3 swap using heuristics.
 * Considers number of hops in the route, number of ticks crossed
 * and the typical base cost for a swap.
 *
 * We get the number of ticks crossed in a swap from the QuoterV2
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
 * @class V3HeuristicGasModelFactory
 */
class V3HeuristicGasModelFactory extends tick_based_heuristic_gas_model_1.TickBasedHeuristicGasModelFactory {
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
}
exports.V3HeuristicGasModelFactory = V3HeuristicGasModelFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjMtaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL3YzL3YzLWhldXJpc3RpYy1nYXMtbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsc0ZBQXNGO0FBRXRGOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILE1BQWEsMEJBQTJCLFNBQVEsa0VBQXdEO0lBQ3RHLFlBQVksUUFBc0I7UUFDaEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFZSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQ2xDLE9BQU8sRUFDUCxXQUFXLEVBQ1gsS0FBSyxFQUNMLFdBQVcsRUFDWCxVQUFVLEVBQ1YsY0FBYyxFQUNkLGlCQUFpQixFQUNqQixjQUFjLEdBQ2tCO1FBR2hDLE9BQU8sTUFBTSxLQUFLLENBQUMscUJBQXFCLENBQUM7WUFDdkMsT0FBTztZQUNQLFdBQVc7WUFDWCxLQUFLO1lBQ0wsV0FBVztZQUNYLFVBQVU7WUFDVixjQUFjO1lBQ2QsaUJBQWlCO1lBQ2pCLGNBQWM7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE1QkQsZ0VBNEJDIn0=