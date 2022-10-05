import axios from "axios";

import { getHourOffsetLocalTimezone } from "./date";
import { intToString } from "./number";

const axiosClient = () => {
  const client = axios.create();

  client.defaults.headers.common = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  return client;
};

export const getMessageCount = async () => {
  const data = { totalMessagesCount: 0, todayMessageCount: 0 };

  try {
    const response = await fetch("https://count.palomachain.com/");
    const res = await response.json();

    data.totalMessagesCount = res.eth;
    data.todayMessageCount = res.eth_day;
  } catch (e) {
    console.log(e);
  }

  return data;
};

export const getFollowersCount = async () => {
  let data = "";

  try {
    const response = await fetch("https://count.palomachain.com/");
    const res = await response.json();

    const { twitter, discord, telegram } = res;
    data = twitter + discord + telegram;
  } catch (e) {
    console.log(e);
  }

  return intToString(data);
};
