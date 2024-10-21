"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicableV4FeesTickspacingsHooks = exports.getApplicableV3FeeAmounts = exports.unparseFeeAmount = exports.parseFeeAmount = exports.parseAmount = exports.MAX_UINT160 = exports.CurrencyAmount = void 0;
const units_1 = require("@ethersproject/units");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const jsbi_1 = __importDefault(require("jsbi"));
class CurrencyAmount extends sdk_core_1.CurrencyAmount {
}
exports.CurrencyAmount = CurrencyAmount;
exports.MAX_UINT160 = '0xffffffffffffffffffffffffffffffffffffffff';
// Try to parse a user entered amount for a given token
function parseAmount(value, currency) {
    const typedValueParsed = (0, units_1.parseUnits)(value, currency.decimals).toString();
    return CurrencyAmount.fromRawAmount(currency, jsbi_1.default.BigInt(typedValueParsed));
}
exports.parseAmount = parseAmount;
function parseFeeAmount(feeAmountStr) {
    switch (feeAmountStr) {
        case '10000':
            return v3_sdk_1.FeeAmount.HIGH;
        case '3000':
            return v3_sdk_1.FeeAmount.MEDIUM;
        case '500':
            return v3_sdk_1.FeeAmount.LOW;
        case '400':
            return v3_sdk_1.FeeAmount.LOW_400;
        case '300':
            return v3_sdk_1.FeeAmount.LOW_300;
        case '200':
            return v3_sdk_1.FeeAmount.LOW_200;
        case '100':
            return v3_sdk_1.FeeAmount.LOWEST;
        default:
            throw new Error(`Fee amount ${feeAmountStr} not supported.`);
    }
}
exports.parseFeeAmount = parseFeeAmount;
function unparseFeeAmount(feeAmount) {
    switch (feeAmount) {
        case v3_sdk_1.FeeAmount.HIGH:
            return '10000';
        case v3_sdk_1.FeeAmount.MEDIUM:
            return '3000';
        case v3_sdk_1.FeeAmount.LOW:
            return '500';
        case v3_sdk_1.FeeAmount.LOW_400:
            return '400';
        case v3_sdk_1.FeeAmount.LOW_300:
            return '300';
        case v3_sdk_1.FeeAmount.LOW_200:
            return '200';
        case v3_sdk_1.FeeAmount.LOWEST:
            return '100';
        default:
            throw new Error(`Fee amount ${feeAmount} not supported.`);
    }
}
exports.unparseFeeAmount = unparseFeeAmount;
function getApplicableV3FeeAmounts(chainId) {
    const feeAmounts = [
        v3_sdk_1.FeeAmount.HIGH,
        v3_sdk_1.FeeAmount.MEDIUM,
        v3_sdk_1.FeeAmount.LOW,
        v3_sdk_1.FeeAmount.LOWEST,
    ];
    if (chainId === sdk_core_1.ChainId.BASE) {
        feeAmounts.push(v3_sdk_1.FeeAmount.LOW_200, v3_sdk_1.FeeAmount.LOW_300, v3_sdk_1.FeeAmount.LOW_400);
    }
    return feeAmounts;
}
exports.getApplicableV3FeeAmounts = getApplicableV3FeeAmounts;
function getApplicableV4FeesTickspacingsHooks(chainId) {
    const feeAmounts = [
        v3_sdk_1.FeeAmount.HIGH,
        v3_sdk_1.FeeAmount.MEDIUM,
        v3_sdk_1.FeeAmount.LOW,
        v3_sdk_1.FeeAmount.LOWEST,
    ];
    if (chainId === sdk_core_1.ChainId.BASE) {
        feeAmounts.push(v3_sdk_1.FeeAmount.LOW_200, v3_sdk_1.FeeAmount.LOW_300, v3_sdk_1.FeeAmount.LOW_400);
    }
    return feeAmounts.map((feeAmount) => [
        feeAmount,
        v3_sdk_1.TICK_SPACINGS[feeAmount],
        router_sdk_1.ADDRESS_ZERO,
    ]);
}
exports.getApplicableV4FeesTickspacingsHooks = getApplicableV4FeesTickspacingsHooks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1vdW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL2Ftb3VudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQWtEO0FBQ2xELG9EQUFtRDtBQUNuRCxnREFJMkI7QUFDM0IsNENBQTJEO0FBQzNELGdEQUF3QjtBQUV4QixNQUFhLGNBQWUsU0FBUSx5QkFBMkI7Q0FBRztBQUFsRSx3Q0FBa0U7QUFFckQsUUFBQSxXQUFXLEdBQUcsNENBQTRDLENBQUM7QUFFeEUsdURBQXVEO0FBQ3ZELFNBQWdCLFdBQVcsQ0FBQyxLQUFhLEVBQUUsUUFBa0I7SUFDM0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLGtCQUFVLEVBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6RSxPQUFPLGNBQWMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFIRCxrQ0FHQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxZQUFvQjtJQUNqRCxRQUFRLFlBQVksRUFBRTtRQUNwQixLQUFLLE9BQU87WUFDVixPQUFPLGtCQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3hCLEtBQUssTUFBTTtZQUNULE9BQU8sa0JBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUIsS0FBSyxLQUFLO1lBQ1IsT0FBTyxrQkFBUyxDQUFDLEdBQUcsQ0FBQztRQUN2QixLQUFLLEtBQUs7WUFDUixPQUFPLGtCQUFTLENBQUMsT0FBTyxDQUFDO1FBQzNCLEtBQUssS0FBSztZQUNSLE9BQU8sa0JBQVMsQ0FBQyxPQUFPLENBQUM7UUFDM0IsS0FBSyxLQUFLO1lBQ1IsT0FBTyxrQkFBUyxDQUFDLE9BQU8sQ0FBQztRQUMzQixLQUFLLEtBQUs7WUFDUixPQUFPLGtCQUFTLENBQUMsTUFBTSxDQUFDO1FBQzFCO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLFlBQVksaUJBQWlCLENBQUMsQ0FBQztLQUNoRTtBQUNILENBQUM7QUFuQkQsd0NBbUJDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsU0FBb0I7SUFDbkQsUUFBUSxTQUFTLEVBQUU7UUFDakIsS0FBSyxrQkFBUyxDQUFDLElBQUk7WUFDakIsT0FBTyxPQUFPLENBQUM7UUFDakIsS0FBSyxrQkFBUyxDQUFDLE1BQU07WUFDbkIsT0FBTyxNQUFNLENBQUM7UUFDaEIsS0FBSyxrQkFBUyxDQUFDLEdBQUc7WUFDaEIsT0FBTyxLQUFLLENBQUM7UUFDZixLQUFLLGtCQUFTLENBQUMsT0FBTztZQUNwQixPQUFPLEtBQUssQ0FBQztRQUNmLEtBQUssa0JBQVMsQ0FBQyxPQUFPO1lBQ3BCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsS0FBSyxrQkFBUyxDQUFDLE9BQU87WUFDcEIsT0FBTyxLQUFLLENBQUM7UUFDZixLQUFLLGtCQUFTLENBQUMsTUFBTTtZQUNuQixPQUFPLEtBQUssQ0FBQztRQUNmO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLFNBQVMsaUJBQWlCLENBQUMsQ0FBQztLQUM3RDtBQUNILENBQUM7QUFuQkQsNENBbUJDO0FBRUQsU0FBZ0IseUJBQXlCLENBQUMsT0FBZ0I7SUFDeEQsTUFBTSxVQUFVLEdBQUc7UUFDakIsa0JBQVMsQ0FBQyxJQUFJO1FBQ2Qsa0JBQVMsQ0FBQyxNQUFNO1FBQ2hCLGtCQUFTLENBQUMsR0FBRztRQUNiLGtCQUFTLENBQUMsTUFBTTtLQUNqQixDQUFDO0lBRUYsSUFBSSxPQUFPLEtBQUssa0JBQU8sQ0FBQyxJQUFJLEVBQUU7UUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBUyxDQUFDLE9BQU8sRUFBRSxrQkFBUyxDQUFDLE9BQU8sRUFBRSxrQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFFO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQWJELDhEQWFDO0FBRUQsU0FBZ0Isb0NBQW9DLENBQ2xELE9BQWdCO0lBRWhCLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLGtCQUFTLENBQUMsSUFBSTtRQUNkLGtCQUFTLENBQUMsTUFBTTtRQUNoQixrQkFBUyxDQUFDLEdBQUc7UUFDYixrQkFBUyxDQUFDLE1BQU07S0FDakIsQ0FBQztJQUVGLElBQUksT0FBTyxLQUFLLGtCQUFPLENBQUMsSUFBSSxFQUFFO1FBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsa0JBQVMsQ0FBQyxPQUFPLEVBQUUsa0JBQVMsQ0FBQyxPQUFPLEVBQUUsa0JBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMxRTtJQUVELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7UUFDbkMsU0FBbUI7UUFDbkIsc0JBQWEsQ0FBQyxTQUFTLENBQUM7UUFDeEIseUJBQVk7S0FDYixDQUFDLENBQUM7QUFDTCxDQUFDO0FBbkJELG9GQW1CQyJ9