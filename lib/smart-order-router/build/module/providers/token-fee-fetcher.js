import { BigNumber } from '@ethersproject/bignumber';
import { ChainId } from '@uniswap/sdk-core';
import { TokenFeeDetector__factory } from '../types/other/factories/TokenFeeDetector__factory';
import { log, metric, MetricLoggerUnit, WRAPPED_NATIVE_CURRENCY, } from '../util';
const DEFAULT_TOKEN_BUY_FEE_BPS = BigNumber.from(0);
const DEFAULT_TOKEN_SELL_FEE_BPS = BigNumber.from(0);
// on detector failure, assume no fee
export const DEFAULT_TOKEN_FEE_RESULT = {
    buyFeeBps: DEFAULT_TOKEN_BUY_FEE_BPS,
    sellFeeBps: DEFAULT_TOKEN_SELL_FEE_BPS,
};
// address at which the FeeDetector lens is deployed
const FEE_DETECTOR_ADDRESS = (chainId) => {
    switch (chainId) {
        case ChainId.MAINNET:
            return '0xbc708B192552e19A088b4C4B8772aEeA83bCf760';
        case ChainId.OPTIMISM:
            return '0x95aDC98A949dCD94645A8cD56830D86e4Cf34Eff';
        case ChainId.BNB:
            return '0xCF6220e4496B091a6b391D48e770f1FbaC63E740';
        case ChainId.POLYGON:
            return '0xC988e19819a63C0e487c6Ad8d6668Ac773923BF2';
        case ChainId.BASE:
            return '0xCF6220e4496B091a6b391D48e770f1FbaC63E740';
        case ChainId.ARBITRUM_ONE:
            return '0x37324D81e318260DC4f0fCb68035028eFdE6F50e';
        case ChainId.CELO:
            return '0x8eEa35913DdeD795001562f9bA5b282d3ac04B60';
        case ChainId.AVALANCHE:
            return '0x8269d47c4910B8c87789aA0eC128C11A8614dfC8';
        case ChainId.WORLDCHAIN:
            return '0xbc708B192552e19A088b4C4B8772aEeA83bCf760';
        case ChainId.ASTROCHAIN_SEPOLIA:
            return '0xbc708B192552e19A088b4C4B8772aEeA83bCf760';
        default:
            // just default to mainnet contract
            return '0xbc708B192552e19A088b4C4B8772aEeA83bCf760';
    }
};
// Amount has to be big enough to avoid rounding errors, but small enough that
// most v2 pools will have at least this many token units
// 100000 is the smallest number that avoids rounding errors in bps terms
// 10000 was not sufficient due to rounding errors for rebase token (e.g. stETH)
const AMOUNT_TO_FLASH_BORROW = '100000';
// 1M gas limit per validate call, should cover most swap cases
const GAS_LIMIT_PER_VALIDATE = 1000000;
export class OnChainTokenFeeFetcher {
    constructor(chainId, rpcProvider, tokenFeeAddress = FEE_DETECTOR_ADDRESS(chainId), gasLimitPerCall = GAS_LIMIT_PER_VALIDATE, amountToFlashBorrow = AMOUNT_TO_FLASH_BORROW) {
        var _a;
        this.chainId = chainId;
        this.tokenFeeAddress = tokenFeeAddress;
        this.gasLimitPerCall = gasLimitPerCall;
        this.amountToFlashBorrow = amountToFlashBorrow;
        this.BASE_TOKEN = (_a = WRAPPED_NATIVE_CURRENCY[this.chainId]) === null || _a === void 0 ? void 0 : _a.address;
        this.contract = TokenFeeDetector__factory.connect(this.tokenFeeAddress, rpcProvider);
    }
    async fetchFees(addresses, providerConfig) {
        const tokenToResult = {};
        const addressesWithoutBaseToken = addresses.filter((address) => address.toLowerCase() !== this.BASE_TOKEN.toLowerCase());
        const functionParams = addressesWithoutBaseToken.map((address) => [
            address,
            this.BASE_TOKEN,
            this.amountToFlashBorrow,
        ]);
        const results = await Promise.all(functionParams.map(async ([address, baseToken, amountToBorrow]) => {
            try {
                // We use the validate function instead of batchValidate to avoid poison pill problem.
                // One token that consumes too much gas could cause the entire batch to fail.
                const feeResult = await this.contract.callStatic.validate(address, baseToken, amountToBorrow, {
                    gasLimit: this.gasLimitPerCall,
                    blockTag: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber,
                });
                metric.putMetric('TokenFeeFetcherFetchFeesSuccess', 1, MetricLoggerUnit.Count);
                return { address, ...feeResult };
            }
            catch (err) {
                log.error({ err }, `Error calling validate on-chain for token ${address}`);
                metric.putMetric('TokenFeeFetcherFetchFeesFailure', 1, MetricLoggerUnit.Count);
                // in case of FOT token fee fetch failure, we return null
                // so that they won't get returned from the token-fee-fetcher
                // and thus no fee will be applied, and the cache won't cache on FOT tokens with failed fee fetching
                return {
                    address,
                    buyFeeBps: undefined,
                    sellFeeBps: undefined,
                    feeTakenOnTransfer: false,
                    externalTransferFailed: false,
                    sellReverted: false,
                };
            }
        }));
        results.forEach(({ address, buyFeeBps, sellFeeBps, feeTakenOnTransfer, externalTransferFailed, sellReverted, }) => {
            if (buyFeeBps || sellFeeBps) {
                tokenToResult[address] = {
                    buyFeeBps,
                    sellFeeBps,
                    feeTakenOnTransfer,
                    externalTransferFailed,
                    sellReverted,
                };
            }
        });
        return tokenToResult;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tZmVlLWZldGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rva2VuLWZlZS1mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVyRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFNUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFFL0YsT0FBTyxFQUNMLEdBQUcsRUFDSCxNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLHVCQUF1QixHQUN4QixNQUFNLFNBQVMsQ0FBQztBQUlqQixNQUFNLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsTUFBTSwwQkFBMEIsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXJELHFDQUFxQztBQUNyQyxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRztJQUN0QyxTQUFTLEVBQUUseUJBQXlCO0lBQ3BDLFVBQVUsRUFBRSwwQkFBMEI7Q0FDdkMsQ0FBQztBQWFGLG9EQUFvRDtBQUNwRCxNQUFNLG9CQUFvQixHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFO0lBQ2hELFFBQVEsT0FBTyxFQUFFO1FBQ2YsS0FBSyxPQUFPLENBQUMsT0FBTztZQUNsQixPQUFPLDRDQUE0QyxDQUFDO1FBQ3RELEtBQUssT0FBTyxDQUFDLFFBQVE7WUFDbkIsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLE9BQU8sQ0FBQyxHQUFHO1lBQ2QsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLE9BQU8sQ0FBQyxPQUFPO1lBQ2xCLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxPQUFPLENBQUMsSUFBSTtZQUNmLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxPQUFP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