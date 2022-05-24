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
        <Link href="/">Home</Link>
        <Link href="/about-us">About Us</Link>
        <Link href="/event">Evetns</Link>
        <Link href="/blog">Blog</Link>
      </div>
      <div className="footer-view-links">
        <div className="footer-view-subtitle">SOCIAL MEDIA</div>
        <a href={TELEGRAM_LINK}>Telegram</a>
        <a href={TWITTER_LINK}>Twitter</a>
        <a href={GITHUB_LINK}>Github</a>
      </div>
    </div>
  </div>
)

export default Footer;