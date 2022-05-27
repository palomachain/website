import { AppProps } from "next/app";
import Layout from "layout";

import "../styles/index.scss";

const App = ({ Component, router, pageProps }: AppProps) => (
  <Layout router={router}>
    <Component {...pageProps} />
  </Layout>
);

export default App;
