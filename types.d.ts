export type TMap = {
  [key: string]: any;
};

export type LIQUIDITY_BUTTON_STATUS =
  | "success"
  | "enter_amount"
  | "insufficient"
  | "loading";

export type LIQUIDITY_BUTTON_TEXT =
  | "Deposit UST"
  | "Enter an amount"
  | "Insufficient Balance"
  | "Confirm Withdraw"
  | "Insufficient Liquidity"
  | "Withdrawing UST";

export interface LIQUIDITY_BALANCE_STATUS {
  text: LIQUIDITY_BUTTON_TEXT;
  status: LIQUIDITY_BUTTON_STATUS;
}

export type COLLECT_TYPE = "UST" | "bLUNA";

export type TRANSACTION_STATUS =
  | "Success"
  | "User Denied"
  | "Create Tx Failed"
  | "Tx Failed"
  | "Timeout"
  | "Unspecified Error"
  | "Unknown Error";

