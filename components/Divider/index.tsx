import cn from "classnames";
import React from "react";
import style from "./Divider.module.scss";

interface DividerProps {
  className?: string;
}

const Divider = ({ className }: DividerProps) => (
  <div className={cn(style.divider, className)} />
);

export default Divider;
