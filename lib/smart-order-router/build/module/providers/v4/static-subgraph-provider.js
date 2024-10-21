import { Pool } from '@uniswap/v4-sdk';
import _ from 'lodash';
import { getAddress, getApplicableV4FeesTickspacingsHooks, log, } from '../../util';
import { BASES_TO_CHECK_TRADES_AGAINST } from '../caching-subgraph-provider';
import JSBI from 'jsbi';
export class StaticV4SubgraphProvider {
    constructor(chainId, poolProvider, v4PoolParams = getApplicableV4FeesTickspacingsHooks(chainId)) {
        this.chainId = chainId;
        this.poolProvider = poolProvider;
        this.v4PoolParams = v4PoolParams;
    }
    async getPools(currencyIn, currencyOut, providerConfig) {
        log.info('In static subgraph provider for V4');
        const bases = BASES_TO_CHECK_TRADES_AGAINST[this.chainId];
        const basePairs = _.flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]));
        if (currencyIn && currencyOut) {
            basePairs.push([currencyIn, currencyOut], ...bases.map((base) => [currencyIn, base]), ...bases.map((base) => [currencyOut, base]));
        }
        const pairs = _(basePairs)
            .filter((tokens) => Boolean(tokens[0] && tokens[1]))
            .filter(([tokenA, tokenB]) => tokenA.wrapped.address !== tokenB.wrapped.address &&
            !tokenA.equals(tokenB))
            .flatMap(([tokenA, tokenB]) => {
            const tokensWithPoolParams = this.v4PoolParams.map(([feeAmount, tickSpacing, hooks]) => {
                return [tokenA, tokenB, feeAmount, tickSpacing, hooks];
            });
            return tokensWithPoolParams;
        })
            .value();
        log.info(`V4 Static subgraph provider about to get ${pairs.length} pools on-chain`);
        const poolAccessor = await this.poolProvider.getPools(pairs, providerConfig);
        const pools = poolAccessor.getAllPools();
        const poolAddressSet = new Set();
        const subgraphPools = _(pools)
            .map((pool) => {
            const { token0, token1, fee, tickSpacing, hooks, liquidity } = pool;
            const poolAddress = Pool.getPoolId(token0, token1, fee, tickSpacing, hooks);
            if (poolAddressSet.has(poolAddress)) {
                return undefined;
            }
            poolAddressSet.add(poolAddress);
            const liquidityNumber = JSBI.toNumber(liquidity);
            return {
                id: poolAddress,
                feeTier: fee.toString(),
                tickSpacing: tickSpacing.toString(),
                hooks: hooks,
                liquidity: liquidity.toString(),
                token0: {
                    id: getAddress(token0),
                },
                token1: {
                    id: getAddress(token1),
                },
                // As a very rough proxy we just use liquidity for TVL.
                tvlETH: liquidityNumber,
                tvlUSD: liquidityNumber,
            };
        })
            .compact()
            .value();
        return subgraphPools;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92NC9zdGF0aWMtc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUV2QixPQUFPLEVBQ0wsVUFBVSxFQUNWLG9DQUFvQyxFQUNwQyxHQUFHLEdBQ0osTUFBTSxZQUFZLENBQUM7QUFDcEIsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFN0UsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBS3hCLE1BQU0sT0FBTyx3QkFBd0I7SUFDbkMsWUFDVSxPQUFnQixFQUNoQixZQUE2QixFQUM3QixlQUVKLG9DQUFvQyxDQUFDLE9BQU8sQ0FBQztRQUp6QyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGlCQUFZLEdBQVosWUFBWSxDQUFpQjtRQUM3QixpQkFBWSxHQUFaLFlBQVksQ0FFNkI7SUFDaEQsQ0FBQztJQUVHLEtBQUssQ0FBQyxRQUFRLENBQ25CLFVBQXFCLEVBQ3JCLFdBQXNCLEVBQ3RCLGNBQStCO1FBRS9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUMvQyxNQUFNLEtBQUssR0FBRyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUQsTUFBTSxTQUFTLEdBQTJCLENBQUMsQ0FBQyxPQUFPLENBQ2pELEtBQUssRUFDTCxDQUFDLElBQUksRUFBMEIsRUFBRSxDQUMvQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUM5QyxDQUFDO1FBRUYsSUFBSSxVQUFVLElBQUksV0FBVyxF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