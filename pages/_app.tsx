import { AppProps } from "next/app";
import Layout from "layout";

import "../styles/index.scss";
import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_API_KEY)
const App = ({ Component, router, pageProps }: AppProps) => (
  <Layout router={router}>
    <Component {...pageProps} />
  </Layout>
);

export default App;
