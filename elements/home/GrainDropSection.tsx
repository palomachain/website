import React from 'react';

const GrainDropSection = () => (
  <div className="home-page-section">
    <div className="grain-drop-container">
      <div className="top">
        <img src="/assets/home/diagram-0.svg" />
        <div className="text-wrapper">
          <div className="subtitle">we are mainnet!</div>
          <div className="title">
            Join the GRAINdrop!
            <br />
            1M GRAINs available
          </div>
          <div className="description">
            Everyone can access our GRAINdrop, just go to Paloma Swap and swap on your favorite EVM DEX to earn GRAIN
            Tokenback rewards.
          </div>
          <a href="https://palomaswap.com" className="home-page-button button" target="_blank">
            Get Tokenback GRAINs now!
            <img src="/assets/arrows/arrow-top-right.png" />
          </a>
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <div className="number">1.</div>
          <div className="title">Go to paloma Swap</div>
          <div className="link">
            Go to{' '}
            <a href="https://palomaswap.com" target="_blank">
              PalomaSwap.com
            </a>
          </div>
        </div>
        <div className="item">
          <div className="number">2.</div>
          <div className="title">swap on your favorite DEX</div>
          <div className="link">Select your favorite DEX and tokens and swap with private transactions.</div>
        </div>
        <div className="item">
          <div className="number">3.</div>
          <div className="title">Earn tokenback GRAINs</div>
          <div className="link">Each and every swap pays you GRAINs and more tokenback rewards.</div>
        </div>
      </div>
    </div>
  </div>
);

export default GrainDropSection;
