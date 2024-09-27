import { initOnRamp } from '@coinbase/cbpay-js';
import { envParam } from 'configs/constants';

const CoinbaseButton = (wallet: string, amount: number) => {
  // Initialize the CB Pay instance
  let onrampInstance;

  initOnRamp(
    {
      appId: envParam.coinbaseApiKey,
      widgetParameters: {
        // Specify the addresses and which networks they support
        addresses: { [wallet]: ['arbitrum'] },
        // Filter the available assets on the above networks to just these ones
        assets: ['USDC'],
        defaultNetwork: 'arbitrum',
        presetCryptoAmount: amount,
      },
      onSuccess: () => {
        console.log('success');
      },
      onExit: () => {
        console.log('exit');
      },
      onEvent: (event) => {
        console.log('event', event);
      },
      experienceLoggedIn: 'popup',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true,
    },
    (error, instance) => {
      onrampInstance = instance;
    },
  );

  // Open the widget when the user clicks a button
  onrampInstance.open();
};

export default CoinbaseButton;
