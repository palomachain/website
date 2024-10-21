import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '@uniswap/sdk-core';
import { GasModelProviderConfig, SwapOptions, SwapRoute } from '../routers';
import { IPortionProvider } from './portion-provider';
import { ProviderConfig } from './provider';
import { Simulator } from './simulation-provider';
import { IV2PoolProvider } from './v2/pool-provider';
import { IV3PoolProvider } from './v3/pool-provider';
import { IV4PoolProvider } from './v4/pool-provider';
export declare class EthEstimateGasSimulator extends Simulator {
    v2PoolProvider: IV2PoolProvider;
    v3PoolProvider: IV3PoolProvider;
    v4PoolProvider: IV4PoolProvider;
    private overrideEstimateMultiplier;
    constructor(chainId: ChainId, provider: JsonRpcProvider, v2PoolProvider: IV2PoolProvider, v3PoolProvider: IV3PoolProvider, v4PoolProvider: IV4PoolProvider, portionProvider: IPortionProvider, overrideEstimateMultiplier?: {
        [chainId in ChainId]?: number;
    });
    ethEstimateGas(fromAddress: string, swapOptions: SwapOptions, route: SwapRoute, providerConfig?: ProviderConfig): Promise<SwapRoute>;
    private adjustGasEstimate;
    protected simulateTransaction(fromAddress: string, swapOptions: SwapOptions, swapRoute: SwapRoute, _providerConfig?: GasModelProviderConfig): Promise<SwapRoute>;
}
