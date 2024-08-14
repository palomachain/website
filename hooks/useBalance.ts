import { useCallback } from "react";
import BigNumber from "bignumber.js";
import { VETH_ADDRESS } from "contracts/addresses";
import { IBalance, IToken } from "interfaces/swap";
import { fetchBalance } from "@wagmi/core";
import { parseIntString } from "utils/string";
import mockTool from "utils/mock";
import { toFixedWithoutRound } from "utils/number";

const useBalance = ({ provider, selectedChain = "1" }) => {
  const getTokenBalance = useCallback(
    async (token: IToken, walletAddress: `0x${string}`): Promise<IBalance> => {
      try {
        if (!provider || !walletAddress || !token.address)
          return mockTool.emptyTokenBalance();
        const chainId = parseIntString(selectedChain);
        // Convert to `0x${string}`
        const tokenAddress: `0x${string}` = `0x${token.address.substring(2)}`;
        const balance =
          token.address === VETH_ADDRESS
            ? await fetchBalance({
                address: walletAddress,
                chainId: Number(chainId),
              })
            : await fetchBalance({
                address: walletAddress,
                token: tokenAddress,
                chainId: Number(chainId),
              });

        return {
          raw: new BigNumber(balance.value.toString()),
          format:
            Number(balance.formatted) === 0
              ? "0.0"
              : toFixedWithoutRound(balance.formatted),
        };
      } catch (error) {
        console.log("error", error);
        return mockTool.emptyTokenBalance();
      }
    },
    [provider, selectedChain]
  );

  return {
    getTokenBalance,
  };
};

export default useBalance;
