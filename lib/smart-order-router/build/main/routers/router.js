"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISwapToRatio = exports.IRouter = exports.SwapType = exports.SwapToRatioStatus = exports.MixedRoute = exports.V2Route = exports.V3Route = exports.V4Route = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
class V4Route extends v4_sdk_1.Route {
    constructor() {
        super(...arguments);
        this.protocol = router_sdk_1.Protocol.V4;
    }
}
exports.V4Route = V4Route;
class V3Route extends v3_sdk_1.Route {
    constructor() {
        super(...arguments);
        this.protocol = router_sdk_1.Protocol.V3;
    }
}
exports.V3Route = V3Route;
class V2Route extends v2_sdk_1.Route {
    constructor() {
        super(...arguments);
        this.protocol = router_sdk_1.Protocol.V2;
    }
}
exports.V2Route = V2Route;
class MixedRoute extends router_sdk_1.MixedRouteSDK {
    constructor() {
        super(...arguments);
        this.protocol = router_sdk_1.Protocol.MIXED;
    }
}
exports.MixedRoute = MixedRoute;
var SwapToRatioStatus;
(function (SwapToRatioStatus) {
    SwapToRatioStatus[SwapToRatioStatus["SUCCESS"] = 1] = "SUCCESS";
    SwapToRatioStatus[SwapToRatioStatus["NO_ROUTE_FOUND"] = 2] = "NO_ROUTE_FOUND";
    SwapToRatioStatus[SwapToRatioStatus["NO_SWAP_NEEDED"] = 3] = "NO_SWAP_NEEDED";
})(SwapToRatioStatus = exports.SwapToRatioStatus || (exports.SwapToRatioStatus = {}));
var SwapType;
(function (SwapType) {
    SwapType[SwapType["UNIVERSAL_ROUTER"] = 0] = "UNIVERSAL_ROUTER";
    SwapType[SwapType["SWAP_ROUTER_02"] = 1] = "SWAP_ROUTER_02";
})(SwapType = exports.SwapType || (exports.SwapType = {}));
/**
 * Provides functionality for finding optimal swap routes on the Uniswap protocol.
 *
 * @export
 * @abstract
 * @class IRouter
 */
class IRouter {
}
exports.IRouter = IRouter;
class ISwapToRatio {
}
exports.ISwapToRatio = ISwapToRatio;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcnMvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9EQUs2QjtBQVk3Qiw0Q0FBc0Q7QUFDdEQsNENBS3lCO0FBQ3pCLDRDQUFzRDtBQU90RCxNQUFhLE9BQVEsU0FBUSxjQUE4QjtJQUEzRDs7UUFDRSxhQUFRLEdBQWdCLHFCQUFRLENBQUMsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Q0FBQTtBQUZELDBCQUVDO0FBQ0QsTUFBYSxPQUFRLFNBQVEsY0FBd0I7SUFBckQ7O1FBQ0UsYUFBUSxHQUFnQixxQkFBUSxDQUFDLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0NBQUE7QUFGRCwwQkFFQztBQUNELE1BQWEsT0FBUSxTQUFRLGNBQXdCO0lBQXJEOztRQUNFLGFBQVEsR0FBZ0IscUJBQVEsQ0FBQyxFQUFFLENBQUM7SUFDdEMsQ0FBQztDQUFBO0FBRkQsMEJBRUM7QUFDRCxNQUFhLFVBQVcsU0FBUSwwQkFBaUM7SUFBakU7O1FBQ0UsYUFBUSxHQUFtQixxQkFBUSxDQUFDLEtBQUssQ0FBQztJQUM1QyxDQUFDO0NBQUE7QUFGRCxnQ0FFQztBQXVGRCxJQUFZLGlCQUlYO0FBSkQsV0FBWSxpQkFBaUI7SUFDM0IsK0RBQVcsQ0FBQTtJQUNYLDZFQUFrQixDQUFBO0lBQ2xCLDZFQUFrQixDQUFBO0FBQ3BCLENBQUMsRUFKVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUk1QjtBQXFCRCxJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDbEIsK0RBQWdCLENBQUE7SUFDaEIsMkRBQWMsQ0FBQTtBQUNoQixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkI7QUEyREQ7Ozs7OztHQU1HO0FBQ0gsTUFBc0IsT0FBTztDQW9CNUI7QUFwQkQsMEJBb0JDO0FBRUQsTUFBc0IsWUFBWTtDQVNqQztBQVRELG9DQVNDIn0=