import axios from "axios";

import { getHourOffsetLocalTimezone } from "./date";

const axiosClient = () => {
  const client = axios.create();

  client.defaults.headers.common = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
  };

  return client;
};

export const getMessageCount = async () => {
  const data = { totalMessagesCount: 0, todayMessageCount: 0 };

  const hourOffset = getHourOffsetLocalTimezone();

  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth();
  const yyyy = today.getFullYear();

  const startTime = new Date(yyyy, mm, dd, 0, 0 ,0);
  const endTime = new Date(yyyy, mm, dd, 23, 59, 59);

  const startTimeUTC = startTime.getTime() + 3600 * hourOffset * 1000;
  const endTimeUTC = endTime.getTime() + 3600 * hourOffset * 1000;

  // console.log(hourOffset);
  // console.log('local', startTime.getTime(), endTime.getTime())
  // console.log('utc', startTimeUTC, endTimeUTC);

  try {
    const res = await axiosClient().get(
      `${process.env.API_BASE_URL}/v1/messages/count?from=${startTimeUTC}&to=${endTimeUTC}`
    );

    if (res.status === 200) {
      data.totalMessagesCount = res.data.totalMessagesCount;
      data.todayMessageCount = res.data.todayMessageCount;
    }
  } catch (e) {
    console.log(e);
  }

  return data;
};

export const getPalomaTwitterFollowersCount = async () => {

   let data = '';

  try {
    const res = await axiosClient().get(
      `${process.env.API_BASE_URL}/v1/messages/twitter-followers`
    );

    if (res.status === 200) {
      data = res.data.followers;
    } 
  } catch(e) {
    console.log(e);
  }

  return data;
}
