import { BigNumber } from '@ethersproject/bignumber';
import { BaseProvider } from '@ethersproject/providers';
import { V4RouteWithValidQuote } from '../../entities';
import { BuildOnChainGasModelFactoryType, GasModelProviderConfig, IGasModel, IOnChainGasModelFactory } from '../gas-model';
import { TickBasedHeuristicGasModelFactory } from '../tick-based-heuristic-gas-model';
import { ChainId } from '@uniswap/sdk-core';
export declare class V4HeuristicGasModelFactory extends TickBasedHeuristicGasModelFactory<V4RouteWithValidQuote> implements IOnChainGasModelFactory<V4RouteWithValidQuote> {
    constructor(provider: BaseProvider);
    buildGasModel({ chainId, gasPriceWei, pools, amountToken, quoteToken, v2poolProvider, l2GasDataProvider, providerConfig, }: BuildOnChainGasModelFactoryType): Promise<IGasModel<V4RouteWithValidQuote>>;
    protected estimateGas(routeWithValidQuote: V4RouteWithValidQuote, gasPriceWei: BigNumber, chainId: ChainId, providerConfig?: GasModelProviderConfig): {
        totalGasCostNativeCurrency: import("@uniswap/sdk-core").CurrencyAmount<import("@uniswap/sdk-core").Token>;
        totalInitializedTicksCrossed: number;
        baseGasUse: BigNumber;
    };
}
