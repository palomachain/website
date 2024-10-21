"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderlySimulator = exports.FallbackTenderlySimulator = exports.TENDERLY_NOT_SUPPORTED_CHAINS = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const constants_1 = require("@ethersproject/constants");
const permit2_sdk_1 = require("@uniswap/permit2-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const universal_router_sdk_1 = require("@uniswap/universal-router-sdk");
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers/lib/ethers");
const routers_1 = require("../routers");
const Erc20__factory_1 = require("../types/other/factories/Erc20__factory");
const Permit2__factory_1 = require("../types/other/factories/Permit2__factory");
const util_1 = require("../util");
const callData_1 = require("../util/callData");
const gas_factory_helpers_1 = require("../util/gas-factory-helpers");
const simulation_provider_1 = require("./simulation-provider");
var TenderlySimulationType;
(function (TenderlySimulationType) {
    TenderlySimulationType["QUICK"] = "quick";
    TenderlySimulationType["FULL"] = "full";
    TenderlySimulationType["ABI"] = "abi";
})(TenderlySimulationType || (TenderlySimulationType = {}));
const TENDERLY_BATCH_SIMULATE_API = (tenderlyBaseUrl, tenderlyUser, tenderlyProject) => `${tenderlyBaseUrl}/api/v1/account/${tenderlyUser}/project/${tenderlyProject}/simulate-batch`;
const TENDERLY_NODE_API = (chainId, tenderlyNodeApiKey) => {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
            return `https://mainnet.gateway.tenderly.co/${tenderlyNodeApiKey}`;
        default:
            throw new Error(`ChainId ${chainId} does not correspond to a tenderly node endpoint`);
    }
};
exports.TENDERLY_NOT_SUPPORTED_CHAINS = [
    sdk_core_1.ChainId.CELO,
    sdk_core_1.ChainId.CELO_ALFAJORES,
    sdk_core_1.ChainId.ZKSYNC,
];
// We multiply tenderly gas limit by this to overestimate gas limit
const DEFAULT_ESTIMATE_MULTIPLIER = 1.3;
class FallbackTenderlySimulator extends simulation_provider_1.Simulator {
    constructor(chainId, provider, portionProvider, tenderlySimulator, ethEstimateGasSimulator) {
        super(provider, portionProvider, chainId);
        this.tenderlySimulator = tenderlySimulator;
        this.ethEstimateGasSimulator = ethEstimateGasSimulator;
    }
    async simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig) {
        // Make call to eth estimate gas if possible
        // For erc20s, we must check if the token allowance is sufficient
        const inputAmount = swapRoute.trade.inputAmount;
        if (inputAmount.currency.isNative ||
            (await this.checkTokenApproved(fromAddress, inputAmount, swapOptions, this.provider))) {
            util_1.log.info('Simulating with eth_estimateGas since token is native or approved.');
            try {
                const swapRouteWithGasEstimate = await this.ethEstimateGasSimulator.ethEstimateGas(fromAddress, swapOptions, swapRoute, providerConfig);
                return swapRouteWithGasEstimate;
            }
            catch (err) {
                util_1.log.info({ err: err }, 'Error simulating using eth_estimateGas');
                // If it fails, we should still try to simulate using Tenderly
                // return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
            }
        }
        try {
            return await this.tenderlySimulator.simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig);
        }
        catch (err) {
            util_1.log.error({ err: err }, 'Failed to simulate via Tenderly');
            if (err instanceof Error && err.message.includes('timeout')) {
                routers_1.metric.putMetric('TenderlySimulationTimeouts', 1, routers_1.MetricLoggerUnit.Count);
            }
            return Object.assign(Object.assign({}, swapRoute), { simulationStatus: simulation_provider_1.SimulationStatus.Failed });
        }
    }
}
exports.FallbackTenderlySimulator = FallbackTenderlySimulator;
class TenderlySimulator extends simulation_provider_1.Simulator {
    constructor(chainId, tenderlyBaseUrl, tenderlyUser, tenderlyProject, tenderlyAccessKey, tenderlyNodeApiKey, v2PoolProvider, v3PoolProvider, v4PoolProvider, provider, portionProvider, overrideEstimateMultiplier, tenderlyRequestTimeout, tenderlyNodeApiMigrationPercent, tenderlyNodeApiEnabledChains) {
        super(provider, portionProvider, chainId);
        this.tenderlyNodeApiEnabledChains = [];
        this.tenderlyServiceInstance = axios_1.default.create({
            // keep connections alive,
            // maxSockets default is Infinity, so Infinity is read as 50 sockets
            httpAgent: new http_1.default.Agent({ keepAlive: true }),
            httpsAgent: new https_1.default.Agent({ keepAlive: true }),
        });
        this.tenderlyBaseUrl = tenderlyBaseUrl;
        this.tenderlyUser = tenderlyUser;
        this.tenderlyProject = tenderlyProject;
        this.tenderlyAccessKey = tenderlyAccessKey;
        this.tenderlyNodeApiKey = tenderlyNodeApiKey;
        this.v2PoolProvider = v2PoolProvider;
        this.v3PoolProvider = v3PoolProvider;
        this.v4PoolProvider = v4PoolProvider;
        this.overrideEstimateMultiplier = overrideEstimateMultiplier !== null && overrideEstimateMultiplier !== void 0 ? overrideEstimateMultiplier : {};
        this.tenderlyRequestTimeout = tenderlyRequestTimeout;
        this.tenderlyNodeApiMigrationPercent = tenderlyNodeApiMigrationPercent;
        this.tenderlyNodeApiEnabledChains = tenderlyNodeApiEnabledChains;
    }
    async simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig) {
        var _a, _b, _c;
        const currencyIn = swapRoute.trade.inputAmount.currency;
        const tokenIn = currencyIn.wrapped;
        const chainId = this.chainId;
        if (exports.TENDERLY_NOT_SUPPORTED_CHAINS.includes(chainId)) {
            const msg = `${exports.TENDERLY_NOT_SUPPORTED_CHAINS.toString()} not supported by Tenderly!`;
            util_1.log.info(msg);
            return Object.assign(Object.assign({}, swapRoute), { simulationStatus: simulation_provider_1.SimulationStatus.NotSupported });
        }
        if (!swapRoute.methodParameters) {
            const msg = 'No calldata provided to simulate transaction';
            util_1.log.info(msg);
            throw new Error(msg);
        }
        const { calldata } = swapRoute.methodParameters;
        util_1.log.info({
            calldata: swapRoute.methodParameters.calldata,
            fromAddress: fromAddress,
            chainId: chainId,
            tokenInAddress: tokenIn.address,
            router: swapOptions.type,
        }, 'Simulating transaction on Tenderly');
        const blockNumber = await (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber);
        let estimatedGasUsed;
        const estimateMultiplier = (_a = this.overrideEstimateMultiplier[chainId]) !== null && _a !== void 0 ? _a : DEFAULT_ESTIMATE_MULTIPLIER;
        if (swapOptions.type == routers_1.SwapType.UNIVERSAL_ROUTER) {
            // simulating from beacon chain deposit address that should always hold **enough balance**
            if (currencyIn.isNative && this.chainId == sdk_core_1.ChainId.MAINNET) {
                fromAddress = util_1.BEACON_CHAIN_DEPOSIT_ADDRESS;
            }
            // Do initial onboarding approval of Permit2.
            const erc20Interface = Erc20__factory_1.Erc20__factory.createInterface();
            const approvePermit2Calldata = erc20Interface.encodeFunctionData('approve', [(0, permit2_sdk_1.permit2Address)(this.chainId), constants_1.MaxUint256]);
            // We are unsure if the users calldata contains a permit or not. We just
            // max approve the Universal Router from Permit2 instead, which will cover both cases.
            const permit2Interface = Permit2__factory_1.Permit2__factory.createInterface();
            const approveUniversalRouterCallData = permit2Interface.encodeFunctionData('approve', [
                tokenIn.address,
                (0, universal_router_sdk_1.UNIVERSAL_ROUTER_ADDRESS)(swapOptions.version, this.chainId),
                util_1.MAX_UINT160,
                Math.floor(new Date().getTime() / 1000) + 10000000,
            ]);
            const approvePermit2 = {
                network_id: chainId,
                estimate_gas: true,
                input: approvePermit2Calldata,
                to: tokenIn.address,
                value: '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
                save_if_fails: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.saveTenderlySimulationIfFailed,
            };
            const approveUniversalRouter = {
                network_id: chainId,
                estimate_gas: true,
                input: approveUniversalRouterCallData,
                to: (0, permit2_sdk_1.permit2Address)(this.chainId),
                value: '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
                save_if_fails: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.saveTenderlySimulationIfFailed,
            };
            const swap = {
                network_id: chainId,
                input: calldata,
                estimate_gas: true,
                to: (0, universal_router_sdk_1.UNIVERSAL_ROUTER_ADDRESS)(swapOptions.version, this.chainId),
                value: currencyIn.isNative ? swapRoute.methodParameters.value : '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
                save_if_fails: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.saveTenderlySimulationIfFailed,
            };
            const body = {
                simulations: [approvePermit2, approveUniversalRouter, swap],
                estimate_gas: true,
            };
            const opts = {
                headers: {
                    'X-Access-Key': this.tenderlyAccessKey,
                },
                timeout: this.tenderlyRequestTimeout,
            };
            const url = TENDERLY_BATCH_SIMULATE_API(this.tenderlyBaseUrl, this.tenderlyUser, this.tenderlyProject);
            routers_1.metric.putMetric('TenderlySimulationUniversalRouterRequests', 1, routers_1.MetricLoggerUnit.Count);
            const before = Date.now();
            if (Math.random() * 100 < ((_b = this.tenderlyNodeApiMigrationPercent) !== null && _b !== void 0 ? _b : 0) &&
                ((_c = this.tenderlyNodeApiEnabledChains) !== null && _c !== void 0 ? _c : []).find((chainId) => chainId === this.chainId)) {
                const { data: resp, status: httpStatus } = await this.requestNodeSimulation(approvePermit2, approveUniversalRouter, swap);
                // We will maintain the original metrics TenderlySimulationUniversalRouterLatencies and TenderlySimulationUniversalRouterResponseStatus
                // so that they don't provide the existing tenderly dashboard as well as simulation alerts
                // In the meanwhile, we also add tenderly node metrics to distinguish from the tenderly api metrics
                // Once we migrate to node endpoint 100%, original metrics TenderlySimulationUniversalRouterLatencies and TenderlySimulationUniversalRouterResponseStatus
                // will work as is
                routers_1.metric.putMetric('TenderlySimulationUniversalRouterLatencies', Date.now() - before, routers_1.MetricLoggerUnit.Milliseconds);
                routers_1.metric.putMetric('TenderlyNodeSimulationUniversalRouterLatencies', Date.now() - before, routers_1.MetricLoggerUnit.Milliseconds);
                routers_1.metric.putMetric(`TenderlySimulationUniversalRouterResponseStatus${httpStatus}`, 1, routers_1.MetricLoggerUnit.Count);
                routers_1.metric.putMetric(`TenderlyNodeSimulationUniversalRouterResponseStatus${httpStatus}`, 1, routers_1.MetricLoggerUnit.Count);
                // Validate tenderly response body
                if (!resp ||
                    !resp.result ||
                    resp.result.length < 3 ||
                    resp.result[2].error) {
                    util_1.log.error({ resp }, `Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}.`);
                    return Object.assign(Object.assign({}, swapRoute), { simulationStatus: simulation_provider_1.SimulationStatus.Failed });
                }
                // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
                estimatedGasUsed = ethers_1.BigNumber.from((Number(resp.result[2].gas) * estimateMultiplier).toFixed(0));
                util_1.log.info({
                    body,
                    approvePermit2GasUsed: resp.result[0].gasUsed,
                    approveUniversalRouterGasUsed: resp.result[1].gasUsed,
                    swapGasUsed: resp.result[2].gasUsed,
                    approvePermit2Gas: resp.result[0].gas,
                    approveUniversalRouterGas: resp.result[1].gas,
                    swapGas: resp.result[2].gas,
                    swapWithMultiplier: estimatedGasUsed.toString(),
                }, 'Successfully Simulated Approvals + Swap via Tenderly node endpoint for Universal Router. Gas used.');
            }
            else {
                const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance
                    .post(url, body, opts)
                    .finally(() => {
                    routers_1.metric.putMetric('TenderlySimulationLatencies', Date.now() - before, routers_1.MetricLoggerUnit.Milliseconds);
                });
                routers_1.metric.putMetric('TenderlySimulationUniversalRouterLatencies', Date.now() - before, routers_1.MetricLoggerUnit.Milliseconds);
                routers_1.metric.putMetric('TenderlyApiSimulationUniversalRouterLatencies', Date.now() - before, routers_1.MetricLoggerUnit.Milliseconds);
                routers_1.metric.putMetric(`TenderlySimulationUniversalRouterResponseStatus${httpStatus}`, 1, routers_1.MetricLoggerUnit.Count);
                routers_1.metric.putMetric(`TenderlyApiSimulationUniversalRouterResponseStatus${httpStatus}`, 1, routers_1.MetricLoggerUnit.Count);
                // Validate tenderly response body
                if (!resp ||
                    resp.simulation_results.length < 3 ||
                    !resp.simulation_results[2].transaction ||
                    resp.simulation_results[2].transaction.error_message) {
                    this.logTenderlyErrorResponse(resp);
                    return Object.assign(Object.assign({}, swapRoute), { simulationStatus: simulation_provider_1.SimulationStatus.Failed });
                }
                // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
                estimatedGasUsed = ethers_1.BigNumber.from((resp.simulation_results[2].transaction.gas * estimateMultiplier).toFixed(0));
                util_1.log.info({
                    body,
                    approvePermit2GasUsed: resp.simulation_results[0].transaction.gas_used,
                    approveUniversalRouterGasUsed: resp.simulation_results[1].transaction.gas_used,
                    swapGasUsed: resp.simulation_results[2].transaction.gas_used,
                    approvePermit2Gas: resp.simulation_results[0].transaction.gas,
                    approveUniversalRouterGas: resp.simulation_results[1].transaction.gas,
                    swapGas: resp.simulation_results[2].transaction.gas,
                    swapWithMultiplier: estimatedGasUsed.toString(),
                }, 'Successfully Simulated Approvals + Swap via Tenderly Api endpoint for Universal Router. Gas used.');
                util_1.log.info({
                    body,
                    swapSimulation: resp.simulation_results[2].simulation,
                    swapTransaction: resp.simulation_results[2].transaction,
                }, 'Successful Tenderly Api endpoint Swap Simulation for Universal Router');
            }
        }
        else if (swapOptions.type == routers_1.SwapType.SWAP_ROUTER_02) {
            const approve = {
                network_id: chainId,
                input: callData_1.APPROVE_TOKEN_FOR_TRANSFER,
                estimate_gas: true,
                to: tokenIn.address,
                value: '0',
                from: fromAddress,
                simulation_type: TenderlySimulationType.QUICK,
            };
            const swap = {
                network_id: chainId,
                input: calldata,
                to: (0, util_1.SWAP_ROUTER_02_ADDRESSES)(chainId),
                estimate_gas: true,
                value: currencyIn.isNative ? swapRoute.methodParameters.value : '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
            };
            const body = { simulations: [approve, swap] };
            const opts = {
                headers: {
                    'X-Access-Key': this.tenderlyAccessKey,
                },
                timeout: this.tenderlyRequestTimeout,
            };
            const url = TENDERLY_BATCH_SIMULATE_API(this.tenderlyBaseUrl, this.tenderlyUser, this.tenderlyProject);
            routers_1.metric.putMetric('TenderlySimulationSwapRouter02Requests', 1, routers_1.MetricLoggerUnit.Count);
            const before = Date.now();
            const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance.post(url, body, opts);
            routers_1.metric.putMetric(`TenderlySimulationSwapRouter02ResponseStatus${httpStatus}`, 1, routers_1.MetricLoggerUnit.Count);
            const latencies = Date.now() - before;
            util_1.log.info(`Tenderly simulation swap router02 request body: ${body}, having latencies ${latencies} in milliseconds.`);
            routers_1.metric.putMetric('TenderlySimulationSwapRouter02Latencies', latencies, routers_1.MetricLoggerUnit.Milliseconds);
            // Validate tenderly response body
            if (!resp ||
                resp.simulation_results.length < 2 ||
                !resp.simulation_results[1].transaction ||
                resp.simulation_results[1].transaction.error_message) {
                const msg = `Failed to Simulate Via Tenderly!: ${resp.simulation_results[1].transaction.error_message}`;
                util_1.log.info({ err: resp.simulation_results[1].transaction.error_message }, msg);
                return Object.assign(Object.assign({}, swapRoute), { simulationStatus: simulation_provider_1.SimulationStatus.Failed });
            }
            // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
            estimatedGasUsed = ethers_1.BigNumber.from((resp.simulation_results[1].transaction.gas * estimateMultiplier).toFixed(0));
            util_1.log.info({
                body,
                approveGasUsed: resp.simulation_results[0].transaction.gas_used,
                swapGasUsed: resp.simulation_results[1].transaction.gas_used,
                approveGas: resp.simulation_results[0].transaction.gas,
                swapGas: resp.simulation_results[1].transaction.gas,
                swapWithMultiplier: estimatedGasUsed.toString(),
            }, 'Successfully Simulated Approval + Swap via Tenderly for SwapRouter02. Gas used.');
            util_1.log.info({
                body,
                swapTransaction: resp.simulation_results[1].transaction,
                swapSimulation: resp.simulation_results[1].simulation,
            }, 'Successful Tenderly Swap Simulation for SwapRouter02');
        }
        else {
            throw new Error(`Unsupported swap type: ${swapOptions}`);
        }
        const { estimatedGasUsedUSD, estimatedGasUsedQuoteToken, estimatedGasUsedGasToken, quoteGasAdjusted, } = await (0, gas_factory_helpers_1.calculateGasUsed)(chainId, swapRoute, estimatedGasUsed, this.v2PoolProvider, this.v3PoolProvider, this.provider, providerConfig);
        return Object.assign(Object.assign({}, (0, gas_factory_helpers_1.initSwapRouteFromExisting)(swapRoute, this.v2PoolProvider, this.v3PoolProvider, this.v4PoolProvider, this.portionProvider, quoteGasAdjusted, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, swapOptions, estimatedGasUsedGasToken, providerConfig)), { simulationStatus: simulation_provider_1.SimulationStatus.Succeeded });
    }
    logTenderlyErrorResponse(resp) {
        util_1.log.info({
            resp,
        }, 'Failed to Simulate on Tenderly');
        util_1.log.info({
            err: resp.simulation_results.length >= 1
                ? resp.simulation_results[0].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #1 Transaction');
        util_1.log.info({
            err: resp.simulation_results.length >= 1
                ? resp.simulation_results[0].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #1 Simulation');
        util_1.log.info({
            err: resp.simulation_results.length >= 2
                ? resp.simulation_results[1].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #2 Transaction');
        util_1.log.info({
            err: resp.simulation_results.length >= 2
                ? resp.simulation_results[1].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #2 Simulation');
        util_1.log.info({
            err: resp.simulation_results.length >= 3
                ? resp.simulation_results[2].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #3 Transaction');
        util_1.log.info({
            err: resp.simulation_results.length >= 3
                ? resp.simulation_results[2].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #3 Simulation');
    }
    async requestNodeSimulation(approvePermit2, approveUniversalRouter, swap) {
        const nodeEndpoint = TENDERLY_NODE_API(this.chainId, this.tenderlyNodeApiKey);
        const blockNumber = swap.block_number
            ? ethers_1.BigNumber.from(swap.block_number).toHexString().replace('0x0', '0x')
            : 'latest';
        const body = {
            id: 1,
            jsonrpc: '2.0',
            method: 'tenderly_estimateGasBundle',
            params: [
                [
                    {
                        from: approvePermit2.from,
                        to: approvePermit2.to,
                        data: approvePermit2.input,
                    },
                    {
                        from: approveUniversalRouter.from,
                        to: approveUniversalRouter.to,
                        data: approveUniversalRouter.input,
                    },
                    { from: swap.from, to: swap.to, data: swap.input },
                ],
                blockNumber,
            ],
        };
        const opts = {
            timeout: this.tenderlyRequestTimeout,
        };
        const before = Date.now();
        try {
            // For now, we don't timeout tenderly node endpoint, but we should before we live switch to node endpoint
            const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance.post(nodeEndpoint, body, opts);
            const latencies = Date.now() - before;
            routers_1.metric.putMetric('TenderlyNodeGasEstimateBundleLatencies', latencies, routers_1.MetricLoggerUnit.Milliseconds);
            routers_1.metric.putMetric('TenderlyNodeGasEstimateBundleSuccess', 1, routers_1.MetricLoggerUnit.Count);
            if (httpStatus !== 200) {
                util_1.log.error(`Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}. HTTP Status: ${httpStatus}`, { resp });
                return { data: resp, status: httpStatus };
            }
            return { data: resp, status: httpStatus };
        }
        catch (err) {
            util_1.log.error({ err }, `Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}. Error: ${err}`);
            routers_1.metric.putMetric('TenderlyNodeGasEstimateBundleFailure', 1, routers_1.MetricLoggerUnit.Count);
            // we will have to re-throw the error, so that simulation-provider can catch the error, and return simulation status = failed
            throw err;
        }
    }
}
exports.TenderlySimulator = TenderlySimulator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsa0RBQTBCO0FBRTFCLHdEQUFzRDtBQUV0RCxzREFBc0Q7QUFDdEQsZ0RBQTRDO0FBQzVDLHdFQUF5RTtBQUN6RSxrREFBa0Q7QUFDbEQsOENBQThDO0FBRTlDLHdDQU9vQjtBQUNwQiw0RUFBeUU7QUFDekUsZ0ZBQTZFO0FBQzdFLGtDQUtpQjtBQUNqQiwrQ0FBOEQ7QUFDOUQscUVBR3FDO0FBSXJDLCtEQUkrQjtBQTJDL0IsSUFBSyxzQkFJSjtBQUpELFdBQUssc0JBQXNCO0lBQ3pCLHlDQUFlLENBQUE7SUFDZix1Q0FBYSxDQUFBO0lBQ2IscUNBQVcsQ0FBQTtBQUNiLENBQUMsRUFKSSxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBSTFCO0FBeUNELE1BQU0sMkJBQTJCLEdBQUcsQ0FDbEMsZUFBdUIsRUFDdkIsWUFBb0IsRUFDcEIsZUFBdUIsRUFDdkIsRUFBRSxDQUNGLEdBQUcsZUFBZSxtQkFBbUIsWUFBWSxZQUFZLGVBQWUsaUJBQWlCLENBQUM7QUFFaEcsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE9BQWdCLEVBQUUsa0JBQTBCLEVBQUUsRUFBRTtJQUN6RSxRQUFRLE9BQU8sRUFBRTtRQUNmLEtBQUssa0JBQU8sQ0FBQyxPQUFPO1lBQ2xCLE9BQU8sdUNBQXVDLGtCQUFrQixFQUFFLENBQUM7UUFDckU7WUFDRSxNQUFNLElBQUksS0FBSyxDQUNiLFdBQVcsT0FBTyxrREFBa0QsQ0FDckUsQ0FBQztLQUNMO0FBQ0gsQ0FBQyxDQUFDO0FBRVcsUUFBQSw2QkFBNkIsR0FBRztJQUMzQyxrQkFBTyxDQUFDLElBQUk7SUFDWixrQkFBTyxDQUFDLGNBQWM7SUFDdEIsa0JBQU8s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LEVBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVU7Z0JBQ3ZDLENBQUMsQ0FBQyxFQUFFO1NBQ1QsRUFDRCw4Q0FBOEMsQ0FDL0MsQ0FBQztRQUNGLFVBQUcsQ0FBQyxJQUFJLENBQ047WUFDRSxHQUFHLEVBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVc7Z0JBQ3hDLENBQUMsQ0FBQyxFQUFFO1NBQ1QsRUFDRCwrQ0FBK0MsQ0FDaEQsQ0FBQztRQUNGLFVBQUcsQ0FBQyxJQUFJLENBQ047WUFDRSxHQUFHLEVBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVU7Z0JBQ3ZDLENBQUMsQ0FBQyxFQUFFO1NBQ1QsRUFDRCw4Q0FBOEMsQ0FDL0MsQ0FBQztRQUNGLFVBQUcsQ0FBQyxJQUFJLENBQ047WUFDRSxHQUFHLEVBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVc7Z0JBQ3hDLENBQUMsQ0FBQyxFQUFFO1NBQ1QsRUFDRCwrQ0FBK0MsQ0FDaEQsQ0FBQztRQUNGLFVBQUcsQ0FBQyxJQUFJLENBQ047WUFDRSxHQUFHLEVBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVU7Z0JBQ3ZDLENBQUMsQ0FBQyxFQUFFO1NBQ1QsRUFDRCw4Q0FBOEMsQ0FDL0MsQ0FBQztJQUNK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