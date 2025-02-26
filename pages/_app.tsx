import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { envParam } from 'configs/constants';
import useWagmi from 'hooks/useWagmi';
import { useWeb3Onboard } from 'hooks/useWeb3Onboard';
import Layout from 'layout';
import mixpanel from 'mixpanel-browser';
import Moralis from 'moralis';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Client, HydrationProvider } from 'react-hydration-provider';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from 'store';
import { WagmiConfig } from 'wagmi';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.scss';

const apiKey = envParam.MORALIS_SERVICE_API_KEY;
Moralis.start({
  apiKey: apiKey,
});

mixpanel.init(process.env.MIXPANEL_API_KEY);

const Web3OnboardProvider = ({ children }) => {
  const { onboard, initOnboard } = useWeb3Onboard();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!onboard) {
      initOnboard();
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return <></>;
  }

  return children;
};

const App = ({ Component, router, pageProps }: AppProps) => {
  const { wagmiConfig } = useWagmi();

  const queryClient = new QueryClient();

  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.Browser = {
        T: () => {},
      };
      setAuth(true);
    } else setAuth(false);
  }, []);

  return auth ? (
    <HydrationProvider>
      <QueryClientProvider client={queryClient}>
        <Client>
          <Provider store={store}>
            <WagmiConfig config={wagmiConfig}>
              <Web3OnboardProvider>
                <Layout router={router}>
                  <Component {...pageProps} />
                </Layout>
              </Web3OnboardProvider>
            </WagmiConfig>
            <ToastContainer autoClose={5000} pauseOnFocusLoss={false} position={'top-right'} />
          </Provider>
        </Client>
      </QueryClientProvider>
    </HydrationProvider>
  ) : null;
};

export default App;
