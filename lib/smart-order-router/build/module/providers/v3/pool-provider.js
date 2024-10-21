import { computePoolAddress, Pool } from '@uniswap/v3-sdk';
import retry from 'async-retry';
import { IUniswapV3PoolState__factory } from '../../types/v3/factories/IUniswapV3PoolState__factory';
import { V3_CORE_FACTORY_ADDRESSES } from '../../util/addresses';
import { log } from '../../util/log';
import { PoolProvider } from '../pool-provider';
export class V3PoolProvider extends PoolProvider {
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
        const { results, blockNumber } = await retry(async () => {
            return this.multicall2Provider.callSameFunctionOnMultipleContracts({
                addresses: poolAddresses,
                contractInterface: IUniswapV3PoolState__factory.createInterface(),
                functionName: functionName,
                providerConfig,
            });
        }, this.retryOptions);
        log.debug(`Pool data fetched as of block ${blockNumber}`);
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
        const poolAddress = computePoolAddress({
            factoryAddress: V3_CORE_FACTORY_ADDRESSES[this.chainId],
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
        return new Pool(token0, token1, feeAmount, slot0.sqrtPriceX96.toString(), liquidity.toString(), slot0.tick);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjMvcG9vbC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsa0JBQWtCLEVBQWEsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEUsT0FBTyxLQUFrQyxNQUFNLGFBQWEsQ0FBQztBQUU3RCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFzQixZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXlEcEUsTUFBTSxPQUFPLGNBQ1gsU0FBUSxZQU1QO0lBT0Q7Ozs7O09BS0c7SUFDSCxZQUNFLE9BQWdCLEVBQ2hCLGtCQUFzQyxFQUN0QyxlQUFtQztRQUNqQyxPQUFPLEVBQUUsQ0FBQztRQUNWLFVBQVUsRUFBRSxFQUFFO1FBQ2QsVUFBVSxFQUFFLEdBQUc7S0FDaEI7UUFFRCxLQUFLLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDO1FBbkJuRCx5RUFBeUU7UUFDekUsa0RBQWtEO1FBQzFDLHVCQUFrQixHQUE4QixFQUFFLENBQUM7SUFrQjNELENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUNuQixVQUE2QixFQUM3QixjQUErQjtRQUUvQixPQUFPLE1BQU0sS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sY0FBYyxDQUNuQixNQUFhLEVBQ2IsTUFBYSxFQUNiLFNBQW9CO1FBRXBCLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUN0RSxNQUFNO1lBQ04sTUFBTTtZQUNOLFNBQVM7U0FDVixDQUFDLENBQUM7UUFDSCxPQUFPO1lBQ0wsV0FBVyxFQUFFLGNBQWM7WUFDM0IsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLFNBQVM7U0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFa0Isd0JBQXdCO1FBQ3pDLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFa0Isb0JBQW9CO1FBQ3JDLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFa0IsS0FBSyxDQUFDLFlBQVksQ0FDbkMsYUFBdUIsRUFDdkIsWUFBb0IsRUFDcEIsY0FBK0I7UUFFL0IsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRTtZQUN0RCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxtQ0FBbUMsQ0FHaEU7Z0JBQ0EsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLGlCQUFpQixFQUFFLDRCQUE0QixDQUFDLGVBQWUsRUFBRTtnQkFDakUsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLGNBQWM7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXRCLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUNBQWlDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFMUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVrQixpQkFBaUIsQ0FBQyxJQUFxQjtRQUt4RCxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFekMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyQixNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBRXBGLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4RCxJQUFJLGFBQWEsRUFBRTtZQUNqQixPQUFPO2dCQUNMLGNBQWMsRUFBRSxhQUFhO2dCQUM3QixTQUFTLEVBQUUsTUFBTTtnQkFDakIsU0FBUyxFQUFFLE1BQU07YUFDbEIsQ0FBQztTQUNIO1FBRUQsTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7WUFDckMsY0FBYyxFQUFFLHlCQUF5QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUU7WUFDeEQsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLEdBQUcsRUFBRSxTQUFTO1lBQ2QsMEJBQTBCLEVBQUUsU0FBUztZQUNyQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsQ0FBQztRQUVoRCxPQUFPO1lBQ0wsY0FBYyxFQUFFLFdBQVc7WUFDM0IsU0FBUyxFQUFFLE1BQU07WUFDakIsU0FBUyxFQUFFLE1BQU07U0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFUyxlQUFlLENBQ3ZCLElBQXFCLEVBQ3JCLEtBQWUsRUFDZixTQUF1QjtRQUV2QixNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFekMsT0FBTyxJQUFJLElBQUksQ0FDYixNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUM3QixTQUFTLENBQUMsUUFBUSxFQUFFLEVBQ3BCLEtBQUssQ0FBQyxJQUFJLENBQ1gsQ0FBQztJQUNKLENBQUM7SUFFUyx1QkFBdUIsQ0FBQyxvQkFFakM7UUFDQyxPQUFPO1lBQ0wsT0FBTyxFQUFFLENBQ1AsTUFBYSxFQUNiLE1BQWEsRUFDYixTQUFvQixFQUNGLEVBQUU7Z0JBQ3BCLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZFLE9BQU8sb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELGdCQUFnQixFQUFFLENBQUMsT0FBZSxFQUFvQixFQUFFLENBQ3RELG9CQUFvQixDQUFDLE9BQU8sQ0FBQztZQUMvQixXQUFXLEVBQUUsR0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztTQUMvRCxDQUFDO0lBQ0osQ0FBQztDQUNGIn0=