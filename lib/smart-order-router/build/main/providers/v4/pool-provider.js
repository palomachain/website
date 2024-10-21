"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V4PoolProvider = exports.sortsBefore = void 0;
const v4_sdk_1 = require("@uniswap/v4-sdk");
const async_retry_1 = __importDefault(require("async-retry"));
const util_1 = require("../../util");
const StateView__factory_1 = require("../../types/other/factories/StateView__factory");
const pool_provider_1 = require("../pool-provider");
// TODO: export sortsBefore from v4-sdk https://github.com/Uniswap/sdks/tree/main/sdks/v4-sdk/src/utils to avoid duplication
function sortsBefore(currencyA, currencyB) {
    if (currencyA.isNative)
        return true;
    if (currencyB.isNative)
        return false;
    return currencyA.wrapped.sortsBefore(currencyB.wrapped);
}
exports.sortsBefore = sortsBefore;
class V4PoolProvider extends pool_provider_1.PoolProvider {
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
        super(chainId, multicall2Provider, retryOptions);
        // Computing pool id is slow as it requires hashing, encoding etc.
        // Addresses never change so can always be cached.
        this.POOL_ID_CACHE = {};
    }
    async getPools(currencyPairs, providerConfig) {
        return await super.getPoolsInternal(currencyPairs, providerConfig);
    }
    getPoolId(currencyA, currencyB, fee, tickSpacing, hooks) {
        const { poolIdentifier, currency0, currency1 } = this.getPoolIdentifier([
            currencyA,
            currencyB,
            fee,
            tickSpacing,
            hooks,
        ]);
        return { poolId: poolIdentifier, currency0, currency1 };
    }
    getLiquidityFunctionName() {
        return 'getLiquidity';
    }
    getSlot0FunctionName() {
        return 'getSlot0';
    }
    async getPoolsData(poolIds, functionName, providerConfig) {
        const { results, blockNumber } = await (0, async_retry_1.default)(async () => {
            // NOTE: V4 pools are a singleton living under PoolsManager.
            // We have to retrieve the pool data from the state view contract.
            // To begin with, we will be consistent with how v4 subgraph retrieves the pool state - via state view.
            return this.multicall2Provider.callSameFunctionOnContractWithMultipleParams({
                address: util_1.STATE_VIEW_ADDRESSES[this.chainId],
                contractInterface: StateView__factory_1.StateView__factory.createInterface(),
                functionName: functionName,
                functionParams: poolIds.map((poolId) => [poolId]),
                providerConfig,
            });
        }, this.retryOptions);
        util_1.log.debug(`Pool data fetched as of block ${blockNumber}`);
        return results;
    }
    getPoolIdentifier(pool) {
        const [currencyA, currencyB, fee, tickSpacing, hooks] = pool;
        const [currency0, currency1] = sortsBefore(currencyA, currencyB)
            ? [currencyA, currencyB]
            : [currencyB, currencyA];
        const currency0Addr = (0, util_1.getAddress)(currency0);
        const currency1Addr = (0, util_1.getAddress)(currency1);
        const cacheKey = `${this.chainId}/${currency0Addr}/${currency1Addr}/${fee}/${tickSpacing}/${hooks}`;
        const cachedId = this.POOL_ID_CACHE[cacheKey];
        if (cachedId) {
            return { poolIdentifier: cachedId, currency0, currency1 };
        }
        const poolId = v4_sdk_1.Pool.getPoolId(currency0, currency1, fee, tickSpacing, hooks);
        this.POOL_ID_CACHE[cacheKey] = poolId;
        return { poolIdentifier: poolId, currency0, currency1 };
    }
    instantiatePool(pool, slot0, liquidity) {
        const [currency0, currency1, fee, tickSpacing, hooks] = pool;
        return new v4_sdk_1.Pool(currency0, currency1, fee, tickSpacing, hooks, slot0.sqrtPriceX96.toString(), liquidity.toString(), slot0.tick);
    }
    instantiatePoolAccessor(poolIdentifierToPool) {
        return {
            getPool: (currencyA, currencyB, fee, tickSpacing, hooks) => {
                const { poolIdentifier } = this.getPoolIdentifier([
                    currencyA,
                    currencyB,
                    fee,
                    tickSpacing,
                    hooks,
                ]);
                return poolIdentifierToPool[poolIdentifier];
            },
            getPoolById: (poolId) => poolIdentifierToPool[poolId],
            getAllPools: () => Object.values(poolIdentifierToPool),
        };
    }
}
exports.V4PoolProvider = V4PoolProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjQvcG9vbC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw0Q0FBdUM7QUFDdkMsOERBQTZEO0FBQzdELHFDQUFtRTtBQUluRSx1RkFBb0Y7QUFDcEYsb0RBQW9FO0FBd0NwRSw0SEFBNEg7QUFDNUgsU0FBZ0IsV0FBVyxDQUFDLFNBQW1CLEVBQUUsU0FBbUI7SUFDbEUsSUFBSSxTQUFTLENBQUMsUUFBUTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ3BDLElBQUksU0FBUyxDQUFDLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNyQyxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBSkQsa0NBSUM7QUFFRCxNQUFhLGNBQ1gsU0FBUSw0QkFNUDtJQU9EOzs7OztPQUtHO0lBQ0gsWUFDRSxPQUFnQixFQUNoQixrQkFBc0MsRUFDdEMsZUFBbUM7UUFDakMsT0FBTyxFQUFFLENBQUM7UUFDVixVQUFVLEVBQUUsRUFBRTtRQUNkLFVBQVUsRUFBRSxHQUFHO0tBQ2hCO1FBRUQsS0FBSyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztRQW5CbkQsa0VBQWtFO1FBQ2xFLGtEQUFrRDtRQUMxQyxrQkFBYSxHQUE4QixFQUFFLENBQUM7SUFrQnRELENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUNuQixhQUFnQyxFQUNoQyxjQUErQjtRQUUvQixPQUFPLE1BQU0sS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRU0sU0FBUyxDQUNkLFNBQW1CLEVBQ25CLFNBQW1CLEVBQ25CLEdBQVcsRUFDWCxXQUFtQixFQUNuQixLQUFhO1FBRWIsTUFB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