import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import OnramperModal from 'components/Modal/OmramperModal';
import TokenSelectModal from 'components/Modal/TokenSelectModal';
import { IBalance, IToken } from 'interfaces/swap';
import { useState } from 'react';
import SelectDropDown from '../SelectDropDown';
import style from './TokenSelector.module.scss';

interface TokenSelectorProps {
  label?: string;
  supportedNetworks: any;
  token: IToken;
  listedTokens: IToken[];
  showMyToken?: boolean;
  canAddFund?: boolean;
  onSelectToken: (token: IToken) => void;
  isDropdown?: boolean;
  selectedIndex?: number;
  selectOptions?: any;
  setSelected?: (e: number) => void;
  isDisable?: boolean;
  className?: string;
}

const TokenSelector = ({
  label,
  supportedNetworks,
  token,
  listedTokens,
  showMyToken = true,
  canAddFund,
  onSelectToken,
  isDropdown = false,
  selectedIndex,
  selectOptions,
  setSelected,
  isDisable = false,
  className,
}: TokenSelectorProps) => {
  const [showTokenSelectModal, setShowTokenSelectModal] = useState(false);
  const [showOnramperModal, setShowOnramperModal] = useState(false);

  const handleSelectToken = (token: IToken) => {
    setShowTokenSelectModal(false);
    onSelectToken(token);
  };

  return (
    <section className={classNames(style.container, className)}>
      {label && (
        <div className="flex-row justify-between">
          <p>{label}</p>
        </div>
      )}
      <div className={classNames(style.tradingInfo)}>
        {isDropdown ? (
          <SelectDropDown
            selectedIndex={selectedIndex}
            selectOptions={selectOptions}
            setSelected={setSelected}
            className={style.dropdown}
            inputClassName={style.dropdownInputClass}
          />
        ) : (
          <div className={style.token} onClick={() => !isDisable && setShowTokenSelectModal(true)}>
            <div className="flex-row gap-8">
              {token.icon !== '' && <img src={token.icon} width={25} height={25} />}
              {token.symbol === '' ? 'Select Token' : <p className="bold">{token.symbol}</p>}
            </div>
            <img className={style.selectIcon} src="/assets/icons/down.svg" alt="" />
          </div>
        )}
      </div>

      {showTokenSelectModal && (
        <TokenSelectModal
          show={showTokenSelectModal}
          onBack={() => setShowTokenSelectModal(false)}
          tokens={listedTokens}
          onSelectToken={handleSelectToken}
          showMyToken={showMyToken}
        />
      )}

      <OnramperModal show={showOnramperModal} onBack={() => setShowOnramperModal(false)} />
    </section>
  );
};

export default TokenSelector;
