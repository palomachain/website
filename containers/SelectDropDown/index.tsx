import classNames from "classnames";
import Selector from "components/ButtonSelector/Selector";
import Tooltip from "components/Tooltip";
import useOutsideAlerter from "hooks/useOutsideAlerter";
import { useRef, useState } from "react";

import style from "./SelectDropDown.module.scss";

interface SelectOptionProps {
  selectedIndex?: number;
  selectOptions: object[];
  setSelected?: (e: number) => void;
  title?: string;
  tooltip?: string;
  className?: string;
  inputClassName?: string;
}

const SelectDropDown = ({
  selectedIndex = 0,
  selectOptions,
  setSelected = (e: number) => {},
  title,
  tooltip,
  className,
  inputClassName,
}: SelectOptionProps) => {
  const chainRef = useRef(null);

  const [showSelectOptionModal, setShowSelectOptionModal] =
    useState<boolean>(false);

  useOutsideAlerter(chainRef, () => {
    setShowSelectOptionModal(false);
  });

  const handleSelectOption = async (value: string | number) => {
    setSelected(Number(value));
    setShowSelectOptionModal(false);
  };

  return (
    <section className={classNames(style.container, className)} ref={chainRef}>
      <div className="flex-col gap-16">
        {(title || tooltip) && (
          <div className={classNames("flex-row gap-8")}>
            <p>{title} </p>
            {tooltip && <Tooltip id="select-drop-down" content={tooltip} />}
          </div>
        )}
        <div
          className={classNames(
            style.profitInput,
            inputClassName,
            "flex-row justify-between"
          )}
          onClick={() => setShowSelectOptionModal(!showSelectOptionModal)}
        >
          <div className="flex-row gap-8">
            {selectedIndex >= 0 && (
              <img
                src={selectOptions[selectedIndex]["icon"]}
                width={25}
                height={25}
                alt=""
              />
            )}
            {selectedIndex >= 0
              ? selectOptions[selectedIndex]["name"]
              : `Select ${title || "Token"}`}
          </div>
          {selectOptions.length > 1 && (
            <img src="/assets/images/Below.svg" alt="" />
          )}
        </div>
      </div>
      {selectOptions.length > 1 && showSelectOptionModal && (
        <Selector
          showSelectModal={showSelectOptionModal}
          handleSelect={handleSelectOption}
          selectableList={selectOptions}
          selected={
            selectedIndex >= 0 ? selectOptions[selectedIndex]["name"] : ""
          }
          className={title || tooltip ? style.selector : style.selector2}
        />
      )}
    </section>
  );
};

export default SelectDropDown;
