import { Protocol } from '@uniswap/router-sdk';
import { ChainId } from '@uniswap/sdk-core';
import { SubgraphProvider } from '../subgraph-provider';
const SUBGRAPH_URL_BY_CHAIN = {
    [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
    // todo: add once subgraph is live
    [ChainId.OPTIMISM_SEPOLIA]: '',
    [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
    // todo: add once subgraph is live
    [ChainId.ARBITRUM_SEPOLIA]: '',
    [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    [ChainId.CELO]: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo',
    [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-gorli',
    [ChainId.BNB]: 'https://api.thegraph.com/subgraphs/name/ilyamk/uniswap-v3---bnb-chain',
    [ChainId.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/lynnshaoyu/uniswap-v3-avax',
    [ChainId.BASE]: 'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/version/latest',
    [ChainId.BLAST]: 'https://gateway-arbitrum.network.thegraph.com/api/0ae45f0bf40ae2e73119b44ccd755967/subgraphs/id/2LHovKznvo8YmKC9ZprPjsYAZDCc4K5q4AYz8s3cnQn1',
};
export class V3SubgraphProvider extends SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 30000, rollback = true, trackedEthThreshold = 0.01, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrlOverride) {
        super(Protocol.V3, chainId, retries, timeout, rollback, trackedEthThreshold, untrackedUsdThreshold, subgraphUrlOverride !== null && subgraphUrlOverride !== void 0 ? subgraphUrlOverride : SUBGRAPH_URL_BY_CHAIN[chainId]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YzL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsT0FBTyxFQUFTLE1BQU0sbUJBQW1CLENBQUM7QUFHbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFpQ3hELE1BQU0scUJBQXFCLEdBQXNDO0lBQy9ELENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUNmLDREQUE0RDtJQUM5RCxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFDaEIsMkVBQTJFO0lBQzdFLGtDQUFrQztJQUNsQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUU7SUFDOUIsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQ3BCLG9FQUFvRTtJQUN0RSxrQ0FBa0M7SUFDbEMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFO0lBQzlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUNmLHNFQUFzRTtJQUN4RSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFDWixpRUFBaUU7SUFDbkUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ2Qsb0VBQW9FO0lBQ3RFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUNYLHVFQUF1RTtJQUN6RSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFDakIsb0VBQW9FO0lBQ3RFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUNaLDRFQUE0RTtJQUM5RSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFDYiw4SUFBOEk7Q0FDakosQ0FBQztBQWdCRixNQUFNLE9BQU8sa0JBQ1gsU0FBUSxnQkFBbUQ7SUFHM0QsWUFDRSxPQUFnQixFQUNoQixPQUFPLEdBQUcsQ0FBQyxFQUNYLE9BQU8sR0FBRyxLQUFLLEVBQ2YsUUFBUSxHQUFHLElBQUksRUFDZixtQkFBbUIsR0FBRyxJQUFJLEVBQzFCLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQ3hDLG1CQUE0QjtRQUU1QixLQUFLLENBQ0gsUUFBUSxDQUFDLEVBQUUsRUFDWCxPQUFPLEVBQ1AsT0FBTyxFQUNQLE9BQU8sRUFDUCxRQUFRLEVBQ1IsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQixtQkFBbUIsYUFBbkIsbUJBQW1CLGNBQW5CLG1CQUFtQixHQUFJLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUN0RCxDQUFDO0lBQ0osQ0FBQztJQUVrQixhQUFhLENBQUMsV0FBb0I7UUFDbkQsT0FBTzs7OztVQUlELFdBQVcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUI1RCxDQUFDO0lBQ0gsQ0FBQztJQUVrQixlQUFlLENBQ2hDLE9BQTBCO1FBRTFCLE9BQU87WUFDTCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDZCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1lBQzVCLE1BQU0sRUFBRTtnQkFDTixFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ3RCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLEVBQUUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDdEI7WUFDRCxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztZQUMvQyxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztTQUNoRCxDQUFDO0lBQ0osQ0FBQztDQUNGIn0=