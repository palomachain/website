import { ChainId } from '@uniswap/sdk-core';
import { BatchParams, BlockNumberConfig, FailureOverrides, QuoteRetryOptions } from '../providers';
export declare const NETWORKS_WITH_SAME_RETRY_OPTIONS: ChainId[];
export declare function constructSameRetryOptionsMap<T extends QuoteRetryOptions>(retryOptions: T, additionalNetworks?: ChainId[]): {
    [chainId: number]: T;
};
export declare const DEFAULT_RETRY_OPTIONS: QuoteRetryOptions;
export declare const RETRY_OPTIONS: {
    [x: number]: import("async-retry").Options;
};
export declare const NETWORKS_WITH_SAME_BATCH_PARAMS: ChainId[];
export declare function constructSameBatchParamsMap<T extends BatchParams>(batchParams: T, additionalNetworks?: ChainId[]): {
    [chainId: number]: T;
};
export declare const DEFAULT_BATCH_PARAMS: BatchParams;
export declare const BATCH_PARAMS: {
    [x: number]: BatchParams;
};
export declare const NETWORKS_WITH_SAME_GAS_ERROR_FAILURE_OVERRIDES: ChainId[];
export declare function constructSameGasErrorFailureOverridesMap<T extends FailureOverrides>(gasErrorFailureOverrides: T, additionalNetworks?: ChainId[]): {
    [chainId: number]: T;
};
export declare const DEFAULT_GAS_ERROR_FAILURE_OVERRIDES: FailureOverrides;
export declare const GAS_ERROR_FAILURE_OVERRIDES: {
    [x: number]: FailureOverrides;
};
export declare const NETWORKS_WITH_SAME_SUCCESS_RATE_FAILURE_OVERRIDES: ChainId[];
export declare function constructSameSuccessRateFailureOverridesMap<T extends FailureOverrides>(successRateFailureOverrides: T, additionalNetworks?: ChainId[]): {
    [chainId: number]: T;
};
export declare const DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES: FailureOverrides;
export declare const SUCCESS_RATE_FAILURE_OVERRIDES: {
    [x: number]: FailureOverrides;
};
export declare const NETWORKS_WITH_SAME_BLOCK_NUMBER_CONFIGS: ChainId[];
export declare function constructSameBlockNumberConfigsMap<T extends BlockNumberConfig>(blockNumberConfigs: T, additionalNetworks?: ChainId[]): {
    [chainId: number]: T;
};
export declare const DEFAULT_BLOCK_NUMBER_CONFIGS: BlockNumberConfig;
export declare const BLOCK_NUMBER_CONFIGS: {
    [x: number]: BlockNumberConfig;
};
