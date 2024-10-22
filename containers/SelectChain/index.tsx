import classNames from 'classnames';
import Selector from 'components/ButtonSelector/Selector';
import { allChains, ChainID } from 'configs/chains';
import useOutsideAlerter from 'hooks/useOutsideAlerter';
import { useWallet } from 'hooks/useWallet';
import { useEffect, useRef, useState } from 'react';
import { isFiat } from 'utils/string';

import style from './SelectChain.module.scss';

interface SelectChainProps {
  selectedChain: string | number;
  supportChains: { [x: string]: string };
  setSelectedChain: (v: string) => void;
  title?: string;
  className?: string;
}

const SelectChain = ({
  selectedChain,
  supportChains,
  setSelectedChain,
  title = 'Select Chain',
  className,
}: SelectChainProps) => {
  const chainRef = useRef(null);
  const { wallet, openConnectionModal, requestSwitchNetwork } = useWallet();

  const [showSelectChainModal, setShowSelectChainModal] = useState<boolean>(false);
  const [clickedChain, setClickedChain] = useState<string>();

  useOutsideAlerter(chainRef, () => {
    setShowSelectChainModal(false);
  });

  const changeNetwork = async (value: string) => {
    const result = await requestSwitchNetwork(value);
    if (result) setSelectedChain(value);
  };

  const handleSelectChain = async (value: string) => {
    if (isFiat(value)) {
      setSelectedChain(value);
    } else if (wallet && wallet.network) {
      setClickedChain('');
      await changeNetwork(value);
    } else {
      setClickedChain(value);
    }
    setShowSelectChainModal(false);
  };

  useEffect(() => {
    if (wallet && wallet.network && clickedChain && clickedChain.length > 0) {
      changeNetwork(clickedChain);
    }
  }, [wallet, clickedChain]);

  const selectableChainList = () => {
    let list = Object.keys(supportChains).map((chain) => {
      return {
        name: allChains[chain].chainName,
        icon: allChains[chain].icon,
        id: allChains[chain].chainId,
      };
    });

    list.sort((a, b) =>
      a.id.toString() === ChainID.BANK_ACCOUNT ||
      a.id.toString() === ChainID.CREDIT_CARD ||
      a.id.toString() === ChainID.COINBASE_ONRAMP
        ? -1
        : 0,
    );

    return list;
  };

  return (
    <section className={classNames(style.container, className)} ref={chainRef}>
      <div>
        <p className={style.mb10}>{title}</p>
        <div
          className={classNames(style.profitInput, 'flex-row justify-between')}
          onClick={() => setShowSelectChainModal(!showSelectChainModal)}
        >
          <div className="flex-row gap-8">
            {selectedChain && selectedChain !== '' && (
              <img src={`/assets/chains/${supportChains[selectedChain].toLowerCase()}.svg`} height={25} alt="" />
            )}
            {selectedChain && selectedChain !== '' ? <p>{supportChains[selectedChain]}</p> : <p>{title}</p>}
          </div>
          <img src="/assets/icons/down.svg" alt="" />
        </div>
      </div>
      {showSelectChainModal && (
        <Selector
          showSelectModal={showSelectChainModal}
          handleSelect={handleSelectChain}
          selectableList={selectableChainList()}
          selected={supportChains[selectedChain]}
          className={style.selector}
        />
      )}
    </section>
  );
};

export default SelectChain;
