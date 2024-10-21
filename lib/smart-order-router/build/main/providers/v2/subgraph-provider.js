"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2SubgraphProvider = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const async_retry_1 = __importDefault(require("async-retry"));
const await_timeout_1 = __importDefault(require("await-timeout"));
const graphql_request_1 = require("graphql-request");
const lodash_1 = __importDefault(require("lodash"));
const log_1 = require("../../util/log");
const metric_1 = require("../../util/metric");
const SUBGRAPH_URL_BY_CHAIN = {
    [sdk_core_1.ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev',
};
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
class V2SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 360000, rollback = true, pageSize = PAGE_SIZE, trackedEthThreshold = 0.025, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrlOverride) {
        var _a;
        this.chainId = chainId;
        this.retries = retries;
        this.timeout = timeout;
        this.rollback = rollback;
        this.pageSize = pageSize;
        this.trackedEthThreshold = trackedEthThreshold;
        this.untrackedUsdThreshold = untrackedUsdThreshold;
        this.subgraphUrlOverride = subgraphUrlOverride;
        const subgraphUrl = (_a = this.subgraphUrlOverride) !== null && _a !== void 0 ? _a : SUBGRAPH_URL_BY_CHAIN[this.chainId];
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new graphql_request_1.GraphQLClient(subgraphUrl);
    }
    async getPools(_tokenIn, _tokenOut, providerConfig) {
        const beforeAll = Date.now();
        let blockNumber = (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? await providerConfig.blockNumber
            : undefined;
        // Due to limitations with the Subgraph API this is the only way to parameterize the query.
        const query2 = (0, graphql_request_1.gql) `
        query getPools($pageSize: Int!, $id: String) {
            pairs(
                first: $pageSize
                ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
                where: { id_gt: $id }
            ) {
                id
                token0 { id, symbol }
                token1 { id, symbol }
                totalSupply
                trackedReserveETH
                reserveETH
                reserveUSD
            }
        }
    `;
        let pools = [];
        log_1.log.info(`Getting V2 pools from the subgraph with page size ${this.pageSize}${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? ` as of block ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}`
            : ''}.`);
        let outerRetries = 0;
        await (0, async_retry_1.default)(async () => {
            const timeout = new await_timeout_1.default();
            const getPools = async () => {
                let lastId = '';
                let pairs = [];
                let pairsPage = [];
                // metrics variables
                let totalPages = 0;
                let retries = 0;
                do {
                    totalPages += 1;
                    await (0, async_retry_1.default)(async () => {
                        const before = Date.now();
                        const poolsResult = await this.client.request(query2, {
                            pageSize: this.pageSize,
                            id: lastId,
                        });
                        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.latency`, Date.now() - before);
                        pairsPage = poolsResult.pairs;
                        pairs = pairs.concat(pairsPage);
                        lastId = pairs[pairs.length - 1].id;
                        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.pageSize`, pairsPage.length);
                    }, {
                        retries: this.retries,
                        onRetry: (err, retry) => {
                            pools = [];
                            retries += 1;
                            log_1.log.error({ err, lastId }, `Failed request for page of pools from subgraph. Retry attempt: ${retry}. LastId: ${lastId}`);
                        },
                    });
                } while (pairsPage.length > 0);
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate`, totalPages);
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.pairs.length`, pairs.length);
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.retries`, retries);
                return pairs;
            };
            try {
                const getPoolsPromise = getPools();
                const timerPromise = timeout.set(this.timeout).then(() => {
                    throw new Error(`Timed out getting pools from subgraph: ${this.timeout}`);
                });
                pools = await Promise.race([getPoolsPromise, timerPromise]);
                return;
            }
            catch (err) {
                log_1.log.error({ err }, 'Error fetching V2 Subgraph Pools.');
                throw err;
            }
            finally {
                timeout.clear();
            }
        }, {
            retries: this.retries,
            onRetry: (err, retry) => {
                outerRetries += 1;
                if (this.rollback &&
                    blockNumber &&
                    lodash_1.default.includes(err.message, 'indexed up to')) {
                    metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.indexError`, 1);
                    blockNumber = blockNumber - 10;
                    log_1.log.info(`Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`);
                }
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.timeout`, 1);
                pools = [];
                log_1.log.info({ err }, `Failed to get pools from subgraph. Retry attempt: ${retry}`);
            },
        });
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.retries`, outerRetries);
        // Filter pools that have tracked reserve ETH less than threshold.
        // trackedReserveETH filters pools that do not involve a pool from this allowlist:
        // https://github.com/Uniswap/v2-subgraph/blob/7c82235cad7aee4cfce8ea82f0030af3d224833e/src/mappings/pricing.ts#L43
        // Which helps filter pools with manipulated prices/liquidity.
        // TODO: Remove. Temporary fix to ensure tokens without trackedReserveETH are in the list.
        const FEI = '0x956f47f50a910163d8bf957cf5846d573e7f87ca';
        const tracked = pools.filter((pool) => pool.token0.id == FEI ||
            pool.token1.id == FEI ||
            parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.length`, tracked.length);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.percent`, (tracked.length / pools.length) * 100);
        const beforeFilter = Date.now();
        const poolsSanitized = pools
            .filter((pool) => {
            return (pool.token0.id == FEI ||
                pool.token1.id == FEI ||
                parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold ||
                parseFloat(pool.reserveUSD) > this.untrackedUsdThreshold);
        })
            .map((pool) => {
            return {
                id: pool.id.toLowerCase(),
                token0: {
                    id: pool.token0.id.toLowerCase(),
                },
                token1: {
                    id: pool.token1.id.toLowerCase(),
                },
                supply: parseFloat(pool.totalSupply),
                reserve: parseFloat(pool.trackedReserveETH),
                reserveUSD: parseFloat(pool.reserveUSD),
            };
        });
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.latency`, Date.now() - beforeFilter);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.length`, poolsSanitized.length);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.percent`, (poolsSanitized.length / pools.length) * 100);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools`, 1);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.latency`, Date.now() - beforeAll);
        log_1.log.info(`Got ${pools.length} V2 pools from the subgraph. ${poolsSanitized.length} after filtering`);
        return poolsSanitized;
    }
}
exports.V2SubgraphProvider = V2SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YyL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUFtRDtBQUNuRCw4REFBZ0M7QUFDaEMsa0VBQW9DO0FBQ3BDLHFEQUFxRDtBQUNyRCxvREFBdUI7QUFFdkIsd0NBQXFDO0FBQ3JDLDhDQUEyQztBQStCM0MsTUFBTSxxQkFBcUIsR0FBc0M7SUFDL0QsQ0FBQyxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUNmLGtFQUFrRTtDQUNyRSxDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsK0NBQStDO0FBZ0J2RSxNQUFhLGtCQUFrQjtJQUc3QixZQUNVLE9BQWdCLEVBQ2hCLFVBQVUsQ0FBQyxFQUNYLFVBQVUsTUFBTSxFQUNoQixXQUFXLElBQUksRUFDZixXQUFXLFNBQVMsRUFDcEIsc0JBQXNCLEtBQUssRUFDM0Isd0JBQXdCLE1BQU0sQ0FBQyxTQUFTLEVBQ3hDLG1CQUE0Qjs7UUFQNUIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixZQUFPLEdBQVAsT0FBTyxDQUFJO1FBQ1gsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFPO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUNwQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQVE7UUFDM0IsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFtQjtRQUN4Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQVM7UUFFcEMsTUFBTSxXQUFXLEdBQ2YsTUFBQSxJQUFJLENBQUMsbUJBQW1CLG1DQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLElBQUksQ0FBQyxP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