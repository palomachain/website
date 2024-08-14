import React from 'react';

import mixpanel from 'mixpanel-browser';
mixpanel.init(process.env.MIXPANEL_API_KEY);

export default function About({ state, router }) {
  return (
    <div className="page-container">
      <div className="about-page-container">
        <div className="about-page-section">
          <div className="about-page-text">
            <h1>About</h1>
            <p className="large">
              Paloma is a fast, permissionless, Cosmos-SDK blockchain that moves messages securely, between any other
              blockchains. Paloma is designed for developers who wish to manage bi-directional messages between chains
              in a scalable and secure manner.
            </p>
            <a href="https://palomachain.github.io/paloma-docs/" className="about-page-button" target="_blank">
              Get Started
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
          <div className="about-page-image">
            <img src="/assets/logo/paloma-logotype.svg" />
          </div>
        </div>

        <div className="about-page-volume">
          <span className="subtitle">Development</span>
          <div className="title">Developed by</div>
          <img className="volume-logo" src="/assets/about/volume.png" />
          <p className="description">
            Volume provides blockchain messaging software that is secure, scalable allowing developers to communicate
            across any number of blockchains and at the lowest possible cost.
          </p>
          <a href="https://volume.finance" className="about-page-button" target="_blank">
            Learn More
            <img src="/assets/arrows/arrow-top-right.png" />
          </a>
        </div>
      </div>
    </div>
  );
}
