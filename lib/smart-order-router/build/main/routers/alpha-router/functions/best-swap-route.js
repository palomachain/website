"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestSwapRouteBy = exports.getBestSwapRoute = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const jsbi_1 = __importDefault(require("jsbi"));
const lodash_1 = __importDefault(require("lodash"));
const fixed_reverse_heap_1 = __importDefault(require("mnemonist/fixed-reverse-heap"));
const queue_1 = __importDefault(require("mnemonist/queue"));
const util_1 = require("../../../util");
const amounts_1 = require("../../../util/amounts");
const log_1 = require("../../../util/log");
const metric_1 = require("../../../util/metric");
const routes_1 = require("../../../util/routes");
const gas_models_1 = require("../gas-models");
async function getBestSwapRoute(amount, percents, routesWithValidQuotes, routeType, chainId, routingConfig, portionProvider, v2GasModel, v3GasModel, v4GasModel, swapConfig, providerConfig) {
    const now = Date.now();
    const { forceMixedRoutes } = routingConfig;
    /// Like with forceCrossProtocol, we apply that logic here when determining the bestSwapRoute
    if (forceMixedRoutes) {
        log_1.log.info({
            forceMixedRoutes: forceMixedRoutes,
        }, 'Forcing mixed routes by filtering out other route types');
        routesWithValidQuotes = lodash_1.default.filter(routesWithValidQuotes, (quotes) => {
            return quotes.protocol === router_sdk_1.Protocol.MIXED;
        });
        if (!routesWithValidQuotes) {
            return null;
        }
    }
    // Build a map of percentage of the input to list of valid quotes.
    // Quotes can be null for a variety of reasons (not enough liquidity etc), so we drop them here too.
    const percentToQuotes = {};
    for (const routeWithValidQuote of routesWithValidQuotes) {
        if (!percentToQuotes[routeWithValidQuote.percent]) {
            percentToQuotes[routeWithValidQuote.percent] = [];
        }
        percentToQuotes[routeWithValidQuote.percent].push(routeWithValidQuote);
    }
    metric_1.metric.putMetric('BuildRouteWithValidQuoteObjects', Date.now() - now, metric_1.MetricLoggerUnit.Milliseconds);
    // Given all the valid quotes for each percentage find the optimal route.
    const swapRoute = await getBestSwapRouteBy(routeType, percentToQuotes, percents, chainId, (rq) => rq.quoteAdjustedForGas, routingConfig, portionProvider, v2GasModel, v3GasModel, v4GasModel, swapConfig, providerConfig);
    // It is possible we were unable to find any valid route given the quotes.
    if (!swapRoute) {
        return null;
    }
    // Due to potential loss of precision when taking percentages of the input it is possible that the sum of the amounts of each
    // route of our optimal quote may not add up exactly to exactIn or exactOut.
    //
    // We check this here, and if there is a mismatch
    // add the missing amount to a random route. The missing amount size should be neglible so the quote should still be highly accurate.
    const { routes: routeAmounts } = swapRoute;
    const totalAmount = lodash_1.default.reduce(routeAmounts, (total, routeAmount) => total.add(routeAmount.amount), amounts_1.CurrencyAmount.fromRawAmount(routeAmounts[0].amount.currency, 0));
    const missingAmount = amount.subtract(totalAmount);
    if (missingAmount.greaterThan(0)) {
        log_1.log.info({
            missingAmount: missingAmount.quotient.toString(),
        }, `Optimal route's amounts did not equal exactIn/exactOut total. Adding missing amount to last route in array.`);
        routeAmounts[routeAmounts.length - 1].amount =
            routeAmounts[routeAmounts.length - 1].amount.add(missingAmount);
    }
    log_1.log.info({
        routes: (0, routes_1.routeAmountsToString)(routeAmounts),
        numSplits: routeAmounts.length,
        amount: amount.toExact(),
        quote: swapRoute.quote.toExact(),
        quoteGasAdjusted: swapRoute.quoteGasAdjusted.toFixed(Math.min(swapRoute.quoteGasAdjusted.currency.decimals, 2)),
        estimatedGasUSD: swapRoute.estimatedGasUsedUSD.toFixed(Math.min(swapRoute.estimatedGasUsedUSD.currency.decimals, 2)),
        estimatedGasToken: swapRoute.estimatedGasUsedQuoteToken.toFixed(Math.min(swapRoute.estimatedGasUsedQuoteToken.currency.decimals, 2)),
    }, `Found best swap route. ${routeAmounts.length} split.`);
    return swapRoute;
}
exports.getBestSwapRoute = getBestSwapRoute;
async function getBestSwapRouteBy(routeType, percentToQuotes, percents, chainId, by, routingConfig, portionProvider, v2GasModel, v3GasModel, v4GasModel, swapConfig, providerConfig) {
    var _a;
    // Build a map of percentage to sorted list of quotes, with the biggest quote being first in the list.
    const percentToSortedQuotes = lodash_1.default.mapValues(percentToQuotes, (routeQuotes) => {
        return routeQuotes.sort((routeQuoteA, routeQuoteB) => {
            if (routeType == sdk_core_1.TradeType.EXACT_INPUT) {
                return by(routeQuoteA).greaterThan(by(routeQuoteB)) ? -1 : 1;
            }
            else {
                return by(routeQuoteA).lessThan(by(routeQuoteB)) ? -1 : 1;
            }
        });
    });
    const quoteCompFn = routeType == sdk_core_1.TradeType.EXACT_INPUT
        ? (a, b) => a.greaterThan(b)
        : (a, b) => a.lessThan(b);
    const sumFn = (currencyAmounts) => {
        let sum = currencyAmounts[0];
        for (let i = 1; i < currencyAmounts.length; i++) {
            sum = sum.add(currencyAmounts[i]);
        }
        return sum;
    };
    let bestQuote;
    let bestSwap;
    // Min-heap for tracking the 5 best swaps given some number of splits.
    const bestSwapsPerSplit = new fixed_reverse_heap_1.default(Array, (a, b) => {
        return quoteCompFn(a.quote, b.quote) ? -1 : 1;
    }, 3);
    const { minSplits, maxSplits, forceCrossProtocol } = routingConfig;
    if (!percentToSortedQuotes[100] || minSplits > 1 || forceCrossProtocol) {
        log_1.log.info({
            percentToSortedQuotes: lodash_1.default.mapValues(percentToSortedQuotes, (p) => p.length),
        }, 'Did not find a valid route without any splits. Continuing search anyway.');
    }
    else {
        bestQuote = by(percentToSortedQuotes[100][0]);
        bestSwap = [percentToSortedQuotes[100][0]];
        for (const routeWithQuote of percentToSortedQuotes[100].slice(0, 5)) {
            bestSwapsPerSplit.push({
                quote: by(routeWithQuote),
                routes: [routeWithQuote],
            });
        }
    }
    // We do a BFS. Each additional node in a path represents us adding an additional split to the route.
    const queue = new queue_1.default();
    // First we seed BFS queue with the best quotes for each percentage.
    // i.e. [best quote when sending 10% of amount, best quote when sending 20% of amount, ...]
    // We will explore the various combinations from each node.
    for (let i = percents.length; i >= 0; i--) {
        const percent = percents[i];
        if (!percentToSortedQuotes[percent]) {
            continue;
        }
        queue.enqueue({
            curRoutes: [percentToSortedQuotes[percent][0]],
            percentIndex: i,
            remainingPercent: 100 - percent,
            special: false,
        });
        if (!percentToSortedQuotes[percent] ||
            !percentToSortedQuotes[percent][1]) {
            continue;
        }
        queue.enqueue({
            curRoutes: [percentToSortedQuotes[percent][1]],
            percentIndex: i,
            remainingPercent: 100 - percent,
            special: true,
        });
    }
    let splits = 1;
    let startedSplit = Date.now();
    while (queue.size > 0) {
        metric_1.metric.putMetric(`Split${splits}Done`, Date.now() - startedSplit, metric_1.MetricLoggerUnit.Milliseconds);
        startedSplit = Date.now();
        log_1.log.info({
            top5: lodash_1.default.map(Array.from(bestSwapsPerSplit.consume()), (q) => `${q.quote.toExact()} (${(0, lodash_1.default)(q.routes)
                .map((r) => r.toString())
                .join(', ')})`),
            onQueue: queue.size,
        }, `Top 3 with ${splits} splits`);
        bestSwapsPerSplit.clear();
        // Size of the queue at this point is the number of potential routes we are investigating for the given number of splits.
        let layer = queue.size;
        splits++;
        // If we didn't improve our quote by adding another split, very unlikely to improve it by splitting more after that.
        if (splits >= 3 && bestSwap && bestSwap.length < splits - 1) {
            break;
        }
        if (splits > maxSplits) {
            log_1.log.info('Max splits reached. Stopping search.');
            metric_1.metric.putMetric(`MaxSplitsHitReached`, 1, metric_1.MetricLoggerUnit.Count);
            break;
        }
        while (layer > 0) {
            layer--;
            const { remainingPercent, curRoutes, percentIndex, special } = queue.dequeue();
            // For all other percentages, add a new potential route.
            // E.g. if our current aggregated route if missing 50%, we will create new nodes and add to the queue for:
            // 50% + new 10% route, 50% + new 20% route, etc.
            for (let i = percentIndex; i >= 0; i--) {
                const percentA = percents[i];
                if (percentA > remainingPercent) {
                    continue;
                }
                // At some point the amount * percentage is so small that the quoter is unable to get
                // a quote. In this case there could be no quotes for that percentage.
                if (!percentToSortedQuotes[percentA]) {
                    continue;
                }
                const candidateRoutesA = percentToSortedQuotes[percentA];
                // Find the best route in the complimentary percentage that doesn't re-use a pool already
                // used in the current route. Re-using pools is not allowed as each swap through a pool changes its liquidity,
                // so it would make the quotes inaccurate.
                const routeWithQuoteA = findFirstRouteNotUsingUsedPools(curRoutes, candidateRoutesA, forceCrossProtocol);
                if (!routeWithQuoteA) {
                    continue;
                }
                const remainingPercentNew = remainingPercent - percentA;
                const curRoutesNew = [...curRoutes, routeWithQuoteA];
                // If we've found a route combination that uses all 100%, and it has at least minSplits, update our best route.
                if (remainingPercentNew == 0 && splits >= minSplits) {
                    const quotesNew = lodash_1.default.map(curRoutesNew, (r) => by(r));
                    const quoteNew = sumFn(quotesNew);
                    let gasCostL1QuoteToken = amounts_1.CurrencyAmount.fromRawAmount(quoteNew.currency, 0);
                    if (util_1.HAS_L1_FEE.includes(chainId)) {
                        if (v2GasModel == undefined &&
                            v3GasModel == undefined &&
                            v4GasModel == undefined) {
                            throw new Error("Can't compute L1 gas fees.");
                        }
                        else {
                            // ROUTE-249: consoliate L1 + L2 gas fee adjustment within best-swap-route
                            const v2Routes = curRoutesNew.filter((routes) => routes.protocol === router_sdk_1.Protocol.V2);
                            if (v2Routes.length > 0 && util_1.V2_SUPPORTED.includes(chainId)) {
                                if (v2GasModel) {
                                    const v2GasCostL1 = await v2GasModel.calculateL1GasFees(v2Routes);
                                    gasCostL1QuoteToken = gasCostL1QuoteToken.add(v2GasCostL1.gasCostL1QuoteToken);
                                }
                            }
                            const v3Routes = curRoutesNew.filter((routes) => routes.protocol === router_sdk_1.Protocol.V3);
                            if (v3Routes.length > 0) {
                                if (v3GasModel) {
                                    const v3GasCostL1 = await v3GasModel.calculateL1GasFees(v3Routes);
                                    gasCostL1QuoteToken = gasCostL1QuoteToken.add(v3GasCostL1.gasCostL1QuoteToken);
                                }
                            }
                            const v4Routes = curRoutesNew.filter((routes) => routes.protocol === router_sdk_1.Protocol.V4);
                            if (v4Routes.length > 0 && util_1.V4_SUPPORTED.includes(chainId)) {
                                if (v4GasModel) {
                                    const v4GasCostL1 = await v4GasModel.calculateL1GasFees(v4Routes);
                                    gasCostL1QuoteToken = gasCostL1QuoteToken.add(v4GasCostL1.gasCostL1QuoteToken);
                                }
                            }
                        }
                    }
                    const quoteAfterL1Adjust = routeType == sdk_core_1.TradeType.EXACT_INPUT
                        ? quoteNew.subtract(gasCostL1QuoteToken)
                        : quoteNew.add(gasCostL1QuoteToken);
                    bestSwapsPerSplit.push({
                        quote: quoteAfterL1Adjust,
                        routes: curRoutesNew,
                    });
                    if (!bestQuote || quoteCompFn(quoteAfterL1Adjust, bestQuote)) {
                        bestQuote = quoteAfterL1Adjust;
                        bestSwap = curRoutesNew;
                        // Temporary experiment.
                        if (special) {
                            metric_1.metric.putMetric(`BestSwapNotPickingBestForPercent`, 1, metric_1.MetricLoggerUnit.Count);
                        }
                    }
                }
                else {
                    queue.enqueue({
                        curRoutes: curRoutesNew,
                        remainingPercent: remainingPercentNew,
                        percentIndex: i,
                        special,
                    });
                }
            }
        }
    }
    if (!bestSwap) {
        log_1.log.info(`Could not find a valid swap`);
        return undefined;
    }
    const postSplitNow = Date.now();
    let quoteGasAdjusted = sumFn(lodash_1.default.map(bestSwap, (routeWithValidQuote) => routeWithValidQuote.quoteAdjustedForGas));
    // this calculates the base gas used
    // if on L1, its the estimated gas used based on hops and ticks across all the routes
    // if on L2, its the gas used on the L2 based on hops and ticks across all the routes
    const estimatedGasUsed = (0, lodash_1.default)(bestSwap)
        .map((routeWithValidQuote) => routeWithValidQuote.gasEstimate)
        .reduce((sum, routeWithValidQuote) => sum.add(routeWithValidQuote), bignumber_1.BigNumber.from(0));
    if (!gas_models_1.usdGasTokensByChain[chainId] || !gas_models_1.usdGasTokensByChain[chainId][0]) {
        // Each route can use a different stablecoin to account its gas costs.
        // They should all be pegged, and this is just an estimate, so we do a merge
        // to an arbitrary stable.
        throw new Error(`Could not find a USD token for computing gas costs on ${chainId}`);
    }
    const usdToken = gas_models_1.usdGasTokensByChain[chainId][0];
    const usdTokenDecimals = usdToken.decimals;
    // if on L2, calculate the L1 security fee
    const gasCostsL1ToL2 = {
        gasUsedL1: bignumber_1.BigNumber.from(0),
        gasUsedL1OnL2: bignumber_1.BigNumber.from(0),
        gasCostL1USD: amounts_1.CurrencyAmount.fromRawAmount(usdToken, 0),
        gasCostL1QuoteToken: amounts_1.CurrencyAmount.fromRawAmount(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        (_a = bestSwap[0]) === null || _a === void 0 ? void 0 : _a.quoteToken, 0),
    };
    // If swapping on an L2 that includes a L1 security fee, calculate the fee and include it in the gas adjusted quotes
    if (util_1.HAS_L1_FEE.includes(chainId)) {
        // ROUTE-249: consoliate L1 + L2 gas fee adjustment within best-swap-route
        if (v2GasModel == undefined &&
            v3GasModel == undefined &&
            v4GasModel == undefined) {
            throw new Error("Can't compute L1 gas fees.");
        }
        else {
            // Before v2 deploy everywhere, a quote on L2 can only go through v3 protocol,
            // so a split between v2 and v3 is not possible.
            // After v2 deploy everywhere, a quote on L2 can go through v2 AND v3 protocol.
            // Since a split is possible now, the gas cost will be the summation of both v2 and v3 gas models.
            // So as long as any route contains v2/v3 protocol, we will calculate the gas cost accumulatively.
            const v2Routes = bestSwap.filter((routes) => routes.protocol === router_sdk_1.Protocol.V2);
            if (v2Routes.length > 0 && util_1.V2_SUPPORTED.includes(chainId)) {
                if (v2GasModel) {
                    const v2GasCostL1 = await v2GasModel.calculateL1GasFees(v2Routes);
                    gasCostsL1ToL2.gasUsedL1 = gasCostsL1ToL2.gasUsedL1.add(v2GasCostL1.gasUsedL1);
                    gasCostsL1ToL2.gasUsedL1OnL2 = gasCostsL1ToL2.gasUsedL1OnL2.add(v2GasCostL1.gasUsedL1OnL2);
                    if (gasCostsL1ToL2.gasCostL1USD.currency.equals(v2GasCostL1.gasCostL1USD.currency)) {
                        gasCostsL1ToL2.gasCostL1USD = gasCostsL1ToL2.gasCostL1USD.add(v2GasCostL1.gasCostL1USD);
                    }
                    else {
                        // This is to handle the case where gasCostsL1ToL2.gasCostL1USD and v2GasCostL1.gasCostL1USD have different currencies.
                        //
                        // gasCostsL1ToL2.gasCostL1USD was initially hardcoded to CurrencyAmount.fromRawAmount(usdGasTokensByChain[chainId]![0]!, 0)
                        // (https://github.com/Uniswap/smart-order-router/blob/main/src/routers/alpha-router/functions/best-swap-route.ts#L438)
                        // , where usdGasTokensByChain is coded in the descending order of decimals per chain,
                        // e.g. Arbitrum_one DAI (18 decimals), USDC bridged (6 decimals), USDC native (6 decimals)
                        // so gasCostsL1ToL2.gasCostL1USD will have DAI as currency.
                        //
                        // For v2GasCostL1.gasCostL1USD, it's calculated within getHighestLiquidityUSDPool among usdGasTokensByChain[chainId]!,
                        // (https://github.com/Uniswap/smart-order-router/blob/b970aedfec8a9509f9e22f14cc5c11be54d47b35/src/routers/alpha-router/gas-models/v2/v2-heuristic-gas-model.ts#L220)
                        // , so the code will actually see which USD pool has the highest liquidity, if any.
                        // e.g. Arbitrum_one on v2 only has liquidity on USDC native
                        // so v2GasCostL1.gasCostL1USD will have USDC native as currency.
                        //
                        // We will re-assign gasCostsL1ToL2.gasCostL1USD to v2GasCostL1.gasCostL1USD in this case.
                        gasCostsL1ToL2.gasCostL1USD = v2GasCostL1.gasCostL1USD;
                    }
                    gasCostsL1ToL2.gasCostL1QuoteToken =
                        gasCostsL1ToL2.gasCostL1QuoteToken.add(v2GasCostL1.gasCostL1QuoteToken);
                }
            }
            const v3Routes = bestSwap.filter((routes) => routes.protocol === router_sdk_1.Protocol.V3);
            if (v3Routes.length > 0) {
                if (v3GasModel) {
                    const v3GasCostL1 = await v3GasModel.calculateL1GasFees(v3Routes);
                    gasCostsL1ToL2.gasUsedL1 = gasCostsL1ToL2.gasUsedL1.add(v3GasCostL1.gasUsedL1);
                    gasCostsL1ToL2.gasUsedL1OnL2 = gasCostsL1ToL2.gasUsedL1OnL2.add(v3GasCostL1.gasUsedL1OnL2);
                    if (gasCostsL1ToL2.gasCostL1USD.currency.equals(v3GasCostL1.gasCostL1USD.currency)) {
                        gasCostsL1ToL2.gasCostL1USD = gasCostsL1ToL2.gasCostL1USD.add(v3GasCostL1.gasCostL1USD);
                    }
                    else {
                        // This is to handle the case where gasCostsL1ToL2.gasCostL1USD and v3GasCostL1.gasCostL1USD have different currencies.
                        //
                        // gasCostsL1ToL2.gasCostL1USD was initially hardcoded to CurrencyAmount.fromRawAmount(usdGasTokensByChain[chainId]![0]!, 0)
                        // (https://github.com/Uniswap/smart-order-router/blob/main/src/routers/alpha-router/functions/best-swap-route.ts#L438)
                        // , where usdGasTokensByChain is coded in the descending order of decimals per chain,
                        // e.g. Arbitrum_one DAI (18 decimals), USDC bridged (6 decimals), USDC native (6 decimals)
                        // so gasCostsL1ToL2.gasCostL1USD will have DAI as currency.
                        //
                        // For v3GasCostL1.gasCostL1USD, it's calculated within getHighestLiquidityV3USDPool among usdGasTokensByChain[chainId]!,
                        // (https://github.com/Uniswap/smart-order-router/blob/1c93e133c46af545f8a3d8af7fca3f1f2dcf597d/src/util/gas-factory-helpers.ts#L110)
                        // , so the code will actually see which USD pool has the highest liquidity, if any.
                        // e.g. Arbitrum_one on v3 has highest liquidity on USDC native
                        // so v3GasCostL1.gasCostL1USD will have USDC native as currency.
                        //
                        // We will re-assign gasCostsL1ToL2.gasCostL1USD to v3GasCostL1.gasCostL1USD in this case.
                        gasCostsL1ToL2.gasCostL1USD = v3GasCostL1.gasCostL1USD;
                    }
                    gasCostsL1ToL2.gasCostL1QuoteToken =
                        gasCostsL1ToL2.gasCostL1QuoteToken.add(v3GasCostL1.gasCostL1QuoteToken);
                }
            }
            const v4Routes = bestSwap.filter((routes) => routes.protocol === router_sdk_1.Protocol.V4);
            if (v4Routes.length > 0 && util_1.V4_SUPPORTED.includes(chainId)) {
                if (v4GasModel) {
                    const v4GasCostL1 = await v4GasModel.calculateL1GasFees(v4Routes);
                    gasCostsL1ToL2.gasUsedL1 = gasCostsL1ToL2.gasUsedL1.add(v4GasCostL1.gasUsedL1);
                    gasCostsL1ToL2.gasUsedL1OnL2 = gasCostsL1ToL2.gasUsedL1OnL2.add(v4GasCostL1.gasUsedL1OnL2);
                    if (gasCostsL1ToL2.gasCostL1USD.currency.equals(v4GasCostL1.gasCostL1USD.currency)) {
                        gasCostsL1ToL2.gasCostL1USD = gasCostsL1ToL2.gasCostL1USD.add(v4GasCostL1.gasCostL1USD);
                    }
                    else {
                        // This is to handle the case where gasCostsL1ToL2.gasCostL1USD and v4GasCostL1.gasCostL1USD have different currencies.
                        //
                        // gasCostsL1ToL2.gasCostL1USD was initially hardcoded to CurrencyAmount.fromRawAmount(usdGasTokensByChain[chainId]![0]!, 0)
                        // (https://github.com/Uniswap/smart-order-router/blob/main/src/routers/alpha-router/functions/best-swap-route.ts#L438)
                        // , where usdGasTokensByChain is coded in the descending order of decimals per chain,
                        // e.g. Arbitrum_one DAI (18 decimals), USDC bridged (6 decimals), USDC native (6 decimals)
                        // so gasCostsL1ToL2.gasCostL1USD will have DAI as currency.
                        //
                        // For v4GasCostL1.gasCostL1USD, it's calculated within getHighestLiquidityV3USDPool among usdGasTokensByChain[chainId]!,
                        // (https://github.com/Uniswap/smart-order-router/blob/1c93e133c46af545f8a3d8af7fca3f1f2dcf597d/src/util/gas-factory-helpers.ts#L110)
                        // , so the code will actually see which USD pool has the highest liquidity, if any.
                        // e.g. Arbitrum_one on v3 has highest liquidity on USDC native
                        // so v4GasCostL1.gasCostL1USD will have USDC native as currency.
                        //
                        // We will re-assign gasCostsL1ToL2.gasCostL1USD to v3GasCostL1.gasCostL1USD in this case.
                        gasCostsL1ToL2.gasCostL1USD = v4GasCostL1.gasCostL1USD;
                    }
                    gasCostsL1ToL2.gasCostL1QuoteToken =
                        gasCostsL1ToL2.gasCostL1QuoteToken.add(v4GasCostL1.gasCostL1QuoteToken);
                }
            }
        }
    }
    const { gasUsedL1OnL2, gasCostL1USD, gasCostL1QuoteToken } = gasCostsL1ToL2;
    // For each gas estimate, normalize decimals to that of the chosen usd token.
    const estimatedGasUsedUSDs = (0, lodash_1.default)(bestSwap)
        .map((routeWithValidQuote) => {
        // TODO: will error if gasToken has decimals greater than usdToken
        const decimalsDiff = usdTokenDecimals - routeWithValidQuote.gasCostInUSD.currency.decimals;
        if (decimalsDiff == 0) {
            return amounts_1.CurrencyAmount.fromRawAmount(usdToken, routeWithValidQuote.gasCostInUSD.quotient);
        }
        if (decimalsDiff < 0 && chainId === 324) {
            log_1.log.error(`Decimals diff is negative for ZkSync. This should not happen.
          usdTokenDecimals ${usdTokenDecimals} routeWithValidQuote.gasCostInUSD.currency.decimals
          ${routeWithValidQuote.gasCostInUSD.currency.decimals} ${JSON.stringify(routeWithValidQuote)}`);
        }
        return amounts_1.CurrencyAmount.fromRawAmount(usdToken, jsbi_1.default.multiply(routeWithValidQuote.gasCostInUSD.quotient, jsbi_1.default.exponentiate(jsbi_1.default.BigInt(10), jsbi_1.default.BigInt(decimalsDiff))));
    })
        .value();
    let estimatedGasUsedUSD = sumFn(estimatedGasUsedUSDs);
    // if they are different usd pools, convert to the usdToken
    if (estimatedGasUsedUSD.currency != gasCostL1USD.currency) {
        const decimalsDiff = usdTokenDecimals - gasCostL1USD.currency.decimals;
        estimatedGasUsedUSD = estimatedGasUsedUSD.add(amounts_1.CurrencyAmount.fromRawAmount(usdToken, jsbi_1.default.multiply(gasCostL1USD.quotient, jsbi_1.default.exponentiate(jsbi_1.default.BigInt(10), jsbi_1.default.BigInt(decimalsDiff)))));
    }
    else {
        estimatedGasUsedUSD = estimatedGasUsedUSD.add(gasCostL1USD);
    }
    log_1.log.info({
        estimatedGasUsedUSD: estimatedGasUsedUSD.toExact(),
        normalizedUsdToken: usdToken,
        routeUSDGasEstimates: lodash_1.default.map(bestSwap, (b) => `${b.percent}% ${(0, routes_1.routeToString)(b.route)} ${b.gasCostInUSD.toExact()}`),
        flatL1GasCostUSD: gasCostL1USD.toExact(),
    }, 'USD gas estimates of best route');
    const estimatedGasUsedQuoteToken = sumFn(lodash_1.default.map(bestSwap, (routeWithValidQuote) => routeWithValidQuote.gasCostInToken)).add(gasCostL1QuoteToken);
    let estimatedGasUsedGasToken;
    if (routingConfig.gasToken) {
        // sum the gas costs in the gas token across all routes
        // if there is a route with undefined gasCostInGasToken, throw an error
        if (bestSwap.some((routeWithValidQuote) => routeWithValidQuote.gasCostInGasToken === undefined)) {
            log_1.log.info({
                bestSwap,
                routingConfig,
            }, 'Could not find gasCostInGasToken for a route in bestSwap');
            throw new Error("Can't compute estimatedGasUsedGasToken");
        }
        estimatedGasUsedGasToken = sumFn(lodash_1.default.map(bestSwap, 
        // ok to type cast here because we throw above if any are not defined
        (routeWithValidQuote) => routeWithValidQuote.gasCostInGasToken));
    }
    const quote = sumFn(lodash_1.default.map(bestSwap, (routeWithValidQuote) => routeWithValidQuote.quote));
    // Adjust the quoteGasAdjusted for the l1 fee
    if (routeType == sdk_core_1.TradeType.EXACT_INPUT) {
        const quoteGasAdjustedForL1 = quoteGasAdjusted.subtract(gasCostL1QuoteToken);
        quoteGasAdjusted = quoteGasAdjustedForL1;
    }
    else {
        const quoteGasAdjustedForL1 = quoteGasAdjusted.add(gasCostL1QuoteToken);
        quoteGasAdjusted = quoteGasAdjustedForL1;
    }
    const routeWithQuotes = bestSwap.sort((routeAmountA, routeAmountB) => routeAmountB.amount.greaterThan(routeAmountA.amount) ? 1 : -1);
    metric_1.metric.putMetric('PostSplitDone', Date.now() - postSplitNow, metric_1.MetricLoggerUnit.Milliseconds);
    return {
        quote,
        quoteGasAdjusted,
        estimatedGasUsed: estimatedGasUsed.add(gasUsedL1OnL2),
        estimatedGasUsedUSD,
        estimatedGasUsedQuoteToken,
        estimatedGasUsedGasToken,
        routes: portionProvider.getRouteWithQuotePortionAdjusted(routeType, routeWithQuotes, swapConfig, providerConfig),
    };
}
exports.getBestSwapRouteBy = getBestSwapRouteBy;
// We do not allow pools to be re-used across split routes, as swapping through a pool changes the pools state.
// Given a list of used routes, this function finds the first route in the list of candidate routes that does not re-use an already used pool.
const findFirstRouteNotUsingUsedPools = (usedRoutes, candidateRouteQuotes, forceCrossProtocol) => {
    const poolAddressSet = new Set();
    const usedPoolAddresses = (0, lodash_1.default)(usedRoutes)
        .flatMap((r) => r.poolIdentifiers)
        .value();
    for (const poolAddress of usedPoolAddresses) {
        poolAddressSet.add(poolAddress);
    }
    const protocolsSet = new Set();
    const usedProtocols = (0, lodash_1.default)(usedRoutes)
        .flatMap((r) => r.protocol)
        .uniq()
        .value();
    for (const protocol of usedProtocols) {
        protocolsSet.add(protocol);
    }
    for (const routeQuote of candidateRouteQuotes) {
        const { poolIdentifiers: poolAddresses, protocol } = routeQuote;
        if (poolAddresses.some((poolAddress) => poolAddressSet.has(poolAddress))) {
            continue;
        }
        // This code is just for debugging. Allows us to force a cross-protocol split route by skipping
        // consideration of routes that come from the same protocol as a used route.
        const needToForce = forceCrossProtocol && protocolsSet.size == 1;
        if (needToForce && protocolsSet.has(protocol)) {
            continue;
        }
        return routeQuote;
    }
    return null;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdC1zd2FwLXJvdXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2Z1bmN0aW9ucy9iZXN0LXN3YXAtcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQXFEO0FBQ3JELG9EQUErQztBQUMvQyxnREFBdUQ7QUFDdkQsZ0RBQXdCO0FBQ3hCLG9EQUF1QjtBQUN2QixzRkFBNEQ7QUFDNUQsNERBQW9DO0FBSXBDLHdDQUF1RTtBQUN2RSxtREFBdUQ7QUFDdkQsMkNBQXdDO0FBQ3hDLGlEQUFnRTtBQUNoRSxpREFBMkU7QUFHM0UsOENBQStFO0FBbUJ4RSxLQUFLLFVBQVUsZ0JBQWdCLENBQ3BDLE1BQXNCLEVBQ3RCLFFBQWtCLEVBQ2xCLHFCQUE0QyxFQUM1QyxTQUFvQixFQUNwQixPQUFnQixFQUNoQixhQUFnQyxFQUNoQyxlQUFpQyxFQUNqQyxVQUE2QyxFQUM3QyxVQUE2QyxFQUM3QyxVQUE2QyxFQUM3QyxVQUF3QixFQUN4QixjQUErQjtJQUUvQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFdkIsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsYUFBYSxDQUFDO0lBRTNDLDZGQUE2RjtJQUM3RixJQUFJLGdCQUFnQixFQUFFO1FBQ3BCLFNBQUcsQ0FBQyxJQUFJLENBQ047WUFDRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7U0FDbkMsRUFDRCx5REFBeUQsQ0FDMUQsQ0FBQztRQUNGLHFCQUFxQixHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDakUsT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLHFCQUFRLENBQUMsS0FBSyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFD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