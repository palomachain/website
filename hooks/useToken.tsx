import BigNumber from 'bignumber.js';
import erc20Abi from 'contracts/abi/erc20.abi.json';
import feesAbi from 'contracts/abi/fees.abi.json';
import { Addresses, VETH_ADDRESS } from 'contracts/addresses';
import { GAS_MULTIPLIER, MAX_AMOUNT } from 'contracts/constants';
import { ethers } from 'ethers';
import { IBalance, IToken } from 'interfaces/swap';
import { useLazyGetTokenPricesQuery } from 'services/api/price';
import { selectCurrentUsdPrice } from 'services/selectors/price';
import balanceTool from 'utils/balance';
import { errorMessage } from 'utils/errorMessage';
import { compare } from 'utils/number';
import { isSameContract } from 'utils/string';

// Almost never return exponential notation:
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const useToken = ({ provider }) => {
  const [tokenPrice] = useLazyGetTokenPricesQuery();

  const getTokenDecimals = async (token: string) => {
    try {
      if (!provider || !token) return;

      if (token !== VETH_ADDRESS) {
        const tokenContract = new ethers.Contract(token, erc20Abi, provider);
        const decimals = await tokenContract.decimals();
        return Number(decimals);
      } else {
        return 18;
      }
    } catch (error) {
      return 0;
    }
  };

  const getTokenName = async (token: string) => {
    try {
      if (!provider || !token) return;

      const tokenContract = new ethers.Contract(token.toString(), erc20Abi, provider);

      const name = await tokenContract.name();
      return name;
    } catch (error) {
      console.log('error', error);
      return '';
    }
  };

  const feeFunctions = async (contractAddress: string) => {
    let res = {
      gasFee: BigInt(0),
      serviceFee: BigInt(0),
      spamFee: BigInt(0),
    };

    try {
      const byteCode = await provider.getCode(contractAddress);
      // No code : "0x" then functionA is definitely not there
      if (byteCode.length <= 2) {
        console.log('No contract');
        return;
      }

      const botContract = new ethers.Contract(contractAddress, feesAbi, provider);
      // If the byteCode doesn't include the function selector fee()
      // is definitely not present
      if (byteCode.includes(ethers.utils.id('fee()').slice(2, 10))) {
        const fee = await botContract.fee();
        res.gasFee = BigInt(fee.toString());
      } else if (byteCode.includes(ethers.utils.id('gas_fee()').slice(2, 10))) {
        const gasFee = await botContract.gas_fee();
        res.gasFee = BigInt(gasFee.toString());
      }

      if (byteCode.includes(ethers.utils.id('service_fee()').slice(2, 10))) {
        const serviceFee = await botContract.service_fee();
        res.serviceFee = BigInt(serviceFee.toString());
      } else if (byteCode.includes(ethers.utils.id('fee_data()').slice(2, 10))) {
        const fees = await botContract.fee_data();
        res.gasFee = BigInt(fees['gas_fee'].toString());
        res.serviceFee = BigInt(fees['service_fee'].toString());
      }

      if (byteCode.includes(ethers.utils.id('spam_fee()').slice(2, 10))) {
        const spamFee = await botContract.spam_fee();
        res.spamFee = BigInt(spamFee.toString());
      }
    } catch (error) {
      console.log(error);
    } finally {
      return res;
    }
  };

  const tokenApprove = async (
    token: IToken,
    account: string,
    spender: string,
    amount: IBalance,
    onWait: (res: any) => void,
    onError: (res: any) => void,
  ) => {
    try {
      // Approve
      if (!isSameContract(token.address)) {
        if (!provider) return;
        await provider.send('eth_requestAccounts', []);

        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(token.address, erc20Abi, signer);
        const allowance = await tokenContract.allowance(account, spender);
        if (compare(allowance.toString(), amount.raw) === -1) {
          // Check if some token amount is already approved.
          if (compare(allowance, 0) === 1) {
            // Approve as 0
            let approveEstimateGas = await tokenContract.estimateGas.approve(spender, 0);
            approveEstimateGas = approveEstimateGas.add(approveEstimateGas.div(GAS_MULTIPLIER));

            onWait({
              txTitle: `Revoke spending cap for your ${token.symbol}`,
              txText: `Approve 0 ${token.symbol}`,
              txHash: 'Approve this transaction on your EVM wallet',
            });

            const { hash: approveHash } = await tokenContract.approve(spender, 0, {
              gasLimit: approveEstimateGas,
            });

            if (approveHash) {
              await provider.waitForTransaction(approveHash);
            }
          }
          // Approve with MAX amount
          let approveEstimateGas = await tokenContract.estimateGas.approve(spender, MAX_AMOUNT);
          approveEstimateGas = approveEstimateGas.add(approveEstimateGas.div(GAS_MULTIPLIER));

          onWait({
            txTitle: 'Waiting for Approval',
            txText: `Approve ${parseFloat(Number(amount.format).toFixed(8))} ${token.symbol}`,
            txHash: 'Approve this transaction on your EVM wallet',
          });

          const { hash: approveHash } = await tokenContract.approve(spender, MAX_AMOUNT, {
            gasLimit: approveEstimateGas,
          });

          if (approveHash) {
            await provider.waitForTransaction(approveHash);
          }
        }
      }

      return true;
    } catch (e) {
      const errorText = errorMessage(e);
      onError(errorText);
      return false;
    }
  };

  const fetchTokenPrice = async (tokenAmount: string | number, tokenAddress: string, chainId: string | number = 1) => {
    const priceData = await tokenPrice({
      network: chainId,
      token: tokenAddress === VETH_ADDRESS ? Addresses[chainId].weth : tokenAddress,
    }).unwrap();
    const exchangeRate = selectCurrentUsdPrice(priceData);

    return balanceTool.convertToDollar(tokenAmount, exchangeRate);
  };

  // Get slippage from input token amount as USD
  const slippageFromPrice = async (
    tokenAmount: string | number,
    tokenAddress: string,
    chainId: string | number = 1,
  ) => {
    try {
      const tokenPrice = await fetchTokenPrice(tokenAmount, tokenAddress, chainId);

      return Number(tokenPrice) > 100000 ? 0.1 : Number(tokenPrice) > 10000 ? 0.5 : 1;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getTokenDecimals,
    getTokenName,
    feeFunctions,
    tokenApprove,
    fetchTokenPrice,
    slippageFromPrice,
  };
};

export default useToken;
