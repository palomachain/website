import axios from 'axios';

import { getHourOffsetLocalTimezone } from './date';
import { intToString } from './number';

const axiosClient = () => {
  const client = axios.create();

  client.defaults.headers.common = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return client;
};

export const getMessageCount = async () => {
  let data = { totalMessagesCount: 3633, todayMessageCount: 122 };

  try {
    const response = await fetch('https://count.palomachain.com/');
    const res = await response.json();

    data.totalMessagesCount = data.totalMessagesCount + res.eth + res.bnb + res.poly;
    data.todayMessageCount = data.todayMessageCount + res.eth_day + res.bnb_day;
  } catch (e) {
    console.log(e);
  }

  return data;
};

export const getPalomaBotStats = async () => {
  let data = { totalBots: 0, sumBotNumbers: 0 };

  try {
    const response = await fetch('https://service.palomabot.ai/stats');
    const res = await response.json();

    data.totalBots = res.bots_total;

    const bots = res.bots;
    Object.values(bots).forEach((item) => (data.sumBotNumbers += Number(item ?? 0)));
  } catch (e) {
    console.log(e);
  }

  return data;
};

export const getFollowersCount = async () => {
  let data = 46700;

  try {
    const response = await fetch('https://count.palomachain.com/');
    const res = await response.json();

    const { twitter, discord, telegram } = res;
    data = twitter + discord + telegram;
  } catch (e) {
    console.log(e);
  }

  return intToString(data);
};
