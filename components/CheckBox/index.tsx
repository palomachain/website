import React, { ReactElement } from "react";

import style from "./CheckBox.module.scss";
import classNames from "classnames";

interface ICheckBoxWrapper {
  checked?: boolean;
  label?: string | ReactElement;
  disabled?: boolean;
  onChange?: () => void;
  className?: string;
}
const CheckBox = ({
  checked = false,
  label,
  disabled = false,
  onChange,
  className,
}: ICheckBoxWrapper) => {
  return (
    <label className={style.container}>
      {disabled ? (
        <img src="/assets/icons/checked.svg" alt="checked" />
      ) : (
        <input type="checkbox" checked={checked} onChange={onChange} />
      )}
      <span
        className={classNames(
          style.checkmark,
          disabled ? style.disabled : undefined
        )}
      >
        {label}
      </span>
    </label>
  );
};

export default CheckBox;
