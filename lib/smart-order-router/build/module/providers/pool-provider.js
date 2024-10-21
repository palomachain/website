import _ from 'lodash';
import { log, poolToString } from '../util';
export class PoolProvider {
    /**
     * Creates an instance of V4PoolProvider.
     * @param chainId The chain id to use.
     * @param multicall2Provider The multicall provider to use to get the pools.
     * @param retryOptions The retry options for each call to the multicall.
     */
    constructor(chainId, multicall2Provider, retryOptions = {
        retries: 2,
        minTimeout: 50,
        maxTimeout: 500,
    }) {
        this.chainId = chainId;
        this.multicall2Provider = multicall2Provider;
        this.retryOptions = retryOptions;
    }
    async getPoolsInternal(poolConstructs, providerConfig) {
        const poolIdentifierSet = new Set();
        const sortedCurrencyPairs = [];
        const sortedPoolIdentifiers = [];
        for (const poolConstruct of poolConstructs) {
            const { poolIdentifier: poolIdentifier, currency0, currency1, } = this.getPoolIdentifier(poolConstruct);
            if (poolIdentifierSet.has(poolIdentifier)) {
                continue;
            }
            // It's the easiest way to change the pool construct in place, since we don't know the entire pool construct at compiling time.
            poolConstruct[0] = currency0;
            poolConstruct[1] = currency1;
            poolIdentifierSet.add(poolIdentifier);
            sortedCurrencyPairs.push(poolConstruct);
            sortedPoolIdentifiers.push(poolIdentifier);
        }
        log.debug(`getPools called with ${poolConstructs.length} token pairs. Deduped down to ${poolIdentifierSet.size}`);
        const [slot0Results, liquidityResults] = await Promise.all([
            this.getPoolsData(sortedPoolIdentifiers, this.getSlot0FunctionName(), providerConfig),
            this.getPoolsData(sortedPoolIdentifiers, this.getLiquidityFunctionName(), providerConfig),
        ]);
        log.info(`Got liquidity and slot0s for ${poolIdentifierSet.size} pools ${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? `as of block: ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}.`
            : ``}`);
        const poolIdentifierToPool = {};
        const invalidPools = [];
        for (let i = 0; i < sortedPoolIdentifiers.length; i++) {
            const slot0Result = slot0Results[i];
            const liquidityResult = liquidityResults[i];
            // These properties tell us if a pool is valid and initialized or not.
            if (!(slot0Result === null || slot0Result === void 0 ? void 0 : slot0Result.success) ||
                !(liquidityResult === null || liquidityResult === void 0 ? void 0 : liquidityResult.success) ||
                slot0Result.result.sqrtPriceX96.eq(0)) {
                invalidPools.push(sortedCurrencyPairs[i]);
                continue;
            }
            const slot0 = slot0Result.result;
            const liquidity = liquidityResult.result[0];
            const pool = this.instantiatePool(sortedCurrencyPairs[i], slot0, liquidity);
            const poolIdentifier = sortedPoolIdentifiers[i];
            poolIdentifierToPool[poolIdentifier] = pool;
        }
        const poolStrs = _.map(Object.values(poolIdentifierToPool), poolToString);
        log.debug({ poolStrs }, `Found ${poolStrs.length} valid pools`);
        return this.instantiatePoolAccessor(poolIdentifierToPool);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcG9vbC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxPQUFPLENBQUMsTUFBTSxRQUFRLENBQUM7QUFFdkIsT0FBTyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFtQjVDLE1BQU0sT0FBZ0IsWUFBWTtJQU9oQzs7Ozs7T0FLRztJQUNILFlBQ1ksT0FBZ0IsRUFDaEIsa0JBQXNDLEVBQ3RDLGVBQTZCO1FBQ3JDLE9BQU8sRUFBRSxDQUFDO1FBQ1YsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsR0FBRztLQUNoQjtRQU5TLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxpQkFBWSxHQUFaLFlBQVksQ0FJckI7SUFDQSxDQUFDO0lBRU0sS0FBSyxDQUFDLGdCQUFnQixDQUM5QixjQUFnQyxFQUNoQyxjQUErQjtRQUUvQixNQUFNLGlCQUFpQixHQUFnQixJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ3pELE1BQU0sbUJBQW1CLEdBQTBCLEVBQUUsQ0FBQztRQUN0RCxNQUFNLHFCQUFxQixHQUFhLEVBQUUsQ0FBQztRQUUzQyxLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtZQUMxQyxNQUFNLEVBQ0osY0FBYyxFQUFFLGNBQWMsRUFDOUIsU0FBUyxFQUNULFNBQVMsR0FDVixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUUxQyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDekMsU0FBUzthQUNWO1lBRUQsK0hBQStIO1lBQy9ILGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDN0IsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMs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