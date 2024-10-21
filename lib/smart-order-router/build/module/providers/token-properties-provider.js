import { getAddressLowerCase, log, metric, MetricLoggerUnit } from '../util';
import { DEFAULT_TOKEN_FEE_RESULT, } from './token-fee-fetcher';
import { DEFAULT_ALLOWLIST, TokenValidationResult, } from './token-validator-provider';
export const DEFAULT_TOKEN_PROPERTIES_RESULT = {
    tokenFeeResult: DEFAULT_TOKEN_FEE_RESULT,
};
export const POSITIVE_CACHE_ENTRY_TTL = 1200; // 20 minutes in seconds
export const NEGATIVE_CACHE_ENTRY_TTL = 1200; // 20 minutes in seconds
export class TokenPropertiesProvider {
    constructor(chainId, tokenPropertiesCache, tokenFeeFetcher, allowList = DEFAULT_ALLOWLIST, positiveCacheEntryTTL = POSITIVE_CACHE_ENTRY_TTL, negativeCacheEntryTTL = NEGATIVE_CACHE_ENTRY_TTL) {
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
                metric.putMetric('TokenPropertiesProviderBatchGetCacheHit', 1, MetricLoggerUnit.Count);
                const tokenFee = cachedValue.tokenFeeResult;
                const tokenFeeResultExists = tokenFee && (tokenFee.buyFeeBps || tokenFee.sellFeeBps);
                if (tokenFeeResultExists) {
                    metric.putMetric(`TokenPropertiesProviderCacheHitTokenFeeResultExists${tokenFeeResultExists}`, 1, MetricLoggerUnit.Count);
                }
                else {
                    metric.putMetric(`TokenPropertiesProviderCacheHitTokenFeeResultNotExists`, 1, MetricLoggerUnit.Count);
                }
                tokenToResult[address] = cachedValue;
            }
            else if (this.allowList.has(address)) {
                tokenToResult[address] = {
                    tokenValidationResult: TokenValidationResult.UNKN,
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
                log.error({ err }, `Error fetching fees for tokens ${addressesToFetchFeesOnchain}`);
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
                    metric.putMetric(`TokenPropertiesProviderTokenFeeResultCacheMissExists${tokenFeeResultExists}`, 1, MetricLoggerUnit.Count);
                    const tokenPropertiesResult = {
                        tokenFeeResult: tokenFee,
                        tokenValidationResult: TokenValidationResult.FOT,
                    };
                    tokenToResult[address] = tokenPropertiesResult;
                    metric.putMetric('TokenPropertiesProviderBatchGetCacheMiss', 1, MetricLoggerUnit.Count);
                    // update cache concurrently
                    // at this point, we are confident that the tokens are FOT, so we can hardcode the validation result
                    return this.tokenPropertiesCache.set(this.CACHE_KEY(this.chainId, address), tokenPropertiesResult, this.positiveCacheEntryTTL);
                }
                else {
                    metric.putMetric(`TokenPropertiesProviderTokenFeeResultCacheMissNotExists`, 1, MetricLoggerUnit.Count);
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
            const address = getAddressLowerCase(currency);
            if (!addressesRaw.has(address)) {
                addressesRaw.add(address);
            }
        }
        return addressesRaw;
    }
    buildAddressesCacheKeys(currencies) {
        const addressesCacheKeys = new Set();
        for (const currency of currencies) {
            const addressCacheKey = this.CACHE_KEY(this.chainId, getAddressLowerCase(currency));
            if (!addressesCacheKeys.has(addressCacheKey)) {
                addressesCacheKeys.add(addressCacheKey);
            }
        }
        return addressesCacheKeys;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tcHJvcGVydGllcy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdG9rZW4tcHJvcGVydGllcy1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUk3RSxPQUFPLEVBQ0wsd0JBQXdCLEdBSXpCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSw0QkFBNEIsQ0FBQztBQUVwQyxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBMEI7SUFDcEUsY0FBYyxFQUFFLHdCQUF3QjtDQUN6QyxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLENBQUMsd0JBQXdCO0FBQ3RFLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxDQUFDLHdCQUF3QjtBQWdCdEUsTUFBTSxPQUFPLHVCQUF1QjtJQUlsQyxZQUNVLE9BQWdCLEVBQ2hCLG9CQUFtRCxFQUNuRCxlQUFpQyxFQUNqQyxZQUFZLGlCQUFpQixFQUM3Qix3QkFBd0Isd0JBQXdCLEVBQ2hELHdCQUF3Qix3QkFBd0I7UUFMaEQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQStCO1FBQ25ELG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUNqQyxjQUFTLEdBQVQsU0FBUyxDQUFvQjtRQUM3QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQTJCO1FBQ2hELDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBMkI7UUFUbEQsY0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxPQUFlLEVBQUUsRUFBRSxDQUN4RCxvQkFBb0IsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lB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