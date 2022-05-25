import React from 'react';
import Link from 'next/link';

import { TELEGRAM_LINK, TWITTER_LINK, GITHUB_LINK } from 'utils/constants';

const Footer = () => (
  <div className="footer-container">
    <div className="footer-triangle-border"></div>
    <div className="footer-view">
      <div className="footer-view-logo">
        <img src="/assets/logo/paloma-black.png" />
      </div>
      <div className="footer-view-links">
        <div className="footer-view-subtitle">USEFUL LINKS</div>
        {/* <Link href="/">Home</Link>
        <Link href="/about-us">About Us</Link> */}
        <Link href="/event">Events</Link>
        <Link href="/blog">Blog</Link>
      </div>
      <div className="footer-view-links">
        <div className="footer-view-subtitle">SOCIAL MEDIA</div>
        <a href={TELEGRAM_LINK} target="_blank">Telegram</a>
        <a href={TWITTER_LINK} target="_blank">Twitter</a>
        <a href={GITHUB_LINK} target="_blank">Github</a>
      </div>
    </div>
  </div>
)

export default Footer;