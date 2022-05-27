import React from "react";
import Link from "next/link";

import { TELEGRAM_LINK, TWITTER_LINK, GITHUB_LINK } from "utils/constants";

const Footer = () => (
  <div className="footer-container">
    <div className="footer-triangle-border"></div>

    <div className="footer-view">
      <div className="footer-view-links">
        <a href={TELEGRAM_LINK} target="_blank">
          Telegram<img src="/assets/arrows/arrow-top-right.png" />
        </a>
        <a href={TWITTER_LINK} target="_blank">
          Twitter<img src="/assets/arrows/arrow-top-right.png" />
        </a>
        <a href={GITHUB_LINK} target="_blank">
          Github<img src="/assets/arrows/arrow-top-right.png" />
        </a>
        <a href="https://jobs.lever.co/volume-finance" target="_blank">
          Careers<img src="/assets/arrows/arrow-top-right.png" />
        </a>
      </div>
      <div className="footer-view-logo">
        <img src="/assets/logo/paloma-black.png" />
      </div>
    </div>
  </div>
);

export default Footer;
