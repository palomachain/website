"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V4SubgraphProviderWithFallBacks = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const subgraph_provider_with_fallback_1 = require("../subgraph-provider-with-fallback");
class V4SubgraphProviderWithFallBacks extends subgraph_provider_with_fallback_1.SubgraphProviderWithFallBacks {
    constructor(fallbacks) {
        super(fallbacks, router_sdk_1.Protocol.V4);
    }
}
exports.V4SubgraphProviderWithFallBacks = V4SubgraphProviderWithFallBacks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjQvc3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBK0M7QUFDL0Msd0ZBQW1GO0FBR25GLE1BQWEsK0JBQ1gsU0FBUSwrREFBNkM7SUFHckQsWUFBWSxTQUFnQztRQUMxQyxLQUFLLENBQUMsU0FBUyxFQUFFLHFCQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBUEQsMEVBT0MifQ==