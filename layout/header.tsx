import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { useOutsideAlerter } from "hooks";
import { TELEGRAM_LINK, DISCORD_LINK } from "utils/constants";

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
  hoverClassName = "",
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
    <div
      ref={childrenRef}
      onClick={(e) => onClick()}
      className={hoverClassName}
    >
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

  const [eventMobileSubMenuOpen, setEventMobileSubMenuOpen] = useState(true);

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
          <img
            className=""
            src="/assets/logo/paloma-logotype.svg"
            alt="Paloma"
          />
        </Link>
      </div>
      <div className="layout-container__header__buttons">
        <HeaderMenu
          title="Developers"
          className="header-button"
          active={false}
          img="/assets/arrows/arrow-down-black.png"
          isLink={false}
          childrenOpen={true}
          hoverClassName="header-parent-menu"
        >
          <div className="header-major-submenu">
            <div className="header-major-submenu-padding"></div>
            <div className="header-major-submenu-content">
              <div className="submenu-section">
                <div className="submenu-section-btitle">Developers</div>
                <p>
                  Find here all the useful links to start building on Paloma.
                </p>
              </div>
              <div className="submenu-section">
                <div className="submenu-section-title">Get Started</div>
                <a
                  className="link"
                  href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/quick-start.html"
                  target="_blank"
                >
                  Quick Start
                </a>
                <a
                  className="link"
                  href="https://palomachain.github.io/paloma-docs/guide/maintain/governance/governance.html"
                  target="_blank"
                >
                  Governance
                </a>
              </div>
              <div className="submenu-section">
                <div className="submenu-section-title">Guides</div>
                <a
                  className="link"
                  href="https://palomachain.github.io/paloma-docs/guide/maintain/node/set-up-production.html"
                  target="_blank"
                >
                  Running a node
                </a>
                <a
                  className="link"
                  href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/mint-egg.html#send-a-message"
                  target="_blank"
                >
                  Mint An Egg
                </a>
                <a
                  className="link"
                  href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/lob.html"
                  target="_blank"
                >
                  set up a limit order bot
                </a>
              </div>
              <div className="submenu-section">
                <div className="submenu-section-title">Github</div>
                <a
                  className="link"
                  href="https://github.com/palomachain/paloma"
                  target="_blank"
                >
                  Read me
                </a>
              </div>
            </div>
          </div>
        </HeaderMenu>
        <HeaderMenu
          title="Applications"
          className="header-button"
          active={false}
          img="/assets/arrows/arrow-down-black.png"
          isLink={false}
          childrenOpen={true}
          hoverClassName="header-parent-menu"
        >
          <div className="header-major-submenu">
            <div className="header-major-submenu-padding"></div>
            <div className="header-major-submenu-content">
              <div className="submenu-section">
                <div className="submenu-section-btitle">Applications</div>
                <p>
                  Discover the ecosystem of Paloma Products and Applications.
                </p>
              </div>
              <div className="submenu-section">
                <a
                  className="submenu-section-title link"
                  href="https://palomachain.github.io/paloma-docs/guide/develop/applications/pyth/pyth-price-feeds.html"
                  target="_blank"
                >
                  pyth Price Feed
                </a>
              </div>
              <div className="submenu-section">
                <a
                  className="submenu-section-title link"
                  href="https://palomachain.github.io/paloma-docs/guide/develop/applications/compass-evm/overview.html"
                  target="_blank"
                >
                  Compass EVM
                </a>
              </div>
              <div className="submenu-section">
                <a
                  className="submenu-section-title link paloma-extension"
                  href=""
                  target="_blank"
                >
                  <img src="/assets/home/egg.png" />
                  <div>
                    Paloma Nest
                    <br />
                    <span>(Chrome Extension)</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </HeaderMenu>
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
        <a href="" className="header-button" target="_blank">
          Forum
        </a>
        <a
          href={DISCORD_LINK}
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
            <img
              className="mobile-logo"
              src="/assets/logo/paloma-logotype.svg"
            />
            <img
              className="mobile-menu-close"
              src="/assets/icons/close.png"
              onClick={(e) => setMobileMenuOpen(false)}
            />
          </div>
          <div className="mobile-header-menu-menus">
            <HeaderMenu
              title="Developers"
              isLink={false}
              className="mobile-button"
              img="/assets/arrows/arrow-down-black.png"
              childrenOpen={eventMobileSubMenuOpen}
              // onClick={() => setEventMobileSubMenuOpen(!eventMobileSubMenuOpen)}
            >
              <div className="mobile-menu-sub">
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/quick-start.html"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  Quick Start
                </a>
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/maintain/governance/governance.html"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  Governance
                </a>
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/maintain/node/set-up-production.html"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  Running a node
                </a>
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/mint-egg.html#send-a-message"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  Mint An Egg
                </a>
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/lob.html"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  set up a limit order bot
                </a>
                <a
                  href="https://github.com/palomachain/paloma"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  Read me
                </a>
              </div>
            </HeaderMenu>
            <HeaderMenu
              title="Applications"
              isLink={false}
              className="mobile-button"
              img="/assets/arrows/arrow-down-black.png"
              childrenOpen={eventMobileSubMenuOpen}
              // onClick={() => setEventMobileSubMenuOpen(!eventMobileSubMenuOpen)}
            >
              <div className="mobile-menu-sub">
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/develop/applications/pyth/pyth-price-feeds.html"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  pyth Price Feed
                </a>
                <a
                  href="https://palomachain.github.io/paloma-docs/guide/develop/applications/compass-evm/overview.html"
                  className="mobile-menu-sub-link"
                  target="_blank"
                >
                  Compass EVM
                </a>
              </div>
            </HeaderMenu>
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
              // onClick={() => setEventMobileSubMenuOpen(!eventMobileSubMenuOpen)}
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
            <a href="" className="mobile-button" target="_blank">
              Forum
            </a>
            <div className="mobile-menu-spacer"></div>
            <a
              href={DISCORD_LINK}
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
