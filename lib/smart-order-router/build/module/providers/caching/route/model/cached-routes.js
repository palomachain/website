import _ from 'lodash';
import { CachedRoute } from './cached-route';
/**
 * Class defining the route to cache
 *
 * @export
 * @class CachedRoute
 */
export class CachedRoutes {
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
        const cachedRoutes = _.map(routes, (route) => new CachedRoute({ route: route.route, percent: route.percent }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLXJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvY2FjaGluZy9yb3V0ZS9tb2RlbC9jYWNoZWQtcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUl2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFjN0M7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQVl2Qjs7Ozs7Ozs7OztPQVVHO0lBQ0gsWUFBWSxFQUNWLE1BQU0sRUFDTixPQUFPLEVBQ1AsVUFBVSxFQUNWLFdBQVcsRUFDWCxnQkFBZ0IsRUFDaEIsV0FBVyxFQUNYLFNBQVMsRUFDVCxjQUFjLEVBQ2QsWUFBWSxHQUFHLENBQUMsR0FDRztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxNQUFNLENBQUMseUJBQXlCLENBQ3JDLE1BQTZCLEVBQzdCLE9BQWdCLEVBQ2hCLFVBQW9CLEVBQ3BCLFdBQXFCLEVBQ3JCLGdCQUE0QixFQUM1QixXQUFtQixFQUNuQixTQUFvQixFQUNwQixjQUFzQjtRQUV0QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBRXpDLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQ3hCLE1BQU0sRUFDTixDQUFDLEtBQTBCLEVBQUUsRUFBRSxDQUM3QixJQUFJLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDbEUsQ0FBQztRQUVGLE9BQU8sSUFBSSxZQUFZLENBQUM7WUFDdEIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsT0FBTztZQUNQLFVBQVU7WUFDVixXQUFXO1lBQ1gsZ0JBQWdCO1lBQ2hCLFdBQVc7WUFDWCxTQUFTO1lBQ1QsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFVBQVUsQ0FBQyxrQkFBMEIsRUFBRSxVQUFVLEdBQUcsS0FBSztRQUM5RCwyRUFBMkU7UUFDM0UsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRS9ELE9BQU8sZ0JBQWdCLElBQUksWUFBWSxDQUFDO0lBQzFDLENBQUM7Q0FDRiJ9