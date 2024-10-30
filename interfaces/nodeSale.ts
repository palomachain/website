import { IBalance } from './swap';

export interface IPriceTier {
  quantity: number;
  price: string;
  fdv: number;
  purchased: number;
  slot: number;
  inputAmount?: number;
}

export enum IAlertInfo {
  WARN = 'Warning',
  ERROR = 'Error',
  NOTE = 'Note',
}

export interface ISteps {
  title?: string | JSX.Element;
  describe?: string | JSX.Element;
  body?: string | JSX.Element;
  externalBtns?: {
    text: string;
    link: string;
  }[];
  alert?: {
    type?: IAlertInfo;
    text?: string | JSX.Element;
  };
  commands?: {
    name?: string | JSX.Element;
    command?: string | JSX.Element;
    copyCommand?: string;
    instruction?: string | JSX.Element;
    isTitle?: boolean;
  }[];
  img?: JSX.Element;
}

export interface IInstructionsNodeSteps {
  head: string | JSX.Element;
  describe?: string | JSX.Element;
  steps?: ISteps[];
  subItems?: {
    title?: string | JSX.Element;
    describe?: string | JSX.Element;
    body?: string | JSX.Element;
    steps?: ISteps[];
  }[];
  footer?: string | JSX.Element;
}

export interface IBonusBalance {
  contractAddress: string;
  chainId: number | string;
  amount: {
    raw: string;
    format: string;
  };
}

export interface IActivateInfos {
  buyer?: string;
  fiat_wallet_address?: string;
  chain_id: number | string;
  token: string;
  contract_ver: number; // 1 and 2
}
