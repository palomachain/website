import axios from "axios";

const axiosClient = (auth = false, token = '') => {
  const client = axios.create();

  client.defaults.headers.common = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
  };

  if (auth && token) {
    client.defaults.headers.common = {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      'Authorization': `Bearer ${token}`
    };
  }

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

export const getPalomaTwitterWidget = async () => {

  let followers = 0;

  try {
    const res = await axiosClient(true, process.env.TWITTER_API_BEARER_TOKEN).get('https://api.twitter.com/2/users/1518188063809318913?user.fields=public_metrics');
    console.log(res);

    if (res.status === 200) {
      const data = res.data;

      console.log(data);
    } 
  } catch(e) {
    console.log(e);
  }

  return followers;
}
