import _ from 'lodash';
import { log, metric, MetricLoggerUnit } from '../../util';
export class CachingV4PoolProvider {
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
                metric.putMetric('V4_INMEMORY_CACHING_POOL_HIT_IN_MEMORY', 1, MetricLoggerUnit.None);
                poolIdToPool[poolId] = cachedPool;
                continue;
            }
            metric.putMetric('V4_INMEMORY_CACHING_POOL_MISS_NOT_IN_MEMORY', 1, MetricLoggerUnit.None);
            poolsToGetCurrencyPairs.push([
                currency0,
                currency1,
                feeAmount,
                tickSpacing,
                hooks,
            ]);
            poolsToGetIds.push(poolId);
        }
        log.info({
            poolsFound: _.map(Object.values(poolIdToPool), (p) => `${p.token0.symbol} ${p.token1.symbol} ${p.fee}`),
            poolsToGetTokenPairs: _.map(poolsToGetCurrencyPairs, (t) => `${t[0].symbol} ${t[1].symbol} ${t[2]}`),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy1wb29sLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92NC9jYWNoaW5nLXBvb2wtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBSzNELE1BQU0sT0FBTyxxQkFBcUI7SUFVaEM7Ozs7O09BS0c7SUFDSCxZQUNZLE9BQWdCLEVBQ2hCLFlBQTZCLEVBQy9CLEtBQW1CO1FBRmpCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsaUJBQVksR0FBWixZQUFZLENBQWlCO1FBQy9CLFVBQUssR0FBTCxLQUFLLENBQWM7UUFsQnJCLGFBQVEsR0FBRyxDQUNqQixPQUFnQixFQUNoQixPQUFlLEVBQ2YsV0FBb0IsRUFDcEIsRUFBRSxDQUNGLFdBQVc7WUFDVCxDQUFDLENBQUMsUUFBUSxPQUFPLElBQUksT0FBTyxJQUFJLFdBQVcsRUFBRTtZQUM3QyxDQUFDLENBQUMsUUFBUSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7SUFZaEMsQ0FBQztJQUVHLEtBQUssQ0FBQyxRQUFRLENBQ25CLGFBQTZELEVBQzdELGNBQStCO1FBRS9CLE1BQU0sU0FBUyxHQUFnQixJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ2pELE1BQU0sdUJBQXVCLEdBRXpCLEVBQUUsQ0FBQztRQUNQLE1BQU0sYUFBYSxHQUFhLEVBQUUsQ0FBQztRQUNuQyxNQUFNLFlBQVksR0FBK0IsRUFBRSxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsV0FBVyxDQUFBLENBQUM7UUFFdEQsS0FBSyxNQUFNLENBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsV0FBVyxF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