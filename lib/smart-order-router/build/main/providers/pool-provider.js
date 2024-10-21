"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolProvider = void 0;
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../util");
class PoolProvider {
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
        util_1.log.debug(`getPools called with ${poolConstructs.length} token pairs. Deduped down to ${poolIdentifierSet.size}`);
        const [slot0Results, liquidityResults] = await Promise.all([
            this.getPoolsData(sortedPoolIdentifiers, this.getSlot0FunctionName(), providerConfig),
            this.getPoolsData(sortedPoolIdentifiers, this.getLiquidityFunctionName(), providerConfig),
        ]);
        util_1.log.info(`Got liquidity and slot0s for ${poolIdentifierSet.size} pools ${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
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
        const poolStrs = lodash_1.default.map(Object.values(poolIdentifierToPool), util_1.poolToString);
        util_1.log.debug({ poolStrs }, `Found ${poolStrs.length} valid pools`);
        return this.instantiatePoolAccessor(poolIdentifierToPool);
    }
}
exports.PoolProvider = PoolProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcG9vbC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSxvREFBdUI7QUFFdkIsa0NBQTRDO0FBbUI1QyxNQUFzQixZQUFZO0lBT2hDOzs7OztPQUtHO0lBQ0gsWUFDWSxPQUFnQixFQUNoQixrQkFBc0MsRUFDdEMsZUFBNkI7UUFDckMsT0FBTyxFQUFFLENBQUM7UUFDVixVQUFVLEVBQUUsRUFBRTtRQUNkLFVBQVUsRUFBRSxHQUFHO0tBQ2hCO1FBTlMsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGlCQUFZLEdBQVosWUFBWSxDQUlyQjtJQUNBLENBQUM7SUFFTSxLQUFLLENBQUMsZ0JBQWdCLENBQzlCLGNBQWdDLEVBQ2hDLGNBQStCO1FBRS9CLE1BQU0saUJBQWlCLEdBQWdCLElBQUksR0FBRyxFQUFVLENBQUM7UUFDekQsTUFBTSxtQkFBbUIsR0FBMEIsRUFBRSxDQUFDO1FBQ3RELE1BQU0scUJBQXFCLEdBQWEsRUFBRSxDQUFDO1FBRTNDLEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFO1lBQzFDLE1BQU0sRUFDSixjQUFjLEVBQUUsY0FBYyxFQUM5QixTQUFTLEVBQ1QsU0FBUyxHQUNWLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTFDLElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUN6QyxTQUFTO2FBQ1Y7WUFFRCwrSEFBK0g7WUFDL0gsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUM3QixhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQzdCLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0Qyxt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