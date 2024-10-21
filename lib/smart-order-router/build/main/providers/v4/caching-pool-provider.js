"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingV4PoolProvider = void 0;
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../../util");
class CachingV4PoolProvider {
    /**
     * Creates an instance of CachingV4PoolProvider.
     * @param chainId The chain id to use.
     * @param poolProvider The provider to use to get the pools when not in the cache.
     * @param cache Cache instance to hold cached pools.
     */
    constructor(chainId, poolProvider, cache) {
        this.chainId = chainId;
        this.poolProvider = poolProvider;
        this.cache = cache;
        this.POOL_KEY = (chainId, address, blockNumber) => blockNumber
            ? `pool-${chainId}-${address}-${blockNumber}`
            : `pool-${chainId}-${address}`;
    }
    async getPools(currencyPairs, providerConfig) {
        const poolIdSet = new Set();
        const poolsToGetCurrencyPairs = [];
        const poolsToGetIds = [];
        const poolIdToPool = {};
        const blockNumber = await (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber);
        for (const [currencyA, currencyB, feeAmount, tickSpacing, hooks,] of currencyPairs) {
            const { poolId, currency0, currency1 } = this.getPoolId(currencyA, currencyB, feeAmount, tickSpacing, hooks);
            if (poolIdSet.has(poolId)) {
                continue;
            }
            poolIdSet.add(poolId);
            const cachedPool = await this.cache.get(this.POOL_KEY(this.chainId, poolId, blockNumber));
            if (cachedPool) {
                util_1.metric.putMetric('V4_INMEMORY_CACHING_POOL_HIT_IN_MEMORY', 1, util_1.MetricLoggerUnit.None);
                poolIdToPool[poolId] = cachedPool;
                continue;
            }
            util_1.metric.putMetric('V4_INMEMORY_CACHING_POOL_MISS_NOT_IN_MEMORY', 1, util_1.MetricLoggerUnit.None);
            poolsToGetCurrencyPairs.push([
                currency0,
                currency1,
                feeAmount,
                tickSpacing,
                hooks,
            ]);
            poolsToGetIds.push(poolId);
        }
        util_1.log.info({
            poolsFound: lodash_1.default.map(Object.values(poolIdToPool), (p) => `${p.token0.symbol} ${p.token1.symbol} ${p.fee}`),
            poolsToGetTokenPairs: lodash_1.default.map(poolsToGetCurrencyPairs, (t) => `${t[0].symbol} ${t[1].symbol} ${t[2]}`),
        }, `Found ${Object.keys(poolIdToPool).length} V4 pools already in local cache. About to get liquidity and slot0s for ${poolsToGetCurrencyPairs.length} pools.`);
        if (poolsToGetCurrencyPairs.length > 0) {
            const poolAccessor = await this.poolProvider.getPools(poolsToGetCurrencyPairs, providerConfig);
            for (const address of poolsToGetIds) {
                const pool = poolAccessor.getPoolById(address);
                if (pool) {
                    poolIdToPool[address] = pool;
                    // We don't want to wait for this caching to complete before returning the pools.
                    this.cache.set(this.POOL_KEY(this.chainId, address, blockNumber), pool);
                }
            }
        }
        return {
            getPool: (currencyA, currencyB, fee, tickSpacing, hooks) => {
                const { poolId } = this.poolProvider.getPoolId(currencyA, currencyB, fee, tickSpacing, hooks);
                return poolIdToPool[poolId];
            },
            getPoolById: (poolId) => poolIdToPool[poolId],
            getAllPools: () => Object.values(poolIdToPool),
        };
    }
    getPoolId(currencyA, currencyB, fee, tickSpacing, hooks) {
        return this.poolProvider.getPoolId(currencyA, currencyB, fee, tickSpacing, hooks);
    }
}
exports.CachingV4PoolProvider = CachingV4PoolProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy1wb29sLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92NC9jYWNoaW5nLXBvb2wtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsb0RBQXVCO0FBQ3ZCLHFDQUEyRDtBQUszRCxNQUFhLHFCQUFxQjtJQVVoQzs7Ozs7T0FLRztJQUNILFlBQ1ksT0FBZ0IsRUFDaEIsWUFBNkIsRUFDL0IsS0FBbUI7UUFGakIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFDL0IsVUFBSyxHQUFMLEtBQUssQ0FBYztRQWxCckIsYUFBUSxHQUFHLENBQ2pCLE9BQWdCLEVBQ2hCLE9BQWUsRUFDZixXQUFvQixFQUNwQixFQUFFLENBQ0YsV0FBVztZQUNULENBQUMsQ0FBQyxRQUFRLE9BQU8sSUFBSSxPQUFPLElBQUksV0FBVyxFQUFFO1lBQzdDLENBQUMsQ0FBQyxRQUFRLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztJQVloQyxDQUFDO0lBRUcsS0FBSyxDQUFDLFFBQVEsQ0FDbkIsYUFBNkQsRUFDN0QsY0FBK0I7UUFFL0IsTUFBTSxTQUFTLEdBQWdCLElBQUksR0FBRyxFQUFVLENBQUM7UUFDakQsTUFBTSx1QkFBdUIsR0FFekIsRUFBRSxDQUFDO1FBQ1AsTUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFDO1FBQ25DLE1BQU0sWUFBWSxHQUErQixFQUFFLENBQUM7UUFDcEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFBLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxXQUFXLENBQUEsQ0FBQztRQUV0RCxLQUFLLE1BQU0sQ0FDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxXQUFXLEVBQ1gsS0FBSyxFQUNOLElBQUksYUFBYSxFQUFFO1lBQ2xCLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQ3JELFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFdBQVcsRUFDWCxLQUFLLENBQ04sQ0FBQztZQUVGLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDekIsU0FBUzthQUNWO1lBRUQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV0QixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUNqRCxDQUFDO1lBQ0YsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsYUFBTSxDQUFDLFNBQVMsQ0FDZCx3Q0FBd0MsRUFDeEMsQ0FBQyxFQUNELHVCQUFnQixDQUFDLElBQUksQ0FDdEIsQ0FBQztnQkFDRixZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUNsQyxTQUFTO2FBQ1Y7WUFFRCxhQUFNLENBQUMsU0FBUyxDQUNkLDZDQUE2QyxFQUM3QyxDQUFDLEVBQ0QsdUJBQWdCLENBQUMsSUFBSSxDQUN0QixDQUFDO1lBQ0YsdUJBQXVCLENBQUMsSUFBSSxDQUFDO2dCQUMzQixTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxXQUFXO2dCQUNYLEtBQUs7YUFDTixDQUFDLENBQUM7WUFDSCxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO1FBRUQsVUFBRyxDQUFDLElBQUksQ0FDTjtZQUNFLFVBQVUsRUFBRSxnQkFBQyxDQUFDLEdBQUcsQ0FDZixNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUMzQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQ3hEO1lBQ0Qsb0JBQW9CLEVBQUUsZ0JBQUMsQ0FBQyxHQUFHLENBQ3pCLHVCQUF1QixFQUN2QixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQy9DO1NBQ0YsRUFDRCxTQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFDNUIsMkVBQ0UsdUJBQXVCLENBQUMsTUFDMUIsU0FBUyxDQUNWLENBQUM7UUFFRixJQUFJLHVCQUF1QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FDbkQsdUJBQXVCLEVBQ3ZCLGNBQWMsQ0FDZixDQUFDO1lBQ0YsS0FBSyxNQUFNLE9BQU8sSUFBSSxhQUFhLEVBQUU7Z0JBQ25DLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9DLElBQUksSUFBSSxFQUFFO29CQUNSLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQzdCLGlGQUFpRjtvQkFDakYsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFDakQsSUFBSSxDQUNMLENBQUM7aUJBQ0g7YUFDRjtTQUNGO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxDQUNQLFNBQW1CLEVBQ25CLFNBQW1CLEVBQ25CLEdBQVcsRUFDWCxXQUFtQixFQUNuQixLQUFhLEVBQ2IsRUFBRTtnQkFDRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQzVDLFNBQVMsRUFDVCxTQUFTLEVBQ1QsR0FBRyxFQUNILFdBQVcsRUFDWCxLQUFLLENBQ04sQ0FBQztnQkFDRixPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQ0QsV0FBVyxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3JELFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztTQUMvQyxDQUFDO0lBQ0osQ0FBQztJQUVNLFNBQVMsQ0FDZCxTQUFtQixFQUNuQixTQUFtQixFQUNuQixHQUFXLEVBQ1gsV0FBbUIsRUFDbkIsS0FBYTtRQUViLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ2hDLFNBQVMsRUFDVCxTQUFTLEVBQ1QsR0FBRyxFQUNILFdBQVcsRUFDWCxLQUFLLENBQ04sQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTVKRCxzREE0SkMifQ==