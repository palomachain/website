import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import style from "components/Tooltip/Tooltip.module.scss";

interface TooltipProps {
  id: string;
  content: string;
  icon?: string;
  width?: number;
  height?: number;
  className?: string;
}

const Tooltip = ({
  id,
  content = "",
  icon,
  width = 12,
  height = 12,
  className,
}: TooltipProps) => (
  <>
    <img
      src={icon ? icon : "/assets/images/Information_white.svg"}
      width={width}
      height={height}
      data-tooltip-id={id}
      data-tooltip-content={content}
      className={className}
    />
    <ReactTooltip
      id={id}
      style={{
        maxWidth: "240px",
        background: "#5D5D5E",
        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0))",
        color: "#fff",
        textAlign: "center",
        fontSize: "10px",
        fontWeight: 400,
        lineHeight: "11.5px",
        padding: "6px",
      }}
    />
  </>
);

export default Tooltip;
