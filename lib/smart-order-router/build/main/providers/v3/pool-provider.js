"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V3PoolProvider = void 0;
const v3_sdk_1 = require("@uniswap/v3-sdk");
const async_retry_1 = __importDefault(require("async-retry"));
const IUniswapV3PoolState__factory_1 = require("../../types/v3/factories/IUniswapV3PoolState__factory");
const addresses_1 = require("../../util/addresses");
const log_1 = require("../../util/log");
const pool_provider_1 = require("../pool-provider");
class V3PoolProvider extends pool_provider_1.PoolProvider {
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
        // Computing pool addresses is slow as it requires hashing, encoding etc.
        // Addresses never change so can always be cached.
        this.POOL_ADDRESS_CACHE = {};
    }
    async getPools(tokenPairs, providerConfig) {
        return await super.getPoolsInternal(tokenPairs, providerConfig);
    }
    getPoolAddress(tokenA, tokenB, feeAmount) {
        const { poolIdentifier, currency0, currency1 } = this.getPoolIdentifier([
            tokenA,
            tokenB,
            feeAmount,
        ]);
        return {
            poolAddress: poolIdentifier,
            token0: currency0,
            token1: currency1,
        };
    }
    getLiquidityFunctionName() {
        return 'liquidity';
    }
    getSlot0FunctionName() {
        return 'slot0';
    }
    async getPoolsData(poolAddresses, functionName, providerConfig) {
        const { results, blockNumber } = await (0, async_retry_1.default)(async () => {
            return this.multicall2Provider.callSameFunctionOnMultipleContracts({
                addresses: poolAddresses,
                contractInterface: IUniswapV3PoolState__factory_1.IUniswapV3PoolState__factory.createInterface(),
                functionName: functionName,
                providerConfig,
            });
        }, this.retryOptions);
        log_1.log.debug(`Pool data fetched as of block ${blockNumber}`);
        return results;
    }
    getPoolIdentifier(pool) {
        const [tokenA, tokenB, feeAmount] = pool;
        const [token0, token1] = tokenA.sortsBefore(tokenB)
            ? [tokenA, tokenB]
            : [tokenB, tokenA];
        const cacheKey = `${this.chainId}/${token0.address}/${token1.address}/${feeAmount}`;
        const cachedAddress = this.POOL_ADDRESS_CACHE[cacheKey];
        if (cachedAddress) {
            return {
                poolIdentifier: cachedAddress,
                currency0: token0,
                currency1: token1,
            };
        }
        const poolAddress = (0, v3_sdk_1.computePoolAddress)({
            factoryAddress: addresses_1.V3_CORE_FACTORY_ADDRESSES[this.chainId],
            tokenA: token0,
            tokenB: token1,
            fee: feeAmount,
            initCodeHashManualOverride: undefined,
            chainId: this.chainId,
        });
        this.POOL_ADDRESS_CACHE[cacheKey] = poolAddress;
        return {
            poolIdentifier: poolAddress,
            currency0: token0,
            currency1: token1,
        };
    }
    instantiatePool(pool, slot0, liquidity) {
        const [token0, token1, feeAmount] = pool;
        return new v3_sdk_1.Pool(token0, token1, feeAmount, slot0.sqrtPriceX96.toString(), liquidity.toString(), slot0.tick);
    }
    instantiatePoolAccessor(poolIdentifierToPool) {
        return {
            getPool: (tokenA, tokenB, feeAmount) => {
                const { poolAddress } = this.getPoolAddress(tokenA, tokenB, feeAmount);
                return poolIdentifierToPool[poolAddress];
            },
            getPoolByAddress: (address) => poolIdentifierToPool[address],
            getAllPools: () => Object.values(poolIdentifierToPool),
        };
    }
}
exports.V3PoolProvider = V3PoolProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjMvcG9vbC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSw0Q0FBc0U7QUFDdEUsOERBQTZEO0FBRTdELHdHQUFxRztBQUNyRyxvREFBaUU7QUFDakUsd0NBQXFDO0FBRXJDLG9EQUFvRTtBQXlEcEUsTUFBYSxjQUNYLFNBQVEsNEJBTVA7SUFPRDs7Ozs7T0FLRztJQUNILFlBQ0UsT0FBZ0IsRUFDaEIsa0JBQXNDLEVBQ3RDLGVBQW1DO1FBQ2pDLE9BQU8sRUFBRSxDQUFDO1FBQ1YsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsR0FBRztLQUNoQjtRQUVELEtBQUssQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFuQm5ELHlFQUF5RTtRQUN6RSxrREFBa0Q7UUFDMUMsdUJBQWtCLEdBQThCLEVBQUUsQ0FBQztJQWtCM0QsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQ25CLFVBQTZCLEVBQzdCLGNBQStCO1FBRS9CLE9BQU8sTUFBTSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTSxjQUFjLENBQ25CLE1BQWEsRUFDYixNQUFhLEVBQ2IsU0FBb0I7UUFFcEIsTUFBTSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ3RFLE1BQU07WUFDTixNQUFNO1lBQ04sU0FBUztTQUNWLENBQUMsQ0FBQztRQUNILE9BQU87WUFDTCxXQUFXLEVBQUUsY0FBYztZQUMzQixNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsU0FBUztTQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVrQix3QkFBd0I7UUFDekMsT0FBTyxXQUFXLENBQUM7SUFD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