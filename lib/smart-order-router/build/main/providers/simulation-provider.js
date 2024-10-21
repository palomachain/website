"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulator = exports.SimulationStatus = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const ethers_1 = require("ethers/lib/ethers");
const routers_1 = require("../routers");
const Erc20__factory_1 = require("../types/other/factories/Erc20__factory");
const Permit2__factory_1 = require("../types/other/factories/Permit2__factory");
const util_1 = require("../util");
const permit2_sdk_1 = require("@uniswap/permit2-sdk");
var SimulationStatus;
(function (SimulationStatus) {
    SimulationStatus[SimulationStatus["NotSupported"] = 0] = "NotSupported";
    SimulationStatus[SimulationStatus["Failed"] = 1] = "Failed";
    SimulationStatus[SimulationStatus["Succeeded"] = 2] = "Succeeded";
    SimulationStatus[SimulationStatus["InsufficientBalance"] = 3] = "InsufficientBalance";
    SimulationStatus[SimulationStatus["NotApproved"] = 4] = "NotApproved";
})(SimulationStatus = exports.SimulationStatus || (exports.SimulationStatus = {}));
/**
 * Provider for dry running transactions.
 *
 * @export
 * @class Simulator
 */
class Simulator {
    /**
     * Returns a new SwapRoute with simulated gas estimates
     * @returns SwapRoute
     */
    constructor(provider, portionProvider, chainId) {
        this.chainId = chainId;
        this.provider = provider;
        this.portionProvider = portionProvider;
    }
    async simulate(fromAddress, swapOptions, swapRoute, amount, quote, providerConfig) {
        const neededBalance = swapRoute.trade.tradeType == sdk_core_1.TradeType.EXACT_INPUT ? amount : quote;
        if (
        // we assume we always have enough eth mainnet balance because we use beacon address later
        (neededBalance.currency.isNative && this.chainId == sdk_core_1.ChainId.MAINNET) ||
            (await this.userHasSufficientBalance(fromAddress, swapRoute.trade.tradeType, amount, quote))) {
            util_1.log.info('User has sufficient balance to simulate. Simulating transaction.');
            try {
                return this.simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig);
            }
            catch (e) {
                util_1.log.error({ e }, 'Error simulating transaction');
                return Object.assign(Object.assign({}, swapRoute), { simulationStatus: SimulationStatus.Failed });
            }
        }
        else {
            util_1.log.error('User does not have sufficient balance to simulate.');
            return Object.assign(Object.assign({}, swapRoute), { simulationStatus: SimulationStatus.InsufficientBalance });
        }
    }
    async userHasSufficientBalance(fromAddress, tradeType, amount, quote) {
        try {
            const neededBalance = tradeType == sdk_core_1.TradeType.EXACT_INPUT ? amount : quote;
            let balance;
            if (neededBalance.currency.isNative) {
                balance = await this.provider.getBalance(fromAddress);
            }
            else {
                const tokenContract = Erc20__factory_1.Erc20__factory.connect(neededBalance.currency.address, this.provider);
                balance = await tokenContract.balanceOf(fromAddress);
            }
            const hasBalance = balance.gte(ethers_1.BigNumber.from(neededBalance.quotient.toString()));
            util_1.log.info({
                fromAddress,
                balance: balance.toString(),
                neededBalance: neededBalance.quotient.toString(),
                neededAddress: neededBalance.wrapped.currency.address,
                hasBalance,
            }, 'Result of balance check for simulation');
            return hasBalance;
        }
        catch (e) {
            util_1.log.error(e, 'Error while checking user balance');
            return false;
        }
    }
    async checkTokenApproved(fromAddress, inputAmount, swapOptions, provider) {
        // Check token has approved Permit2 more than expected amount.
        const tokenContract = Erc20__factory_1.Erc20__factory.connect(inputAmount.currency.wrapped.address, provider);
        if (swapOptions.type == routers_1.SwapType.UNIVERSAL_ROUTER) {
            const permit2Allowance = await tokenContract.allowance(fromAddress, (0, permit2_sdk_1.permit2Address)(this.chainId));
            // If a permit has been provided we don't need to check if UR has already been allowed.
            if (swapOptions.inputTokenPermit) {
                util_1.log.info({
                    permitAllowance: permit2Allowance.toString(),
                    inputAmount: inputAmount.quotient.toString(),
                }, 'Permit was provided for simulation on UR, checking that Permit2 has been approved.');
                return permit2Allowance.gte(ethers_1.BigNumber.from(inputAmount.quotient.toString()));
            }
            // Check UR has been approved from Permit2.
            const permit2Contract = Permit2__factory_1.Permit2__factory.connect((0, permit2_sdk_1.permit2Address)(this.chainId), provider);
            const { amount: universalRouterAllowance, expiration: tokenExpiration } = await permit2Contract.allowance(fromAddress, inputAmount.currency.wrapped.address, (0, util_1.SWAP_ROUTER_02_ADDRESSES)(this.chainId));
            const nowTimestampS = Math.round(Date.now() / 1000);
            const inputAmountBN = ethers_1.BigNumber.from(inputAmount.quotient.toString());
            const permit2Approved = permit2Allowance.gte(inputAmountBN);
            const universalRouterApproved = universalRouterAllowance.gte(inputAmountBN);
            const expirationValid = tokenExpiration > nowTimestampS;
            util_1.log.info({
                permitAllowance: permit2Allowance.toString(),
                tokenAllowance: universalRouterAllowance.toString(),
                tokenExpirationS: tokenExpiration,
                nowTimestampS,
                inputAmount: inputAmount.quotient.toString(),
                permit2Approved,
                universalRouterApproved,
                expirationValid,
            }, `Simulating on UR, Permit2 approved: ${permit2Approved}, UR approved: ${universalRouterApproved}, Expiraton valid: ${expirationValid}.`);
            return permit2Approved && universalRouterApproved && expirationValid;
        }
        else if (swapOptions.type == routers_1.SwapType.SWAP_ROUTER_02) {
            if (swapOptions.inputTokenPermit) {
                util_1.log.info({
                    inputAmount: inputAmount.quotient.toString(),
                }, 'Simulating on SwapRouter02 info - Permit was provided for simulation. Not checking allowances.');
                return true;
            }
            const allowance = await tokenContract.allowance(fromAddress, (0, util_1.SWAP_ROUTER_02_ADDRESSES)(this.chainId));
            const hasAllowance = allowance.gte(ethers_1.BigNumber.from(inputAmount.quotient.toString()));
            util_1.log.info({
                hasAllowance,
                allowance: allowance.toString(),
                inputAmount: inputAmount.quotient.toString(),
            }, `Simulating on SwapRouter02 - Has allowance: ${hasAllowance}`);
            // Return true if token allowance is greater than input amount
            return hasAllowance;
        }
        throw new Error(`Unsupported swap type ${swapOptions}`);
    }
}
exports.Simulator = Simulator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltdWxhdGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvc2ltdWxhdGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnREFBdUQ7QUFDdkQsOENBQThDO0FBRTlDLHdDQUtvQjtBQUNwQiw0RUFBeUU7QUFDekUsZ0ZBQTZFO0FBQzdFLGtDQUF3RTtBQUV4RSxzREFBc0Q7QUFhdEQsSUFBWSxnQkFNWDtBQU5ELFdBQVksZ0JBQWdCO0lBQzFCLHVFQUFnQixDQUFBO0lBQ2hCLDJEQUFVLENBQUE7SUFDVixpRUFBYSxDQUFBO0lBQ2IscUZBQXVCLENBQUE7SUFDdkIscUVBQWUsQ0FBQTtBQUNqQixDQUFDLEVBTlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFNM0I7QUFFRDs7Ozs7R0FLRztBQUNILE1BQXNCLFNBQVM7SUFJN0I7OztPQUdHO0lBQ0gsWUFDRSxRQUF5QixFQUN6QixlQUFpQyxFQUN2QixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRTFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUNuQixXQUFtQixFQUNuQixXQUF3QixFQUN4QixTQUFvQixFQUNwQixNQUFzQixFQUN0QixLQUFxQixFQUNyQixjQUF1QztRQUV2QyxNQUFNLGFBQWEsR0FDakIsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksb0JBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3RFO1FBQ0UsMEZBQTBGO1FBQzFGLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxrQkFBTyxDQUFDLE9B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