import { BigNumber } from '@ethersproject/bignumber';
import { ZERO } from '@uniswap/router-sdk';
import { Fraction, TradeType } from '@uniswap/sdk-core';
import { SwapType, } from '../routers';
import { CurrencyAmount } from '../util';
export class PortionProvider {
    getPortionAmount(tokenOutAmount, tradeType, externalTransferFailed, feeTakenOnTransfer, swapConfig) {
        if (externalTransferFailed ||
            feeTakenOnTransfer ||
            (swapConfig === null || swapConfig === void 0 ? void 0 : swapConfig.type) !== SwapType.UNIVERSAL_ROUTER) {
            return undefined;
        }
        const swapConfigUniversalRouter = swapConfig;
        switch (tradeType) {
            case TradeType.EXACT_INPUT:
                if (swapConfigUniversalRouter.fee &&
                    swapConfigUniversalRouter.fee.fee.greaterThan(ZERO)) {
                    return tokenOutAmount.multiply(swapConfigUniversalRouter.fee.fee);
                }
                return undefined;
            case TradeType.EXACT_OUTPUT:
                if (swapConfigUniversalRouter.flatFee &&
                    swapConfigUniversalRouter.flatFee.amount > BigNumber.from(0)) {
                    return CurrencyAmount.fromRawAmount(tokenOutAmount.currency, swapConfigUniversalRouter.flatFee.amount.toString());
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
        if (tradeType !== TradeType.EXACT_OUTPUT) {
            return undefined;
        }
        // 1. then we know portion amount and portion adjusted exact out amount,
        //    we can get a ratio
        //    i.e. portionToPortionAdjustedAmountRatio = portionAmountToken / portionAdjustedAmount
        const portionToPortionAdjustedAmountRatio = new Fraction(portionAmount.quotient, portionAdjustedAmount.quotient);
        // 2. we have the portionAmountToken / portionAdjustedAmount ratio
        //    then we can estimate the portion amount for quote, i.e. what is the estimated token in amount deducted for the portion
        //    this amount will be portionQuoteAmountToken = portionAmountToken / portionAdjustedAmount * quote
        //    CAVEAT: we prefer to use the quote currency amount OVER quote gas adjusted currency amount for the formula
        //    because the portion amount calculated from the exact out has no way to account for the gas units.
        return CurrencyAmount.fromRawAmount(quote.currency, portionToPortionAdjustedAmountRatio.multiply(quote).quotient);
    }
    getRouteWithQuotePortionAdjusted(tradeType, routeWithQuotes, swapConfig, providerConfig) {
        // the route with quote portion adjustment is only needed for exact in routes with quotes
        // because the route with quotes does not know the output amount needs to subtract the portion amount
        if (tradeType !== TradeType.EXACT_INPUT) {
            return routeWithQuotes;
        }
        // the route with quote portion adjustment is only needed for universal router
        // for swap router 02, it doesn't have portion-related commands
        if ((swapConfig === null || swapConfig === void 0 ? void 0 : swapConfig.type) !== SwapType.UNIVERSAL_ROUTER) {
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
            case TradeType.EXACT_INPUT:
                return quote;
            case TradeType.EXACT_OUTPUT:
                return portionQuoteAmount ? quote.subtract(portionQuoteAmount) : quote;
            default:
                throw new Error(`Unknown trade type ${tradeType}`);
        }
    }
    getQuoteGasAdjusted(tradeType, quoteGasAdjusted, portionQuoteAmount) {
        switch (tradeType) {
            case TradeType.EXACT_INPUT:
                return quoteGasAdjusted;
            case TradeType.EXACT_OUTPUT:
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
            case TradeType.EXACT_INPUT:
                return quoteGasAdjusted.subtract(portionAmount);
            case TradeType.EXACT_OUTPUT:
                return quoteGasAdjusted;
            default:
                throw new Error(`Unknown trade type ${tradeType}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvcG9ydGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsT0FBTyxFQUlMLFFBQVEsR0FDVCxNQUFNLFlBQVksQ0FBQztBQUNwQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBZ0h6QyxNQUFNLE9BQU8sZUFBZTtJQUMxQixnQkFBZ0IsQ0FDZCxjQUE4QixFQUM5QixTQUFvQixFQUNwQixzQkFBZ0MsRUFDaEMsa0JBQTRCLEVBQzVCLFVBQXdCO1FBRXhCLElBQ0Usc0JBQXNCO1lBQ3RCLGtCQUFrQjtZQUNsQixDQUFBLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxJQUFJLE1BQUssUUFBUSxDQUFDLGdCQUFnQixFQUM5QztZQUNBLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsTUFBTSx5QkFBeUIsR0FBRyxVQUF3QyxDQUFDO1FBQzNFLFFBQVEsU0FBUyxFQUFFO1lBQ2pCLEtBQUssU0FBUyxDQUFDLFdBQVc7Z0JBQ3hCLElBQ0UseUJBQXlCLENBQUMsR0FBRztvQkFDN0IseUJBQXlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQ25EO29CQUNBLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ25FO2dCQUVELE9BQU8sU0FBUyxDQUFDO1lBQ25CLEtBQUssU0FBUyxDQUFDLFlBQVk7Z0JBQ3pCLElBQ0UseUJBQXlC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