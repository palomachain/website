import { Protocol } from '@uniswap/router-sdk';
import { Percent } from '@uniswap/sdk-core';
import { Pair } from '@uniswap/v2-sdk';
import { Pool as V3Pool } from '@uniswap/v3-sdk';
import { Pool as V4Pool } from '@uniswap/v4-sdk';
import _ from 'lodash';
import { V3_CORE_FACTORY_ADDRESSES } from './addresses';
import { CurrencyAmount } from '.';
export const routeToTokens = (route) => {
    switch (route.protocol) {
        case Protocol.V4:
            return route.currencyPath;
        case Protocol.V3:
            return route.tokenPath;
        case Protocol.V2:
        case Protocol.MIXED:
            return route.path;
        default:
            throw new Error(`Unsupported route ${JSON.stringify(route)}`);
    }
};
export const routeToPools = (route) => {
    switch (route.protocol) {
        case Protocol.V4:
        case Protocol.V3:
        case Protocol.MIXED:
            return route.pools;
        case Protocol.V2:
            return route.pairs;
        default:
            throw new Error(`Unsupported route ${JSON.stringify(route)}`);
    }
};
export const poolToString = (pool) => {
    if (pool instanceof V4Pool) {
        return ` -- ${pool.fee / 10000}% [${V4Pool.getPoolId(pool.token0, pool.token1, pool.fee, pool.tickSpacing, pool.hooks)}]`;
    }
    else if (pool instanceof V3Pool) {
        return ` -- ${pool.fee / 10000}% [${V3Pool.getAddress(pool.token0, pool.token1, pool.fee, undefined, V3_CORE_FACTORY_ADDRESSES[pool.chainId])}]`;
    }
    else if (pool instanceof Pair) {
        return ` -- [${Pair.getAddress(pool.token0, pool.token1)}]`;
    }
    else {
        throw new Error(`Unsupported pool ${JSON.stringify(pool)}`);
    }
};
export const routeToString = (route) => {
    const routeStr = [];
    const tokens = routeToTokens(route);
    const tokenPath = _.map(tokens, (token) => `${token.symbol}`);
    const pools = routeToPools(route);
    const poolFeePath = _.map(pools, (pool) => {
        if (pool instanceof Pair) {
            return ` -- [${Pair.getAddress(pool.token0, pool.token1)}]`;
        }
        else if (pool instanceof V3Pool) {
            return ` -- ${pool.fee / 10000}% [${V3Pool.getAddress(pool.token0, pool.token1, pool.fee, undefined, V3_CORE_FACTORY_ADDRESSES[pool.chainId])}]`;
        }
        else if (pool instanceof V4Pool) {
            return ` -- ${pool.fee / 10000}% [${V4Pool.getPoolId(pool.token0, pool.token1, pool.fee, pool.tickSpacing, pool.hooks)}]`;
        }
        else {
            throw new Error(`Unsupported pool ${JSON.stringify(pool)}`);
        }
        return `${poolToString(pool)} --> `;
    });
    for (let i = 0; i < tokenPath.length; i++) {
        routeStr.push(tokenPath[i]);
        if (i < poolFeePath.length) {
            routeStr.push(poolFeePath[i]);
        }
    }
    return routeStr.join('');
};
export const routeAmountsToString = (routeAmounts) => {
    const total = _.reduce(routeAmounts, (total, cur) => {
        return total.add(cur.amount);
    }, CurrencyAmount.fromRawAmount(routeAmounts[0].amount.currency, 0));
    const routeStrings = _.map(routeAmounts, ({ protocol, route, amount }) => {
        const portion = amount.divide(total);
        const percent = new Percent(portion.numerator, portion.denominator);
        /// @dev special case for MIXED routes we want to show user friendly V2+V3 instead
        return `[${protocol == Protocol.MIXED ? 'V2 + V3 + V4' : protocol}] ${percent.toFixed(2)}% = ${routeToString(route)}`;
    });
    return _.join(routeStrings, ', ');
};
export function shouldWipeoutCachedRoutes(cachedRoutes, routingConfig) {
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
            case Protocol.MIXED:
                return (route.route.pools.filter((pool) => {
                    return poolIsInExcludedProtocols(pool, routingConfig === null || routingConfig === void 0 ? void 0 : routingConfig.excludedProtocolsFromMixed);
                }).length > 0);
            default:
                return false;
        }
    });
    return containsExcludedProtocolPools !== undefined;
}
function poolIsInExcludedProtocols(pool, excludedProtocolsFromMixed) {
    var _a, _b, _c;
    if (pool instanceof V4Pool) {
        return (_a = excludedProtocolsFromMixed === null || excludedProtocolsFromMixed === void 0 ? void 0 : excludedProtocolsFromMixed.includes(Protocol.V4)) !== null && _a !== void 0 ? _a : false;
    }
    else if (pool instanceof V3Pool) {
        return (_b = excludedProtocolsFromMixed === null || excludedProtocolsFromMixed === void 0 ? void 0 : excludedProtocolsFromMixed.includes(Protocol.V3)) !== null && _b !== void 0 ? _b : false;
    }
    else if (pool instanceof Pair) {
        return (_c = excludedProtocolsFromMixed === null || excludedProtocolsFromMixed === void 0 ? void 0 : excludedProtocolsFromMixed.includes(Protocol.V2)) !== null && _c !== void 0 ? _c : false;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMvQyxPQUFPLEVBQVksT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxJQUFJLElBQUksTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUFFLElBQUksSUFBSSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRCxPQUFPLENBQUMsTUFBTSxRQUFRLENBQUM7QUFRdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR3hELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxHQUFHLENBQUM7QUFHbkMsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBc0IsRUFBYyxFQUFFO0lBQ2xFLFFBQVEsS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUN0QixLQUFLLFFBQVEsQ0FBQyxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQzVCLEtBQUssUUFBUSxDQUFDLEVBQUU7WUFDZCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDekIsS0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ2pCLEtBQUssUUFBUSxDQUFDLEtBQUs7WUFDakIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3BCO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDakU7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFzQixFQUFXLEVBQUU7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