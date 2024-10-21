"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPropertiesProvider = exports.NEGATIVE_CACHE_ENTRY_TTL = exports.POSITIVE_CACHE_ENTRY_TTL = exports.DEFAULT_TOKEN_PROPERTIES_RESULT = void 0;
const util_1 = require("../util");
const token_fee_fetcher_1 = require("./token-fee-fetcher");
const token_validator_provider_1 = require("./token-validator-provider");
exports.DEFAULT_TOKEN_PROPERTIES_RESULT = {
    tokenFeeResult: token_fee_fetcher_1.DEFAULT_TOKEN_FEE_RESULT,
};
exports.POSITIVE_CACHE_ENTRY_TTL = 1200; // 20 minutes in seconds
exports.NEGATIVE_CACHE_ENTRY_TTL = 1200; // 20 minutes in seconds
class TokenPropertiesProvider {
    constructor(chainId, tokenPropertiesCache, tokenFeeFetcher, allowList = token_validator_provider_1.DEFAULT_ALLOWLIST, positiveCacheEntryTTL = exports.POSITIVE_CACHE_ENTRY_TTL, negativeCacheEntryTTL = exports.NEGATIVE_CACHE_ENTRY_TTL) {
        this.chainId = chainId;
        this.tokenPropertiesCache = tokenPropertiesCache;
        this.tokenFeeFetcher = tokenFeeFetcher;
        this.allowList = allowList;
        this.positiveCacheEntryTTL = positiveCacheEntryTTL;
        this.negativeCacheEntryTTL = negativeCacheEntryTTL;
        this.CACHE_KEY = (chainId, address) => `token-properties-${chainId}-${address}`;
    }
    async getTokensProperties(currencies, providerConfig) {
        const tokenToResult = {};
        if (!(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.enableFeeOnTransferFeeFetching)) {
            return tokenToResult;
        }
        const addressesToFetchFeesOnchain = [];
        const addressesRaw = this.buildAddressesRaw(currencies);
        const addressesCacheKeys = this.buildAddressesCacheKeys(currencies);
        const tokenProperties = await this.tokenPropertiesCache.batchGet(addressesCacheKeys);
        // Check if we have cached token validation results for any tokens.
        for (const address of addressesRaw) {
            const cachedValue = tokenProperties[this.CACHE_KEY(this.chainId, address.toLowerCase())];
            if (cachedValue) {
                util_1.metric.putMetric('TokenPropertiesProviderBatchGetCacheHit', 1, util_1.MetricLoggerUnit.Count);
                const tokenFee = cachedValue.tokenFeeResult;
                const tokenFeeResultExists = tokenFee && (tokenFee.buyFeeBps || tokenFee.sellFeeBps);
                if (tokenFeeResultExists) {
                    util_1.metric.putMetric(`TokenPropertiesProviderCacheHitTokenFeeResultExists${tokenFeeResultExists}`, 1, util_1.MetricLoggerUnit.Count);
                }
                else {
                    util_1.metric.putMetric(`TokenPropertiesProviderCacheHitTokenFeeResultNotExists`, 1, util_1.MetricLoggerUnit.Count);
                }
                tokenToResult[address] = cachedValue;
            }
            else if (this.allowList.has(address)) {
                tokenToResult[address] = {
                    tokenValidationResult: token_validator_provider_1.TokenValidationResult.UNKN,
                };
            }
            else {
                addressesToFetchFeesOnchain.push(address);
            }
        }
        if (addressesToFetchFeesOnchain.length > 0) {
            let tokenFeeMap = {};
            try {
                tokenFeeMap = await this.tokenFeeFetcher.fetchFees(addressesToFetchFeesOnchain, providerConfig);
            }
            catch (err) {
                util_1.log.error({ err }, `Error fetching fees for tokens ${addressesToFetchFeesOnchain}`);
            }
            await Promise.all(addressesToFetchFeesOnchain.map((address) => {
                const tokenFee = tokenFeeMap[address];
                const tokenFeeResultExists = tokenFee && (tokenFee.buyFeeBps || tokenFee.sellFeeBps);
                if (tokenFeeResultExists) {
                    // we will leverage the metric to log the token fee result, if it exists
                    // the idea is that the token fee should not differ by too much across tokens,
                    // so that we can accurately log the token fee for a particular quote request (without breaching metrics dimensionality limit)
                    // in the form of metrics.
                    // if we log as logging, given prod traffic volume, the logging volume will be high.
                    util_1.metric.putMetric(`TokenPropertiesProviderTokenFeeResultCacheMissExists${tokenFeeResultExists}`, 1, util_1.MetricLoggerUnit.Count);
                    const tokenPropertiesResult = {
                        tokenFeeResult: tokenFee,
                        tokenValidationResult: token_validator_provider_1.TokenValidationResult.FOT,
                    };
                    tokenToResult[address] = tokenPropertiesResult;
                    util_1.metric.putMetric('TokenPropertiesProviderBatchGetCacheMiss', 1, util_1.MetricLoggerUnit.Count);
                    // update cache concurrently
                    // at this point, we are confident that the tokens are FOT, so we can hardcode the validation result
                    return this.tokenPropertiesCache.set(this.CACHE_KEY(this.chainId, address), tokenPropertiesResult, this.positiveCacheEntryTTL);
                }
                else {
                    util_1.metric.putMetric(`TokenPropertiesProviderTokenFeeResultCacheMissNotExists`, 1, util_1.MetricLoggerUnit.Count);
                    const tokenPropertiesResult = {
                        tokenFeeResult: undefined,
                        tokenValidationResult: undefined,
                    };
                    tokenToResult[address] = tokenPropertiesResult;
                    return this.tokenPropertiesCache.set(this.CACHE_KEY(this.chainId, address), tokenPropertiesResult, this.negativeCacheEntryTTL);
                }
            }));
        }
        return tokenToResult;
    }
    buildAddressesRaw(currencies) {
        const addressesRaw = new Set();
        for (const currency of currencies) {
            const address = (0, util_1.getAddressLowerCase)(currency);
            if (!addressesRaw.has(address)) {
                addressesRaw.add(address);
            }
        }
        return addressesRaw;
    }
    buildAddressesCacheKeys(currencies) {
        const addressesCacheKeys = new Set();
        for (const currency of currencies) {
            const addressCacheKey = this.CACHE_KEY(this.chainId, (0, util_1.getAddressLowerCase)(currency));
            if (!addressesCacheKeys.has(addressCacheKey)) {
                addressesCacheKeys.add(addressCacheKey);
            }
        }
        return addressesCacheKeys;
    }
}
exports.TokenPropertiesProvider = TokenPropertiesProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tcHJvcGVydGllcy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdG9rZW4tcHJvcGVydGllcy1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxrQ0FBNkU7QUFJN0UsMkRBSzZCO0FBQzdCLHlFQUdvQztBQUV2QixRQUFBLCtCQUErQixHQUEwQjtJQUNwRSxjQUFjLEVBQUUsNENBQXdCO0NBQ3pDLENBQUM7QUFDVyxRQUFBLHdCQUF3QixHQUFHLElBQUksQ0FBQyxDQUFDLHdCQUF3QjtBQUN6RCxRQUFBLHdCQUF3QixHQUFHLElBQUksQ0FBQyxDQUFDLHdCQUF3QjtBQWdCdEUsTUFBYSx1QkFBdUI7SUFJbEMsWUFDVSxPQUFnQixFQUNoQixvQkFBbUQsRUFDbkQsZUFBaUMsRUFDakMsWUFBWSw0Q0FBaUIsRUFDN0Isd0JBQXdCLGdDQUF3QixFQUNoRCx3QkFBd0IsZ0NBQXdCO1FBTGhELFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUErQjtRQUNuRCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFDakMsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFDN0IsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUEyQjtRQUNoRCwwQkFBcUIsR0FBckIscUJBQXFCLENBQTJCO1FBVGxELGNBQVMsR0FBRyxDQUFDLE9BQWdCLEVBQUUsT0FBZSxFQUFFLEVBQUUsQ0FDeEQsb0JBQW9CLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztJQVN4QyxDQUFDO0lBRUcsS0FBSyxDQUFDLG1CQUFtQixDQUM5QixVQUFzQixFQUN0QixjQUErQjtRQUUvQixNQUFNLGFBQWEsR0FBdUIsRUFBRSxDQUFDO1FBRTdDLElBQUksQ0FBQyxDQUFBLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSw4QkFBOEIsQ0FBQSxFQUFFO1lBQ25ELE9BQU8sYUFBYSxD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