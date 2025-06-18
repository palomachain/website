import { ChainRPCs } from "configs/chains";
import { ethers } from "ethers";
import { parseIntString } from "./string";

export const getFirstWorkingRpcUrl = (chainId: string, index = 0) => {
  const rpcs: string[] = ChainRPCs[parseIntString(chainId)] || null;
  if (!rpcs || rpcs.length === 0 || index >= rpcs.length) {
    console.log("No working RPC URL found");
    return null;
  }

  const rpcUrl = rpcs[index];
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  try {
    provider.getBlockNumber();
    console.log(`First working RPC URL: ${rpcUrl}`);
    return rpcUrl;
  } catch (error) {
    console.log(`error: `, error);
    return getFirstWorkingRpcUrl(chainId, index + 1);
  }
};
