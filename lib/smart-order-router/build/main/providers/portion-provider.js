"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortionProvider = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const routers_1 = require("../routers");
const util_1 = require("../util");
class PortionProvider {
    getPortionAmount(tokenOutAmount, tradeType, externalTransferFailed, feeTakenOnTransfer, swapConfig) {
        if (externalTransferFailed ||
            feeTakenOnTransfer ||
            (swapConfig === null || swapConfig === void 0 ? void 0 : swapConfig.type) !== routers_1.SwapType.UNIVERSAL_ROUTER) {
            return undefined;
        }
        const swapConfigUniversalRouter = swapConfig;
        switch (tradeType) {
            case sdk_core_1.TradeType.EXACT_INPUT:
                if (swapConfigUniversalRouter.fee &&
                    swapConfigUniversalRouter.fee.fee.greaterThan(router_sdk_1.ZERO)) {
                    return tokenOutAmount.multiply(swapConfigUniversalRouter.fee.fee);
                }
                return undefined;
            case sdk_core_1.TradeType.EXACT_OUTPUT:
                if (swapConfigUniversalRouter.flatFee &&
                    swapConfigUniversalRouter.flatFee.amount > bignumber_1.BigNumber.from(0)) {
                    return util_1.CurrencyAmount.fromRawAmount(tokenOutAmount.currency, swapConfigUniversalRouter.flatFee.amount.toString());
                }
                return undefined;
            default:
                throw new Error(`Unknown trade type ${tradeType}`);
        }
    }
    getPortionQuoteAmount(tradeType, quote, portionAdjustedAmount, portionAmount) {
        if (!portionAmount) {
            return undefined;
        }
        // this method can only be called for exact out
        // for exact in, there is no need to compute the portion quote amount, since portion is always against token out amount
        if (tradeType !== sdk_core_1.TradeType.EXACT_OUTPUT) {
            return undefined;
        }
        // 1. then we know portion amount and portion adjusted exact out amount,
        //    we can get a ratio
        //    i.e. portionToPortionAdjustedAmountRatio = portionAmountToken / portionAdjustedAmount
        const portionToPortionAdjustedAmountRatio = new sdk_core_1.Fraction(portionAmount.quotient, portionAdjustedAmount.quotient);
        // 2. we have the portionAmountToken / portionAdjustedAmount ratio
        //    then we can estimate the portion amount for quote, i.e. what is the estimated token in amount deducted for the portion
        //    this amount will be portionQuoteAmountToken = portionAmountToken / portionAdjustedAmount * quote
        //    CAVEAT: we prefer to use the quote currency amount OVER quote gas adjusted currency amount for the formula
        //    because the portion amount calculated from the exact out has no way to account for the gas units.
        return util_1.CurrencyAmount.fromRawAmount(quote.currency, portionToPortionAdjustedAmountRatio.multiply(quote).quotient);
    }
    getRouteWithQuotePortionAdjusted(tradeType, routeWithQuotes, swapConfig, providerConfig) {
        // the route with quote portion adjustment is only needed for exact in routes with quotes
        // because the route with quotes does not know the output amount needs to subtract the portion amount
        if (tradeType !== sdk_core_1.TradeType.EXACT_INPUT) {
            return routeWithQuotes;
        }
        // the route with quote portion adjustment is only needed for universal router
        // for swap router 02, it doesn't have portion-related commands
        if ((swapConfig === null || swapConfig === void 0 ? void 0 : swapConfig.type) !== routers_1.SwapType.UNIVERSAL_ROUTER) {
            return routeWithQuotes;
        }
        return routeWithQuotes.map((routeWithQuote) => {
            const portionAmount = this.getPortionAmount(routeWithQuote.quote, tradeType, providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.externalTransferFailed, providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.feeTakenOnTransfer, swapConfig);
            // This is a sub-optimal solution agreed among the teams to work around the exact in
            // portion amount issue for universal router.
            // The most optimal solution is to update router-sdk https://github.com/Uniswap/router-sdk/blob/main/src/entities/trade.ts#L215
            // `minimumAmountOut` to include portionBips as well, `public minimumAmountOut(slippageTolerance: Percent, amountOut = this.outputAmount, portionBips: Percent)
            // but this will require a new release of router-sdk, and bump router-sdk versions in across downstream dependencies across the stack.
            // We opt to use this sub-optimal solution for now, and revisit the optimal solution in the future.
            // Since SOR subtracts portion amount from EACH route output amount (note the routeWithQuote.quote above),
            // SOR will have as accurate ouput amount per route as possible, which helps with the final `minimumAmountOut`
            if (portionAmount) {
                routeWithQuote.quote = routeWithQuote.quote.subtract(portionAmount);
            }
            return routeWithQuote;
        });
    }
    getQuote(tradeType, quote, portionQuoteAmount) {
        switch (tradeType) {
            case sdk_core_1.TradeType.EXACT_INPUT:
                return quote;
            case sdk_core_1.TradeType.EXACT_OUTPUT:
                return portionQuoteAmount ? quote.subtract(portionQuoteAmount) : quote;
            default:
                throw new Error(`Unknown trade type ${tradeType}`);
        }
    }
    getQuoteGasAdjusted(tradeType, quoteGasAdjusted, portionQuoteAmount) {
        switch (tradeType) {
            case sdk_core_1.TradeType.EXACT_INPUT:
                return quoteGasAdjusted;
            case sdk_core_1.TradeType.EXACT_OUTPUT:
                return portionQuoteAmount
                    ? quoteGasAdjusted.subtract(portionQuoteAmount)
                    : quoteGasAdjusted;
            default:
                throw new Error(`Unknown trade type ${tradeType}`);
        }
    }
    getQuoteGasAndPortionAdjusted(tradeType, quoteGasAdjusted, portionAmount) {
        if (!portionAmount) {
            return undefined;
        }
        switch (tradeType) {
            case sdk_core_1.TradeType.EXACT_INPUT:
                return quoteGasAdjusted.subtract(portionAmount);
            case sdk_core_1.TradeType.EXACT_OUTPUT:
                return quoteGasAdjusted;
            default:
                throw new Error(`Unknown trade type ${tradeType}`);
        }
    }
}
exports.PortionProvider = PortionProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcG9ydGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3REFBcUQ7QUFDckQsb0RBQTJDO0FBQzNDLGdEQUF3RDtBQUV4RCx3Q0FLb0I7QUFDcEIsa0NBQXlDO0FBZ0h6QyxNQUFhLGVBQWU7SUFDMUIsZ0JBQWdCLENBQ2QsY0FBOEIsRUFDOUIsU0FBb0IsRUFDcEIsc0JBQWdDLEVBQ2hDLGtCQUE0QixFQUM1QixVQUF3QjtRQUV4QixJQUNFLHNCQUFzQjtZQUN0QixrQkFBa0I7WUFDbEIsQ0FBQSxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsSUFBSSxNQUFLLGtCQUFRLENBQUMsZ0JBQWdCLEVBQzlDO1lBQ0EsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLHlCQUF5QixHQUFHLFVBQXdDLENBQUM7UUFDM0UsUUFBUSxTQUFTLEVBQUU7WUFDakIsS0FBSyxvQkFBUyxDQUFDLFdBQVc7Z0JBQ3hCLElBQ0UseUJBQXlCLENBQUMsR0FBRztvQkFDN0IseUJBQXlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsaUJBQUksQ0FBQyxFQUNuRDtvQkFDQSxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNuRTtnQkFFRCxPQUFPLFNBQVMsQ0FBQztZQUNuQixLQUFLLG9CQUFTLENBQUMsWUFBWTtnQkFDekIsSUFDRSx5QkFBeUIsQ0FBQyxPQUFPO29CQUNqQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUM1RDtvQkFDQSxPQUFPLHFCQUFjLENBQUMsYUFBYSxDQUNqQyxjQUFjLENBQUMsUUFBUSxFQUN2Qix5QkFBeUIsQ0FBQyxP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