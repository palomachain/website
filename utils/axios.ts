import axios from "axios";

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

  try {
    const res = await axiosClient().get(
      `${process.env.API_BASE_URL}/v1/messages/count`
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
