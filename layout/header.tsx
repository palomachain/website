import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { useOutsideAlerter } from "hooks";
import { TELEGRAM_LINK } from "utils/constants";

import cn from "classnames";

const HeaderMenu = ({
  title,
  isLink = true,
  href = "",
  onClick = () => {},
  className = "",
  active = false,
  img = "",
  children = null,
  childrenRef = null,
  childrenOpen = false,
  hoverClassName = ""
}) => {
  return isLink ? (
    <Link href={href}>
      <div
        className={cn(className, {
          active,
        })}
      >
        <span>{title}</span>
        {/* {img !== "" && active && <img src={`${img}.png`} />}
        {img !== "" && !active && <img src={`${img}-black.png`} />} */}
        <img src={img} />
      </div>
    </Link>
  ) : (
    <div ref={childrenRef} onClick={(e) => onClick()} className={hoverClassName}>
      <div
        className={cn(className, {
          active,
        })}
      >
        <span>{title}</span>
        {/* {img !== "" && <img src={`${img}.png`} />} */}
        <img src={img} />
      </div>
      {childrenOpen && children}
    </div>
  );
};

const baseUrl = process.env.BASE_URL;

const LayoutHeader = ({ router }) => {
  const [curLink, setCurLink] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [eventSubMenuOpen, setEventSubMenuOpen] = useState(false);
  const eventSubMenuRef = useRef(null);
  useOutsideAlerter(eventSubMenuRef, () => {
    setEventSubMenuOpen(false);
  });

  const [eventMobileSubMenuOpen, setEventMobileSubMenuOpen] = useState(false);

  useEffect(() => {

    setCurLink(router.route);

    if (router.route.startsWith("/event")) {
      setEventMobileSubMenuOpen(true);
    }
  }, [router.route]);

  const handleClickMobileLink = (link) => {
    setMobileMenuOpen(false);
    router.push(link);
  };

  return (
    <header className="layout-container__header">
      <div className="layout-container__header__logo">
        <Link href="/">
          <img className="" src="/assets/logo/paloma-black.png" alt="Paloma" />
        </Link>
      </div>
      <div className="layout-container__header__buttons">
        {/* <HeaderMenu
          title="Home"
          isLink={false}
          className="disabled header-button"
          active={curLink === "/"}
        />
        <HeaderMenu
          title="About US"
          isLink={false}
          className="disabled header-button"
          active={curLink.startsWith("/about-us")}
        /> */}
        <HeaderMenu
          title="Blog"
          href={`${baseUrl}/blog`}
          className="header-button"
          active={curLink.startsWith("/blog")}
        />
        <HeaderMenu
          title="Events"
          isLink={false}
          className="header-button"
          active={curLink.startsWith("/event")}
          img="/assets/arrows/arrow-down-black.png"
          childrenOpen={true}
          hoverClassName="header-parent-menu"
        >
          <div className="header-menu-sub">
            <HeaderMenu
              title="Upcoming Events"
              href="/event/upcoming-events"
              className="header-menu-sub-link"
              active={curLink.startsWith("/event/upcoming-events")}
            />
            <HeaderMenu
              title="Past Events"
              href="/event/past-events"
              className="header-menu-sub-link"
              active={curLink.startsWith("/event/past-events")}
            />
          </div>
        </HeaderMenu>
        <a
          href={TELEGRAM_LINK}
          className="header-button community"
          target="_blank"
        >
          <span>Join our Community</span>
        </a>
      </div>
      <div className="layout-container__header__hamburger">
        <img
          src="/assets/icons/hamburger.png"
          onClick={(e) => setMobileMenuOpen(true)}
        />
      </div>
      {mobileMenuOpen && (
        <div className="mobile-header-menu">
          <div className="mobile-header-menu-top">
            <img className="mobile-logo" src="/assets/logo/paloma-red.png" />
            <img
              className="mobile-menu-close"
              src="/assets/icons/close.png"
              onClick={(e) => setMobileMenuOpen(false)}
            />
          </div>
          <div className="mobile-header-menu-menus">
            {/* <HeaderMenu
              title="Home"
              isLink={false}
              className="disabled mobile-button"
              active={curLink === "/"}
            />
            <HeaderMenu
              title="About US"
              isLink={false}
              className="disabled mobile-button"
              active={curLink.startsWith("/about-us")}
            /> */}
            <HeaderMenu
              title="Blog"
              href={`${baseUrl}/blog`}
              isLink={false}
              className="mobile-button"
              active={curLink.startsWith("/blog")}
              onClick={() => handleClickMobileLink("/blog")}
            />
            <HeaderMenu
              title="Events"
              isLink={false}
              className="mobile-button"
              active={curLink.startsWith("/event")}
              img="/assets/arrows/arrow-down-black.png"
              childrenOpen={eventMobileSubMenuOpen}
              onClick={() =>
                setEventMobileSubMenuOpen(!eventMobileSubMenuOpen)
              }
            >
              <div className="mobile-menu-sub">
                <HeaderMenu
                  title="Upcoming Events"
                  href="/event/upcoming-events"
                  className="mobile-menu-sub-link"
                  active={curLink.startsWith("/event/upcoming-events")}
                  isLink={false}
                  onClick={() =>
                    handleClickMobileLink("/event/upcoming-events")
                  }
                />
                <HeaderMenu
                  title="Past Events"
                  href="/event/past-events"
                  className="mobile-menu-sub-link"
                  active={curLink.startsWith("/event/past-events")}
                  isLink={false}
                  onClick={() => handleClickMobileLink("/event/past-events")}
                />
              </div>
            </HeaderMenu>
            <div className="mobile-menu-spacer"></div>
            <a
              href={TELEGRAM_LINK}
              className="mobile-button community"
              target="_blank"
            >
              <span>Join our Community</span>
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default LayoutHeader;
