"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingV4SubgraphProvider = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const caching_subgraph_provider_1 = require("../caching-subgraph-provider");
/**
 * Provider for getting V4 pools, with functionality for caching the results.
 *
 * @export
 * @class CachingV4SubgraphProvider
 */
class CachingV4SubgraphProvider extends caching_subgraph_provider_1.CachingSubgraphProvider {
    /**
     * Creates an instance of CachingV3SubgraphProvider.
     * @param chainId The chain id to use.
     * @param subgraphProvider The provider to use to get the subgraph pools when not in the cache.
     * @param cache Cache instance to hold cached pools.
     */
    constructor(chainId, subgraphProvider, cache) {
        super(chainId, subgraphProvider, cache, router_sdk_1.Protocol.V4);
    }
}
exports.CachingV4SubgraphProvider = CachingV4SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy1zdWJncmFwaC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjQvY2FjaGluZy1zdWJncmFwaC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBK0M7QUFHL0MsNEVBQXVFO0FBR3ZFOzs7OztHQUtHO0FBQ0gsTUFBYSx5QkFDWCxTQUFRLG1EQUF1QztJQUcvQzs7Ozs7T0FLRztJQUNILFlBQ0UsT0FBZ0IsRUFDaEIsZ0JBQXFDLEVBQ3JDLEtBQStCO1FBRS9CLEtBQUssQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLHFCQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNGO0FBakJELDhEQWlCQyJ9