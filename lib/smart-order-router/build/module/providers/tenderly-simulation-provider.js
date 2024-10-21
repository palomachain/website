import http from 'http';
import https from 'https';
import { MaxUint256 } from '@ethersproject/constants';
import { permit2Address } from '@uniswap/permit2-sdk';
import { ChainId } from '@uniswap/sdk-core';
import { UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk';
import axios from 'axios';
import { BigNumber } from 'ethers/lib/ethers';
import { metric, MetricLoggerUnit, SwapType, } from '../routers';
import { Erc20__factory } from '../types/other/factories/Erc20__factory';
import { Permit2__factory } from '../types/other/factories/Permit2__factory';
import { BEACON_CHAIN_DEPOSIT_ADDRESS, log, MAX_UINT160, SWAP_ROUTER_02_ADDRESSES, } from '../util';
import { APPROVE_TOKEN_FOR_TRANSFER } from '../util/callData';
import { calculateGasUsed, initSwapRouteFromExisting, } from '../util/gas-factory-helpers';
import { SimulationStatus, Simulator, } from './simulation-provider';
var TenderlySimulationType;
(function (TenderlySimulationType) {
    TenderlySimulationType["QUICK"] = "quick";
    TenderlySimulationType["FULL"] = "full";
    TenderlySimulationType["ABI"] = "abi";
})(TenderlySimulationType || (TenderlySimulationType = {}));
const TENDERLY_BATCH_SIMULATE_API = (tenderlyBaseUrl, tenderlyUser, tenderlyProject) => `${tenderlyBaseUrl}/api/v1/account/${tenderlyUser}/project/${tenderlyProject}/simulate-batch`;
const TENDERLY_NODE_API = (chainId, tenderlyNodeApiKey) => {
    switch (chainId) {
        case ChainId.MAINNET:
            return `https://mainnet.gateway.tenderly.co/${tenderlyNodeApiKey}`;
        default:
            throw new Error(`ChainId ${chainId} does not correspond to a tenderly node endpoint`);
    }
};
export const TENDERLY_NOT_SUPPORTED_CHAINS = [
    ChainId.CELO,
    ChainId.CELO_ALFAJORES,
    ChainId.ZKSYNC,
];
// We multiply tenderly gas limit by this to overestimate gas limit
const DEFAULT_ESTIMATE_MULTIPLIER = 1.3;
export class FallbackTenderlySimulator extends Simulator {
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
            log.info('Simulating with eth_estimateGas since token is native or approved.');
            try {
                const swapRouteWithGasEstimate = await this.ethEstimateGasSimulator.ethEstimateGas(fromAddress, swapOptions, swapRoute, providerConfig);
                return swapRouteWithGasEstimate;
            }
            catch (err) {
                log.info({ err: err }, 'Error simulating using eth_estimateGas');
                // If it fails, we should still try to simulate using Tenderly
                // return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
            }
        }
        try {
            return await this.tenderlySimulator.simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig);
        }
        catch (err) {
            log.error({ err: err }, 'Failed to simulate via Tenderly');
            if (err instanceof Error && err.message.includes('timeout')) {
                metric.putMetric('TenderlySimulationTimeouts', 1, MetricLoggerUnit.Count);
            }
            return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
        }
    }
}
export class TenderlySimulator extends Simulator {
    constructor(chainId, tenderlyBaseUrl, tenderlyUser, tenderlyProject, tenderlyAccessKey, tenderlyNodeApiKey, v2PoolProvider, v3PoolProvider, v4PoolProvider, provider, portionProvider, overrideEstimateMultiplier, tenderlyRequestTimeout, tenderlyNodeApiMigrationPercent, tenderlyNodeApiEnabledChains) {
        super(provider, portionProvider, chainId);
        this.tenderlyNodeApiEnabledChains = [];
        this.tenderlyServiceInstance = axios.create({
            // keep connections alive,
            // maxSockets default is Infinity, so Infinity is read as 50 sockets
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
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
        if (TENDERLY_NOT_SUPPORTED_CHAINS.includes(chainId)) {
            const msg = `${TENDERLY_NOT_SUPPORTED_CHAINS.toString()} not supported by Tenderly!`;
            log.info(msg);
            return { ...swapRoute, simulationStatus: SimulationStatus.NotSupported };
        }
        if (!swapRoute.methodParameters) {
            const msg = 'No calldata provided to simulate transaction';
            log.info(msg);
            throw new Error(msg);
        }
        const { calldata } = swapRoute.methodParameters;
        log.info({
            calldata: swapRoute.methodParameters.calldata,
            fromAddress: fromAddress,
            chainId: chainId,
            tokenInAddress: tokenIn.address,
            router: swapOptions.type,
        }, 'Simulating transaction on Tenderly');
        const blockNumber = await (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber);
        let estimatedGasUsed;
        const estimateMultiplier = (_a = this.overrideEstimateMultiplier[chainId]) !== null && _a !== void 0 ? _a : DEFAULT_ESTIMATE_MULTIPLIER;
        if (swapOptions.type == SwapType.UNIVERSAL_ROUTER) {
            // simulating from beacon chain deposit address that should always hold **enough balance**
            if (currencyIn.isNative && this.chainId == ChainId.MAINNET) {
                fromAddress = BEACON_CHAIN_DEPOSIT_ADDRESS;
            }
            // Do initial onboarding approval of Permit2.
            const erc20Interface = Erc20__factory.createInterface();
            const approvePermit2Calldata = erc20Interface.encodeFunctionData('approve', [permit2Address(this.chainId), MaxUint256]);
            // We are unsure if the users calldata contains a permit or not. We just
            // max approve the Universal Router from Permit2 instead, which will cover both cases.
            const permit2Interface = Permit2__factory.createInterface();
            const approveUniversalRouterCallData = permit2Interface.encodeFunctionData('approve', [
                tokenIn.address,
                UNIVERSAL_ROUTER_ADDRESS(swapOptions.version, this.chainId),
                MAX_UINT160,
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
                to: permit2Address(this.chainId),
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
                to: UNIVERSAL_ROUTER_ADDRESS(swapOptions.version, this.chainId),
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
            metric.putMetric('TenderlySimulationUniversalRouterRequests', 1, MetricLoggerUnit.Count);
            const before = Date.now();
            if (Math.random() * 100 < ((_b = this.tenderlyNodeApiMigrationPercent) !== null && _b !== void 0 ? _b : 0) &&
                ((_c = this.tenderlyNodeApiEnabledChains) !== null && _c !== void 0 ? _c : []).find((chainId) => chainId === this.chainId)) {
                const { data: resp, status: httpStatus } = await this.requestNodeSimulation(approvePermit2, approveUniversalRouter, swap);
                // We will maintain the original metrics TenderlySimulationUniversalRouterLatencies and TenderlySimulationUniversalRouterResponseStatus
                // so that they don't provide the existing tenderly dashboard as well as simulation alerts
                // In the meanwhile, we also add tenderly node metrics to distinguish from the tenderly api metrics
                // Once we migrate to node endpoint 100%, original metrics TenderlySimulationUniversalRouterLatencies and TenderlySimulationUniversalRouterResponseStatus
                // will work as is
                metric.putMetric('TenderlySimulationUniversalRouterLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
                metric.putMetric('TenderlyNodeSimulationUniversalRouterLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
                metric.putMetric(`TenderlySimulationUniversalRouterResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`TenderlyNodeSimulationUniversalRouterResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
                // Validate tenderly response body
                if (!resp ||
                    !resp.result ||
                    resp.result.length < 3 ||
                    resp.result[2].error) {
                    log.error({ resp }, `Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}.`);
                    return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
                }
                // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
                estimatedGasUsed = BigNumber.from((Number(resp.result[2].gas) * estimateMultiplier).toFixed(0));
                log.info({
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
                    metric.putMetric('TenderlySimulationLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
                });
                metric.putMetric('TenderlySimulationUniversalRouterLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
                metric.putMetric('TenderlyApiSimulationUniversalRouterLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
                metric.putMetric(`TenderlySimulationUniversalRouterResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
                metric.putMetric(`TenderlyApiSimulationUniversalRouterResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
                // Validate tenderly response body
                if (!resp ||
                    resp.simulation_results.length < 3 ||
                    !resp.simulation_results[2].transaction ||
                    resp.simulation_results[2].transaction.error_message) {
                    this.logTenderlyErrorResponse(resp);
                    return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
                }
                // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
                estimatedGasUsed = BigNumber.from((resp.simulation_results[2].transaction.gas * estimateMultiplier).toFixed(0));
                log.info({
                    body,
                    approvePermit2GasUsed: resp.simulation_results[0].transaction.gas_used,
                    approveUniversalRouterGasUsed: resp.simulation_results[1].transaction.gas_used,
                    swapGasUsed: resp.simulation_results[2].transaction.gas_used,
                    approvePermit2Gas: resp.simulation_results[0].transaction.gas,
                    approveUniversalRouterGas: resp.simulation_results[1].transaction.gas,
                    swapGas: resp.simulation_results[2].transaction.gas,
                    swapWithMultiplier: estimatedGasUsed.toString(),
                }, 'Successfully Simulated Approvals + Swap via Tenderly Api endpoint for Universal Router. Gas used.');
                log.info({
                    body,
                    swapSimulation: resp.simulation_results[2].simulation,
                    swapTransaction: resp.simulation_results[2].transaction,
                }, 'Successful Tenderly Api endpoint Swap Simulation for Universal Router');
            }
        }
        else if (swapOptions.type == SwapType.SWAP_ROUTER_02) {
            const approve = {
                network_id: chainId,
                input: APPROVE_TOKEN_FOR_TRANSFER,
                estimate_gas: true,
                to: tokenIn.address,
                value: '0',
                from: fromAddress,
                simulation_type: TenderlySimulationType.QUICK,
            };
            const swap = {
                network_id: chainId,
                input: calldata,
                to: SWAP_ROUTER_02_ADDRESSES(chainId),
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
            metric.putMetric('TenderlySimulationSwapRouter02Requests', 1, MetricLoggerUnit.Count);
            const before = Date.now();
            const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance.post(url, body, opts);
            metric.putMetric(`TenderlySimulationSwapRouter02ResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
            const latencies = Date.now() - before;
            log.info(`Tenderly simulation swap router02 request body: ${body}, having latencies ${latencies} in milliseconds.`);
            metric.putMetric('TenderlySimulationSwapRouter02Latencies', latencies, MetricLoggerUnit.Milliseconds);
            // Validate tenderly response body
            if (!resp ||
                resp.simulation_results.length < 2 ||
                !resp.simulation_results[1].transaction ||
                resp.simulation_results[1].transaction.error_message) {
                const msg = `Failed to Simulate Via Tenderly!: ${resp.simulation_results[1].transaction.error_message}`;
                log.info({ err: resp.simulation_results[1].transaction.error_message }, msg);
                return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
            }
            // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
            estimatedGasUsed = BigNumber.from((resp.simulation_results[1].transaction.gas * estimateMultiplier).toFixed(0));
            log.info({
                body,
                approveGasUsed: resp.simulation_results[0].transaction.gas_used,
                swapGasUsed: resp.simulation_results[1].transaction.gas_used,
                approveGas: resp.simulation_results[0].transaction.gas,
                swapGas: resp.simulation_results[1].transaction.gas,
                swapWithMultiplier: estimatedGasUsed.toString(),
            }, 'Successfully Simulated Approval + Swap via Tenderly for SwapRouter02. Gas used.');
            log.info({
                body,
                swapTransaction: resp.simulation_results[1].transaction,
                swapSimulation: resp.simulation_results[1].simulation,
            }, 'Successful Tenderly Swap Simulation for SwapRouter02');
        }
        else {
            throw new Error(`Unsupported swap type: ${swapOptions}`);
        }
        const { estimatedGasUsedUSD, estimatedGasUsedQuoteToken, estimatedGasUsedGasToken, quoteGasAdjusted, } = await calculateGasUsed(chainId, swapRoute, estimatedGasUsed, this.v2PoolProvider, this.v3PoolProvider, this.provider, providerConfig);
        return {
            ...initSwapRouteFromExisting(swapRoute, this.v2PoolProvider, this.v3PoolProvider, this.v4PoolProvider, this.portionProvider, quoteGasAdjusted, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, swapOptions, estimatedGasUsedGasToken, providerConfig),
            simulationStatus: SimulationStatus.Succeeded,
        };
    }
    logTenderlyErrorResponse(resp) {
        log.info({
            resp,
        }, 'Failed to Simulate on Tenderly');
        log.info({
            err: resp.simulation_results.length >= 1
                ? resp.simulation_results[0].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #1 Transaction');
        log.info({
            err: resp.simulation_results.length >= 1
                ? resp.simulation_results[0].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #1 Simulation');
        log.info({
            err: resp.simulation_results.length >= 2
                ? resp.simulation_results[1].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #2 Transaction');
        log.info({
            err: resp.simulation_results.length >= 2
                ? resp.simulation_results[1].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #2 Simulation');
        log.info({
            err: resp.simulation_results.length >= 3
                ? resp.simulation_results[2].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #3 Transaction');
        log.info({
            err: resp.simulation_results.length >= 3
                ? resp.simulation_results[2].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #3 Simulation');
    }
    async requestNodeSimulation(approvePermit2, approveUniversalRouter, swap) {
        const nodeEndpoint = TENDERLY_NODE_API(this.chainId, this.tenderlyNodeApiKey);
        const blockNumber = swap.block_number
            ? BigNumber.from(swap.block_number).toHexString().replace('0x0', '0x')
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
            metric.putMetric('TenderlyNodeGasEstimateBundleLatencies', latencies, MetricLoggerUnit.Milliseconds);
            metric.putMetric('TenderlyNodeGasEstimateBundleSuccess', 1, MetricLoggerUnit.Count);
            if (httpStatus !== 200) {
                log.error(`Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}. HTTP Status: ${httpStatus}`, { resp });
                return { data: resp, status: httpStatus };
            }
            return { data: resp, status: httpStatus };
        }
        catch (err) {
            log.error({ err }, `Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}. Error: ${err}`);
            metric.putMetric('TenderlyNodeGasEstimateBundleFailure', 1, MetricLoggerUnit.Count);
            // we will have to re-throw the error, so that simulation-provider can catch the error, and return simulation status = failed
            throw err;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sS0FBNkIsTUFBTSxPQUFPLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTlDLE9BQU8sRUFFTCxNQUFNLEVBQ04sZ0JBQWdCLEVBR2hCLFFBQVEsR0FDVCxNQUFNLFlBQVksQ0FBQztBQUNwQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDekUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDN0UsT0FBTyxFQUNMLDRCQUE0QixFQUM1QixHQUFHLEVBQ0gsV0FBVyxFQUNYLHdCQUF3QixHQUN6QixNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLHlCQUF5QixHQUMxQixNQUFNLDZCQUE2QixDQUFDO0FBSXJDLE9BQU8sRUFFTCxnQkFBZ0IsRUFDaEIsU0FBUyxHQUNWLE1BQU0sdUJBQXVCLENBQUM7QUEyQy9CLElBQUssc0JBSUo7QUFKRCxXQUFLLHNCQUFzQjtJQUN6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