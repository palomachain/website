"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V4SubgraphProvider = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const subgraph_provider_1 = require("../subgraph-provider");
const SUBGRAPH_URL_BY_CHAIN = {
    [sdk_core_1.ChainId.SEPOLIA]: '',
};
class V4SubgraphProvider extends subgraph_provider_1.SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 30000, rollback = true, trackedEthThreshold = 0.01, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrlOverride) {
        super(router_sdk_1.Protocol.V4, chainId, retries, timeout, rollback, trackedEthThreshold, untrackedUsdThreshold, subgraphUrlOverride !== null && subgraphUrlOverride !== void 0 ? subgraphUrlOverride : SUBGRAPH_URL_BY_CHAIN[chainId]);
    }
    subgraphQuery(blockNumber) {
        return `
    query getPools($pageSize: Int!, $id: String) {
      pools(
        first: $pageSize
        ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
          where: { id_gt: $id }
        ) {
          id
          token0 {
            symbol
            id
          }
          token1 {
            symbol
            id
          }
          feeTier
          tickSpacing
          hooks
          liquidity
          totalValueLockedUSD
          totalValueLockedETH
          totalValueLockedUSDUntracked
        }
      }
   `;
    }
    mapSubgraphPool(rawPool) {
        return {
            id: rawPool.id,
            feeTier: rawPool.feeTier,
            tickSpacing: rawPool.tickSpacing,
            hooks: rawPool.hooks,
            liquidity: rawPool.liquidity,
            token0: {
                id: rawPool.token0.id,
            },
            token1: {
                id: rawPool.token1.id,
            },
            tvlETH: parseFloat(rawPool.totalValueLockedETH),
            tvlUSD: parseFloat(rawPool.totalValueLockedUSD),
        };
    }
}
exports.V4SubgraphProvider = V4SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Y0L3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9EQUErQztBQUMvQyxnREFBc0Q7QUFHdEQsNERBQXdEO0FBcUN4RCxNQUFNLHFCQUFxQixHQUFzQztJQUMvRCxDQUFDLGtCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRTtDQUN0QixDQUFDO0FBZ0JGLE1BQWEsa0JBQ1gsU0FBUSxvQ0FBbUQ7SUFHM0QsWUFDRSxPQUFnQixFQUNoQixPQUFPLEdBQUcsQ0FBQyxFQUNYLE9BQU8sR0FBRyxLQUFLLEVBQ2YsUUFBUSxHQUFHLElBQUksRUFDZixtQkFBbUIsR0FBRyxJQUFJLEVBQzFCLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQ3hDLG1CQUE0QjtRQUU1QixLQUFLLENBQ0gscUJBQVEsQ0FBQyxFQUFFLEVBQ1gsT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1AsUUFBUSxFQUNSLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsbUJBQW1CLGFBQW5CLG1CQUFtQixjQUFuQixtQkFBbUIsR0FBSSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FDdEQsQ0FBQztJQUNKLENBQUM7SUFFa0IsYUFBYSxDQUFDLFdBQW9CO1FBQ25ELE9BQU87Ozs7VUFJRCxXQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUI1RCxDQUFDO0lBQ0gsQ0FBQztJQUVrQixlQUFlLENBQ2hDLE9BQTBCO1FBRTFCLE9BQU87WUFDTCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDZCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQ2hDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDNUIsTUFBTSxFQUFFO2dCQUNOLEVBQUUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDdEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTthQUN0QjtZQUNELE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO1lBQy9DLE1BQU0sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO1NBQ2hELENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF6RUQsZ0RBeUVDIn0=