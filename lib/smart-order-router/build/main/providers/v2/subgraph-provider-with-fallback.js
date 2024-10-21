"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2SubgraphProviderWithFallBacks = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const subgraph_provider_with_fallback_1 = require("../subgraph-provider-with-fallback");
/**
 * Provider for getting V2 subgraph pools that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class V2SubgraphProviderWithFallBacks
 */
class V2SubgraphProviderWithFallBacks extends subgraph_provider_with_fallback_1.SubgraphProviderWithFallBacks {
    /**
     * Creates an instance of V2SubgraphProviderWithFallBacks.
     * @param fallbacks Ordered list of `IV2SubgraphProvider` to try to get pools from.
     */
    constructor(fallbacks) {
        super(fallbacks, router_sdk_1.Protocol.V2);
    }
}
exports.V2SubgraphProviderWithFallBacks = V2SubgraphProviderWithFallBacks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjIvc3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBK0M7QUFDL0Msd0ZBQW1GO0FBR25GOzs7Ozs7R0FNRztBQUNILE1BQWEsK0JBQ1gsU0FBUSwrREFBNkM7SUFHckQ7OztPQUdHO0lBQ0gsWUFBWSxTQUFnQztRQUMxQyxLQUFLLENBQUMsU0FBUyxFQUFFLHFCQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBWEQsMEVBV0MifQ==