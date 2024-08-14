import { useGetTokenPricesQuery } from "services/api/price";
import selectors from "services/selectors";

interface GetTokenPriceProps {
  skip?: boolean;
  network?: string | number;
  tokenAddress?: string;
}

const useGetTokenPrice = ({
  network,
  tokenAddress,
  skip,
}: GetTokenPriceProps) => {
  const { data, isLoading, error, tokenPriceInUsd } = useGetTokenPricesQuery(
    { network, token: tokenAddress },
    {
      skip: !!skip,
      selectFromResult: (result) => ({
        ...result,
        tokenPriceInUsd: selectors.selectCurrentUsdPrice(result.data),
      }),
    }
  );

  return { data, isLoading, error, tokenPriceInUsd };
};

export default useGetTokenPrice;
