import { ChainId, Currency } from '@uniswap/sdk-core';
import { ProviderConfig } from '../provider';
import { IV4PoolProvider } from './pool-provider';
import { IV4SubgraphProvider, V4SubgraphPool } from './subgraph-provider';
export declare class StaticV4SubgraphProvider implements IV4SubgraphProvider {
    private chainId;
    private poolProvider;
    private v4PoolParams;
    constructor(chainId: ChainId, poolProvider: IV4PoolProvider, v4PoolParams?: Array<[
        number,
        number,
        string
    ]>);
    getPools(currencyIn?: Currency, currencyOut?: Currency, providerConfig?: ProviderConfig): Promise<V4SubgraphPool[]>;
}
