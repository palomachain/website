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

export const getPalomaTwitterWidget = async () => {

  let followers = 0;

  try {
    const res = await axiosClient().get('https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=paloma_chain');
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
