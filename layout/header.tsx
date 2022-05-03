import React, { useState, useEffect } from "react";
import Link from "next/link";

import { TELEGRAM_LINK } from "utils/constants";

import cn from "classnames";

const LayoutHeader = ({ router }) => {
  const [curLink, setCurLink] = useState("");

  useEffect(() => {
    if (router.route === "/") {
      router.push("/event");
    }
    setCurLink(router.route);
  }, [router.route]);

  return (
    <header className="layout-container__header">
      <div className="layout-container__header__logo">
        <Link href="/">
          <img className="" src="/assets/logo/paloma-white.png" alt="Paloma" />
        </Link>
      </div>
      <div className="layout-container__header__buttons">
        <Link href="/blog">
          <div
            className={cn("header-button", {
              active: curLink.startsWith("/blog"),
            })}
          >
            <span>Blog</span>
          </div>
        </Link>
        <Link href="/event">
          <div
            className={cn("header-button", {
              active: curLink.startsWith("/event"),
            })}
          >
            <span>Events</span>
          </div>
        </Link>
       <a
          href={TELEGRAM_LINK}
          className="header-button"
          target="_blank"
        >
          <span>Join our Community</span>
          <img src="/assets/social/telegram.png" alt="Telegram" />
        </a>
      </div>
    </header>
  );
};

export default LayoutHeader;
