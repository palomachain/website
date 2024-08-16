import { envParam } from 'configs/constants';
import { supportedNetworks } from './networks';

enum StaticLink {
  Home = '/',
  PURCHASE = '/',
  REGISTER = '/purchase/register/',
  DOWNLOAD = '/purchase/download',
  ACTIVATE = '/purchase/activate',
  PASSCODE = '/passcode',
}

const enableImageLink = (name: string, enable: boolean = true) => {
  return `/assets/images/${name}${enable ? '' : '_disabled'}.svg`;
};

const metamaskChromeExtensionStoreUrl =
  'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en';

const palomaChromeExtensionStoreUrl = `https://chrome.google.com/webstore/detail/paloma-nestbeta/${envParam.palomaExtensionId}`;

enum ExternalLink {
  Etherscan = 'https://etherscan.io/',
  Bscscan = 'https://bscscan.com/',
  Polygonscan = 'https://polygonscan.com/',
}

const getTxHashLink = (chainId: string | number) => {
  const chain = supportedNetworks[chainId];
  if (chain) {
    const blockExplorerUrl = chain.blockExplorerUrls[0];
    return (txHash) => `${blockExplorerUrl}tx/${txHash}`;
  }
  return (txHash) => `${ExternalLink.Etherscan}tx/${txHash}`;
};

export { StaticLink, enableImageLink, getTxHashLink, metamaskChromeExtensionStoreUrl, palomaChromeExtensionStoreUrl };
