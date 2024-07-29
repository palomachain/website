import React from "react";

interface IRangeSliderWrapper {
  title?: string;
  describe?: string;
  min?: number;
  max?: number;
  mid?: number;
  step?: number;
  prefix?: string;
  value?: number;
  setValue?: (e) => void;
}
const RangeSlider = ({
  title,
  describe,
  min,
  max,
  mid,
  step,
  prefix = '',
  value,
  setValue,
}: IRangeSliderWrapper) => (
  <div className="slider-range">
    <div className="slider-range-header">
      <h3>{title}</h3>
      <p>{describe}</p>
    </div>
    <div className="slider-range-input">
      <input
        type="range"
        required
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
        className="slider"
      />
      <div className="slider-range-values">
        <div>{prefix + min}</div>
        <div>{prefix + mid}</div>
        <div>{prefix + max}</div>
      </div>
    </div>
  </div>
);

export default RangeSlider;
