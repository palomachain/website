import { TradeType, } from '@uniswap/sdk-core';
import { CacheMode } from './model';
/**
 * Abstract class for a RouteCachingProvider.
 * Defines the base methods of how to interact with this interface, but not the implementation of how to cache.
 */
export class IRouteCachingProvider {
    constructor() {
        /**
         * Final implementation of the public `getCachedRoute` method, this is how code will interact with the implementation
         *
         * @public
         * @readonly
         * @param chainId
         * @param amount
         * @param quoteCurrency
         * @param tradeType
         * @param protocols
         * @param blockNumber
         */
        this.getCachedRoute = async (
        // Defined as a readonly member instead of a regular function to make it final.
        chainId, amount, quoteCurrency, tradeType, protocols, blockNumber, optimistic = false) => {
            if ((await this.getCacheMode(chainId, amount, quoteCurrency, tradeType, protocols)) == CacheMode.Darkmode) {
                return undefined;
            }
            const cachedRoute = await this._getCachedRoute(chainId, amount, quoteCurrency, tradeType, protocols, blockNumber, optimistic);
            return this.filterExpiredCachedRoutes(cachedRoute, blockNumber, optimistic);
        };
        /**
         * Final implementation of the public `setCachedRoute` method.
         * This method will set the blockToLive in the CachedRoutes object before calling the internal method to insert in cache.
         *
         * @public
         * @readonly
         * @param cachedRoutes The route to cache.
         * @returns Promise<boolean> Indicates if the route was inserted into cache.
         */
        this.setCachedRoute = async (
        // Defined as a readonly member instead of a regular function to make it final.
        cachedRoutes, amount) => {
            if ((await this.getCacheModeFromCachedRoutes(cachedRoutes, amount)) ==
                CacheMode.Darkmode) {
                return false;
            }
            cachedRoutes.blocksToLive = await this._getBlocksToLive(cachedRoutes, amount);
            return this._setCachedRoute(cachedRoutes, amount);
        };
    }
    /**
     * Returns the CacheMode for the given cachedRoutes and amount
     *
     * @param cachedRoutes
     * @param amount
     */
    getCacheModeFromCachedRoutes(cachedRoutes, amount) {
        const quoteCurrency = cachedRoutes.tradeType == TradeType.EXACT_INPUT
            ? cachedRoutes.currencyOut
            : cachedRoutes.currencyIn;
        return this.getCacheMode(cachedRoutes.chainId, amount, quoteCurrency, cachedRoutes.tradeType, cachedRoutes.protocolsCovered);
    }
    filterExpiredCachedRoutes(cachedRoutes, blockNumber, optimistic) {
        return (cachedRoutes === null || cachedRoutes === void 0 ? void 0 : cachedRoutes.notExpired(blockNumber, optimistic))
            ? cachedRoutes
            : undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUtY2FjaGluZy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvY2FjaGluZy9yb3V0ZS9yb3V0ZS1jYWNoaW5nLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFJTCxTQUFTLEdBQ1YsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBR3BDOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IscUJBQXFCO0lBQTNDO1FBQ0U7Ozs7Ozs7Ozs7O1dBV0c7UUFDYSxtQkFBYyxHQUFHLEtBQUs7UUFDcEMsK0VBQStFO1FBQy9FLE9BQWUsRUFDZixNQUFnQyxFQUNoQyxhQUF1QixFQUN2QixTQUFvQixFQUNwQixTQUFxQixFQUNyQixXQUFtQixFQUNuQixVQUFVLEdBQUcsS0FBSyxFQUNpQixFQUFFO1lBQ3JDLElBQ0UsQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQ3RCLE9BQU8sRUFDUCxNQUFNLEVBQ04sYUFBYSxFQUNiLFNBQVMsRUFDVCxTQUFTLENBQ1YsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQ3hCO2dCQUNBLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUM1QyxPQUFPLEVBQ1AsTUFBTSxFQUNOLGFBQWEsRUFDYixTQUFTLEVBQ1QsU0FBUyxFQUNULFdBQVcsRUFDWCxVQUFVLENBQ1gsQ0FBQztZQUVGLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDO1FBRUY7Ozs7Ozs7O1dBUUc7UUFDYSxtQkFBYyxHQUFHLEtBQUs7UUFDcEMsK0VBQStFO1FBQy9FLFlBQTBCLEVBQzFCLE1BQWdDLEVBQ2QsRUFBRTtZQUNwQixJQUNFLENBQUMsTUFBTSxJQUFJLENBQUMsNEJBQTRCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMvRCxTQUFTLENBQUMsUUFBUSxFQUNsQjtnQkFDQSxPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsWUFBWSxDQUFDLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FDckQsWUFBWSxFQUNaLE1BQU0sQ0FDUCxDQUFDO1lBRUYsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUM7SUFvR0osQ0FBQztJQWxHQzs7Ozs7T0FLRztJQUNJLDRCQUE0QixDQUNqQyxZQUEwQixFQUMxQixNQUFnQztRQUVoQyxNQUFNLGFBQWEsR0FDakIsWUFBWSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVztZQUM3QyxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVc7WUFDMUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFFOUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUN0QixZQUFZLENBQUMsT0FBTyxFQUNwQixNQUFNLEVBQ04sYUFBYSxFQUNiLFlBQVksQ0FBQyxTQUFTLEVBQ3RCLFlBQVksQ0FBQyxnQkFBZ0IsQ0FDOUIsQ0FBQztJQUNKLENBQUM7SUFtQlMseUJBQXlCLENBQ2pDLFlBQXNDLEVBQ3RDLFdBQW1CLEVBQ25CLFVBQW1CO1FBRW5CLE9BQU8sQ0FBQSxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsVUFBVSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUM7WUFDdEQsQ0FBQyxDQUFDLFlBQVk7WUFDZCxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2hCLENBQUM7Q0FpREYifQ==