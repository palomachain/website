import React from "react";
import Link from "next/link";

import {
  TELEGRAM_LINK,
  TWITTER_LINK,
  GITHUB_LINK,
  DISCORD_LINK,
} from "utils/constants";

const Footer = () => (
  <div className="footer-container">
    <div className="footer-triangle-border"></div>

    <div className="footer-view">
      <div className="footer-view-logo">
        <Link href="/"><img src="/assets/logo/paloma-logotype.svg" /></Link>
      </div>

      <div className="footer-view-links">
        <h3 className="footer-subtitle">Features</h3>
        <a href="https://docs.palomachain.com/guide/maintain/relayer/pigeon.html" target="_blank">
          pigeon
        </a>
        <a href="https://docs.palomachain.com/guide/develop/quick-start/resources.html#sdks" target="_blank">
          SDKs
        </a>
        <a href="https://docs.palomachain.com/guide/develop/applications/compass-evm/overview.html#model" target="_blank">
          Compass-EVM
        </a>
        <a href="https://docs.palomachain.com/guide/develop/module-specifications/spec-auth.html#parameters" target="_blank">
          Gas Management
        </a>
      </div>

      <div className="footer-view-links">
        <h3 className="footer-subtitle">Examples</h3>
        <a href="https://docs.palomachain.com/guide/develop/quick-start/mint-egg.html" target="_blank">
          Mint an Egg
        </a>
        <a href="" target="_blank">
          Limit Order Bot
        </a>
      </div>

      <div className="footer-view-links">
        <h3 className="footer-subtitle">Company</h3>
        <Link href="/about">About</Link>
        <a href="https://volume.finance/careers/" target="_blank">
          Careers
        </a>
        <Link href="/brand-assets">Brand Assets</Link>
      </div>

      <div className="footer-view-links">
        <h3 className="footer-subtitle">Social Media</h3>
        <a href={DISCORD_LINK} target="_blank">
          Discord
        </a>
        <a href={TELEGRAM_LINK} target="_blank">
          Telegram
        </a>
        <a href={TWITTER_LINK} target="_blank">
          Twitter
        </a>
        <a href={GITHUB_LINK} target="_blank">
          Github
        </a>
        <a href="https://forum.palomachain.com/" target="_blank">
          Forum
        </a>
      </div>
    </div>
  </div>
);

export default Footer;
