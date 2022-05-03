import axios from "axios";

const axiosClient = () => {
  const client = axios.create();

  client.defaults.headers.common = {
    "Access-Control-Allow-Origin": "*",
  };

  return client;
};

const getGasPrices = () =>
  axiosClient().get("https://bombay-fcd.terra.dev/v1/txs/gas_prices");

const getTxHistories = async (address, offset = 0, limit = 100) => {
  const res = await fetch(`https://fcd.terra.dev/v1/txs?offset=${offset}&limit=${limit}&account=${address}`);
  const json = await res.json();

  return json;
}

export { getGasPrices, getTxHistories };
