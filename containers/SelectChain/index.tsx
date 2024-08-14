import classNames from 'classnames';
import Selector from 'components/ButtonSelector/Selector';
import { allChains } from 'configs/chains';
import useOutsideAlerter from 'hooks/useOutsideAlerter';
import { useWallet } from 'hooks/useWallet';
import { useRef, useState } from 'react';

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
  const { wallet, connectMetaMask, requestSwitchNetwork } = useWallet();

  const [showSelectChainModal, setShowSelectChainModal] = useState<boolean>(false);

  useOutsideAlerter(chainRef, () => {
    setShowSelectChainModal(false);
  });

  const handleSelectChain = async (value: string) => {
    if (!wallet || !wallet.network) {
      await connectMetaMask(value);
    } else {
      const result = await requestSwitchNetwork(value);
      if (result) setSelectedChain(value);
    }
    setShowSelectChainModal(false);
  };

  const selectableChainList = Object.keys(supportChains).map((chain) => {
    return {
      name: allChains[chain].chainName,
      icon: allChains[chain].icon,
      id: allChains[chain].chainId,
    };
  });

  return (
    <section className={classNames(style.container, className)} ref={chainRef}>
      <div>
        <p className={style.mb16}>{title}</p>
        <div
          className={classNames(style.profitInput, 'flex-row justify-between')}
          onClick={() => setShowSelectChainModal(!showSelectChainModal)}
        >
          <div className="flex-row gap-8">
            {selectedChain && selectedChain !== '' && (
              <img
                src={`/assets/chains/${supportChains[selectedChain].toLowerCase()}.png`}
                width={25}
                height={25}
                alt=""
              />
            )}
            {selectedChain && selectedChain !== '' ? supportChains[selectedChain] : 'Select Chain'}
          </div>
          <img src="/assets/icons/down.svg" alt="" />
        </div>
      </div>
      {showSelectChainModal && (
        <Selector
          showSelectModal={showSelectChainModal}
          handleSelect={handleSelectChain}
          selectableList={selectableChainList}
          selected={supportChains[selectedChain]}
          className={style.selector}
        />
      )}
    </section>
  );
};

export default SelectChain;
