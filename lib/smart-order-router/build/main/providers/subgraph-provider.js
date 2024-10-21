"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubgraphProvider = void 0;
const async_retry_1 = __importDefault(require("async-retry"));
const await_timeout_1 = __importDefault(require("await-timeout"));
const graphql_request_1 = require("graphql-request");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../util");
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
class SubgraphProvider {
    constructor(protocol, chainId, retries = 2, timeout = 30000, rollback = true, trackedEthThreshold = 0.01, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrl) {
        this.protocol = protocol;
        this.chainId = chainId;
        this.retries = retries;
        this.timeout = timeout;
        this.rollback = rollback;
        this.trackedEthThreshold = trackedEthThreshold;
        this.untrackedUsdThreshold = untrackedUsdThreshold;
        this.subgraphUrl = subgraphUrl;
        this.protocol = protocol;
        if (!this.subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new graphql_request_1.GraphQLClient(this.subgraphUrl);
    }
    async getPools(_currencyIn, _currencyOut, providerConfig) {
        const beforeAll = Date.now();
        let blockNumber = (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? await providerConfig.blockNumber
            : undefined;
        const query = (0, graphql_request_1.gql) `
      ${this.subgraphQuery(blockNumber)}
    `;
        let pools = [];
        util_1.log.info(`Getting ${this.protocol} pools from the subgraph with page size ${PAGE_SIZE}${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? ` as of block ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}`
            : ''}.`);
        let retries = 0;
        await (0, async_retry_1.default)(async () => {
            const timeout = new await_timeout_1.default();
            const getPools = async () => {
                let lastId = '';
                let pools = [];
                let poolsPage = [];
                // metrics variables
                let totalPages = 0;
                do {
                    totalPages += 1;
                    const poolsResult = await this.client.request(query, {
                        pageSize: PAGE_SIZE,
                        id: lastId,
                    });
                    poolsPage = poolsResult.pools;
                    pools = pools.concat(poolsPage);
                    lastId = pools[pools.length - 1].id;
                    util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.paginate.pageSize`, poolsPage.length);
                } while (poolsPage.length > 0);
                util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.paginate`, totalPages);
                util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.pools.length`, pools.length);
                return pools;
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
                util_1.log.error({ err }, `Error fetching ${this.protocol} Subgraph Pools.`);
                throw err;
            }
            finally {
                timeout.clear();
            }
        }, {
            retries: this.retries,
            onRetry: (err, retry) => {
                retries += 1;
                if (this.rollback &&
                    blockNumber &&
                    lodash_1.default.includes(err.message, 'indexed up to')) {
                    util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.indexError`, 1);
                    blockNumber = blockNumber - 10;
                    util_1.log.info(`Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`);
                }
                util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.timeout`, 1);
                pools = [];
                util_1.log.info({ err }, `Failed to get pools from subgraph. Retry attempt: ${retry}`);
            },
        });
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.retries`, retries);
        const untrackedPools = pools.filter((pool) => parseInt(pool.liquidity) > 0 ||
            parseFloat(pool.totalValueLockedETH) > this.trackedEthThreshold ||
            parseFloat(pool.totalValueLockedUSDUntracked) >
                this.untrackedUsdThreshold);
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.untracked.length`, untrackedPools.length);
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.untracked.percent`, (untrackedPools.length / pools.length) * 100);
        const beforeFilter = Date.now();
        const poolsSanitized = pools
            .filter((pool) => parseInt(pool.liquidity) > 0 ||
            parseFloat(pool.totalValueLockedETH) > this.trackedEthThreshold)
            .map((pool) => {
            return this.mapSubgraphPool(pool);
        });
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.filter.latency`, Date.now() - beforeFilter);
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.filter.length`, poolsSanitized.length);
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.filter.percent`, (poolsSanitized.length / pools.length) * 100);
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools`, 1);
        util_1.metric.putMetric(`${this.protocol}SubgraphProvider.chain_${this.chainId}.getPools.latency`, Date.now() - beforeAll);
        util_1.log.info(`Got ${pools.length} ${this.protocol} pools from the subgraph. ${poolsSanitized.length} after filtering`);
        return poolsSanitized;
    }
}
exports.SubgraphProvider = SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDhEQUFnQztBQUNoQyxrRUFBb0M7QUFDcEMscURBQXFEO0FBQ3JELG9EQUF1QjtBQUd2QixrQ0FBc0M7QUFZdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsK0NBQStDO0FBaUN2RSxNQUFzQixnQkFBZ0I7SUFNcEMsWUFDVSxRQUFrQixFQUNsQixPQUFnQixFQUNoQixVQUFVLENBQUMsRUFDWCxVQUFVLEtBQUssRUFDZixXQUFXLElBQUksRUFDZixzQkFBc0IsSUFBSSxFQUMxQix3QkFBd0IsTUFBTSxDQUFDLFNBQVMsRUFDeEMsV0FBb0I7UUFQcEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBTztRQUNmLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBTztRQUMxQiwwQkFBcUIsR0FBckIscUJBQXFCLENBQW1CO1FBQ3hDLGdCQUFXLEdBQVgsV0FBVyxDQUFTO1FBRTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLCtCQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUNuQixXQUFzQixFQUN0QixZQUF1QixFQUN2QixjQUErQjtRQUUv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