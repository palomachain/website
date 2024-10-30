import { ThirdwebSDK } from '@thirdweb-dev/react';
import { prepareWriteContract, readContract, waitForTransaction, writeContract } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { ChainID } from 'configs/chains';
import { purchaseSupportedNetworks } from 'configs/constants';
import nodesaleContractAbi from 'contracts/abi/nodesale.abi.json';
import { Addresses, VETH_ADDRESS, ZERO_ADDRESS_PALOMA } from 'contracts/addresses';
import { GAS_MULTIPLIER } from 'contracts/constants';
import { ethers } from 'ethers';
import { IBonusBalance } from 'interfaces/nodeSale';
import { IBalance, IToken } from 'interfaces/swap';
import React from 'react';
import balanceTool from 'utils/balance';
import { errorMessage } from 'utils/errorMessage';
import { formatNumber } from 'utils/number';
import { parseIntString } from 'utils/string';
import useToken from './useToken';

const useNodeSale = ({ provider, wallet }) => {
  const { tokenApprove } = useToken({ provider });
  const chainId = wallet?.network ? Number(parseIntString(wallet.network)) : 1;
  const usdcDecimals = chainId === Number(ChainID.BSC_MAIN) ? 18 : 6;
  const contractAddress = Addresses[chainId.toString()].node_sale;

  const getProcessingFeeAmount = async () => {
    try {
      const gasFeeAmount = await readContract({
        address: contractAddress,
        abi: nodesaleContractAbi,
        functionName: 'processing_fee',
        chainId: Number(chainId),
      });

      return Number(gasFeeAmount) / 10 ** usdcDecimals;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const getSubscriptionFeeAmount = async () => {
    try {
      const gasFeeAmount = await readContract({
        address: contractAddress,
        abi: nodesaleContractAbi,
        functionName: 'subscription_fee',
        chainId: Number(chainId),
      });

      return Number(gasFeeAmount) / 10 ** usdcDecimals;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const getSlippageFeePercent = async () => {
    try {
      const gasFeeAmount = await readContract({
        address: contractAddress,
        abi: nodesaleContractAbi,
        functionName: 'slippage_fee_percentage',
        chainId: Number(chainId),
      });

      return Number(gasFeeAmount) / 100; // percentage like if result is 1, 1%
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const getActivate = async (chain = '42161') => {
    try {
      const activates = await readContract({
        address: Addresses[chain].node_sale,
        abi: nodesaleContractAbi,
        functionName: 'activates',
        chainId: Number(chain),
        args: [wallet.account],
      });

      return activates.toString();
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const getBonusAmount = async (address: string) => {
    try {
      let amount: IBonusBalance[] = [];

      // For V1
      const v1ContractAddresses = {
        '1': '0x8050371F14Bb6E2395E936611615BE41237faF02',
        '10': '0x496C48d24a33B1Fd45782537eBd42157Bf265703',
        '56': '0x2f78AfAdD7E58052c4a8789dc01A1eD49848cc0C',
        '137': '0x496C48d24a33B1Fd45782537eBd42157Bf265703',
        '8453': '0x2f78AfAdD7E58052c4a8789dc01A1eD49848cc0C',
        '42161': '0x249cE7e8c5A0f7300f9c45Af70c644b39dABa4dB',
      };
      await Promise.all(
        [1, 10, 56, 137, 8453, 42161].map(async (chain) => {
          const nodesaleAddress = v1ContractAddresses[chain];
          const sdk = new ThirdwebSDK(chain);
          const contract = await sdk.getContract(nodesaleAddress, nodesaleContractAbi);
          const balance = await contract.call('claimable', [address]);

          if (balance && BigNumber(balance.toString()).comparedTo(0) > 0) {
            amount.push({
              chainId: chain,
              amount: {
                raw: balance.toString(),
                format: balanceTool.convertFromWei(balance.toString(), 4, chain === 56 ? 18 : 6),
              },
            });
          }
        }),
      );

      // For V2
      await Promise.all(
        [1, 10, 56, 137, 8453, 42161].map(async (chain) => {
          const nodesaleAddress = Addresses[chain].node_sale;
          const sdk = new ThirdwebSDK(chain);
          const contract = await sdk.getContract(nodesaleAddress, nodesaleContractAbi);
          const balance = await contract.call('claimable', [address]);

          if (balance && BigNumber(balance.toString()).comparedTo(0) > 0) {
            amount.push({
              chainId: chain,
              amount: {
                raw: balance.toString(),
                format: balanceTool.convertFromWei(balance.toString(), 4, chain === 56 ? 18 : 6),
              },
            });
          }
        }),
      );

      return amount;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const activateWallet = async (palomaWallet, chain, isV1: boolean = false) => {
    try {
      if (!provider) return;
      // If WalletConnect
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Almost never return exponential notation:
      BigNumber.config({ EXPONENTIAL_AT: 1e9 });

      const factoryAddress = Addresses[chain].node_sale;
      if (!factoryAddress) return;

      const factoryContract = new ethers.Contract(factoryAddress, nodesaleContractAbi, signer);
      let depositEstimateGas = await factoryContract.estimateGas.activate_wallet(palomaWallet, isV1);
      console.log('Estimating gas...', depositEstimateGas.toString());

      let txHash;
      console.log('Preparing transaction hash...');
      // if (wallet.providerName === 'metamask' || wallet.providerName === 'frame') {
      depositEstimateGas = depositEstimateGas.add(depositEstimateGas.div(GAS_MULTIPLIER));

      const { hash } = await factoryContract.activate_wallet(palomaWallet, isV1, {
        gasLimit: depositEstimateGas,
      });
      txHash = hash;
      // } else {
      //   const { request } = await prepareWriteContract({
      //     address: factoryAddress,
      //     abi: nodesaleContractAbi,
      //     functionName: 'activate_wallet',
      //     account: wallet.account,
      //     args: [palomaWallet, isV1],
      //     chainId: Number(chain),
      //   });
      //   console.log('Preparing deposit function...');
      //   const { hash } = await writeContract(request);
      //   txHash = hash;
      // }
      console.log('Deposit hash', txHash);

      if (txHash) {
        if (wallet.providerName === 'metamask' || wallet.providerName === 'frame') {
          await provider.waitForTransaction(txHash);
        } else {
          // WalletConnect
          await waitForTransaction({ hash: txHash });
        }
      }

      if (txHash) return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const buyNow = async (
    fromToken: IToken,
    node_count: number,
    expectedAmount: IBalance,
    totalCost: string,
    isSubSupport: boolean,
    sub_month: number,
    swapPath: string,
    generatedMyPromocode: string,
    onSuccess = (res) => {},
    onError = (res) => {},
    onWait = (res) => {},
    promo_code?: string,
  ) => {
    try {
      if (!provider) return;
      // If WalletConnect
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Almost never return exponential notation:
      BigNumber.config({ EXPONENTIAL_AT: 1e9 });

      if (contractAddress === '') return;

      const approveResult = await tokenApprove(
        fromToken,
        wallet.account,
        contractAddress,
        expectedAmount,
        onWait,
        onError,
      );
      if (!approveResult) return;

      onWait({
        txTitle: 'Waiting for Purchasing LightNodes Confirmation',
        txText: (
          <span>
            Purchasing <span style={{ textDecoration: 'underline' }}>{node_count} Paloma LightNodes</span>
          </span>
        ),
      });

      const factoryContract = new ethers.Contract(contractAddress, nodesaleContractAbi, signer);

      let txHash: any;

      const isForETH = fromToken.address === VETH_ADDRESS;
      const ethValue = isForETH ? expectedAmount.raw.toFixed(0) : 0;

      let args = [];
      !isForETH && args.push(fromToken.address, expectedAmount.raw.toFixed(0));
      args.push(
        node_count,
        totalCost,
        promo_code && promo_code !== '' ? promo_code : ZERO_ADDRESS_PALOMA,
        swapPath, //
        isSubSupport, // enhanced
        sub_month,
        generatedMyPromocode,
      );
      console.log('args', args);
      console.log('ethValue', ethValue);

      const buyNowFunctionName = isForETH ? 'pay_for_eth' : 'pay_for_token';
      let depositEstimateGas = await factoryContract.estimateGas[buyNowFunctionName](...args, {
        value: ethValue,
      });
      console.log('Estimating gas...', depositEstimateGas.toString());

      console.log('Preparing transaction hash...');
      // if (wallet.providerName === 'metamask' || wallet.providerName === 'frame') {
      depositEstimateGas = depositEstimateGas.add(depositEstimateGas.div(GAS_MULTIPLIER));

      const { hash } = await factoryContract[buyNowFunctionName](...args, {
        value: ethValue,
        gasLimit: depositEstimateGas,
      });
      txHash = hash;
      // } else {
      //   const { request } = await prepareWriteContract({
      //     address: contractAddress,
      //     abi: nodesaleContractAbi,
      //     functionName: buyNowFunctionName,
      //     account: wallet.account,
      //     args: args,
      //     value: ethValue,
      //     chainId: Number(chainId),
      //   });
      //   console.log('Preparing deposit function...');
      //   const { hash } = await writeContract(request);
      //   txHash = hash;
      // }
      console.log('Deposit hash', txHash);

      onWait({
        txTitle: 'Processing Transaction...',
        txText: (
          <p>
            Purchasing <span style={{ textDecoration: 'underline' }}>{node_count} Paloma LightNodes</span>
          </p>
        ),
        txHash: '',
        txProcessing: true,
      });

      if (txHash) {
        if (wallet.providerName === 'metamask' || wallet.providerName === 'frame') {
          await provider.waitForTransaction(txHash);
        } else {
          // WalletConnect
          await waitForTransaction({ hash: txHash, chainId: Number(chainId) });
        }
      }

      onSuccess({
        hash: txHash,
      });
    } catch (e) {
      const errorText = errorMessage(e);
      onError(errorText);
    }
  };

  const claimBonus = async (bonus: IBonusBalance, onError = (res) => {}, onWait = (res) => {}) => {
    try {
      if (!provider) return;
      // If WalletConnect
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Almost never return exponential notation:
      BigNumber.config({ EXPONENTIAL_AT: 1e9 });

      onWait({
        txTitle: 'Waiting for Claiming referral Bonus Confirmation',
        txText: (
          <span>
            Claim{' '}
            <span style={{ textDecoration: 'underline' }}>
              {formatNumber(bonus.amount.format, 0, 2)} USDC on {purchaseSupportedNetworks[bonus.chainId.toString()]}{' '}
              Network
            </span>
          </span>
        ),
      });

      const factoryAddress = Addresses[bonus.chainId.toString()].node_sale;
      if (!factoryAddress) return;

      const factoryContract = new ethers.Contract(factoryAddress, nodesaleContractAbi, signer);
      let depositEstimateGas = await factoryContract.estimateGas.claim();
      console.log('Estimating gas...', depositEstimateGas.toString());

      let txHash;
      console.log('Preparing transaction hash...');
      // if (wallet.providerName === 'metamask' || wallet.providerName === 'frame') {
      depositEstimateGas = depositEstimateGas.add(depositEstimateGas.div(GAS_MULTIPLIER));

      const { hash } = await factoryContract.claim({
        gasLimit: depositEstimateGas,
      });
      txHash = hash;
      // } else {
      //   const { request } = await prepareWriteContract({
      //     address: factoryAddress,
      //     abi: nodesaleContractAbi,
      //     functionName: 'claim',
      //     account: wallet.account,
      //     chainId: Number(bonus.chainId),
      //   });
      //   console.log('Preparing deposit function...');
      //   const { hash } = await writeContract(request);
      //   txHash = hash;
      // }
      console.log('Deposit hash', txHash);

      onWait({
        txTitle: 'Processing Transaction...',
        txText: (
          <p>
            Claiming Referral Bonus:{' '}
            <span style={{ textDecoration: 'underline' }}>{formatNumber(bonus.amount.format, 0, 2)} USDC</span> on{' '}
            {purchaseSupportedNetworks[bonus.chainId.toString()]} Network
          </p>
        ),
        txHash: '',
        txProcessing: true,
      });

      if (txHash) {
        if (wallet.providerName === 'metamask' || wallet.providerName === 'frame') {
          await provider.waitForTransaction(txHash);
        } else {
          // WalletConnect
          await waitForTransaction({ hash: txHash });
        }
      }

      return Number(bonus.amount.format);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  return {
    getProcessingFeeAmount,
    getSubscriptionFeeAmount,
    getSlippageFeePercent,
    getActivate,
    getBonusAmount,
    activateWallet,
    buyNow,
    claimBonus,
  };
};

export default useNodeSale;
