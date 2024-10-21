"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedRoute = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
const util_1 = require("../../../../util");
/**
 * Class defining the route to cache
 *
 * @export
 * @class CachedRoute
 */
class CachedRoute {
    /**
     * @param route
     * @param percent
     */
    constructor({ route, percent }) {
        // Hashing function copying the same implementation as Java's `hashCode`
        // Sourced from: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=4613539#gistcomment-4613539
        this.hashCode = (str) => [...str].reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0);
        this.route = route;
        this.percent = percent;
    }
    get protocol() {
        return this.route.protocol;
    }
    get currencyIn() {
        return this.route.input;
    }
    get currencyOut() {
        return this.route.output;
    }
    get routePath() {
        switch (this.protocol) {
            case router_sdk_1.Protocol.V4:
                return this.route.pools
                    .map((pool) => `[V4]${(0, util_1.getAddress)(pool.token0)}/${(0, util_1.getAddress)(pool.token1)}`)
                    .join('->');
            case router_sdk_1.Protocol.V3:
                return this.route.pools
                    .map((pool) => `[V3]${pool.token0.address}/${pool.token1.address}/${pool.fee}`)
                    .join('->');
            case router_sdk_1.Protocol.V2:
                return this.route.pairs
                    .map((pair) => `[V2]${pair.token0.address}/${pair.token1.address}`)
                    .join('->');
            case router_sdk_1.Protocol.MIXED:
                return this.route.pools
                    .map((pool) => {
                    if (pool instanceof v4_sdk_1.Pool) {
                        // TODO: ROUTE-217 - Support native currency routing in V4
                        return `[V4]${pool.token0.isToken
                            ? pool.token0.wrapped.address
                            : pool.token0.symbol}/${pool.token1.isToken
                            ? pool.token1.wrapped.address
                            : pool.token1.symbol}`;
                    }
                    else if (pool instanceof v3_sdk_1.Pool) {
                        return `[V3]${pool.token0.address}/${pool.token1.address}/${pool.fee}`;
                    }
                    else if (pool instanceof v2_sdk_1.Pair) {
                        return `[V2]${pool.token0.address}/${pool.token1.address}`;
                    }
                    else {
                        throw new Error(`Unsupported pool type ${JSON.stringify(pool)}`);
                    }
                })
                    .join('->');
            default:
                throw new Error(`Unsupported protocol ${this.protocol}`);
        }
    }
    get routeId() {
        return this.hashCode(this.routePath);
    }
}
exports.CachedRoute = CachedRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLXJvdXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9jYWNoaW5nL3JvdXRlL21vZGVsL2NhY2hlZC1yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBK0M7QUFFL0MsNENBQXVDO0FBQ3ZDLDRDQUFpRDtBQUNqRCw0Q0FBaUQ7QUFTakQsMkNBQThDO0FBTzlDOzs7OztHQUtHO0FBQ0gsTUFBYSxXQUFXO0lBUXRCOzs7T0FHRztJQUNILFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUE0QjtRQVR4RCx3RUFBd0U7UUFDeEUsb0lBQW9JO1FBQzVILGFBQVEsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQ2pDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFPdkUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELElBQVcsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQVcsU0FBUztRQUNsQixRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckIsS0FBSyxx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