import { BigNumber } from '@ethersproject/bignumber';
import _ from 'lodash';
import { log, WRAPPED_NATIVE_CURRENCY } from '../../../../util';
import { CurrencyAmount } from '../../../../util/amounts';
import { calculateL1GasFeesHelper, getV2NativePool, } from '../../../../util/gas-factory-helpers';
import { getQuoteThroughNativePool, IV2GasModelFactory, usdGasTokensByChain, } from '../gas-model';
// Constant cost for doing any swap regardless of pools.
export const BASE_SWAP_COST = BigNumber.from(135000); // 115000, bumped up by 20_000 @eric 7/8/2022
// Constant per extra hop in the route.
export const COST_PER_EXTRA_HOP = BigNumber.from(50000); // 20000, bumped up by 30_000 @eric 7/8/2022
/**
 * Computes a gas estimate for a V2 swap using heuristics.
 * Considers number of hops in the route and the typical base cost for a swap.
 *
 * We compute gas estimates off-chain because
 *  1/ Calling eth_estimateGas for a swaps requires the caller to have
 *     the full balance token being swapped, and approvals.
 *  2/ Tracking gas used using a wrapper contract is not accurate with Multicall
 *     due to EIP-2929. We would have to make a request for every swap we wanted to estimate.
 *  3/ For V2 we simulate all our swaps off-chain so have no way to track gas used.
 *
 * Note, certain tokens e.g. rebasing/fee-on-transfer, may incur higher gas costs than
 * what we estimate here. This is because they run extra logic on token transfer.
 *
 * @export
 * @class V2HeuristicGasModelFactory
 */
export class V2HeuristicGasModelFactory extends IV2GasModelFactory {
    constructor(provider) {
        super();
        this.provider = provider;
    }
    async buildGasModel({ chainId, gasPriceWei, poolProvider, token, l2GasDataProvider, providerConfig, }) {
        const l2GasData = l2GasDataProvider
            ? await l2GasDataProvider.getGasData(providerConfig)
            : undefined;
        const usdPoolPromise = this.getHighestLiquidityUSDPool(chainId, poolProvider, providerConfig);
        // Only fetch the native gasToken pool if specified by the config AND the gas token is not the native currency.
        const nativeAndSpecifiedGasTokenPoolPromise = (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.gasToken) &&
            !(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.gasToken.equals(WRAPPED_NATIVE_CURRENCY[chainId]))
            ? this.getEthPool(chainId, providerConfig.gasToken, poolProvider, providerConfig)
            : Promise.resolve(null);
        const [usdPool, nativeAndSpecifiedGasTokenPool] = await Promise.all([
            usdPoolPromise,
            nativeAndSpecifiedGasTokenPoolPromise,
        ]);
        let ethPool = null;
        if (!token.equals(WRAPPED_NATIVE_CURRENCY[chainId])) {
            ethPool = await this.getEthPool(chainId, token, poolProvider, providerConfig);
        }
        const usdToken = usdPool.token0.address == WRAPPED_NATIVE_CURRENCY[chainId].address
            ? usdPool.token1
            : usdPool.token0;
        const calculateL1GasFees = async (route) => {
            const nativePool = !token.equals(WRAPPED_NATIVE_CURRENCY[chainId])
                ? await getV2NativePool(token, poolProvider, providerConfig)
                : null;
            return await calculateL1GasFeesHelper(route, chainId, usdPool, token, nativePool, this.provider, l2GasData);
        };
        return {
            estimateGasCost: (routeWithValidQuote) => {
                var _a;
                const { gasCostInEth, gasUse } = this.estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig);
                /** ------ MARK: USD logic  -------- */
                const gasCostInTermsOfUSD = getQuoteThroughNativePool(chainId, gasCostInEth, usdPool);
                /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
                let gasCostInTermsOfGasToken = undefined;
                if (nativeAndSpecifiedGasTokenPool) {
                    gasCostInTermsOfGasToken = getQuoteThroughNativePool(chainId, gasCostInEth, nativeAndSpecifiedGasTokenPool);
                }
                // if the gasToken is the native currency, we can just use the gasCostInEth
                else if ((_a = providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.gasToken) === null || _a === void 0 ? void 0 : _a.equals(WRAPPED_NATIVE_CURRENCY[chainId])) {
                    gasCostInTermsOfGasToken = gasCostInEth;
                }
                /** ------ MARK: return early if quoteToken is wrapped native currency ------- */
                if (token.equals(WRAPPED_NATIVE_CURRENCY[chainId])) {
                    return {
                        gasEstimate: gasUse,
                        gasCostInToken: gasCostInEth,
                        gasCostInUSD: gasCostInTermsOfUSD,
                        gasCostInGasToken: gasCostInTermsOfGasToken,
                    };
                }
                // If the quote token is not WETH, we convert the gas cost to be in terms of the quote token.
                // We do this by getting the highest liquidity <token>/ETH pool.
                if (!ethPool) {
                    log.info('Unable to find ETH pool with the quote token to produce gas adjusted costs. Route will not account for gas.');
                    return {
                        gasEstimate: gasUse,
                        gasCostInToken: CurrencyAmount.fromRawAmount(token, 0),
                        gasCostInUSD: CurrencyAmount.fromRawAmount(usdToken, 0),
                    };
                }
                const gasCostInTermsOfQuoteToken = getQuoteThroughNativePool(chainId, gasCostInEth, ethPool);
                return {
                    gasEstimate: gasUse,
                    gasCostInToken: gasCostInTermsOfQuoteToken,
                    gasCostInUSD: gasCostInTermsOfUSD,
                    gasCostInGasToken: gasCostInTermsOfGasToken,
                };
            },
            calculateL1GasFees,
        };
    }
    estimateGas(routeWithValidQuote, gasPriceWei, chainId, providerConfig) {
        const hops = routeWithValidQuote.route.pairs.length;
        let gasUse = BASE_SWAP_COST.add(COST_PER_EXTRA_HOP.mul(hops - 1));
        if (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.additionalGasOverhead) {
            gasUse = gasUse.add(providerConfig.additionalGasOverhead);
        }
        const totalGasCostWei = gasPriceWei.mul(gasUse);
        const weth = WRAPPED_NATIVE_CURRENCY[chainId];
        const gasCostInEth = CurrencyAmount.fromRawAmount(weth, totalGasCostWei.toString());
        return { gasCostInEth, gasUse };
    }
    async getEthPool(chainId, token, poolProvider, providerConfig) {
        const weth = WRAPPED_NATIVE_CURRENCY[chainId];
        const poolAccessor = await poolProvider.getPools([[weth, token]], providerConfig);
        const pool = poolAccessor.getPool(weth, token);
        if (!pool || pool.reserve0.equalTo(0) || pool.reserve1.equalTo(0)) {
            log.error({
                weth,
                token,
                reserve0: pool === null || pool === void 0 ? void 0 : pool.reserve0.toExact(),
                reserve1: pool === null || pool === void 0 ? void 0 : pool.reserve1.toExact(),
            }, `Could not find a valid WETH pool with ${token.symbol} for computing gas costs.`);
            return null;
        }
        return pool;
    }
    async getHighestLiquidityUSDPool(chainId, poolProvider, providerConfig) {
        const usdTokens = usdGasTokensByChain[chainId];
        if (!usdTokens) {
            throw new Error(`Could not find a USD token for computing gas costs on ${chainId}`);
        }
        const usdPools = _.map(usdTokens, (usdToken) => [
            usdToken,
            WRAPPED_NATIVE_CURRENCY[chainId],
        ]);
        const poolAccessor = await poolProvider.getPools(usdPools, providerConfig);
        const poolsRaw = poolAccessor.getAllPools();
        const pools = _.filter(poolsRaw, (pool) => pool.reserve0.greaterThan(0) &&
            pool.reserve1.greaterThan(0) &&
            // this case should never happen in production, but when we mock the pool provider it may return non native pairs
            (pool.token0.equals(WRAPPED_NATIVE_CURRENCY[chainId]) ||
                pool.token1.equals(WRAPPED_NATIVE_CURRENCY[chainId])));
        if (pools.length == 0) {
            log.error({ pools }, `Could not find a USD/WETH pool for computing gas costs.`);
            throw new Error(`Can't find USD/WETH pool for computing gas costs.`);
        }
        const maxPool = _.maxBy(pools, (pool) => {
            if (pool.token0.equals(WRAPPED_NATIVE_CURRENCY[chainId])) {
                return parseFloat(pool.reserve0.toSignificant(2));
            }
            else {
                return parseFloat(pool.reserve1.toSignificant(2));
            }
        });
        return maxPool;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjItaGV1cmlzdGljLWdhcy1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yb3V0ZXJzL2FscGhhLXJvdXRlci9nYXMtbW9kZWxzL3YyL3YyLWhldXJpc3RpYy1nYXMtbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBR3JELE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUt2QixPQUFPLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFDTCx3QkFBd0IsRUFDeEIsZUFBZSxHQUNoQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE9BQU8sRUFHTCx5QkFBeUIsRUFFekIsa0JBQWtCLEVBQ2xCLG1CQUFtQixHQUNwQixNQUFNLGNBQWMsQ0FBQztBQUV0Qix3REFBd0Q7QUFDeEQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyw2Q0FBNkM7QUFFbkcsdUNBQXVDO0FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0Q0FBNEM7QUFFckc7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsa0JBQWtCO0lBR2hFLFlBQVksUUFBc0I7UUFDaEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixPQUFPLEVBQ1AsV0FBVyxFQUNYLFlBQVksRUFDWixLQUFLLEVBQ0wsaUJBQWlCLEVBQ2pCLGNBQWMs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