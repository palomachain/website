import React from "react";

import cn from "classnames";

const RotatedHeader = ({
  className = "",
  title = "",
  leftImage = "",
  rightImage = "",
  theme = "dark"
}) => {
  return (
    <div className={cn("rotated-header-container", className)}>
      <div className={cn('skew-bg', theme)}>
        {leftImage !== "" && <img src={leftImage} className="left-image" />}
        <h1 className="header-title">{title}</h1>
        {rightImage !== "" && <img src={rightImage} className="right-image" />}
      </div>
    </div>
  );
};

export default RotatedHeader;
