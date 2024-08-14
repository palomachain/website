import Moralis from 'moralis';

const useMoralis = () => {
  const getNativeBalance = async (wallet: string, chainId: string) => {
    try {
      const response = await Moralis.EvmApi.balance.getNativeBalance({
        chain: chainId,
        address: wallet,
      });

      return response?.raw?.balance;
    } catch (e) {
      console.error(e);
      return '0';
    }
  };

  const getMyTokens = async (wallet: string, chainId: string) => {
    try {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        chain: chainId,
        address: wallet,
      });

      return response?.raw;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getTokenName = async (address: string, chainId: string) => {
    try {
      const response = await Moralis.EvmApi.token.getTokenMetadata({
        chain: chainId,
        addresses: [address],
      });

      return response?.raw[0].name;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return { getNativeBalance, getMyTokens, getTokenName };
};

export default useMoralis;
