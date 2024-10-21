import { MixedRouteSDK, Protocol, } from '@uniswap/router-sdk';
import { Route as V2RouteRaw } from '@uniswap/v2-sdk';
import { Route as V3RouteRaw, } from '@uniswap/v3-sdk';
import { Route as V4RouteRaw } from '@uniswap/v4-sdk';
export class V4Route extends V4RouteRaw {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.V4;
    }
}
export class V3Route extends V3RouteRaw {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.V3;
    }
}
export class V2Route extends V2RouteRaw {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.V2;
    }
}
export class MixedRoute extends MixedRouteSDK {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.MIXED;
    }
}
export var SwapToRatioStatus;
(function (SwapToRatioStatus) {
    SwapToRatioStatus[SwapToRatioStatus["SUCCESS"] = 1] = "SUCCESS";
    SwapToRatioStatus[SwapToRatioStatus["NO_ROUTE_FOUND"] = 2] = "NO_ROUTE_FOUND";
    SwapToRatioStatus[SwapToRatioStatus["NO_SWAP_NEEDED"] = 3] = "NO_SWAP_NEEDED";
})(SwapToRatioStatus || (SwapToRatioStatus = {}));
export var SwapType;
(function (SwapType) {
    SwapType[SwapType["UNIVERSAL_ROUTER"] = 0] = "UNIVERSAL_ROUTER";
    SwapType[SwapType["SWAP_ROUTER_02"] = 1] = "SWAP_ROUTER_02";
})(SwapType || (SwapType = {}));
/**
 * Provides functionality for finding optimal swap routes on the Uniswap protocol.
 *
 * @export
 * @abstract
 * @class IRouter
 */
export class IRouter {
}
export class ISwapToRatio {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcnMvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFFTCxhQUFhLEVBQ2IsUUFBUSxHQUVULE1BQU0scUJBQXFCLENBQUM7QUFZN0IsT0FBTyxFQUFFLEtBQUssSUFBSSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBSUwsS0FBSyxJQUFJLFVBQVUsR0FDcEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsS0FBSyxJQUFJLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBT3RELE1BQU0sT0FBTyxPQUFRLFNBQVEsVUFBOEI7SUFBM0Q7O1FBQ0UsYUFBUSxHQUFnQixRQUFRLENBQUMsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Q0FBQTtBQUNELE1BQU0sT0FBTyxPQUFRLFNBQVEsVUFBd0I7SUFBckQ7O1FBQ0UsYUFBUSxHQUFnQixRQUFRLENBQUMsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Q0FBQTtBQUNELE1BQU0sT0FBTyxPQUFRLFNBQVEsVUFBd0I7SUFBckQ7O1FBQ0UsYUFBUSxHQUFnQixRQUFRLENBQUMsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Q0FBQTtBQUNELE1BQU0sT0FBTyxVQUFXLFNBQVEsYUFBaUM7SUFBakU7O1FBQ0UsYUFBUSxHQUFtQixRQUFRLENBQUMsS0FBSyxDQUFDO0lBQzVDLENBQUM7Q0FBQTtBQXVGRCxNQUFNLENBQU4sSUFBWSxpQkFJWDtBQUpELFdBQVksaUJBQWlCO0lBQzNCLCtEQUFXLENBQUE7SUFDWCw2RUFBa0IsQ0FBQTtJQUNsQiw2RUFBa0IsQ0FBQTtBQUNwQixDQUFDLEVBSlcsaUJBQWlCLEtBQWpCLGlCQUFpQixRQUk1QjtBQXFCRCxNQUFNLENBQU4sSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2xCLCtEQUFnQixDQUFBO0lBQ2hCLDJEQUFjLENBQUE7QUFDaEIsQ0FBQyxFQUhXLFFBQVEsS0FBUixRQUFRLFFBR25CO0FBMkREOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBZ0IsT0FBTztDQW9CNUI7QUFFRCxNQUFNLE9BQWdCLFlBQVk7Q0FTakMifQ==