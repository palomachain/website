import React, { useState, useRef } from 'react';
import cn from 'classnames';
import useOutsideAlerter from 'hooks/useOutsideAlerter';
import ButtonSelector from './ButtonSelector';
import Button from '../Button';

import style from 'components/ButtonSelector/SelectOption.module.scss';

interface SelectOptionProps {
  title?: string;
  options: string[];
  value: string;
  handleSelectOption: (e: any) => void;
  sectionClassName?: string;
  modalClassName?: string;
}

const SelectOption = ({
  title,
  options,
  value,
  handleSelectOption,
  sectionClassName,
  modalClassName,
}: SelectOptionProps) => {
  const ref = useRef(null);
  const [showSelectOptions, setShowSelectOptions] = useState<boolean>(false);

  useOutsideAlerter(ref, () => {
    setShowSelectOptions(false);
  });

  const handleChangeSelectOption = (index: string) => {
    handleSelectOption(index);
    setShowSelectOptions(false);
  };

  return (
    <div ref={ref}>
      <Button
        type="outline"
        className={cn(style.sortBy, sectionClassName)}
        onClick={() => setShowSelectOptions(!showSelectOptions)}
      >
        <>
          <span>{value ? value : title ? title : options[0]}</span>
          <img src="/assets/images/Below.svg" alt="" />
        </>
      </Button>
      {showSelectOptions && (
        <ButtonSelector className={cn(style.buttonSelector, modalClassName)}>
          <>
            {options.map((option, index) => (
              <div key={index} className={style.sortOption} onClick={() => handleChangeSelectOption(option)}>
                <span className={value !== option ? style.disabled : ''}>{option}</span>
              </div>
            ))}
          </>
        </ButtonSelector>
      )}
    </div>
  );
};

export default SelectOption;
