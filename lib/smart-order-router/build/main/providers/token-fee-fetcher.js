"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainTokenFeeFetcher = exports.DEFAULT_TOKEN_FEE_RESULT = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const sdk_core_1 = require("@uniswap/sdk-core");
const TokenFeeDetector__factory_1 = require("../types/other/factories/TokenFeeDetector__factory");
const util_1 = require("../util");
const DEFAULT_TOKEN_BUY_FEE_BPS = bignumber_1.BigNumber.from(0);
const DEFAULT_TOKEN_SELL_FEE_BPS = bignumber_1.BigNumber.from(0);
// on detector failure, assume no fee
exports.DEFAULT_TOKEN_FEE_RESULT = {
    buyFeeBps: DEFAULT_TOKEN_BUY_FEE_BPS,
    sellFeeBps: DEFAULT_TOKEN_SELL_FEE_BPS,
};
// address at which the FeeDetector lens is deployed
const FEE_DETECTOR_ADDRESS = (chainId) => {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
            return '0xbc708B192552e19A088b4C4B8772aEeA83bCf760';
        case sdk_core_1.ChainId.OPTIMISM:
            return '0x95aDC98A949dCD94645A8cD56830D86e4Cf34Eff';
        case sdk_core_1.ChainId.BNB:
            return '0xCF6220e4496B091a6b391D48e770f1FbaC63E740';
        case sdk_core_1.ChainId.POLYGON:
            return '0xC988e19819a63C0e487c6Ad8d6668Ac773923BF2';
        case sdk_core_1.ChainId.BASE:
            return '0xCF6220e4496B091a6b391D48e770f1FbaC63E740';
        case sdk_core_1.ChainId.ARBITRUM_ONE:
            return '0x37324D81e318260DC4f0fCb68035028eFdE6F50e';
        case sdk_core_1.ChainId.CELO:
            return '0x8eEa35913DdeD795001562f9bA5b282d3ac04B60';
        case sdk_core_1.ChainId.AVALANCHE:
            return '0x8269d47c4910B8c87789aA0eC128C11A8614dfC8';
        case sdk_core_1.ChainId.WORLDCHAIN:
            return '0xbc708B192552e19A088b4C4B8772aEeA83bCf760';
        case sdk_core_1.ChainId.ASTROCHAIN_SEPOLIA:
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
class OnChainTokenFeeFetcher {
    constructor(chainId, rpcProvider, tokenFeeAddress = FEE_DETECTOR_ADDRESS(chainId), gasLimitPerCall = GAS_LIMIT_PER_VALIDATE, amountToFlashBorrow = AMOUNT_TO_FLASH_BORROW) {
        var _a;
        this.chainId = chainId;
        this.tokenFeeAddress = tokenFeeAddress;
        this.gasLimitPerCall = gasLimitPerCall;
        this.amountToFlashBorrow = amountToFlashBorrow;
        this.BASE_TOKEN = (_a = util_1.WRAPPED_NATIVE_CURRENCY[this.chainId]) === null || _a === void 0 ? void 0 : _a.address;
        this.contract = TokenFeeDetector__factory_1.TokenFeeDetector__factory.connect(this.tokenFeeAddress, rpcProvider);
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
                util_1.metric.putMetric('TokenFeeFetcherFetchFeesSuccess', 1, util_1.MetricLoggerUnit.Count);
                return Object.assign({ address }, feeResult);
            }
            catch (err) {
                util_1.log.error({ err }, `Error calling validate on-chain for token ${address}`);
                util_1.metric.putMetric('TokenFeeFetcherFetchFeesFailure', 1, util_1.MetricLoggerUnit.Count);
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
exports.OnChainTokenFeeFetcher = OnChainTokenFeeFetcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tZmVlLWZldGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rva2VuLWZlZS1mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUFxRDtBQUVyRCxnREFBNEM7QUFFNUMsa0dBQStGO0FBRS9GLGtDQUtpQjtBQUlqQixNQUFNLHlCQUF5QixHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sMEJBQTBCLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFckQscUNBQXFDO0FBQ3hCLFFBQUEsd0JBQXdCLEdBQUc7SUFDdEMsU0FBUyxFQUFFLHlCQUF5QjtJQUNwQyxVQUFVLEVBQUUsMEJBQTBCO0NBQ3ZDLENBQUM7QUFhRixvREFBb0Q7QUFDcEQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtJQUNoRCxRQUFRLE9BQU8sRUFBRTtRQUNmLEtBQUssa0JBQU8sQ0FBQyxPQUFPO1lBQ2xCLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxrQkFBTyxDQUFDLFFBQVE7WUFDbkIsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLGtCQUFPLENBQUMsR0FBRztZQUNkLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxrQkFBTyxDQUFDLE9BQU87WUFDbEIsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLGtCQUFPLENBQUMsSUFBSTtZQUNmLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxrQkFBTyxDQUFDLFlBQVk7WUFDdkIsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLGtCQUFPLENBQUMsSUFBSTtZQUNmLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxrQkFBTyxDQUFDLFNBQVM7WUFDcEIsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLGtCQUFPLENBQUMs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