import { ChainId, Token } from '@uniswap/sdk-core';
import { IMulticallProvider } from './multicall-provider';
import { ProviderConfig } from './provider';
/**
 * Provider for getting token data.
 *
 * @export
 * @interface ITokenProvider
 */
export interface ITokenProvider {
    /**
     * Gets the token at each address. Any addresses that are not valid ERC-20 are ignored.
     *
     * @param addresses The token addresses to get.
     * @param [providerConfig] The provider config.
     * @returns A token accessor with methods for accessing the tokens.
     */
    getTokens(addresses: string[], providerConfig?: ProviderConfig): Promise<TokenAccessor>;
}
export declare type TokenAccessor = {
    getTokenByAddress(address: string): Token | undefined;
    getTokenBySymbol(symbol: string): Token | undefined;
    getAllTokens: () => Token[];
};
export declare const USDC_MAINNET: Token;
export declare const USDT_MAINNET: Token;
export declare const WBTC_MAINNET: Token;
export declare const DAI_MAINNET: Token;
export declare const FEI_MAINNET: Token;
export declare const UNI_MAINNET: Token;
export declare const AAVE_MAINNET: Token;
export declare const LIDO_MAINNET: Token;
export declare const WSTETH_MAINNET: Token;
export declare const USDC_SEPOLIA: Token;
export declare const USDC_NATIVE_SEPOLIA: Token;
export declare const DAI_SEPOLIA: Token;
export declare const USDC_GOERLI: Token;
export declare const USDT_GOERLI: Token;
export declare const WBTC_GOERLI: Token;
export declare const DAI_GOERLI: Token;
export declare const UNI_GOERLI: Token;
export declare const USDC_OPTIMISM: Token;
export declare const USDC_NATIVE_OPTIMISM: Token;
export declare const USDT_OPTIMISM: Token;
export declare const WBTC_OPTIMISM: Token;
export declare const DAI_OPTIMISM: Token;
export declare const OP_OPTIMISM: Token;
export declare const USDC_OPTIMISM_GOERLI: Token;
export declare const USDT_OPTIMISM_GOERLI: Token;
export declare const WBTC_OPTIMISM_GOERLI: Token;
export declare const DAI_OPTIMISM_GOERLI: Token;
export declare const USDC_OPTIMISM_SEPOLIA: Token;
export declare const USDT_OPTIMISM_SEPOLIA: Token;
export declare const WBTC_OPTIMISM_SEPOLIA: Token;
export declare const DAI_OPTIMISM_SEPOLIA: Token;
export declare const USDC_ARBITRUM: Token;
export declare const USDC_NATIVE_ARBITRUM: Token;
export declare const USDT_ARBITRUM: Token;
export declare const WBTC_ARBITRUM: Token;
export declare const DAI_ARBITRUM: Token;
export declare const ARB_ARBITRUM: Token;
export declare const DAI_ARBITRUM_GOERLI: Token;
export declare const DAI_ARBITRUM_SEPOLIA: Token;
export declare const USDC_ARBITRUM_GOERLI: Token;
export declare const USDC_ARBITRUM_SEPOLIA: Token;
export declare const WMATIC_POLYGON: Token;
export declare const WETH_POLYGON: Token;
export declare const USDC_POLYGON: Token;
export declare const USDC_NATIVE_POLYGON: Token;
export declare const DAI_POLYGON: Token;
export declare const WMATIC_POLYGON_MUMBAI: Token;
export declare const USDC_POLYGON_MUMBAI: Token;
export declare const DAI_POLYGON_MUMBAI: Token;
export declare const WETH_POLYGON_MUMBAI: Token;
export declare const BTC_BNB: Token;
export declare const BUSD_BNB: Token;
export declare const DAI_BNB: Token;
export declare const ETH_BNB: Token;
export declare const USDC_BNB: Token;
export declare const USDT_BNB: Token;
export declare const CELO: Token;
export declare const DAI_CELO: Token;
export declare const CUSD_CELO: Token;
export declare const USDC_CELO: Token;
export declare const USDC_WORMHOLE_CELO: Token;
export declare const USDC_NATIVE_CELO: Token;
export declare const CEUR_CELO: Token;
export declare const CELO_ALFAJORES: Token;
export declare const DAI_CELO_ALFAJORES: Token;
export declare const CUSD_CELO_ALFAJORES: Token;
export declare const CEUR_CELO_ALFAJORES: Token;
export declare const DAI_AVAX: Token;
export declare const USDC_AVAX: Token;
export declare const USDC_BRIDGED_AVAX: Token;
export declare const USDC_NATIVE_AVAX: Token;
export declare const USDC_BASE: Token;
export declare const USDC_NATIVE_BASE: Token;
export declare const USDC_BASE_GOERLI: Token;
export declare const USDC_ETHEREUM_GNOSIS: Token;
export declare const WXDAI_GNOSIS: Token;
export declare const WBTC_GNOSIS: Token;
export declare const USDC_MOONBEAM: Token;
export declare const WGLMR_MOONBEAM: Token;
export declare const DAI_MOONBEAM: Token;
export declare const WBTC_MOONBEAM: Token;
export declare const USDB_BLAST: Token;
export declare const USDC_ZORA: Token;
export declare const USDC_ZKSYNC: Token;
export declare const USDCE_ZKSYNC: Token;
export declare const DAI_ZKSYNC: Token;
export declare const USDC_WORLDCHAIN: Token;
export declare const WLD_WORLDCHAIN: Token;
export declare const WBTC_WORLDCHAIN: Token;
export declare const USDC_ASTROCHAIN_SEPOLIA: Token;
export declare class TokenProvider implements ITokenProvider {
    private chainId;
    protected multicall2Provider: IMulticallProvider;
    constructor(chainId: ChainId, multicall2Provider: IMulticallProvider);
    private getTokenSymbol;
    private getTokenDecimals;
    getTokens(_addresses: string[], providerConfig?: ProviderConfig): Promise<TokenAccessor>;
}
export declare const DAI_ON: (chainId: ChainId) => Token;
export declare const USDT_ON: (chainId: ChainId) => Token;
export declare const USDC_ON: (chainId: ChainId) => Token;
export declare const WNATIVE_ON: (chainId: ChainId) => Token;
export declare const V4_SEPOLIA_TEST_A: Token;
export declare const V4_SEPOLIA_TEST_B: Token;
