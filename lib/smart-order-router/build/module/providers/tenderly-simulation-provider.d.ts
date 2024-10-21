import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '@uniswap/sdk-core';
import { GasModelProviderConfig, SwapOptions, SwapRoute } from '../routers';
import { EthEstimateGasSimulator } from './eth-estimate-gas-provider';
import { IPortionProvider } from './portion-provider';
import { SimulationResult, Simulator } from './simulation-provider';
import { IV2PoolProvider } from './v2/pool-provider';
import { IV3PoolProvider } from './v3/pool-provider';
import { IV4PoolProvider } from './v4/pool-provider';
export declare type TenderlyResponseUniversalRouter = {
    config: {
        url: string;
        method: string;
        data: string;
    };
    simulation_results: [SimulationResult, SimulationResult, SimulationResult];
};
export declare type TenderlyResponseSwapRouter02 = {
    config: {
        url: string;
        method: string;
        data: string;
    };
    simulation_results: [SimulationResult, SimulationResult];
};
export declare type GasBody = {
    gas: string;
    gasUsed: string;
};
export declare type JsonRpcError = {
    error: {
        code: number;
        message: string;
        data: string;
    };
};
export declare type TenderlyResponseEstimateGasBundle = {
    id: number;
    jsonrpc: string;
    result: Array<JsonRpcError | GasBody>;
};
export declare const TENDERLY_NOT_SUPPORTED_CHAINS: ChainId[];
export declare class FallbackTenderlySimulator extends Simulator {
    private tenderlySimulator;
    private ethEstimateGasSimulator;
    constructor(chainId: ChainId, provider: JsonRpcProvider, portionProvider: IPortionProvider, tenderlySimulator: TenderlySimulator, ethEstimateGasSimulator: EthEstimateGasSimulator);
    protected simulateTransaction(fromAddress: string, swapOptions: SwapOptions, swapRoute: SwapRoute, providerConfig?: GasModelProviderConfig): Promise<SwapRoute>;
}
export declare class TenderlySimulator extends Simulator {
    private tenderlyBaseUrl;
    private tenderlyUser;
    private tenderlyProject;
    private tenderlyAccessKey;
    private tenderlyNodeApiKey;
    private v2PoolProvider;
    private v3PoolProvider;
    private v4PoolProvider;
    private overrideEstimateMultiplier;
    private tenderlyRequestTimeout?;
    private tenderlyNodeApiMigrationPercent?;
    private tenderlyNodeApiEnabledChains?;
    private tenderlyServiceInstance;
    constructor(chainId: ChainId, tenderlyBaseUrl: string, tenderlyUser: string, tenderlyProject: string, tenderlyAccessKey: string, tenderlyNodeApiKey: string, v2PoolProvider: IV2PoolProvider, v3PoolProvider: IV3PoolProvider, v4PoolProvider: IV4PoolProvider, provider: JsonRpcProvider, portionProvider: IPortionProvider, overrideEstimateMultiplier?: {
        [chainId in ChainId]?: number;
    }, tenderlyRequestTimeout?: number, tenderlyNodeApiMigrationPercent?: number, tenderlyNodeApiEnabledChains?: ChainId[]);
    simulateTransaction(fromAddress: string, swapOptions: SwapOptions, swapRoute: SwapRoute, providerConfig?: GasModelProviderConfig): Promise<SwapRoute>;
    private logTenderlyErrorResponse;
    private requestNodeSimulation;
}
