import { BigNumber } from '@ethersproject/bignumber';
import { BaseProvider } from '@ethersproject/providers';
import { ChainId } from '@uniswap/sdk-core';
import { V3RouteWithValidQuote, V4RouteWithValidQuote } from '../entities';
import { BuildOnChainGasModelFactoryType, GasModelProviderConfig, IGasModel, IOnChainGasModelFactory } from './gas-model';
export declare abstract class TickBasedHeuristicGasModelFactory<TRouteWithValidQuote extends V3RouteWithValidQuote | V4RouteWithValidQuote> extends IOnChainGasModelFactory<TRouteWithValidQuote> {
    protected provider: BaseProvider;
    protected constructor(provider: BaseProvider);
    protected buildGasModelInternal({ chainId, gasPriceWei, pools, amountToken, quoteToken, l2GasDataProvider, providerConfig, }: BuildOnChainGasModelFactoryType): Promise<IGasModel<TRouteWithValidQuote>>;
    protected estimateGas(routeWithValidQuote: TRouteWithValidQuote, gasPriceWei: BigNumber, chainId: ChainId, providerConfig?: GasModelProviderConfig): {
        totalGasCostNativeCurrency: import("@uniswap/sdk-core").CurrencyAmount<import("@uniswap/sdk-core").Token>;
        totalInitializedTicksCrossed: number;
        baseGasUse: BigNumber;
    };
}
