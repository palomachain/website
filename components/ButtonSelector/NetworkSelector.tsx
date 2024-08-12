import React from "react";
import cn from "classnames";
import { Networks } from "configs/constants";
import ButtonSelector from "./ButtonSelector";

import style from "components/ButtonSelector/NetworkSelector.module.scss";

interface ButtonProps {
  showSelectModal: boolean;
  handleSelectNetwork: (e: string) => void;
  network: string | number;
  className?: string;
}

const NetworkSelector = ({
  showSelectModal,
  handleSelectNetwork,
  className,
  network,
}: ButtonProps) => {
  return (
    showSelectModal && (
      <ButtonSelector className={cn(style.selectList, className)}>
        <div>
          {Object.keys(Networks).map((chainId: string, index: number) => (
            <div
              key={index}
              className={cn(
                style.selectOption,
                String(network) !== chainId ? style.disabled : ""
              )}
              onClick={() => handleSelectNetwork(chainId)}
            >
              <img
                src={`/assets/chains/${Networks[chainId]}.svg`}
                width={25}
                height={25}
                alt=""
              />
              <span>{Networks[chainId]}</span>
            </div>
          ))}
        </div>
      </ButtonSelector>
    )
  );
};

export default NetworkSelector;
