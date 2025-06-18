import { envParam } from 'configs/constants';
import { allEVMChains } from './chains';

enum StaticLink {
  Home = '/',
  PURCHASE = '/purchase',
  REGISTER = '/purchase/register/',
  INSTRUCTIONS = '/purchase/instructions',
  ACTIVATE = '/purchase/activate',
  LOGIN = '/purchase/login',
  PASSCODE = '/passcode',
  BUYMOREBOARD = '/buy-more-board',
  LIGHTNODE = '/lightnode',
}

const enableImageLink = (name: string, enable: boolean = true) => {
  return `/assets/icons/${name}${enable ? '_pink' : '_black'}.svg`;
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
  const chain = allEVMChains[chainId];
  if (chain) {
    const blockExplorerUrl = chain.blockExplorerUrl[0];
    return (txHash) => `${blockExplorerUrl}tx/${txHash}`;
  }
  return (txHash) => `${ExternalLink.Etherscan}tx/${txHash}`;
};

export { StaticLink, enableImageLink, getTxHashLink, metamaskChromeExtensionStoreUrl, palomaChromeExtensionStoreUrl };
