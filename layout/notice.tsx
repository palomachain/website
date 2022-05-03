import React from "react";

import { TWITTER_LINK, TELEGRAM_LINK, GITHUB_LINK } from "utils/constants";

const Notice = () => (
  <div className="notice-container">
    <div className="social-wrapper">
      <a href={TELEGRAM_LINK} target="_blank">
        <img src="/assets/social/telegram.png" />
      </a>
      <a href={TWITTER_LINK} target="_blank">
        <img src="/assets/social/twitter.png" />
      </a>
      <a href={GITHUB_LINK} target="_blank">
        <img src="/assets/social/github.png" />
      </a>
    </div>
  </div>
);

export default Notice;
