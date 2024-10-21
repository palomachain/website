import { Protocol } from '@uniswap/router-sdk';
import { ChainId } from '@uniswap/sdk-core';
import { SubgraphProvider } from '../subgraph-provider';
const SUBGRAPH_URL_BY_CHAIN = {
    [ChainId.SEPOLIA]: '',
};
export class V4SubgraphProvider extends SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 30000, rollback = true, trackedEthThreshold = 0.01, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrlOverride) {
        super(Protocol.V4, chainId, retries, timeout, rollback, trackedEthThreshold, untrackedUsdThreshold, subgraphUrlOverride !== null && subgraphUrlOverride !== void 0 ? subgraphUrlOverride : SUBGRAPH_URL_BY_CHAIN[chainId]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Y0L3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFHdEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFxQ3hELE1BQU0scUJBQXFCLEdBQXNDO0lBQy9ELENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7Q0FDdEIsQ0FBQztBQWdCRixNQUFNLE9BQU8sa0JBQ1gsU0FBUSxnQkFBbUQ7SUFHM0QsWUFDRSxPQUFnQixFQUNoQixPQUFPLEdBQUcsQ0FBQyxFQUNYLE9BQU8sR0FBRyxLQUFLLEVBQ2YsUUFBUSxHQUFHLElBQUksRUFDZixtQkFBbUIsR0FBRyxJQUFJLEVBQzFCLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQ3hDLG1CQUE0QjtRQUU1QixLQUFLLENBQ0gsUUFBUSxDQUFDLEVBQUUsRUFDWCxPQUFPLEVBQ1AsT0FBTyxFQUNQLE9BQU8sRUFDUCxRQUFRLEVBQ1IsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQixtQkFBbUIsYUFBbkIsbUJBQW1CLGNBQW5CLG1CQUFtQixHQUFJLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUN0RCxDQUFDO0lBQ0osQ0FBQztJQUVrQixhQUFhLENBQUMsV0FBb0I7UUFDbkQsT0FBTzs7OztVQUlELFdBQVcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQjVELENBQUM7SUFDSCxDQUFDO0lBRWtCLGVBQWUsQ0FDaEMsT0FBMEI7UUFFMUIsT0FBTztZQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNkLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDaEMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1lBQ3BCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixNQUFNLEVBQUU7Z0JBQ04sRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTthQUN0QjtZQUNELE1BQU0sRUFBRTtnQkFDTixFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ3RCO1lBQ0QsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7WUFDL0MsTUFBTSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7U0FDaEQsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9