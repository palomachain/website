"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeOnChain = exports.ExtendedEther = exports.WRAPPED_NATIVE_CURRENCY = exports.ID_TO_PROVIDER = exports.CHAIN_IDS_LIST = exports.ID_TO_NETWORK_NAME = exports.NATIVE_CURRENCY = exports.NATIVE_NAMES_BY_ID = exports.NativeCurrencyName = exports.ChainName = exports.ID_TO_CHAIN_ID = exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = exports.HAS_L1_FEE = exports.MIXED_SUPPORTED = exports.V4_SUPPORTED = exports.V2_SUPPORTED = exports.SUPPORTED_CHAINS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
// WIP: Gnosis, Moonbeam
exports.SUPPORTED_CHAINS = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.OPTIMISM_SEPOLIA,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.ARBITRUM_SEPOLIA,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.CELO_ALFAJORES,
    sdk_core_1.ChainId.CELO,
    sdk_core_1.ChainId.BNB,
    sdk_core_1.ChainId.AVALANCHE,
    sdk_core_1.ChainId.BASE,
    sdk_core_1.ChainId.BLAST,
    sdk_core_1.ChainId.ZORA,
    sdk_core_1.ChainId.ZKSYNC,
    sdk_core_1.ChainId.WORLDCHAIN,
    sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA,
    // Gnosis and Moonbeam don't yet have contracts deployed yet
];
exports.V2_SUPPORTED = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.BASE,
    sdk_core_1.ChainId.BNB,
    sdk_core_1.ChainId.AVALANCHE,
];
exports.V4_SUPPORTED = [sdk_core_1.ChainId.SEPOLIA];
exports.MIXED_SUPPORTED = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.GOERLI,
];
exports.HAS_L1_FEE = [
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.OPTIMISM_SEPOLIA,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.ARBITRUM_SEPOLIA,
    sdk_core_1.ChainId.BASE,
    sdk_core_1.ChainId.BASE_GOERLI,
    sdk_core_1.ChainId.BLAST,
    sdk_core_1.ChainId.ZORA,
    sdk_core_1.ChainId.WORLDCHAIN,
    sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA,
];
exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
];
const ID_TO_CHAIN_ID = (id) => {
    switch (id) {
        case 1:
            return sdk_core_1.ChainId.MAINNET;
        case 5:
            return sdk_core_1.ChainId.GOERLI;
        case 11155111:
            return sdk_core_1.ChainId.SEPOLIA;
        case 56:
            return sdk_core_1.ChainId.BNB;
        case 10:
            return sdk_core_1.ChainId.OPTIMISM;
        case 420:
            return sdk_core_1.ChainId.OPTIMISM_GOERLI;
        case 11155420:
            return sdk_core_1.ChainId.OPTIMISM_SEPOLIA;
        case 42161:
            return sdk_core_1.ChainId.ARBITRUM_ONE;
        case 421613:
            return sdk_core_1.ChainId.ARBITRUM_GOERLI;
        case 421614:
            return sdk_core_1.ChainId.ARBITRUM_SEPOLIA;
        case 137:
            return sdk_core_1.ChainId.POLYGON;
        case 80001:
            return sdk_core_1.ChainId.POLYGON_MUMBAI;
        case 42220:
            return sdk_core_1.ChainId.CELO;
        case 44787:
            return sdk_core_1.ChainId.CELO_ALFAJORES;
        case 100:
            return sdk_core_1.ChainId.GNOSIS;
        case 1284:
            return sdk_core_1.ChainId.MOONBEAM;
        case 43114:
            return sdk_core_1.ChainId.AVALANCHE;
        case 8453:
            return sdk_core_1.ChainId.BASE;
        case 84531:
            return sdk_core_1.ChainId.BASE_GOERLI;
        case 81457:
            return sdk_core_1.ChainId.BLAST;
        case 7777777:
            return sdk_core_1.ChainId.ZORA;
        case 324:
            return sdk_core_1.ChainId.ZKSYNC;
        case 480:
            return sdk_core_1.ChainId.WORLDCHAIN;
        case 1301:
            return sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
exports.ID_TO_CHAIN_ID = ID_TO_CHAIN_ID;
var ChainName;
(function (ChainName) {
    ChainName["MAINNET"] = "mainnet";
    ChainName["GOERLI"] = "goerli";
    ChainName["SEPOLIA"] = "sepolia";
    ChainName["OPTIMISM"] = "optimism-mainnet";
    ChainName["OPTIMISM_GOERLI"] = "optimism-goerli";
    ChainName["OPTIMISM_SEPOLIA"] = "optimism-sepolia";
    ChainName["ARBITRUM_ONE"] = "arbitrum-mainnet";
    ChainName["ARBITRUM_GOERLI"] = "arbitrum-goerli";
    ChainName["ARBITRUM_SEPOLIA"] = "arbitrum-sepolia";
    ChainName["POLYGON"] = "polygon-mainnet";
    ChainName["POLYGON_MUMBAI"] = "polygon-mumbai";
    ChainName["CELO"] = "celo-mainnet";
    ChainName["CELO_ALFAJORES"] = "celo-alfajores";
    ChainName["GNOSIS"] = "gnosis-mainnet";
    ChainName["MOONBEAM"] = "moonbeam-mainnet";
    ChainName["BNB"] = "bnb-mainnet";
    ChainName["AVALANCHE"] = "avalanche-mainnet";
    ChainName["BASE"] = "base-mainnet";
    ChainName["BASE_GOERLI"] = "base-goerli";
    ChainName["BLAST"] = "blast-mainnet";
    ChainName["ZORA"] = "zora-mainnet";
    ChainName["ZKSYNC"] = "zksync-mainnet";
    ChainName["WORLDCHAIN"] = "worldchain-mainnet";
    ChainName["ASTROCHAIN_SEPOLIA"] = "astrochain-sepolia";
})(ChainName = exports.ChainName || (exports.ChainName = {}));
var NativeCurrencyName;
(function (NativeCurrencyName) {
    // Strings match input for CLI
    NativeCurrencyName["ETHER"] = "ETH";
    NativeCurrencyName["MATIC"] = "MATIC";
    NativeCurrencyName["CELO"] = "CELO";
    NativeCurrencyName["GNOSIS"] = "XDAI";
    NativeCurrencyName["MOONBEAM"] = "GLMR";
    NativeCurrencyName["BNB"] = "BNB";
    NativeCurrencyName["AVALANCHE"] = "AVAX";
})(NativeCurrencyName = exports.NativeCurrencyName || (exports.NativeCurrencyName = {}));
exports.NATIVE_NAMES_BY_ID = {
    [sdk_core_1.ChainId.MAINNET]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.OPTIMISM]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ARBITRUM_ONE]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.POLYGON]: ['MATIC', '0x0000000000000000000000000000000000001010'],
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: [
        'MATIC',
        '0x0000000000000000000000000000000000001010',
    ],
    [sdk_core_1.ChainId.CELO]: ['CELO'],
    [sdk_core_1.ChainId.CELO_ALFAJORES]: ['CELO'],
    [sdk_core_1.ChainId.GNOSIS]: ['XDAI'],
    [sdk_core_1.ChainId.MOONBEAM]: ['GLMR'],
    [sdk_core_1.ChainId.BNB]: ['BNB', 'BNB', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
    [sdk_core_1.ChainId.AVALANCHE]: [
        'AVAX',
        'AVALANCHE',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.BASE]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.BLAST]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ZORA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ZKSYNC]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.WORLDCHAIN]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
};
exports.NATIVE_CURRENCY = {
    [sdk_core_1.ChainId.MAINNET]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.SEPOLIA]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.OPTIMISM]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ARBITRUM_ONE]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.POLYGON]: NativeCurrencyName.MATIC,
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: NativeCurrencyName.MATIC,
    [sdk_core_1.ChainId.CELO]: NativeCurrencyName.CELO,
    [sdk_core_1.ChainId.CELO_ALFAJORES]: NativeCurrencyName.CELO,
    [sdk_core_1.ChainId.GNOSIS]: NativeCurrencyName.GNOSIS,
    [sdk_core_1.ChainId.MOONBEAM]: NativeCurrencyName.MOONBEAM,
    [sdk_core_1.ChainId.BNB]: NativeCurrencyName.BNB,
    [sdk_core_1.ChainId.AVALANCHE]: NativeCurrencyName.AVALANCHE,
    [sdk_core_1.ChainId.BASE]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.BLAST]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ZORA]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ZKSYNC]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.WORLDCHAIN]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA]: NativeCurrencyName.ETHER,
};
const ID_TO_NETWORK_NAME = (id) => {
    switch (id) {
        case 1:
            return ChainName.MAINNET;
        case 5:
            return ChainName.GOERLI;
        case 11155111:
            return ChainName.SEPOLIA;
        case 56:
            return ChainName.BNB;
        case 10:
            return ChainName.OPTIMISM;
        case 420:
            return ChainName.OPTIMISM_GOERLI;
        case 11155420:
            return ChainName.OPTIMISM_SEPOLIA;
        case 42161:
            return ChainName.ARBITRUM_ONE;
        case 421613:
            return ChainName.ARBITRUM_GOERLI;
        case 421614:
            return ChainName.ARBITRUM_SEPOLIA;
        case 137:
            return ChainName.POLYGON;
        case 80001:
            return ChainName.POLYGON_MUMBAI;
        case 42220:
            return ChainName.CELO;
        case 44787:
            return ChainName.CELO_ALFAJORES;
        case 100:
            return ChainName.GNOSIS;
        case 1284:
            return ChainName.MOONBEAM;
        case 43114:
            return ChainName.AVALANCHE;
        case 8453:
            return ChainName.BASE;
        case 84531:
            return ChainName.BASE_GOERLI;
        case 81457:
            return ChainName.BLAST;
        case 7777777:
            return ChainName.ZORA;
        case 324:
            return ChainName.ZKSYNC;
        case 480:
            return ChainName.WORLDCHAIN;
        case 1301:
            return ChainName.ASTROCHAIN_SEPOLIA;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
exports.ID_TO_NETWORK_NAME = ID_TO_NETWORK_NAME;
exports.CHAIN_IDS_LIST = Object.values(sdk_core_1.ChainId).map((c) => c.toString());
const ID_TO_PROVIDER = (id) => {
    switch (id) {
        case sdk_core_1.ChainId.MAINNET:
            return process.env.JSON_RPC_PROVIDER;
        case sdk_core_1.ChainId.GOERLI:
            return process.env.JSON_RPC_PROVIDER_GORLI;
        case sdk_core_1.ChainId.SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_SEPOLIA;
        case sdk_core_1.ChainId.OPTIMISM:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM;
        case sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM_GOERLI;
        case sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM_SEPOLIA;
        case sdk_core_1.ChainId.ARBITRUM_ONE:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_ONE;
        case sdk_core_1.ChainId.ARBITRUM_GOERLI:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_GOERLI;
        case sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_SEPOLIA;
        case sdk_core_1.ChainId.POLYGON:
            return process.env.JSON_RPC_PROVIDER_POLYGON;
        case sdk_core_1.ChainId.POLYGON_MUMBAI:
            return process.env.JSON_RPC_PROVIDER_POLYGON_MUMBAI;
        case sdk_core_1.ChainId.CELO:
            return process.env.JSON_RPC_PROVIDER_CELO;
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return process.env.JSON_RPC_PROVIDER_CELO_ALFAJORES;
        case sdk_core_1.ChainId.BNB:
            return process.env.JSON_RPC_PROVIDER_BNB;
        case sdk_core_1.ChainId.AVALANCHE:
            return process.env.JSON_RPC_PROVIDER_AVALANCHE;
        case sdk_core_1.ChainId.BASE:
            return process.env.JSON_RPC_PROVIDER_BASE;
        case sdk_core_1.ChainId.BLAST:
            return process.env.JSON_RPC_PROVIDER_BLAST;
        case sdk_core_1.ChainId.ZORA:
            return process.env.JSON_RPC_PROVIDER_ZORA;
        case sdk_core_1.ChainId.ZKSYNC:
            return process.env.JSON_RPC_PROVIDER_ZKSYNC;
        case sdk_core_1.ChainId.WORLDCHAIN:
            return process.env.JSON_RPC_PROVIDER_WORLDCHAIN;
        case sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_ASTROCHAIN_SEPOLIA;
        default:
            throw new Error(`Chain id: ${id} not supported`);
    }
};
exports.ID_TO_PROVIDER = ID_TO_PROVIDER;
exports.WRAPPED_NATIVE_CURRENCY = {
    [sdk_core_1.ChainId.MAINNET]: new sdk_core_1.Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.GOERLI]: new sdk_core_1.Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.SEPOLIA]: new sdk_core_1.Token(11155111, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BNB]: new sdk_core_1.Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    [sdk_core_1.ChainId.OPTIMISM]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_ONE]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_GOERLI, '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_SEPOLIA, '0xc556bAe1e86B2aE9c22eA5E036b07E55E7596074', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.POLYGON]: new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped MATIC'),
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON_MUMBAI, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC'),
    // The Celo native currency 'CELO' implements the erc-20 token standard
    [sdk_core_1.ChainId.CELO]: new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0x471EcE3750Da237f93B8E339c536989b8978a438', 18, 'CELO', 'Celo native asset'),
    [sdk_core_1.ChainId.CELO_ALFAJORES]: new sdk_core_1.Token(sdk_core_1.ChainId.CELO_ALFAJORES, '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', 18, 'CELO', 'Celo native asset'),
    [sdk_core_1.ChainId.GNOSIS]: new sdk_core_1.Token(sdk_core_1.ChainId.GNOSIS, '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', 18, 'WXDAI', 'Wrapped XDAI on Gnosis'),
    [sdk_core_1.ChainId.MOONBEAM]: new sdk_core_1.Token(sdk_core_1.ChainId.MOONBEAM, '0xAcc15dC74880C9944775448304B263D191c6077F', 18, 'WGLMR', 'Wrapped GLMR'),
    [sdk_core_1.ChainId.AVALANCHE]: new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX'),
    [sdk_core_1.ChainId.BASE]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BASE_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ROOTSTOCK]: new sdk_core_1.Token(sdk_core_1.ChainId.ROOTSTOCK, '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d', 18, 'WRBTC', 'Wrapped BTC'),
    [sdk_core_1.ChainId.ZORA]: new sdk_core_1.Token(sdk_core_1.ChainId.ZORA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ZORA_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.ZORA_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BLAST]: new sdk_core_1.Token(sdk_core_1.ChainId.BLAST, '0x4300000000000000000000000000000000000004', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ZKSYNC]: new sdk_core_1.Token(sdk_core_1.ChainId.ZKSYNC, '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.WORLDCHAIN]: new sdk_core_1.Token(sdk_core_1.ChainId.WORLDCHAIN, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
};
function isMatic(chainId) {
    return chainId === sdk_core_1.ChainId.POLYGON_MUMBAI || chainId === sdk_core_1.ChainId.POLYGON;
}
class MaticNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isMatic(this.chainId))
            throw new Error('Not matic');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isMatic(chainId))
            throw new Error('Not matic');
        super(chainId, 18, 'MATIC', 'Polygon Matic');
    }
}
function isCelo(chainId) {
    return chainId === sdk_core_1.ChainId.CELO_ALFAJORES || chainId === sdk_core_1.ChainId.CELO;
}
class CeloNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isCelo(this.chainId))
            throw new Error('Not celo');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isCelo(chainId))
            throw new Error('Not celo');
        super(chainId, 18, 'CELO', 'Celo');
    }
}
function isGnosis(chainId) {
    return chainId === sdk_core_1.ChainId.GNOSIS;
}
class GnosisNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isGnosis(this.chainId))
            throw new Error('Not gnosis');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isGnosis(chainId))
            throw new Error('Not gnosis');
        super(chainId, 18, 'XDAI', 'xDai');
    }
}
function isBnb(chainId) {
    return chainId === sdk_core_1.ChainId.BNB;
}
class BnbNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isBnb(this.chainId))
            throw new Error('Not bnb');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isBnb(chainId))
            throw new Error('Not bnb');
        super(chainId, 18, 'BNB', 'BNB');
    }
}
function isMoonbeam(chainId) {
    return chainId === sdk_core_1.ChainId.MOONBEAM;
}
class MoonbeamNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isMoonbeam(this.chainId))
            throw new Error('Not moonbeam');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isMoonbeam(chainId))
            throw new Error('Not moonbeam');
        super(chainId, 18, 'GLMR', 'Glimmer');
    }
}
function isAvax(chainId) {
    return chainId === sdk_core_1.ChainId.AVALANCHE;
}
class AvalancheNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isAvax(this.chainId))
            throw new Error('Not avalanche');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isAvax(chainId))
            throw new Error('Not avalanche');
        super(chainId, 18, 'AVAX', 'Avalanche');
    }
}
class ExtendedEther extends sdk_core_1.Ether {
    get wrapped() {
        if (this.chainId in exports.WRAPPED_NATIVE_CURRENCY) {
            return exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        }
        throw new Error('Unsupported chain ID');
    }
    static onChain(chainId) {
        var _a;
        return ((_a = this._cachedExtendedEther[chainId]) !== null && _a !== void 0 ? _a : (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)));
    }
}
exports.ExtendedEther = ExtendedEther;
ExtendedEther._cachedExtendedEther = {};
const cachedNativeCurrency = {};
function nativeOnChain(chainId) {
    if (cachedNativeCurrency[chainId] != undefined) {
        return cachedNativeCurrency[chainId];
    }
    if (isMatic(chainId)) {
        cachedNativeCurrency[chainId] = new MaticNativeCurrency(chainId);
    }
    else if (isCelo(chainId)) {
        cachedNativeCurrency[chainId] = new CeloNativeCurrency(chainId);
    }
    else if (isGnosis(chainId)) {
        cachedNativeCurrency[chainId] = new GnosisNativeCurrency(chainId);
    }
    else if (isMoonbeam(chainId)) {
        cachedNativeCurrency[chainId] = new MoonbeamNativeCurrency(chainId);
    }
    else if (isBnb(chainId)) {
        cachedNativeCurrency[chainId] = new BnbNativeCurrency(chainId);
    }
    else if (isAvax(chainId)) {
        cachedNativeCurrency[chainId] = new AvalancheNativeCurrency(chainId);
    }
    else {
        cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId);
    }
    return cachedNativeCurrency[chainId];
}
exports.nativeOnChain = nativeOnChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvY2hhaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQU0yQjtBQUUzQix3QkFBd0I7QUFDWCxRQUFBLGdCQUFnQixHQUFjO0lBQ3pDLGtCQUFPLENBQUMsT0FBTztJQUNmLGtCQUFPLENBQUMsUUFBUTtJQUNoQixrQkFBTyxDQUFDLGVBQWU7SUFDdkIsa0JBQU8sQ0FBQyxnQkFBZ0I7SUFDeEIsa0JBQU8sQ0FBQyxZQUFZO0lBQ3BCLGtCQUFPLENBQUMsZUFBZTtJQUN2QixrQkFBTyxDQUFDLGdCQUFnQjtJQUN4QixrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLGNBQWM7SUFDdEIsa0JBQU8sQ0FBQyxPQUFPO0lBQ2Ysa0JBQU8sQ0FBQyxjQUFjO0lBQ3RCLGtCQUFPLENBQUMsSUFBSTtJQUNaLGtCQUFPLENBQUMsR0FBRztJQUNYLGtCQUFPLENBQUMsU0FBUztJQUNqQixrQkFBTyxDQUFDLElBQUk7SUFDWixrQkFBTyxDQUFDLEtBQUs7SUFDYixrQkFBTyxDQUFDLElBQUk7SUFDWixrQkFBTyxDQUFDLE1BQU07SUFDZCxrQkFBTyxDQUFDLFVBQVU7SUFDbEIsa0JBQU8sQ0FBQyxrQkFBa0I7SUFDMUIsNERBQTREO0NBQzdELENBQUM7QUFFVyxRQUFBLFlBQVksR0FBRztJQUMxQixrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLFlBQVk7SUFDcEIsa0JBQU8sQ0FBQyxRQUFRO0lBQ2hCLGtCQUFPLENBQUMsT0FBTztJQUNmLGtCQUFPLENBQUMsSUFBSTtJQUNaLGtCQUFPLENBQUMsR0FBRztJQUNYLGtCQUFPLENBQUMsU0FBUztDQUNsQixDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUcsQ0FBQyxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRWpDLFFBQUEsZUFBZSxHQUFHO0lB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