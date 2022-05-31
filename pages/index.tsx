import React from "react";

import EventPage from "./event";

import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_API_KEY);

export default function Home({ state, router }) {
  return <EventPage />;
}
