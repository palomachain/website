import { useState, useEffect } from 'react'
import { MsgSend, MnemonicKey, Coins, LCDClient, WasmAPI, Wallet } from "@terra-money/terra.js";
import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { getGasPrices } from "utils/axios";

const useLCDClient = () => {
  const connectedWallet = useConnectedWallet();
  const {
    network,
  } = useWallet();

  const [client, setClient] = useState(null);

  useEffect(() => {
    const init = async () => {
      const gasPrices = await getGasPrices();
      const gasPricesCoins = new Coins(gasPrices.data);

      const lcd = new LCDClient({
        URL: network.lcd,
        chainID: network.chainID,
        gasPrices: gasPricesCoins,
        gasAdjustment: "1.5",
      });

      setClient(lcd)
    }

    if (connectedWallet) {
      init();
    }
  }, [connectedWallet, network]);

  return client
};

export default useLCDClient;
