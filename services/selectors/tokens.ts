import { ChainID } from 'configs/chains';
import { VETH_ADDRESS } from 'contracts/addresses';
import { IToken } from 'interfaces/swap';
import type { GetListedSwapTokensApiResponse } from 'services/api/tokens';

const selectListedSwapTokensByChainId = (
  data: GetListedSwapTokensApiResponse | undefined,
  chainId: string | number | null,
  addNativeToken: boolean = true,
): IToken[] => {
  const tokens = data
    ? data.data.tokens
        .filter((token) => token.chainId.toString() === chainId?.toString())
        .map((token) => ({
          chainId: token.chainId.toString(),
          icon: token.logoURI,
          displayName: token.name,
          symbol: token.symbol,
          address: token.address,
          decimals: token.decimals,
        }))
    : [];

  const additionalToken = [];
  if (addNativeToken) {
    if (
      chainId === ChainID.ETHEREUM_MAIN ||
      chainId === ChainID.ARBITRUM_MAIN ||
      chainId === ChainID.OPTIMISM_MAIN ||
      chainId === ChainID.BASE_MAIN
    ) {
      additionalToken.push({
        address: VETH_ADDRESS,
        symbol: 'ETH',
        displayName: 'ETH',
        icon: '/assets/tokens/eth.png',
        decimals: 18,
      });
    }

    if (chainId === ChainID.BSC_MAIN) {
      additionalToken.push({
        address: VETH_ADDRESS,
        symbol: 'BNB',
        displayName: 'BNB',
        icon: '/assets/tokens/binance.png',
        decimals: 18,
      });
    }

    if (chainId === ChainID.POLYGON_MAIN) {
      additionalToken.push({
        address: VETH_ADDRESS,
        symbol: 'POL',
        displayName: 'POL',
        icon: '/assets/tokens/polygon.png',
        decimals: 18,
      });
    }
  }
  if (data && data.data.name === 'Curve') {
    const tokensArray = [...tokens];
    return [...tokensArray.slice(0, 2), ...additionalToken, ...tokensArray.slice(2)];
  }
  return [...additionalToken, ...tokens];
};

export { selectListedSwapTokensByChainId };
