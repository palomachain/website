export interface IPriceTiers {
  quantity: number;
  price: string;
  fdv: number;
  purchased: number;
  slot: number;
  inputAmount?: number;
}

export interface IDownloadAndInstallNodeSteps {
  head: string | JSX.Element;
  describe?: string | JSX.Element;
  steps?: {
    title?: string | JSX.Element;
    describe?: string | JSX.Element;
    externalBtns?: {
      text: string;
      link: string;
    }[];
    items?: {
      name: string | JSX.Element;
      command?: string | JSX.Element;
      copyCommand?: string;
    }[];
    img?: JSX.Element;
  }[];
}
