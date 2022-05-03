import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from "@terra-money/wallet-provider";

import { AppProps } from "next/app";
import Layout from "layout";

import "../styles/index.scss";

function App({
  Component,
  pageProps,
  defaultNetwork,
  walletConnectChainIds,
  router,
}: AppProps & WalletControllerChainOptions) {
  return typeof window !== "undefined" ? (
    <WalletProvider
      defaultNetwork={defaultNetwork}
      walletConnectChainIds={walletConnectChainIds}
    >
      <Layout
        router={router}
        defaultNetwork={defaultNetwork}
        walletConnectChainIds={walletConnectChainIds}
      >
        <Component { ...pageProps }/>
      </Layout>
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={defaultNetwork}>
      <Layout
        router={router}
        defaultNetwork={defaultNetwork}
        walletConnectChainIds={walletConnectChainIds}
      >
        <Component { ...pageProps }/>
      </Layout>
    </StaticWalletProvider>
  );
}

App.getInitialProps = async () => {
  const chainOptions = await getChainOptions();
  return {
    ...chainOptions,
  };
};

export default App;
