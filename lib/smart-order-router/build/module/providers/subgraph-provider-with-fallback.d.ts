import { Protocol } from '@uniswap/router-sdk';
import { Token } from '@uniswap/sdk-core';
import { SubgraphPool } from '../routers/alpha-router/functions/get-candidate-pools';
import { ProviderConfig } from './provider';
import { ISubgraphProvider } from './subgraph-provider';
export declare abstract class SubgraphProviderWithFallBacks<TSubgraphPool extends SubgraphPool> implements ISubgraphProvider<TSubgraphPool> {
    private fallbacks;
    private protocol;
    protected constructor(fallbacks: ISubgraphProvider<TSubgraphPool>[], protocol: Protocol);
    getPools(currencyIn?: Token, currencyOut?: Token, providerConfig?: ProviderConfig): Promise<TSubgraphPool[]>;
}
