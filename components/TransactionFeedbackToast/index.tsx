import React from "react";

import { getWalletAddressEllipsis } from "utils/common";

type ToastStatus = "success" | "error";

const TransactionFeedbackToast = ({
  status,
  msg,
  hash,
}: {
  status: ToastStatus;
  msg: string;
  hash: string;
}) => (
  <div className="transaction-toast-container">
    <img className="transaction-toast-icon" src={`/assets/${status}.png`} />
    <div className="transaction-toast-text">
      <div className="text">{msg}</div>
      {hash && hash !== "" && (
        <div className="link">
          <a
            href={`https://terrasco.pe/mainnet/tx/${hash}`}
            className={status}
            target="_blank"
          >
            {getWalletAddressEllipsis(hash, 8, 8)}
          </a>
        </div>
      )}
    </div>
  </div>
);

export default TransactionFeedbackToast;
