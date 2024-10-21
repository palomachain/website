"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticV4SubgraphProvider = void 0;
const v4_sdk_1 = require("@uniswap/v4-sdk");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../../util");
const caching_subgraph_provider_1 = require("../caching-subgraph-provider");
const jsbi_1 = __importDefault(require("jsbi"));
class StaticV4SubgraphProvider {
    constructor(chainId, poolProvider, v4PoolParams = (0, util_1.getApplicableV4FeesTickspacingsHooks)(chainId)) {
        this.chainId = chainId;
        this.poolProvider = poolProvider;
        this.v4PoolParams = v4PoolParams;
    }
    async getPools(currencyIn, currencyOut, providerConfig) {
        util_1.log.info('In static subgraph provider for V4');
        const bases = caching_subgraph_provider_1.BASES_TO_CHECK_TRADES_AGAINST[this.chainId];
        const basePairs = lodash_1.default.flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]));
        if (currencyIn && currencyOut) {
            basePairs.push([currencyIn, currencyOut], ...bases.map((base) => [currencyIn, base]), ...bases.map((base) => [currencyOut, base]));
        }
        const pairs = (0, lodash_1.default)(basePairs)
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
        util_1.log.info(`V4 Static subgraph provider about to get ${pairs.length} pools on-chain`);
        const poolAccessor = await this.poolProvider.getPools(pairs, providerConfig);
        const pools = poolAccessor.getAllPools();
        const poolAddressSet = new Set();
        const subgraphPools = (0, lodash_1.default)(pools)
            .map((pool) => {
            const { token0, token1, fee, tickSpacing, hooks, liquidity } = pool;
            const poolAddress = v4_sdk_1.Pool.getPoolId(token0, token1, fee, tickSpacing, hooks);
            if (poolAddressSet.has(poolAddress)) {
                return undefined;
            }
            poolAddressSet.add(poolAddress);
            const liquidityNumber = jsbi_1.default.toNumber(liquidity);
            return {
                id: poolAddress,
                feeTier: fee.toString(),
                tickSpacing: tickSpacing.toString(),
                hooks: hooks,
                liquidity: liquidity.toString(),
                token0: {
                    id: (0, util_1.getAddress)(token0),
                },
                token1: {
                    id: (0, util_1.getAddress)(token1),
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
exports.StaticV4SubgraphProvider = StaticV4SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92NC9zdGF0aWMtc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsNENBQXVDO0FBQ3ZDLG9EQUF1QjtBQUV2QixxQ0FJb0I7QUFDcEIsNEVBQTZFO0FBRTdFLGdEQUF3QjtBQUt4QixNQUFhLHdCQUF3QjtJQUNuQyxZQUNVLE9BQWdCLEVBQ2hCLFlBQTZCLEVBQzdCLGVBRUosSUFBQSwyQ0FBb0MsRUFBQyxPQUFPLENBQUM7UUFKekMsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFDN0IsaUJBQVksR0FBWixZQUFZLENBRTZCO0lBQ2hELENBQUM7SUFFRyxLQUFLLENBQUMsUUFBUSxDQUNuQixVQUFxQixFQUNyQixXQUFzQixFQUN0QixjQUErQjtRQUUvQixVQUFHLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxLQUFLLEdBQUcseURBQTZCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFELE1BQU0sU0FBUyxHQUEyQixnQkFBQyxDQUFDLE9BQU8sQ0FDakQsS0FBSyxFQUNMLENBQUMsSUFBSSxFQUEwQixFQUFFLENBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQzlDLENBQUM7UUFFRixJQUFJLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDN0IsU0FBUyxDQUFDLElBQUksQ0FDWixDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFDekIsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUF3QixFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMs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