import BigNumber from "bignumber.js";
import { WasmAPI } from "@terra-money/terra.js";
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  UserDenied,
} from "@terra-money/wallet-provider";
import { APIRequester } from "@terra-money/terra.js/dist/client/lcd/APIRequester";

import { addresses } from "utils/constants";

const formatBalance = (value, fixed = 3, decimals = 6) => {
  const balance = new BigNumber(value)
    .div(10 ** decimals)
    .toFormat(fixed)
    .toString();

  return balance;
};

const toBalance = (value, fixed = 3, decimals = 6) => {
  const balance = new BigNumber(value)
    .div(10 ** decimals)
    .toFixed(fixed)
    .toString();

  return balance;
};

const getBalance = async (contractAddress, userAddress) => {
  const wasm = new WasmAPI(new APIRequester(addresses.endpoint));

  const balance = await wasm.contractQuery(contractAddress, {
    balance: {
      address: userAddress,
    },
  });

  return balance;
};

const getContractQuery = async (contractAddress, query) => {
  const wasm = new WasmAPI(new APIRequester(addresses.endpoint));

  const result = await wasm.contractQuery(contractAddress, {
    ...query,
  });

  return result;
};

const postMessage = (connectedWallet, msg, callback) => {
  connectedWallet
    .post({
      // fee: new Fee(1000000, "200000uusd"),
      msgs: [msg],
    })
    .then((nextTxResult: TxResult) => {
      console.log(nextTxResult);
      setTimeout(() => {
        callback({
          status: "Success",
          msg: "Your transaction has been successfully completed",
          data: nextTxResult,
        });
      }, 5000);
    })
    .catch((error: unknown) => {
      if (error instanceof UserDenied) {
        callback({
          status: "User Denied",
          msg: "User Denied",
          data: error,
        });
      } else if (error instanceof CreateTxFailed) {
        callback({
          status: "Create Tx Failed",
          msg: "User Denied",
          data: error,
        });
      } else if (error instanceof TxFailed) {
        callback({
          status: "Tx Failed",
          msg: "Tx Failed: " + error.message,
          data: error,
        });
      } else if (error instanceof Timeout) {
        callback({
          status: "Timeout",
          msg: "Timeout",
          data: error,
        });
      } else if (error instanceof TxUnspecifiedError) {
        callback({
          status: "Unspecified Error",
          msg: "Unspecified Error: " + error.message,
          data: error,
        });
      } else {
        callback({
          status: "Unknown Error",
          msg:
            "Unknown Error: " +
            (error instanceof Error ? error.message : String(error)),
          data: error,
        });
      }
    });
};

export { formatBalance, toBalance, getBalance, getContractQuery, postMessage };
