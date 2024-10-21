"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSwapMethodParameters = exports.buildTrade = void 0;
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const universal_router_sdk_1 = require("@uniswap/universal-router-sdk");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const v4_sdk_1 = require("@uniswap/v4-sdk");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("..");
function buildTrade(tokenInCurrency, tokenOutCurrency, tradeType, routeAmounts) {
    /// Removed partition because of new mixedRoutes
    const v4RouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === router_sdk_1.Protocol.V4);
    const v3RouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === router_sdk_1.Protocol.V3);
    const v2RouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === router_sdk_1.Protocol.V2);
    const mixedRouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === router_sdk_1.Protocol.MIXED);
    // TODO: ROUTE-248 - refactor route objects for the trade object composition
    const v4Routes = lodash_1.default.map(v4RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == sdk_core_1.TradeType.EXACT_INPUT) {
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeRaw = new v4_sdk_1.Route(route.pools, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev4: routeRaw,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeCurrency = new v4_sdk_1.Route(route.pools, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev4: routeCurrency,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const v3Routes = lodash_1.default.map(v3RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == sdk_core_1.TradeType.EXACT_INPUT) {
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeRaw = new v3_sdk_1.Route(route.pools, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev3: routeRaw,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeCurrency = new v3_sdk_1.Route(route.pools, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev3: routeCurrency,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const v2Routes = lodash_1.default.map(v2RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == sdk_core_1.TradeType.EXACT_INPUT) {
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeV2SDK = new v2_sdk_1.Route(route.pairs, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev2: routeV2SDK,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeV2SDK = new v2_sdk_1.Route(route.pairs, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev2: routeV2SDK,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const mixedRoutes = lodash_1.default.map(mixedRouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        if (tradeType != sdk_core_1.TradeType.EXACT_INPUT) {
            throw new Error('Mixed routes are only supported for exact input trades');
        }
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
        const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
        const routeRaw = new router_sdk_1.MixedRouteSDK(route.pools, amountCurrency.currency, quoteCurrency.currency);
        return {
            mixedRoute: routeRaw,
            inputAmount: amountCurrency,
            outputAmount: quoteCurrency,
        };
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const trade = new router_sdk_1.Trade({
        v2Routes,
        v3Routes,
        v4Routes,
        mixedRoutes,
        tradeType,
    });
    return trade;
}
exports.buildTrade = buildTrade;
function buildSwapMethodParameters(trade, swapConfig, chainId) {
    if (swapConfig.type == __1.SwapType.UNIVERSAL_ROUTER) {
        return Object.assign(Object.assign({}, universal_router_sdk_1.SwapRouter.swapCallParameters(trade, swapConfig)), { to: (0, universal_router_sdk_1.UNIVERSAL_ROUTER_ADDRESS)(swapConfig.version, chainId) });
    }
    else if (swapConfig.type == __1.SwapType.SWAP_ROUTER_02) {
        const { recipient, slippageTolerance, deadline, inputTokenPermit } = swapConfig;
        return Object.assign(Object.assign({}, router_sdk_1.SwapRouter.swapCallParameters(trade, {
            recipient,
            slippageTolerance,
            deadlineOrPreviousBlockhash: deadline,
            inputTokenPermit,
        })), { to: (0, __1.SWAP_ROUTER_02_ADDRESSES)(chainId) });
    }
    throw new Error(`Unsupported swap type ${swapConfig}`);
}
exports.buildSwapMethodParameters = buildSwapMethodParameters;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kUGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL21ldGhvZFBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0RBSzZCO0FBQzdCLGdEQUFpRTtBQUNqRSx3RUFHdUM7QUFDdkMsNENBQXNEO0FBQ3RELDRDQUFzRDtBQUN0RCw0Q0FBc0Q7QUFDdEQsb0RBQXVCO0FBRXZCLDBCQVdZO0FBRVosU0FBZ0IsVUFBVSxDQUN4QixlQUF5QixFQUN6QixnQkFBMEIsRUFDMUIsU0FBcUIsRUFDckIsWUFBbUM7SUFFbkMsZ0RBQWdEO0lBQ2hELE1BQU0sY0FBYyxHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUM3QixZQUFZLEVBQ1osQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUsscUJBQVEsQ0FBQyxFQUFFLENBQ3RELENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRyxnQkFBQyxDQUFDLE1BQU0sQ0FDN0IsWUFBWSxFQUNaLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxLQUFLLHFCQUFRLENBQUMsRUFBRSxDQUN0RCxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQUcsZ0JBQUMsQ0FBQyxNQUFNLENBQzdCLFlBQVksRUFDWixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsS0FBSyxxQkFBUSxDQUFDLEVBQUUsQ0FDdEQsQ0FBQztJQUNGLE1BQU0saUJBQWlCLEdBQUcsZ0JBQUMsQ0FBQyxNQUFNLENBQ2hDLFlBQVksRUFDWixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsS0FBSyxxQkFBUSxDQUFDLEtBQUssQ0FDekQsQ0FBQztJQUVGLDRFQUE0RTtJQUM1RSxNQUFNLFFBQVEsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FRcEIsY0FBeUMsRUFDekMsQ0FBQyxXQUFrQyxFQUFFLEVBQUU7UUFDckMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsV0FBVyxDQUFDO1FBRTdDLGtFQUFrRTtRQUNsRSx1RUFBdUU7UUFDdkUsa0dBQWtHO1FBQ2xHLElBQUksU0FBUyxJQUFJLG9CQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3RDLE1BQU0sY0FBYyxHQUFHLGtCQUFjLENBQUMsb0JBQW9CLENBQ3hELGVBQWUsRUFDZixNQUFNLENBQUMsU0FBUyxFQUNoQixNQUFNLENBQUMsV0FBVyxDQUNuQixDQUFDO1lBQ0YsTUFBTSxhQUFhLEdBQUcsa0JBQWMsQ0FBQyxvQkFBb0IsQ0FDdkQsZ0JBQWdCLEVBQ2hCLEtBQUssQ0FBQyxTQUFTLEVBQ2YsS0FBSyxDQUFDLFdBQVcsQ0FDbEIsQ0FBQztZQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBVSxDQUM3QixLQUFLLENBQUMsS0FBSyxFQUNYLGNBQWMsQ0FBQyxRQUFRLEVBQ3ZCLGFBQWEsQ0FBQyxRQUFRLENBQ3ZCLENBQUM7WUFFRixPQUFPO2dCQUNMLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixXQUFXLEVBQUUsY0FBYztnQkFDM0IsWUFBWSxFQUFFLGFBQWE7YUFDNUIsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLGFBQWEsR0FBRyxrQkFBYyxDQUFDLG9CQUFvQixDQUN2RCxlQUFlLEVBQ2YsS0FBSyxDQUFDLFNBQVMsRUFDZixLQUFLLENBQUMsV0FBVyxDQUNsQixDQUFDO1lBRUYsTUFBTSxjQUFjLEdBQUcsa0JBQWMsQ0FBQyxvQkFBb0IsQ0FDeEQsZ0JBQWdCLEVBQ2hCLE1BQU0sQ0FBQyxTQUFTLEVBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQ25CLENBQUM7WUFFRixNQUFNLGFBQWEsR0FBRyxJQUFJLGNBQVUsQ0FDbEMsS0FBSyxDQUFDLEtBQUssRUFDWCxhQUFhLENBQUMsUUFBUSxFQUN0QixjQUFjLENBQUMsUUFBUSxDQUN4QixDQUFDO1lBRUYsT0FBTztnQkFDTCxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsV0FBVyxFQUFFLGFBQWE7Z0JBQzFCLFlBQVksRUFBRSxjQUFjO2FBQzdCLENBQUM7U0FDSDtJQUNILENBQUMsQ0FDRixDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUcsZ0JBQUMsQ0FBQyxHQUFHLENBUXBCLGNBQXlDLEVBQ3pDLENBQUMsV0FBa0MsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUU3QyxrRUFBa0U7UUFDbEUsdUVBQXVFO1FBQ3ZFLGtHQUFrRztRQUNsRyxJQUFJLFNBQVMsSUFBSSxvQkFBUyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLGNBQWMsR0FBRyxrQkFBYyxDQUFDLG9CQUFvQixDQUN4RCxlQUFlLEVBQ2YsTUFBTSxDQUFDLFNBQVMsRUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztZQUNGLE1BQU0sYUFBYSxHQUFHLGtCQUFjLENBQUMsb0JBQW9CLENBQ3ZELGdCQUFnQixFQUNoQixLQUFLLENBQUMsU0FBUyxFQUNmLEtBQUssQ0FBQyxXQUFXLENBQ2xCLENBQUM7WUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVUsQ0FDN0IsS0FBSyxDQUFDLEtBQUssRUFDWCxjQUFjLENBQUMsUUFBUSxFQUN2QixhQUFhLENBQUMsUUFBUSxDQUN2QixDQUFDO1lBRUYsT0FBTztnQkFDTCxPQUFPLEVBQUUsUUFBUTtnQkFDakIsV0FBVyxFQUFFLGNBQWM7Z0JBQzNCLFlBQVksRUFBRSxhQUFhO2FBQzVCLENBQUM7U0FDSDthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsa0JBQWMsQ0FBQyxvQkFBb0IsQ0FDdkQsZUFBZSxFQUNmLEtBQUssQ0FBQyxTQUFTLEVBQ2YsS0FBSyxDQUFDLFdBQVcsQ0FDbEIsQ0FBQztZQUVGLE1BQU0sY0FBYyxHQUFHLGtCQUFjLENBQUMsb0JBQW9CLENBQ3hELGdCQUFnQixFQUNoQixNQUFNLENBQUMsU0FBUyxFQUNoQixNQUFNLENBQUMsV0FBVyxDQUNuQixDQUFDO1lBRUYsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFVLENBQ2xDLEtBQUssQ0FBQyxLQUFLLEVBQ1gsYUFBYSxDQUFDLFFBQVEsRUFDdEIsY0FBYyxDQUFDLFFBQVEsQ0FDeEIsQ0FBQztZQUVGLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLFdBQVcsRUFBRSxhQUFhO2dCQUMxQixZQUFZLEVBQUUsY0FBYzthQUM3QixDQUFDO1NBQ0g7SUFDSCxDQUFDLENBQ0YsQ0FBQztJQUVGLE1BQU0sUUFBUSxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQVFwQixjQUF5QyxFQUN6QyxDQUFDLFdBQWtDLEVBQUUsRUFBRTtRQUNyQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxXQUFXLENBQUM7UUFFN0Msa0VBQWtFO1FBQ2xFLHVFQUF1RTtRQUN2RSxrR0FBa0c7UUFDbEcsSUFBSSxTQUFTLElBQUksb0JBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDdEMsTUFBTSxjQUFjLEdBQUcsa0JBQWMsQ0FBQyxvQkFBb0IsQ0FDeEQsZUFBZSxFQUNmLE1BQU0sQ0FBQyxTQUFTLEVBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQ25CLENBQUM7WUFDRixNQUFNLGFBQWEsR0FBRyxrQkFBYyxDQUFDLG9CQUFvQixDQUN2RCxnQkFBZ0IsRUFDaEIsS0FBSyxDQUFDLFNBQVMsRUFDZixLQUFLLENBQUMsV0FBVyxDQUNsQixDQUFDO1lBRUYsTUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFVLENBQy9CLEtBQUssQ0FBQyxLQUFLLEVBQ1gsY0FBYyxDQUFDLFFBQVEsRUFDdkIsYUFBYSxDQUFDLFFBQVEsQ0FDdkIsQ0FBQztZQUVGLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixZQUFZLEVBQUUsYUFBYTthQUM1QixDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sYUFBYSxHQUFHLGtCQUFjLENBQUMsb0JBQW9CLENBQ3ZELGVBQWUsRUFDZixLQUFLLENBQUMsU0FBUyxFQUNmLEtBQUssQ0FBQyxXQUFXLENBQ2xCLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxrQkFBYyxDQUFDLG9CQUFvQixDQUN4RCxnQkFBZ0IsRUFDaEIsTUFBTSxDQUFDLFNBQVMsRUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztZQUVGLE1BQU0sVUFBVSxHQUFHLElBQUksY0FBVSxDQUMvQixLQUFLLENBQUMsS0FBSyxFQUNYLGFBQWEsQ0FBQyxRQUFRLEVBQ3RCLGNBQWMsQ0FBQyxRQUFRLENBQ3hCLENBQUM7WUFFRixPQUFPO2dCQUNMLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixXQUFXLEVBQUUsYUFBYTtnQkFDMUIsWUFBWSxFQUFFLGNBQWM7YUFDN0IsQ0FBQztTQUNIO0lBQ0gsQ0FBQyxDQUNGLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FRdkIsaUJBQStDLEVBQy9DLENBQUMsV0FBcUMsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUU3QyxJQUFJLFNBQVMsSUFBSSxvQkFBUyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLHdEQUF3RCxDQUN6RCxDQUFDO1NBQ0g7UUFFRCxrRUFBa0U7UUFDbEUsdUVBQXVFO1FBQ3ZFLGtHQUFrRztRQUNsRyxNQUFNLGNBQWMsR0FBRyxrQkFBYyxDQUFDLG9CQUFvQixDQUN4RCxlQUFlLEVBQ2YsTUFBTSxDQUFDLFNBQVMsRUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztRQUNGLE1BQU0sYUFBYSxHQUFHLGtCQUFjLENBQUMsb0JBQW9CLENBQ3ZELGdCQUFnQixFQUNoQixLQUFLLENBQUMsU0FBUyxFQUNmLEtBQUssQ0FBQyxXQUFXLENBQ2xCLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLDBCQUFhLENBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQ1gsY0FBYyxDQUFDLFFBQVEsRUFDdkIsYUFBYSxDQUFDLFFBQVEsQ0FDdkIsQ0FBQztRQUVGLE9BQU87WUFDTCxVQUFVLEVBQUUsUUFBUTtZQUNwQixXQUFXLEVBQUUsY0FBYztZQUMzQixZQUFZLEVBQUUsYUFBYTtTQUM1QixDQUFDO0lBQ0osQ0FBQyxDQUNGLENBQUM7SUFFRiw2REFBNkQ7SUFDN0QsYUFBYTtJQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksa0JBQUssQ0FBQztRQUN0QixRQUFRO1FBQ1IsUUFBUTtRQUNSLFFBQVE7UUFDUixXQUFXO1FBQ1gsU0FBUztLQUNWLENBQUMsQ0FBQztJQUVILE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQXhSRCxnQ0F3UkM7QUFFRCxTQUFnQix5QkFBeUIsQ0FDdkMsS0FBMkMsRUFDM0MsVUFBdUIsRUFDdkIsT0FBZ0I7SUFFaEIsSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLFlBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNoRCx1Q0FDSyxpQ0FBZSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsS0FDeEQsRUFBRSxFQUFFLElBQUEsK0NBQXdCLEVBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFDekQ7S0FDSDtTQUFNLElBQUksVUFBVSxDQUFDLElBQUksSUFBSSxZQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3JELE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLEdBQ2hFLFVBQVUsQ0FBQztRQUViLHVDQUNLLHVCQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1lBQ3hDLFNBQVM7WUFDVCxpQkFBaUI7WUFDakIsMkJBQTJCLEVBQUUsUUFBUTtZQUNyQyxnQkFBZ0I7U0FDakIsQ0FBQyxLQUNGLEVBQUUsRUFBRSxJQUFBLDRCQUF3QixFQUFDLE9BQU8sQ0FBQyxJQUNyQztLQUNIO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBMUJELDhEQTBCQyJ9