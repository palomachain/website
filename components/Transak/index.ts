import { TransakConfig, Transak as TransakSDK } from '@transak/transak-sdk';
import { envParam } from 'configs/constants';

const openTransak = (wallet: string, amount: number) => {
  const settings: TransakConfig = {
    apiKey: envParam.transakApiKey, // Your API Key
    environment: TransakSDK.ENVIRONMENTS.PRODUCTION, // STAGING/PRODUCTION
    walletAddress: wallet,
    disableWalletAddressForm: true,
    defaultNetwork: 'arbitrum',
    network: 'arbitrum',
    defaultCryptoCurrency: 'USDC',
    cryptoCurrencyCode: 'USDC',
    defaultCryptoAmount: amount,
    cryptoAmount: amount,
  };

  const transak = new TransakSDK(settings);

  transak.init();

  // To get all the events
  // TransakSDK.on(TransakSDK.ALL_EVENTS, (data) => {
  //   console.log(data);
  // });

  // This will trigger when the user closed the widget
  TransakSDK.on(TransakSDK.EVENTS.TRANSAK_WIDGET_CLOSE, (eventData) => {
    console.log(eventData);
    transak.close();
  });

  // This will trigger when the user marks payment is made.
  TransakSDK.on(TransakSDK.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    window.alert('Payment Success');
    transak.close();
  });
};

export default openTransak;
