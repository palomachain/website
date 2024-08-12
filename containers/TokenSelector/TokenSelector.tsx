import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import OnramperModal from 'components/Modal/OmramperModal';
import TokenSelectModal from 'components/Modal/TokenSelectModal';
import { useWallet } from 'hooks/useWallet';
import { IBalance, IToken } from 'interfaces/swap';
import { useCallback, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import balanceTool from 'utils/balance';
import mockTool from 'utils/mock';
import SelectDropDown from '../SelectDropDown';
import style from './TokenSelector.module.scss';

interface TokenSelectorProps {
  label?: string;
  botType: string;
  token: IToken;
  tokenBalance?: IBalance;
  amount: IBalance;
  exchangeRate: number | BigNumber;
  listedTokens: IToken[];
  showMyToken?: boolean;
  canAddFund?: boolean;
  canRemoveToken?: boolean;
  onInputAmount?: (val: string) => void;
  onClickMaxTokenBalance?: () => void;
  onSelectToken: (token: IToken) => void;
  isDropdown?: boolean;
  selectedIndex?: number;
  selectOptions?: any;
  setSelected?: (e: number) => void;
  className?: string;
}

const TokenSelector = ({
  label,
  botType,
  token,
  tokenBalance,
  exchangeRate,
  amount,
  listedTokens,
  showMyToken = true,
  canAddFund,
  canRemoveToken = false,
  onInputAmount,
  onClickMaxTokenBalance,
  onSelectToken,
  isDropdown = false,
  selectedIndex,
  selectOptions,
  setSelected,
  className,
}: TokenSelectorProps) => {
  const supportNetworks = BotList[botType].supportNetworks;
  const defaultChain = BotList[botType].defaultChain;

  const { networkSelect } = useWallet();

  const [showTokenSelectModal, setShowTokenSelectModal] = useState(false);
  const [showOnramperModal, setShowOnramperModal] = useState(false);

  const handleShowTokenSelectModal = async () => {
    const connectedChain = await networkSelect(defaultChain, supportNetworks);
    if (connectedChain) setShowTokenSelectModal(true);
  };

  const handleSelectToken = (token: IToken) => {
    setShowTokenSelectModal(false);
    onSelectToken(token);
  };

  const handleInputAmount = (value: string) => {
    if (onInputAmount) {
      onInputAmount(value);
    }
  };

  const isInvalidBorrowTokenAmount = useCallback(() => {
    if (tokenBalance && amount && amount.raw.comparedTo(0) > 0 && tokenBalance.raw.comparedTo(amount.raw) === -1) {
      return style.errorColor;
    } else return '';
  }, [tokenBalance, amount]);

  return (
    <section className={classNames(style.container, className)}>
      {(label || token.symbol !== '') && (
        <div className="flex-row justify-between">
          <p>{label}</p>
          {token.symbol !== '' && tokenBalance && (
            <div className={style.walletBalance}>
              Wallet Balance: {tokenBalance.format}{' '}
              <div className={style.max} onClick={onClickMaxTokenBalance}>
                MAX
              </div>
            </div>
          )}
        </div>
      )}
      <div className={classNames(style.tradingInfo, isInvalidBorrowTokenAmount())}>
        {isDropdown ? (
          <SelectDropDown
            selectedIndex={selectedIndex}
            selectOptions={selectOptions}
            setSelected={setSelected}
            className={style.dropdown}
            inputClassName={style.dropdownInputClass}
          />
        ) : (
          <div className={style.token} onClick={() => handleShowTokenSelectModal()}>
            <div className="flex-center gap-4">
              <img src={token.icon === '' ? '/assets/images/Empty_ellipse.svg' : token.icon} width={25} height={25} />
              {token.symbol === '' ? '?' : <div className={classNames(style.symbol, 'bold')}>{token.symbol}</div>}
            </div>
            <img className={style.selectIcon} src="/assets/images/Below.svg" alt="" />
          </div>
        )}
        <div className={style.tokenValueInfo}>
          <div className={style.tokenValue}>
            <DebounceInput
              placeholder="0.0"
              debounceTimeout={300}
              onChange={(e) => handleInputAmount(e.target.value)}
              type="number"
              className={style.tokenAmount}
              value={parseFloat(Number(amount.format).toFixed(8))}
              disabled={token.address === '' || !onInputAmount}
            />
            <p className={style.usdPrice}>
              US$
              {balanceTool.convertToDollar(amount.format, exchangeRate)}
            </p>
          </div>
          {canRemoveToken && (
            <img
              src="/assets/images/Close_circle.svg"
              width={15}
              height={15}
              onClick={() => handleSelectToken(mockTool.getEmptyToken())}
            />
          )}
        </div>
      </div>

      {showTokenSelectModal && (
        <TokenSelectModal
          show={showTokenSelectModal}
          onBack={() => setShowTokenSelectModal(false)}
          tokens={listedTokens}
          onSelectToken={handleSelectToken}
          showMyToken={showMyToken}
          onAddFundBot={canAddFund ? () => setShowOnramperModal(true) : undefined}
        />
      )}

      <OnramperModal show={showOnramperModal} onBack={() => setShowOnramperModal(false)} />
    </section>
  );
};

export default TokenSelector;
