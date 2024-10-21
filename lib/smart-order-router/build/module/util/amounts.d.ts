import { ChainId, Currency, CurrencyAmount as CurrencyAmountRaw } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';
export declare class CurrencyAmount extends CurrencyAmountRaw<Currency> {
}
export declare const MAX_UINT160 = "0xffffffffffffffffffffffffffffffffffffffff";
export declare function parseAmount(value: string, currency: Currency): CurrencyAmount;
export declare function parseFeeAmount(feeAmountStr: string): FeeAmount;
export declare function unparseFeeAmount(feeAmount: FeeAmount): "10000" | "3000" | "500" | "400" | "300" | "200" | "100";
export declare function getApplicableV3FeeAmounts(chainId: ChainId): FeeAmount[];
export declare function getApplicableV4FeesTickspacingsHooks(chainId: ChainId): Array<[number, number, string]>;
