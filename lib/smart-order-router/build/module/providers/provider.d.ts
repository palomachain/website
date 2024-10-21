import { UniversalRouterVersion } from '@uniswap/universal-router-sdk';
export declare type ProviderConfig = {
    /**
     * The block number to use when getting data on-chain.
     */
    blockNumber?: number | Promise<number>;
    debugRouting?: boolean;
    /**
     * Flag for token properties provider to enable fetching fee-on-transfer tokens.
     */
    enableFeeOnTransferFeeFetching?: boolean;
    /**
     * Tenderly natively support save simulation failures if failed,
     * we need this as a pass-through flag to enable/disable this feature.
     */
    saveTenderlySimulationIfFailed?: boolean;
    /**
     * Flag to indicate whether to use the CachedRoutes in optimistic mode.
     * Optimistic mode means that we will allow blocksToLive greater than 1.
     */
    optimisticCachedRoutes?: boolean;
    /**
     * FOT fees charged on token transfers where the to or from address is NOT the uniswap V2 pair address
     */
    externalTransferFailed?: boolean;
    /**
     * double FOT fee taken on transfer as part of universal router custody
     */
    feeTakenOnTransfer?: boolean;
    /**
     * The version of the universal router to use.
     */
    universalRouterVersion?: UniversalRouterVersion;
};
export declare type LocalCacheEntry<T> = {
    entry: T;
    blockNumber: number;
};
