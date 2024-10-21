"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldWipeoutCachedRoutes = exports.routeAmountsToString = exports.routeToString = exports.poolToString = exports.routeToPools = exports.routeToTokens = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
const lodash_1 = __importDefault(require("lodash"));
const addresses_1 = require("./addresses");
const _1 = require(".");
const routeToTokens = (route) => {
    switch (route.protocol) {
        case router_sdk_1.Protocol.V4:
            return route.currencyPath;
        case router_sdk_1.Protocol.V3:
            return route.tokenPath;
        case router_sdk_1.Protocol.V2:
        case router_sdk_1.Protocol.MIXED:
            return route.path;
        default:
            throw new Error(`Unsupported route ${JSON.stringify(route)}`);
    }
};
exports.routeToTokens = routeToTokens;
const routeToPools = (route) => {
    switch (route.protocol) {
        case router_sdk_1.Protocol.V4:
        case router_sdk_1.Protocol.V3:
        case router_sdk_1.Protocol.MIXED:
            return route.pools;
        case router_sdk_1.Protocol.V2:
            return route.pairs;
        default:
            throw new Error(`Unsupported route ${JSON.stringify(route)}`);
    }
};
exports.routeToPools = routeToPools;
const poolToString = (pool) => {
    if (pool instanceof v4_sdk_1.Pool) {
        return ` -- ${pool.fee / 10000}% [${v4_sdk_1.Pool.getPoolId(pool.token0, pool.token1, pool.fee, pool.tickSpacing, pool.hooks)}]`;
    }
    else if (pool instanceof v3_sdk_1.Pool) {
        return ` -- ${pool.fee / 10000}% [${v3_sdk_1.Pool.getAddress(pool.token0, pool.token1, pool.fee, undefined, addresses_1.V3_CORE_FACTORY_ADDRESSES[pool.chainId])}]`;
    }
    else if (pool instanceof v2_sdk_1.Pair) {
        return ` -- [${v2_sdk_1.Pair.getAddress(pool.token0, pool.token1)}]`;
    }
    else {
        throw new Error(`Unsupported pool ${JSON.stringify(pool)}`);
    }
};
exports.poolToString = poolToString;
const routeToString = (route) => {
    const routeStr = [];
    const tokens = (0, exports.routeToTokens)(route);
    const tokenPath = lodash_1.default.map(tokens, (token) => `${token.symbol}`);
    const pools = (0, exports.routeToPools)(route);
    const poolFeePath = lodash_1.default.map(pools, (pool) => {
        if (pool instanceof v2_sdk_1.Pair) {
            return ` -- [${v2_sdk_1.Pair.getAddress(pool.token0, pool.token1)}]`;
        }
        else if (pool instanceof v3_sdk_1.Pool) {
            return ` -- ${pool.fee / 10000}% [${v3_sdk_1.Pool.getAddress(pool.token0, pool.token1, pool.fee, undefined, addresses_1.V3_CORE_FACTORY_ADDRESSES[pool.chainId])}]`;
        }
        else if (pool instanceof v4_sdk_1.Pool) {
            return ` -- ${pool.fee / 10000}% [${v4_sdk_1.Pool.getPoolId(pool.token0, pool.token1, pool.fee, pool.tickSpacing, pool.hooks)}]`;
        }
        else {
            throw new Error(`Unsupported pool ${JSON.stringify(pool)}`);
        }
        return `${(0, exports.poolToString)(pool)} --> `;
    });
    for (let i = 0; i < tokenPath.length; i++) {
        routeStr.push(tokenPath[i]);
        if (i < poolFeePath.length) {
            routeStr.push(poolFeePath[i]);
        }
    }
    return routeStr.join('');
};
exports.routeToString = routeToString;
const routeAmountsToString = (routeAmounts) => {
    const total = lodash_1.default.reduce(routeAmounts, (total, cur) => {
        return total.add(cur.amount);
    }, _1.CurrencyAmount.fromRawAmount(routeAmounts[0].amount.currency, 0));
    const routeStrings = lodash_1.default.map(routeAmounts, ({ protocol, route, amount }) => {
        const portion = amount.divide(total);
        const percent = new sdk_core_1.Percent(portion.numerator, portion.denominator);
        /// @dev special case for MIXED routes we want to show user friendly V2+V3 instead
        return `[${protocol == router_sdk_1.Protocol.MIXED ? 'V2 + V3 + V4' : protocol}] ${percent.toFixed(2)}% = ${(0, exports.routeToString)(route)}`;
    });
    return lodash_1.default.join(routeStrings, ', ');
};
exports.routeAmountsToString = routeAmountsToString;
function shouldWipeoutCachedRoutes(cachedRoutes, routingConfig) {
    // In case of optimisticCachedRoutes, we don't want to wipe out the cache
    // This is because the upstream client will indicate that it's a perf sensitive (likely online) request,
    // such that we should still use the cached routes.
    // In case of routing-api,
    // when intent=quote, optimisticCachedRoutes will be true, it means it's an online quote request, and we should use the cached routes.
    // when intent=caching, optimisticCachedRoutes will be false, it means it's an async routing lambda invocation for the benefit of
    // non-perf-sensitive, so that we can nullify the retrieved cached routes, if certain condition meets.
    if (routingConfig === null || routingConfig === void 0 ? void 0 : routingConfig.optimisticCachedRoutes) {
        return false;
    }
    const containsExcludedProtocolPools = cachedRoutes === null || cachedRoutes === void 0 ? void 0 : cachedRoutes.routes.find((route) => {
        switch (route.protocol) {
            case router_sdk_1.Protocol.MIXED:
                return (route.route.pools.filter((pool) => {
                    return poolIsInExcludedProtocols(pool, routingConfig === null || routingConfig === void 0 ? void 0 : routingConfig.excludedProtocolsFromMixed);
                }).length > 0);
            default:
                return false;
        }
    });
    return containsExcludedProtocolPools !== undefined;
}
exports.shouldWipeoutCachedRoutes = shouldWipeoutCachedRoutes;
function poolIsInExcludedProtocols(pool, excludedProtocolsFromMixed) {
    var _a, _b, _c;
    if (pool instanceof v4_sdk_1.Pool) {
        return (_a = excludedProtocolsFromMixed === null || excludedProtocolsFromMixed === void 0 ? void 0 : excludedProtocolsFromMixed.includes(router_sdk_1.Protocol.V4)) !== null && _a !== void 0 ? _a : false;
    }
    else if (pool instanceof v3_sdk_1.Pool) {
        return (_b = excludedProtocolsFromMixed === null || excludedProtocolsFromMixed === void 0 ? void 0 : excludedProtocolsFromMixed.includes(router_sdk_1.Protocol.V3)) !== null && _b !== void 0 ? _b : false;
    }
    else if (pool instanceof v2_sdk_1.Pair) {
        return (_c = excludedProtocolsFromMixed === null || excludedProtocolsFromMixed === void 0 ? void 0 : excludedProtocolsFromMixed.includes(router_sdk_1.Protocol.V2)) !== null && _c !== void 0 ? _c : false;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUErQztBQUMvQyxnREFBc0Q7QUFDdEQsNENBQXVDO0FBQ3ZDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFDakQsb0RBQXVCO0FBUXZCLDJDQUF3RDtBQUd4RCx3QkFBbUM7QUFHNUIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFzQixFQUFjLEVBQUU7SUFDbEUsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO1FBQ3RCLEtBQUsscUJBQVEsQ0FBQyxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQzVCLEtBQUsscUJBQVEsQ0FBQyxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3pCLEtBQUsscUJBQVEsQ0FBQyxFQUFFLENBQUM7UUFDakIsS0FBSyxxQkFBUSxDQUFDLEtBQUs7WUFDakIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3BCO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDakU7QUFDSCxDQUFDLENBQUM7QUFaVyxRQUFBLGFBQWEsaUJBWXhCO0FBRUssTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFzQixFQUFXLEVBQUU7SUFDOUQsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFO1FBQ3RCLEtBQUsscUJBQVEsQ0FBQyxFQUFFLENBQUM7UUFDakIsS0FBSyxxQkFBUSxDQUFDLEVBQUUsQ0FBQztRQUNqQixLQUFLLHFCQUFRLENBQUMsS0FBSztZQUNqQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDckIsS0FBSyxxQkFBUSxDQUFDLEVBQUU7WUFDZCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDckI7WUFDRSxNQUFNLElBQUksS0FB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