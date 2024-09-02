import { ChainID } from 'configs/chains';
import { envParam } from 'configs/constants';
import { TMap } from 'types';

export const Addresses: TMap = {
  [ChainID.ETHEREUM_MAIN]: {
    uniswapV3SwapRouter02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',

    uniswapV2Factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    uniswapV2Router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',

    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',

    node_sale: envParam.nodeSale_eth,
  },
  [ChainID.BSC_MAIN]: {
    apeRouter: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
    apeFactory: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6',

    babyDogeRouter: '0xC9a0F685F39d05D835c369036251ee3aEaaF3c47',
    babyDogeFactory: '0x4693B62E5fc9c0a45F89D62e6300a03C85f43137',

    pancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    pancakeFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',

    babyRouter: '0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd',
    babyFactory: '0x86407bea2078ea5f5eb5a52b2caa963bc1f889da',

    wallchainRouterManager: '0xC2B5123642D62999B3DF9a19050934C6deE75435',

    weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // wbnb address
    bat: '0x101d82428437127bf1608f699cd651e6abf9766e',
    usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    usdt: '0x55d398326f99059fF775485246999027B3197955',

    node_sale: envParam.nodeSale_bnb,
  },
  [ChainID.ARBITRUM_MAIN]: {
    uniswapV3SwapRouter02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',

    curveExchangeRouter: '',
    curveFactory: '',
    curveAddressGetter: '0x0000000022d53366457f9d5e68ec105046fc4383',

    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',

    node_sale: envParam.nodeSale_arb,
  },
  [ChainID.POLYGON_MAIN]: {
    uniswapV3SwapRouter02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',

    wallchainRouterManager: '0x1d658D2f8Fdae5A52be5e2D37b6013a1F776bEe8',

    weth: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // wmatic address
    usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',

    node_sale: envParam.nodeSale_polygon,
  },
  [ChainID.OPTIMISM_MAIN]: {
    uniswapV3SwapRouter02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',

    weth: '0x4200000000000000000000000000000000000006',
    usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    dai: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',

    node_sale: envParam.nodeSale_op,
  },
  [ChainID.BASE_MAIN]: {
    uniswapV3SwapRouter02: '0x2626664c2603336E57B271c5C0b26F421741e481',
    uniswapV3Factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',

    weth: '0x4200000000000000000000000000000000000006',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdt: '0xF9E36ba92f4f5E60FC0A19CCD201c285d8CCe62D',
    dai: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',

    node_sale: envParam.nodeSale_base,
  },
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const VETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const ZERO_ADDRESS_PALOMA = '0x0000000000000000000000000000000000000000000000000000000000000000';
