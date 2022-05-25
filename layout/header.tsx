import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { useOutsideAlerter } from "hooks";
import { TELEGRAM_LINK } from "utils/constants";

import cn from "classnames";

const LayoutHeader = ({ router }) => {
  const [curLink, setCurLink] = useState("");

  const [eventSubMenuOpen, setEventSubMenuOpen] = useState(false);

  const eventSubMenu = useRef(null);
  useOutsideAlerter(eventSubMenu, () => {
    setEventSubMenuOpen(false);
  });

  useEffect(() => {
    if (router.route === "/") {
      router.replace("/event");
      setCurLink("/event");
    } else {
      setCurLink(router.route);
    }
  }, [router.route]);

  return (
    <header className="layout-container__header">
      <div className="layout-container__header__logo">
        <Link href="/">
          <img className="" src="/assets/logo/paloma-black.png" alt="Paloma" />
        </Link>
      </div>
      <div className="layout-container__header__buttons">
        {/* <Link href="/">
          <div
            className={cn("header-button", {
              active: curLink === "/",
            })}
          >
            Home
          </div>
        </Link>
        <Link href="/about-us">
          <div
            className={cn("header-button", {
              active: curLink.startsWith("/about-us"),
            })}
          >
            About US
          </div>
        </Link> */}
        <Link href="/blog">
          <div
            className={cn("header-button", {
              active: curLink.startsWith("/blog"),
            })}
          >
            Blog
          </div>
        </Link>
        <div
          className={cn("header-button", {
            active: curLink.startsWith("/event"),
          })}
          onClick={(e) => setEventSubMenuOpen(!eventSubMenuOpen)}
          ref={eventSubMenu}
        >
          <span>Events</span>
          <img src="/assets/arrows/arrow-down.png" />
          {eventSubMenuOpen && (
            <div className="header-menu-sub">
              <Link href="/event/upcoming-events">
                <div
                  className={cn("header-menu-sub-link", {
                    active: curLink.startsWith("/event/upcoming-events"),
                  })}
                >
                  Upcoming Events
                </div>
              </Link>
              <Link href="/event/past-events">
                <div
                  className={cn("header-menu-sub-link", {
                    active: curLink.startsWith("/event/past-events"),
                  })}
                >
                  Past Events
                </div>
              </Link>
            </div>
          )}
        </div>
        <a
          href={TELEGRAM_LINK}
          className="header-button community"
          target="_blank"
        >
          Join our Community
        </a>
      </div>
    </header>
  );
};

export default LayoutHeader;
