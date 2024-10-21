"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedRoutes = void 0;
const lodash_1 = __importDefault(require("lodash"));
const cached_route_1 = require("./cached-route");
/**
 * Class defining the route to cache
 *
 * @export
 * @class CachedRoute
 */
class CachedRoutes {
    /**
     * @param routes
     * @param chainId
     * @param currencyIn
     * @param currencyOut
     * @param protocolsCovered
     * @param blockNumber
     * @param tradeType
     * @param originalAmount
     * @param blocksToLive
     */
    constructor({ routes, chainId, currencyIn, currencyOut, protocolsCovered, blockNumber, tradeType, originalAmount, blocksToLive = 0, }) {
        this.routes = routes;
        this.chainId = chainId;
        this.currencyIn = currencyIn;
        this.currencyOut = currencyOut;
        this.protocolsCovered = protocolsCovered;
        this.blockNumber = blockNumber;
        this.tradeType = tradeType;
        this.originalAmount = originalAmount;
        this.blocksToLive = blocksToLive;
    }
    /**
     * Factory method that creates a `CachedRoutes` object from an array of RouteWithValidQuote.
     *
     * @public
     * @static
     * @param routes
     * @param chainId
     * @param currencyIn
     * @param currencyOut
     * @param protocolsCovered
     * @param blockNumber
     * @param tradeType
     * @param originalAmount
     */
    static fromRoutesWithValidQuotes(routes, chainId, currencyIn, currencyOut, protocolsCovered, blockNumber, tradeType, originalAmount) {
        if (routes.length == 0)
            return undefined;
        const cachedRoutes = lodash_1.default.map(routes, (route) => new cached_route_1.CachedRoute({ route: route.route, percent: route.percent }));
        return new CachedRoutes({
            routes: cachedRoutes,
            chainId,
            currencyIn,
            currencyOut,
            protocolsCovered,
            blockNumber,
            tradeType,
            originalAmount,
        });
    }
    /**
     * Function to determine if, given a block number, the CachedRoute is expired or not.
     *
     * @param currentBlockNumber
     * @param optimistic
     */
    notExpired(currentBlockNumber, optimistic = false) {
        // When it's not optimistic, we only allow the route of the existing block.
        const blocksToLive = optimistic ? this.blocksToLive : 0;
        const blocksDifference = currentBlockNumber - this.blockNumber;
        return blocksDifference <= blocksToLive;
    }
}
exports.CachedRoutes = CachedRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLXJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvY2FjaGluZy9yb3V0ZS9tb2RlbC9jYWNoZWQtcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLG9EQUF1QjtBQUl2QixpREFBNkM7QUFjN0M7Ozs7O0dBS0c7QUFDSCxNQUFhLFlBQVk7SUFZdkI7Ozs7Ozs7Ozs7T0FVRztJQUNILFlBQVksRUFDVixNQUFNLEVBQ04sT0FBTyxFQUNQLFVBQVUsRUFDVixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLFdBQVcsRUFDWCxTQUFTLEVBQ1QsY0FBYyxFQUNkLFlBQVksR0FBRyxDQUFDLEdBQ0c7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksTUFBTSxDQUFDLHlCQUF5QixDQUNyQyxNQUE2QixFQUM3QixPQUFnQixFQUNoQixVQUFvQixFQUNwQixXQUFxQixFQUNyQixnQkFBNEIsRUFDNUIsV0FBbUIsRUFDbkIsU0FBb0IsRUFDcEIsY0FBc0I7UUFFdEIsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUV6QyxNQUFNLFlBQVksR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FDeEIsTUFBTSxFQUNOLENBQUMsS0FBMEIsRUFBRSxFQUFFLENBQzdCLElBQUksMEJBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDbEUsQ0FBQztRQUVGLE9BQU8sSUFBSSxZQUFZLENBQUM7WUFDdEIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsT0FBTztZQUNQLFVBQVU7WUFDVixXQUFXO1lBQ1gsZ0JBQWdCO1lBQ2hCLFdBQVc7WUFDWCxTQUFTO1lBQ1QsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFVBQVUsQ0FBQyxrQkFBMEIsRUFBRSxVQUFVLEdBQUcsS0FBSztRQUM5RCwyRUFBMkU7UUFDM0UsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRS9ELE9BQU8sZ0JBQWdCLElBQUksWUFBWSxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQXRHRCxvQ0FzR0MifQ==