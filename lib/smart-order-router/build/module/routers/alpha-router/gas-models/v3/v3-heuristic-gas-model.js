import { TickBasedHeuristicGasModelFactory } from '../tick-based-heuristic-gas-model';
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
export class V3HeuristicGasModelFactory extends TickBasedHeuristicGasModelFactory {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjMtaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL3YzL3YzLWhldXJpc3RpYy1nYXMtbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFdEY7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxPQUFPLDBCQUEyQixTQUFRLGlDQUF3RDtJQUN0RyxZQUFZLFFBQXNCO1FBQ2hDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRWUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUNsQyxPQUFPLEVBQ1AsV0FBVyxFQUNYLEtBQUssRUFDTCxXQUFXLEVBQ1gsVUFBVSxFQUNWLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsY0FBYyxHQUNrQjtRQUdoQyxPQUFPLE1BQU0sS0FBSyxDQUFDLHFCQUFxQixDQUFDO1lBQ3ZDLE9BQU87WUFDUCxXQUFXO1lBQ1gsS0FBSztZQUNMLFdBQVc7WUFDWCxVQUFVO1lBQ1YsY0FBYztZQUNkLGlCQUFpQjtZQUNqQixjQUFjO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIn0=