import React from "react";
import { PALOMABOT_WEBSITE_LINK } from "utils/constants";

const PalomaBotIntro = () => (
  <div className="home-page-section paloma-bot-intro-bg">
    <div className="paloma-bot-intro-container">
      <div className="home-page-text">
        <div className="subTitle">PALOMA BOT</div>
        <h1 className="title">Decentralized Crypto trading Bots</h1>
        <p className="description">
        Create secure, fast, private, and decentralized blockchain trading bots for any public blockchain. Keep all your strategies and bot revenues for yourself and your community.
        </p>
        <a
          href={PALOMABOT_WEBSITE_LINK}
          className="home-page-button"
          target="_blank"
        >
          Create a Bot
          <img src="/assets/arrows/arrow-top-right-white.svg" />
        </a>
      </div>
      <div className="home-page-image">
        <img src="/assets/home/paloma-bot.svg" />
      </div>
    </div>
  </div>
);

export default PalomaBotIntro;
