"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainQuoteProvider = exports.ProviderGasError = exports.ProviderTimeoutError = exports.ProviderBlockHeaderError = exports.SuccessRateError = exports.BlockConflictError = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
const async_retry_1 = __importDefault(require("async-retry"));
const lodash_1 = __importDefault(require("lodash"));
const stats_lite_1 = __importDefault(require("stats-lite"));
const router_1 = require("../routers/router");
const IMixedRouteQuoterV1__factory_1 = require("../types/other/factories/IMixedRouteQuoterV1__factory");
const MixedRouteQuoterV2__factory_1 = require("../types/other/factories/MixedRouteQuoterV2__factory");
const V4Quoter__factory_1 = require("../types/other/factories/V4Quoter__factory");
const IQuoterV2__factory_1 = require("../types/v3/factories/IQuoterV2__factory");
const util_1 = require("../util");
const log_1 = require("../util/log");
const onchainQuoteProviderConfigs_1 = require("../util/onchainQuoteProviderConfigs");
const routes_1 = require("../util/routes");
class BlockConflictError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'BlockConflictError';
    }
}
exports.BlockConflictError = BlockConflictError;
class SuccessRateError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'SuccessRateError';
    }
}
exports.SuccessRateError = SuccessRateError;
class ProviderBlockHeaderError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderBlockHeaderError';
    }
}
exports.ProviderBlockHeaderError = ProviderBlockHeaderError;
class ProviderTimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderTimeoutError';
    }
}
exports.ProviderTimeoutError = ProviderTimeoutError;
/**
 * This error typically means that the gas used by the multicall has
 * exceeded the total call gas limit set by the node provider.
 *
 * This can be resolved by modifying BatchParams to request fewer
 * quotes per call, or to set a lower gas limit per quote.
 *
 * @export
 * @class ProviderGasError
 */
class ProviderGasError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderGasError';
    }
}
exports.ProviderGasError = ProviderGasError;
const DEFAULT_BATCH_RETRIES = 2;
/**
 * Computes on chain quotes for swaps. For pure V3 routes, quotes are computed on-chain using
 * the 'QuoterV2' smart contract. For exactIn mixed and V2 routes, quotes are computed using the 'MixedRouteQuoterV1' contract
 * This is because computing quotes off-chain would require fetching all the tick data for each pool, which is a lot of data.
 *
 * To minimize the number of requests for quotes we use a Multicall contract. Generally
 * the number of quotes to fetch exceeds the maximum we can fit in a single multicall
 * while staying under gas limits, so we also batch these quotes across multiple multicalls.
 *
 * The biggest challenge with the quote provider is dealing with various gas limits.
 * Each provider sets a limit on the amount of gas a call can consume (on Infura this
 * is approximately 10x the block max size), so we must ensure each multicall does not
 * exceed this limit. Additionally, each quote on V3 can consume a large number of gas if
 * the pool lacks liquidity and the swap would cause all the ticks to be traversed.
 *
 * To ensure we don't exceed the node's call limit, we limit the gas used by each quote to
 * a specific value, and we limit the number of quotes in each multicall request. Users of this
 * class should set BatchParams such that multicallChunk * gasLimitPerCall is less than their node
 * providers total gas limit per call.
 *
 * @export
 * @class OnChainQuoteProvider
 */
class OnChainQuoteProvider {
    /**
     * Creates an instance of OnChainQuoteProvider.
     *
     * @param chainId The chain to get quotes for.
     * @param provider The web 3 provider.
     * @param multicall2Provider The multicall provider to use to get the quotes on-chain.
     * Only supports the Uniswap Multicall contract as it needs the gas limitting functionality.
     * @param retryOptions The retry options for each call to the multicall.
     * @param batchParams The parameters for each batched call to the multicall.
     * @param gasErrorFailureOverride The gas and chunk parameters to use when retrying a batch that failed due to out of gas.
     * @param successRateFailureOverrides The parameters for retries when we fail to get quotes.
     * @param blockNumberConfig Parameters for adjusting which block we get quotes from, and how to handle block header not found errors.
     * @param [quoterAddressOverride] Overrides the address of the quoter contract to use.
     * @param metricsPrefix metrics prefix to differentiate between different instances of the quote provider.
     */
    constructor(chainId, provider, 
    // Only supports Uniswap Multicall as it needs the gas limitting functionality.
    multicall2Provider, 
    // retryOptions, batchParams, and gasErrorFailureOverride are always override in alpha-router
    // so below default values are always not going to be picked up in prod.
    // So we will not extract out below default values into constants.
    retryOptions = {
        retries: DEFAULT_BATCH_RETRIES,
        minTimeout: 25,
        maxTimeout: 250,
    }, batchParams = (_optimisticCachedRoutes, _protocol) => {
        return {
            multicallChunk: 150,
            gasLimitPerCall: 1000000,
            quoteMinSuccessRate: 0.2,
        };
    }, gasErrorFailureOverride = (_protocol) => {
        return {
            gasLimitOverride: 1500000,
            multicallChunk: 100,
        };
    }, 
    // successRateFailureOverrides and blockNumberConfig are not always override in alpha-router.
    // So we will extract out below default values into constants.
    // In alpha-router default case, we will also define the constants with same values as below.
    successRateFailureOverrides = (_protocol) => {
        return onchainQuoteProviderConfigs_1.DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES;
    }, blockNumberConfig = (_protocol) => {
        return onchainQuoteProviderConfigs_1.DEFAULT_BLOCK_NUMBER_CONFIGS;
    }, quoterAddressOverride, metricsPrefix = (chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes) => useMixedRouteQuoter
        ? `ChainId_${chainId}_${protocol}RouteQuoter${mixedRouteContainsV4Pool ? 'V2' : 'V1'}_OptimisticCachedRoutes${optimisticCachedRoutes}_`
        : `ChainId_${chainId}_${protocol}Quoter_OptimisticCachedRoutes${optimisticCachedRoutes}_`) {
        this.chainId = chainId;
        this.provider = provider;
        this.multicall2Provider = multicall2Provider;
        this.retryOptions = retryOptions;
        this.batchParams = batchParams;
        this.gasErrorFailureOverride = gasErrorFailureOverride;
        this.successRateFailureOverrides = successRateFailureOverrides;
        this.blockNumberConfig = blockNumberConfig;
        this.quoterAddressOverride = quoterAddressOverride;
        this.metricsPrefix = metricsPrefix;
    }
    getQuoterAddress(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol) {
        if (this.quoterAddressOverride) {
            const quoterAddress = this.quoterAddressOverride(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol);
            if (!quoterAddress) {
                throw new Error(`No address for the quoter contract on chain id: ${this.chainId}`);
            }
            return quoterAddress;
        }
        const quoterAddress = useMixedRouteQuoter
            ? mixedRouteContainsV4Pool
                ? util_1.MIXED_ROUTE_QUOTER_V2_ADDRESSES[this.chainId]
                : util_1.MIXED_ROUTE_QUOTER_V1_ADDRESSES[this.chainId]
            : protocol === router_sdk_1.Protocol.V3
                ? util_1.NEW_QUOTER_V2_ADDRESSES[this.chainId]
                : util_1.PROTOCOL_V4_QUOTER_ADDRESSES[this.chainId];
        if (!quoterAddress) {
            throw new Error(`No address for the quoter contract on chain id: ${this.chainId}`);
        }
        return quoterAddress;
    }
    async getQuotesManyExactIn(amountIns, routes, providerConfig) {
        return this.getQuotesManyData(amountIns, routes, 'quoteExactInput', providerConfig);
    }
    async getQuotesManyExactOut(amountOuts, routes, providerConfig) {
        return this.getQuotesManyData(amountOuts, routes, 'quoteExactOutput', providerConfig);
    }
    encodeRouteToPath(route, functionName) {
        switch (route.protocol) {
            case router_sdk_1.Protocol.V3:
                return (0, v3_sdk_1.encodeRouteToPath)(route, functionName == 'quoteExactOutput' // For exactOut must be true to ensure the routes are reversed.
                );
            case router_sdk_1.Protocol.V4:
                return (0, v4_sdk_1.encodeRouteToPath)(route, functionName == 'quoteExactOutput');
            // We don't have onchain V2 quoter, but we do have a mixed quoter that can quote against v2 routes onchain
            // Hence in case of V2 or mixed, we explicitly encode into mixed routes.
            case router_sdk_1.Protocol.V2:
            case router_sdk_1.Protocol.MIXED:
                return (0, router_sdk_1.encodeMixedRouteToPath)(route instanceof router_1.V2Route
                    ? new router_sdk_1.MixedRouteSDK(route.pairs, route.input, route.output)
                    : route);
            default:
                throw new Error(`Unsupported protocol for the route: ${JSON.stringify(route)}`);
        }
    }
    getContractInterface(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol) {
        if (useMixedRouteQuoter) {
            if (mixedRouteContainsV4Pool) {
                return MixedRouteQuoterV2__factory_1.MixedRouteQuoterV2__factory.createInterface();
            }
            else {
                return IMixedRouteQuoterV1__factory_1.IMixedRouteQuoterV1__factory.createInterface();
            }
        }
        switch (protocol) {
            case router_sdk_1.Protocol.V3:
                return IQuoterV2__factory_1.IQuoterV2__factory.createInterface();
            case router_sdk_1.Protocol.V4:
                return V4Quoter__factory_1.V4Quoter__factory.createInterface();
            default:
                throw new Error(`Unsupported protocol: ${protocol}`);
        }
    }
    async consolidateResults(protocol, useMixedRouteQuoter, mixedRouteContainsV4Pool, functionName, inputs, providerConfig, gasLimitOverride) {
        if ((protocol === router_sdk_1.Protocol.MIXED && mixedRouteContainsV4Pool) ||
            protocol === router_sdk_1.Protocol.V4) {
            const mixedQuote = await this.multicall2Provider.callSameFunctionOnContractWithMultipleParams({
                address: this.getQuoterAddress(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol),
                contractInterface: this.getContractInterface(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol),
                functionName,
                functionParams: inputs,
                providerConfig,
                additionalConfig: {
                    gasLimitPerCallOverride: gasLimitOverride,
                },
            });
            return {
                blockNumber: mixedQuote.blockNumber,
                approxGasUsedPerSuccessCall: mixedQuote.approxGasUsedPerSuccessCall,
                results: mixedQuote.results.map((result) => {
                    if (result.success) {
                        switch (functionName) {
                            case 'quoteExactInput':
                            case 'quoteExactOutput':
                                return {
                                    success: true,
                                    result: [
                                        result.result[0],
                                        Array(inputs.length),
                                        Array(inputs.length),
                                        result.result[1],
                                    ],
                                };
                            default:
                                throw new Error(`Unsupported function name: ${functionName}`);
                        }
                    }
                    else {
                        return result;
                    }
                }),
            };
        }
        else {
            return await this.multicall2Provider.callSameFunctionOnContractWithMultipleParams({
                address: this.getQuoterAddress(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol),
                contractInterface: this.getContractInterface(useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol),
                functionName,
                functionParams: inputs,
                providerConfig,
                additionalConfig: {
                    gasLimitPerCallOverride: gasLimitOverride,
                },
            });
        }
    }
    async getQuotesManyData(amounts, routes, functionName, _providerConfig) {
        var _a, _b;
        const useMixedRouteQuoter = routes.some((route) => route.protocol === router_sdk_1.Protocol.V2) ||
            routes.some((route) => route.protocol === router_sdk_1.Protocol.MIXED);
        const useV4RouteQuoter = routes.some((route) => route.protocol === router_sdk_1.Protocol.V4) &&
            !useMixedRouteQuoter;
        const mixedRouteContainsV4Pool = useMixedRouteQuoter
            ? routes.some((route) => route.protocol === router_sdk_1.Protocol.MIXED &&
                route.pools.some((pool) => pool instanceof v4_sdk_1.Pool))
            : false;
        const protocol = useMixedRouteQuoter
            ? router_sdk_1.Protocol.MIXED
            : useV4RouteQuoter
                ? router_sdk_1.Protocol.V4
                : router_sdk_1.Protocol.V3;
        const optimisticCachedRoutes = (_a = _providerConfig === null || _providerConfig === void 0 ? void 0 : _providerConfig.optimisticCachedRoutes) !== null && _a !== void 0 ? _a : false;
        /// Validate that there are no incorrect routes / function combinations
        this.validateRoutes(routes, functionName, useMixedRouteQuoter);
        let multicallChunk = this.batchParams(optimisticCachedRoutes, protocol).multicallChunk;
        let gasLimitOverride = this.batchParams(optimisticCachedRoutes, protocol).gasLimitPerCall;
        const { baseBlockOffset, rollback } = this.blockNumberConfig(protocol);
        // Apply the base block offset if provided
        const originalBlockNumber = await this.provider.getBlockNumber();
        const providerConfig = Object.assign(Object.assign({}, _providerConfig), { blockNumber: (_b = _providerConfig === null || _providerConfig === void 0 ? void 0 : _providerConfig.blockNumber) !== null && _b !== void 0 ? _b : originalBlockNumber + baseBlockOffset });
        const inputs = (0, lodash_1.default)(routes)
            .flatMap((route) => {
            const encodedRoute = this.encodeRouteToPath(route, functionName);
            const routeInputs = amounts.map((amount) => {
                switch (route.protocol) {
                    case router_sdk_1.Protocol.V4:
                        return [
                            {
                                exactCurrency: (0, util_1.getAddress)(amount.currency),
                                path: encodedRoute,
                                exactAmount: amount.quotient.toString(),
                            },
                        ];
                    case router_sdk_1.Protocol.MIXED:
                        if (mixedRouteContainsV4Pool) {
                            return [
                                encodedRoute,
                                {
                                    nonEncodableData: route.pools.map((_) => {
                                        return {
                                            hookData: '0x',
                                        };
                                    }),
                                },
                                amount.quotient.toString(),
                            ];
                        }
                        else {
                            return [encodedRoute, amount.quotient.toString()];
                        }
                    default:
                        return [
                            encodedRoute,
                            `0x${amount.quotient.toString(16)}`,
                        ];
                }
            });
            return routeInputs;
        })
            .value();
        const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk));
        const inputsChunked = lodash_1.default.chunk(inputs, normalizedChunk);
        let quoteStates = lodash_1.default.map(inputsChunked, (inputChunk) => {
            return {
                status: 'pending',
                inputs: inputChunk,
            };
        });
        log_1.log.info(`About to get ${inputs.length} quotes in chunks of ${normalizedChunk} [${lodash_1.default.map(inputsChunked, (i) => i.length).join(',')}] ${gasLimitOverride
            ? `with a gas limit override of ${gasLimitOverride}`
            : ''} and block number: ${await providerConfig.blockNumber} [Original before offset: ${originalBlockNumber}].`);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteBatchSize`, inputs.length, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteBatchSize_${(0, util_1.ID_TO_NETWORK_NAME)(this.chainId)}`, inputs.length, util_1.MetricLoggerUnit.Count);
        const startTime = Date.now();
        let haveRetriedForSuccessRate = false;
        let haveRetriedForBlockHeader = false;
        let blockHeaderRetryAttemptNumber = 0;
        let haveIncrementedBlockHeaderFailureCounter = false;
        let blockHeaderRolledBack = false;
        let haveRetriedForBlockConflictError = false;
        let haveRetriedForOutOfGas = false;
        let haveRetriedForTimeout = false;
        let haveRetriedForUnknownReason = false;
        let finalAttemptNumber = 1;
        const expectedCallsMade = quoteStates.length;
        let totalCallsMade = 0;
        const { results: quoteResults, blockNumber, approxGasUsedPerSuccessCall, } = await (0, async_retry_1.default)(async (_bail, attemptNumber) => {
            haveIncrementedBlockHeaderFailureCounter = false;
            finalAttemptNumber = attemptNumber;
            const [success, failed, pending] = this.partitionQuotes(quoteStates);
            log_1.log.info(`Starting attempt: ${attemptNumber}.
          Currently ${success.length} success, ${failed.length} failed, ${pending.length} pending.
          Gas limit override: ${gasLimitOverride} Block number override: ${providerConfig.blockNumber}.`);
            quoteStates = await Promise.all(lodash_1.default.map(quoteStates, async (quoteState, idx) => {
                if (quoteState.status == 'success') {
                    return quoteState;
                }
                // QuoteChunk is pending or failed, so we try again
                const { inputs } = quoteState;
                try {
                    totalCallsMade = totalCallsMade + 1;
                    const results = await this.consolidateResults(protocol, useMixedRouteQuoter, mixedRouteContainsV4Pool, functionName, inputs, providerConfig, gasLimitOverride);
                    const successRateError = this.validateSuccessRate(results.results, haveRetriedForSuccessRate, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes);
                    if (successRateError) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: successRateError,
                            results,
                        };
                    }
                    return {
                        status: 'success',
                        inputs,
                        results,
                    };
                }
                catch (err) {
                    // Error from providers have huge messages that include all the calldata and fill the logs.
                    // Catch them and rethrow with shorter message.
                    if (err.message.includes('header not found')) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: new ProviderBlockHeaderError(err.message.slice(0, 500)),
                        };
                    }
                    if (err.message.includes('timeout')) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: new ProviderTimeoutError(`Req ${idx}/${quoteStates.length}. Request had ${inputs.length} inputs. ${err.message.slice(0, 500)}`),
                        };
                    }
                    if (err.message.includes('out of gas')) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: new ProviderGasError(err.message.slice(0, 500)),
                        };
                    }
                    return {
                        status: 'failed',
                        inputs,
                        reason: new Error(`Unknown error from provider: ${err.message.slice(0, 500)}`),
                    };
                }
            }));
            const [successfulQuoteStates, failedQuoteStates, pendingQuoteStates] = this.partitionQuotes(quoteStates);
            if (pendingQuoteStates.length > 0) {
                throw new Error('Pending quote after waiting for all promises.');
            }
            let retryAll = false;
            const blockNumberError = this.validateBlockNumbers(successfulQuoteStates, inputsChunked.length, gasLimitOverride);
            // If there is a block number conflict we retry all the quotes.
            if (blockNumberError) {
                retryAll = true;
            }
            const reasonForFailureStr = lodash_1.default.map(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason.name).join(', ');
            if (failedQuoteStates.length > 0) {
                log_1.log.info(`On attempt ${attemptNumber}: ${failedQuoteStates.length}/${quoteStates.length} quotes failed. Reasons: ${reasonForFailureStr}`);
                for (const failedQuoteState of failedQuoteStates) {
                    const { reason: error } = failedQuoteState;
                    log_1.log.info({ error }, `[QuoteFetchError] Attempt ${attemptNumber}. ${error.message}`);
                    if (error instanceof BlockConflictError) {
                        if (!haveRetriedForBlockConflictError) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteBlockConflictErrorRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForBlockConflictError = true;
                        }
                        retryAll = true;
                    }
                    else if (error instanceof ProviderBlockHeaderError) {
                        if (!haveRetriedForBlockHeader) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteBlockHeaderNotFoundRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForBlockHeader = true;
                        }
                        // Ensure that if multiple calls fail due to block header in the current pending batch,
                        // we only count once.
                        if (!haveIncrementedBlockHeaderFailureCounter) {
                            blockHeaderRetryAttemptNumber =
                                blockHeaderRetryAttemptNumber + 1;
                            haveIncrementedBlockHeaderFailureCounter = true;
                        }
                        if (rollback.enabled) {
                            const { rollbackBlockOffset, attemptsBeforeRollback } = rollback;
                            if (blockHeaderRetryAttemptNumber >= attemptsBeforeRollback &&
                                !blockHeaderRolledBack) {
                                log_1.log.info(`Attempt ${attemptNumber}. Have failed due to block header ${blockHeaderRetryAttemptNumber - 1} times. Rolling back block number by ${rollbackBlockOffset} for next retry`);
                                providerConfig.blockNumber = providerConfig.blockNumber
                                    ? (await providerConfig.blockNumber) + rollbackBlockOffset
                                    : (await this.provider.getBlockNumber()) +
                                        rollbackBlockOffset;
                                retryAll = true;
                                blockHeaderRolledBack = true;
                            }
                        }
                    }
                    else if (error instanceof ProviderTimeoutError) {
                        if (!haveRetriedForTimeout) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteTimeoutRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForTimeout = true;
                        }
                    }
                    else if (error instanceof ProviderGasError) {
                        if (!haveRetriedForOutOfGas) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteOutOfGasExceptionRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForOutOfGas = true;
                        }
                        gasLimitOverride =
                            this.gasErrorFailureOverride(protocol).gasLimitOverride;
                        multicallChunk =
                            this.gasErrorFailureOverride(protocol).multicallChunk;
                        retryAll = true;
                    }
                    else if (error instanceof SuccessRateError) {
                        if (!haveRetriedForSuccessRate) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteSuccessRateRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForSuccessRate = true;
                            // Low success rate can indicate too little gas given to each call.
                            gasLimitOverride =
                                this.successRateFailureOverrides(protocol).gasLimitOverride;
                            multicallChunk =
                                this.successRateFailureOverrides(protocol).multicallChunk;
                            retryAll = true;
                        }
                    }
                    else {
                        if (!haveRetriedForUnknownReason) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteUnknownReasonRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForUnknownReason = true;
                        }
                    }
                }
            }
            if (retryAll) {
                log_1.log.info(`Attempt ${attemptNumber}. Resetting all requests to pending for next attempt.`);
                const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk));
                const inputsChunked = lodash_1.default.chunk(inputs, normalizedChunk);
                quoteStates = lodash_1.default.map(inputsChunked, (inputChunk) => {
                    return {
                        status: 'pending',
                        inputs: inputChunk,
                    };
                });
            }
            if (failedQuoteStates.length > 0) {
                // TODO: Work with Arbitrum to find a solution for making large multicalls with gas limits that always
                // successfully.
                //
                // On Arbitrum we can not set a gas limit for every call in the multicall and guarantee that
                // we will not run out of gas on the node. This is because they have a different way of accounting
                // for gas, that seperates storage and compute gas costs, and we can not cover both in a single limit.
                //
                // To work around this and avoid throwing errors when really we just couldn't get a quote, we catch this
                // case and return 0 quotes found.
                if ((this.chainId == sdk_core_1.ChainId.ARBITRUM_ONE ||
                    this.chainId == sdk_core_1.ChainId.ARBITRUM_GOERLI) &&
                    lodash_1.default.every(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason instanceof ProviderGasError) &&
                    attemptNumber == this.retryOptions.retries) {
                    log_1.log.error(`Failed to get quotes on Arbitrum due to provider gas error issue. Overriding error to return 0 quotes.`);
                    return {
                        results: [],
                        blockNumber: bignumber_1.BigNumber.from(0),
                        approxGasUsedPerSuccessCall: 0,
                    };
                }
                throw new Error(`Failed to get ${failedQuoteStates.length} quotes. Reasons: ${reasonForFailureStr}`);
            }
            const callResults = lodash_1.default.map(successfulQuoteStates, (quoteState) => quoteState.results);
            return {
                results: lodash_1.default.flatMap(callResults, (result) => result.results),
                blockNumber: bignumber_1.BigNumber.from(callResults[0].blockNumber),
                approxGasUsedPerSuccessCall: stats_lite_1.default.percentile(lodash_1.default.map(callResults, (result) => result.approxGasUsedPerSuccessCall), 100),
            };
        }, Object.assign({ retries: DEFAULT_BATCH_RETRIES }, this.retryOptions));
        const routesQuotes = this.processQuoteResults(quoteResults, routes, amounts, bignumber_1.BigNumber.from(gasLimitOverride));
        const endTime = Date.now();
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteLatency`, endTime - startTime, util_1.MetricLoggerUnit.Milliseconds);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteApproxGasUsedPerSuccessfulCall`, approxGasUsedPerSuccessCall, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteNumRetryLoops`, finalAttemptNumber - 1, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteTotalCallsToProvider`, totalCallsMade, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteExpectedCallsToProvider`, expectedCallsMade, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteNumRetriedCalls`, totalCallsMade - expectedCallsMade, util_1.MetricLoggerUnit.Count);
        const [successfulQuotes, failedQuotes] = (0, lodash_1.default)(routesQuotes)
            .flatMap((routeWithQuotes) => routeWithQuotes[1])
            .partition((quote) => quote.quote != null)
            .value();
        log_1.log.info(`Got ${successfulQuotes.length} successful quotes, ${failedQuotes.length} failed quotes. Took ${finalAttemptNumber - 1} attempt loops. Total calls made to provider: ${totalCallsMade}. Have retried for timeout: ${haveRetriedForTimeout}`);
        return {
            routesWithQuotes: routesQuotes,
            blockNumber,
        };
    }
    partitionQuotes(quoteStates) {
        const successfulQuoteStates = lodash_1.default.filter(quoteStates, (quoteState) => quoteState.status == 'success');
        const failedQuoteStates = lodash_1.default.filter(quoteStates, (quoteState) => quoteState.status == 'failed');
        const pendingQuoteStates = lodash_1.default.filter(quoteStates, (quoteState) => quoteState.status == 'pending');
        return [successfulQuoteStates, failedQuoteStates, pendingQuoteStates];
    }
    processQuoteResults(quoteResults, routes, amounts, gasLimit) {
        const routesQuotes = [];
        const quotesResultsByRoute = lodash_1.default.chunk(quoteResults, amounts.length);
        const debugFailedQuotes = [];
        for (let i = 0; i < quotesResultsByRoute.length; i++) {
            const route = routes[i];
            const quoteResults = quotesResultsByRoute[i];
            const quotes = lodash_1.default.map(quoteResults, (quoteResult, index) => {
                var _a;
                const amount = amounts[index];
                if (!quoteResult.success) {
                    const percent = (100 / amounts.length) * (index + 1);
                    const amountStr = amount.toFixed(Math.min(amount.currency.decimals, 2));
                    const routeStr = (0, routes_1.routeToString)(route);
                    debugFailedQuotes.push({
                        route: routeStr,
                        percent,
                        amount: amountStr,
                    });
                    return {
                        amount,
                        quote: null,
                        sqrtPriceX96AfterList: null,
                        gasEstimate: (_a = quoteResult.gasUsed) !== null && _a !== void 0 ? _a : null,
                        gasLimit: gasLimit,
                        initializedTicksCrossedList: null,
                    };
                }
                return {
                    amount,
                    quote: quoteResult.result[0],
                    sqrtPriceX96AfterList: quoteResult.result[1],
                    initializedTicksCrossedList: quoteResult.result[2],
                    gasEstimate: quoteResult.result[3],
                    gasLimit: gasLimit,
                };
            });
            routesQuotes.push([route, quotes]);
        }
        // For routes and amounts that we failed to get a quote for, group them by route
        // and batch them together before logging to minimize number of logs.
        const debugChunk = 80;
        lodash_1.default.forEach(lodash_1.default.chunk(debugFailedQuotes, debugChunk), (quotes, idx) => {
            const failedQuotesByRoute = lodash_1.default.groupBy(quotes, (q) => q.route);
            const failedFlat = lodash_1.default.mapValues(failedQuotesByRoute, (f) => (0, lodash_1.default)(f)
                .map((f) => `${f.percent}%[${f.amount}]`)
                .join(','));
            log_1.log.info({
                failedQuotes: lodash_1.default.map(failedFlat, (amounts, routeStr) => `${routeStr} : ${amounts}`),
            }, `Failed on chain quotes for routes Part ${idx}/${Math.ceil(debugFailedQuotes.length / debugChunk)}`);
        });
        return routesQuotes;
    }
    validateBlockNumbers(successfulQuoteStates, totalCalls, gasLimitOverride) {
        if (successfulQuoteStates.length <= 1) {
            return null;
        }
        const results = lodash_1.default.map(successfulQuoteStates, (quoteState) => quoteState.results);
        const blockNumbers = lodash_1.default.map(results, (result) => result.blockNumber);
        const uniqBlocks = (0, lodash_1.default)(blockNumbers)
            .map((blockNumber) => blockNumber.toNumber())
            .uniq()
            .value();
        if (uniqBlocks.length == 1) {
            return null;
        }
        /* if (
          uniqBlocks.length == 2 &&
          Math.abs(uniqBlocks[0]! - uniqBlocks[1]!) <= 1
        ) {
          return null;
        } */
        return new BlockConflictError(`Quotes returned from different blocks. ${uniqBlocks}. ${totalCalls} calls were made with gas limit ${gasLimitOverride}`);
    }
    validateSuccessRate(allResults, haveRetriedForSuccessRate, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes) {
        const numResults = allResults.length;
        const numSuccessResults = allResults.filter((result) => result.success).length;
        const successRate = (1.0 * numSuccessResults) / numResults;
        const { quoteMinSuccessRate } = this.batchParams(optimisticCachedRoutes, protocol);
        if (successRate < quoteMinSuccessRate) {
            if (haveRetriedForSuccessRate) {
                log_1.log.info(`Quote success rate still below threshold despite retry. Continuing. ${quoteMinSuccessRate}: ${successRate}`);
                util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteRetriedSuccessRateLow`, successRate, util_1.MetricLoggerUnit.Percent);
                return;
            }
            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, mixedRouteContainsV4Pool, protocol, optimisticCachedRoutes)}QuoteSuccessRateLow`, successRate, util_1.MetricLoggerUnit.Percent);
            return new SuccessRateError(`Quote success rate below threshold of ${quoteMinSuccessRate}: ${successRate}`);
        }
    }
    /**
     * Throw an error for incorrect routes / function combinations
     * @param routes Any combination of V3, V2, and Mixed routes.
     * @param functionName
     * @param useMixedRouteQuoter true if there are ANY V2Routes or MixedRoutes in the routes parameter
     */
    validateRoutes(routes, functionName, useMixedRouteQuoter) {
        /// We do not send any V3Routes to new qutoer becuase it is not deployed on chains besides mainnet
        if (routes.some((route) => route.protocol === router_sdk_1.Protocol.V3) &&
            useMixedRouteQuoter) {
            throw new Error(`Cannot use mixed route quoter with V3 routes`);
        }
        /// We cannot call quoteExactOutput with V2 or Mixed routes
        if (functionName === 'quoteExactOutput' && useMixedRouteQuoter) {
            throw new Error('Cannot call quoteExactOutput with V2 or Mixed routes');
        }
    }
}
exports.OnChainQuoteProvider = OnChainQuoteProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib24tY2hhaW4tcXVvdGUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL29uLWNoYWluLXF1b3RlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUFtRTtBQUduRSxvREFJNkI7QUFDN0IsZ0RBQTRDO0FBQzVDLDRDQUEyRTtBQUMzRSw0Q0FHeUI7QUFDekIsOERBQTZEO0FBQzdELG9EQUF1QjtBQUN2Qiw0REFBK0I7QUFFL0IsOENBTTJCO0FBQzNCLHdHQUFxRztBQUNyRyxzR0FBbUc7QUFDbkcsa0ZBQStFO0FBQy9FLGlGQUE4RTtBQUM5RSxrQ0FTaUI7QUFFakIscUNBQWtDO0FBQ2xDLHFGQUc2QztBQUM3QywyQ0FBK0M7QUFxRS9DLE1BQWEsa0JBQW1CLFNBQVEsS0FBSztJQUE3Qzs7UUFDUyxTQUFJLEdBQUcsb0JBQW9CLENBQUM7SUFDckMsQ0FBQztDQUFBO0FBRkQsZ0RBRUM7QUFFRCxNQUFhLGdCQUFpQixTQUFRLEtBQUs7SUFBM0M7O1FBQ1MsU0FBSSxHQUFHLGtCQUFrQixDQUFDO0lBQ25DLENBQUM7Q0FBQTtBQUZELDRDQUVDO0FBRUQsTUFBYSx3QkFBeUIsU0FBUSxLQUFLO0lBQW5EOztRQUNTLFNBQUksR0FBRywwQkFBMEIsQ0FBQztJQUMzQyxDQUFDO0NBQUE7QUFGRCw0REFFQztBQUVELE1BQWEsb0JBQXFCLFNBQVEsS0FBSztJQUEvQzs7UUFDUyxTQUFJLEdBQUcsc0JBQXNCLENBQUM7SUFDdkMsQ0FBQztDQUFBO0FBRkQsb0RBRUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLGdCQUFpQixTQUFRLEtBQUs7SUFBM0M7O1FBQ1MsU0FBSSxHQUFHLGtCQUFrQixDQUFDO0lBQ25DLENBQUM7Q0FBQTtBQUZELDRDQUVDO0FBd0pELE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dB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