import BigNumber from 'bignumber.js';
import { NO_CHAIN_SELECTED } from 'configs/chains';
import { EVMChain } from 'interfaces/network';
import { IBalance, ISelectToken, IToken } from 'interfaces/swap';

const emptyTokenBalance = (): IBalance => ({
  raw: new BigNumber(0),
  format: '',
});

const getEmptyToken = (): IToken => ({
  address: '',
  symbol: '',
  displayName: '',
  icon: '',
  decimals: 0,
});

const getEmptySelectToken = (): ISelectToken => ({
  token: {
    token: getEmptyToken(),
    balance: emptyTokenBalance(),
    exchangeRate: new BigNumber(0),
  },
  amount: emptyTokenBalance(),
  swapPath: {
    routes: [],
    amount: emptyTokenBalance(),
  },
});

const getMockChain = (): EVMChain => ({
  icon: '',
  chainName: 'SELECT CHAIN',
  chainId: NO_CHAIN_SELECTED,
  rpc: '',
  blockExplorerUrl: '',
});

const getMockSwapContracts = () => ({
  swapRouterAddress: '',
  swapFactoryAddress: '',
});

const getEmptySelectedToken = (): ISelectToken => ({
  token: {
    token: getEmptyToken(),
    balance: emptyTokenBalance(),
    exchangeRate: new BigNumber(0),
  },
  amount: emptyTokenBalance(),
  swapPath: {
    routes: [],
    amount: emptyTokenBalance(),
  },
});

const mockTool = {
  emptyTokenBalance,
  getEmptyToken,
  getEmptySelectToken,
  getMockChain,
  getMockSwapContracts,
  getEmptySelectedToken,
};

export default mockTool;
