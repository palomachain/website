import React from "react";

import BlogPage from "./blog";
import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_API_KEY);

export default function Home({ state, router }) {
  return <BlogPage />;
}
