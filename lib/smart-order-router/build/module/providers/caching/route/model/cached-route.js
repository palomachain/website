import { Protocol } from '@uniswap/router-sdk';
import { Pair } from '@uniswap/v2-sdk';
import { Pool as V3Pool } from '@uniswap/v3-sdk';
import { Pool as V4Pool } from '@uniswap/v4-sdk';
import { getAddress } from '../../../../util';
/**
 * Class defining the route to cache
 *
 * @export
 * @class CachedRoute
 */
export class CachedRoute {
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
            case Protocol.V4:
                return this.route.pools
                    .map((pool) => `[V4]${getAddress(pool.token0)}/${getAddress(pool.token1)}`)
                    .join('->');
            case Protocol.V3:
                return this.route.pools
                    .map((pool) => `[V3]${pool.token0.address}/${pool.token1.address}/${pool.fee}`)
                    .join('->');
            case Protocol.V2:
                return this.route.pairs
                    .map((pair) => `[V2]${pair.token0.address}/${pair.token1.address}`)
                    .join('->');
            case Protocol.MIXED:
                return this.route.pools
                    .map((pool) => {
                    if (pool instanceof V4Pool) {
                        // TODO: ROUTE-217 - Support native currency routing in V4
                        return `[V4]${pool.token0.isToken
                            ? pool.token0.wrapped.address
                            : pool.token0.symbol}/${pool.token1.isToken
                            ? pool.token1.wrapped.address
                            : pool.token1.symbol}`;
                    }
                    else if (pool instanceof V3Pool) {
                        return `[V3]${pool.token0.address}/${pool.token1.address}/${pool.fee}`;
                    }
                    else if (pool instanceof Pair) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLXJvdXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9jYWNoaW5nL3JvdXRlL21vZGVsL2NhY2hlZC1yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFL0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxJQUFJLElBQUksTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUFFLElBQUksSUFBSSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQVNqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFPOUM7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sV0FBVztJQVF0Qjs7O09BR0c7SUFDSCxZQUFZLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBNEI7UUFUeEQsd0VBQXdFO1FBQ3hFLG9JQUFvSTtRQUM1SCxhQUFRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUNqQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBT3ZFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBVyxVQUFVO1FBQ25C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