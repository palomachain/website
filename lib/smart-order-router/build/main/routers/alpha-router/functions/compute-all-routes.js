"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAllRoutes = exports.computeAllMixedRoutes = exports.computeAllV2Routes = exports.computeAllV3Routes = exports.computeAllV4Routes = void 0;
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
const util_1 = require("../../../util");
const log_1 = require("../../../util/log");
const routes_1 = require("../../../util/routes");
const router_1 = require("../../router");
function computeAllV4Routes(currencyIn, currencyOut, pools, maxHops) {
    return computeAllRoutes(currencyIn, currencyOut, (route, currencyIn, currencyOut) => {
        return new router_1.V4Route(route, currencyIn, currencyOut);
    }, (pool, currency) => pool.involvesToken(currency), pools, maxHops);
}
exports.computeAllV4Routes = computeAllV4Routes;
function computeAllV3Routes(tokenIn, tokenOut, pools, maxHops) {
    return computeAllRoutes(tokenIn, tokenOut, (route, tokenIn, tokenOut) => {
        return new router_1.V3Route(route, tokenIn, tokenOut);
    }, (pool, token) => pool.involvesToken(token), pools, maxHops);
}
exports.computeAllV3Routes = computeAllV3Routes;
function computeAllV2Routes(tokenIn, tokenOut, pools, maxHops) {
    return computeAllRoutes(tokenIn, tokenOut, (route, tokenIn, tokenOut) => {
        return new router_1.V2Route(route, tokenIn, tokenOut);
    }, (pool, token) => pool.involvesToken(token), pools, maxHops);
}
exports.computeAllV2Routes = computeAllV2Routes;
function computeAllMixedRoutes(currencyIn, currencyOut, parts, maxHops) {
    const routesRaw = computeAllRoutes(currencyIn, currencyOut, (route, currencyIn, currencyOut) => {
        return new router_1.MixedRoute(route, currencyIn, currencyOut);
    }, (pool, currency) => currency.isNative
        ? pool.involvesToken(currency)
        : pool.involvesToken(currency), parts, maxHops);
    /// filter out pure v4 and v3 and v2 routes
    return routesRaw.filter((route) => {
        return (!route.pools.every((pool) => pool instanceof v4_sdk_1.Pool) &&
            !route.pools.every((pool) => pool instanceof v3_sdk_1.Pool) &&
            !route.pools.every((pool) => pool instanceof v2_sdk_1.Pair));
    });
}
exports.computeAllMixedRoutes = computeAllMixedRoutes;
function computeAllRoutes(tokenIn, tokenOut, buildRoute, involvesToken, pools, maxHops) {
    var _a;
    const poolsUsed = Array(pools.length).fill(false);
    const routes = [];
    const computeRoutes = (tokenIn, tokenOut, currentRoute, poolsUsed, tokensVisited, _previousTokenOut) => {
        if (currentRoute.length > maxHops) {
            return;
        }
        if (currentRoute.length > 0 &&
            involvesToken(currentRoute[currentRoute.length - 1], tokenOut)) {
            routes.push(buildRoute([...currentRoute], tokenIn, tokenOut));
            return;
        }
        for (let i = 0; i < pools.length; i++) {
            if (poolsUsed[i]) {
                continue;
            }
            const curPool = pools[i];
            const previousTokenOut = _previousTokenOut ? _previousTokenOut : tokenIn;
            if (!involvesToken(curPool, previousTokenOut)) {
                continue;
            }
            const currentTokenOut = curPool.token0.equals(previousTokenOut)
                ? curPool.token1
                : curPool.token0;
            if (tokensVisited.has((0, util_1.getAddressLowerCase)(currentTokenOut))) {
                continue;
            }
            tokensVisited.add((0, util_1.getAddressLowerCase)(currentTokenOut));
            currentRoute.push(curPool);
            poolsUsed[i] = true;
            computeRoutes(tokenIn, tokenOut, currentRoute, poolsUsed, tokensVisited, currentTokenOut);
            poolsUsed[i] = false;
            currentRoute.pop();
            tokensVisited.delete((0, util_1.getAddressLowerCase)(currentTokenOut));
        }
    };
    computeRoutes(tokenIn, tokenOut, [], poolsUsed, new Set([(0, util_1.getAddressLowerCase)(tokenIn)]));
    log_1.log.info({
        routes: routes.map(routes_1.routeToString),
        pools: pools.map(routes_1.poolToString),
    }, `Computed ${routes.length} possible routes for type ${(_a = routes[0]) === null || _a === void 0 ? void 0 : _a.protocol}.`);
    return routes;
}
exports.computeAllRoutes = computeAllRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZS1hbGwtcm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2Z1bmN0aW9ucy9jb21wdXRlLWFsbC1yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsNENBQXVDO0FBQ3ZDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFFakQsd0NBQW9EO0FBQ3BELDJDQUF3QztBQUN4QyxpREFBbUU7QUFDbkUseUNBTXNCO0FBRXRCLFNBQWdCLGtCQUFrQixDQUNoQyxVQUFvQixFQUNwQixXQUFxQixFQUNyQixLQUFlLEVBQ2YsT0FBZTtJQUVmLE9BQU8sZ0JBQWdCLENBQ3JCLFVBQVUsRUFDVixXQUFXLEVBQ1gsQ0FBQyxLQUFlLEVBQUUsVUFBb0IsRUFBRSxXQUFxQixFQUFFLEVBQUU7UUFDL0QsT0FBTyxJQUFJLGdCQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRCxDQUFDLEVBQ0QsQ0FBQyxJQUFZLEVBQUUsUUFBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFDbEUsS0FBSyxFQUNMLE9BQU8sQ0FDUixDQUFDO0FBQ0osQ0FBQztBQWhCRCxnREFnQkM7QUFFRCxTQUFnQixrQkFBa0IsQ0FDaEMsT0FBYyxFQUNkLFFBQWUsRUFDZixLQUFlLEVBQ2YsT0FBZTtJQUVmLE9BQU8sZ0JBQWdCLENBQ3JCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsQ0FBQyxLQUFlLEVBQUUsT0FBYyxFQUFFLFFBQWUsRUFBRSxFQUFFO1FBQ25ELE9BQU8sSUFBSSxnQkFBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxFQUNELENBQUMsSUFBWSxFQUFFLEtBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFDekQs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