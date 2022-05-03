import React from "react";

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="spinner-icon"></div>
  </div>
);

const LoadingTriple = ({ style = {} }) => (
  <div className="loading-triple-container" style={{ ...style }}>
    <div className="three-balls">
      <div className="ball ball1"></div>
      <div className="ball ball2"></div>
      <div className="ball ball3"></div>
    </div>
  </div>
);

export { LoadingSpinner, LoadingTriple };
