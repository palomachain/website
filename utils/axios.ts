import axios from "axios";

const axiosClient = () => {
  const client = axios.create();

  client.defaults.headers.common = {
    "Access-Control-Allow-Origin": "*",
  };

  return client;
};

const getMessageCount = () =>
  axiosClient().get(`${process.env.API_BASE_URL}/v1/messages/count`);

export { getMessageCount };
