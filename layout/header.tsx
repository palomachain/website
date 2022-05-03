import React, { useState, useEffect } from "react";
import Link from "next/link";

import { DISCORD_LINK } from "utils/constants";
import { navMenu } from './menu/menu';
import MobileMenu from "./menu/MobileMenu";

import cn from "classnames";

const NaveMenuItem = ({menu, curLink = ''}) => (
  <React.Fragment>
    {menu.hasLink && menu.external && (
      <a href={menu.link} className="header-button" target="_blank">
        <span>{menu.title}</span>
        {("submenus" in menu) && (<img src="/assets/arrows/arrow-down-black.png" />)}
      </a>
    )}
    {menu.hasLink && !menu.external && (
      <Link href={menu.link}>
        <div className={cn("header-button", { active: curLink.includes(menu.link) })}>
          <span>{menu.title}</span>
          {("submenus" in menu) && (<img src="/assets/arrows/arrow-down-black.png" />)}
        </div>
      </Link>
    )}
    {!menu.hasLink && (
      <div className="header-button">
        <span>{menu.title}</span>
        {("submenus" in menu) && (<img src="/assets/arrows/arrow-down-black.png" />)}
      </div>
    )}
  </React.Fragment>
)

const LayoutHeader = ({ router }) => {
  const [curLink, setCurLink] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <img
            className=""
            src="/assets/logo/paloma-logotype.svg"
            alt="Paloma"
          />
        </Link>
      </div>
      <div className="layout-container__header__buttons">
        {navMenu.map((item_1) => (
          <React.Fragment key={`menu-1-${item_1.title}`}>
            {!("submenus" in item_1) && (
              <NaveMenuItem menu={item_1} curLink={curLink} />
            )}
            {("submenus" in item_1) && (
              <div className="header-parent-menu">
                <NaveMenuItem menu={item_1} curLink={curLink} />
                {"submenus" in item_1 && (
                  <div className="header-major-submenu">
                    <div className="header-major-submenu-padding" />
                    <div className="header-major-submenu-content">
                      <div className="submenu-section">
                        <div className="submenu-section-btitle">{item_1.title}</div>
                        <p>{item_1.description}</p>
                      </div>
                      {item_1.submenus.map((item_2) => (
                        <div className="submenu-section" key={`menu-2-${item_2.title}`}>
                          {!item_2.hasLink && (<div className="submenu-section-title">{item_2.title}</div>)}
                          {item_2.hasLink && item_2.external && (
                            <a className="submenu-section-title link" href={item_2.link} target="_blank">{item_2.title}</a>
                          )}
                          {item_2.hasLink && !item_2.external && (
                            <Link href={item_2.link}><div className="submenu-section-title link">{item_2.title}</div></Link>
                          )}
                          {"submenus" in item_2 && item_2.submenus.map((item_3) => (
                            <React.Fragment key={`menu-3-${item_3.title}`}>
                              {item_3.hasLink &&(
                                <a className="link" href={item_3.link} target="_blank">{item_3.title}</a>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
        <a href={DISCORD_LINK} className="header-button community" target="_blank">
          <span>Join our Community</span>
        </a>
      </div>

      {/* 
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
      */}

      <div className="layout-container__header__hamburger">
        <img
          src="/assets/icons/hamburger.png"
          onClick={(e) => setMobileMenuOpen(true)}
        />
      </div>

      {mobileMenuOpen && <MobileMenu onClose={() => { setMobileMenuOpen(false) }}/>}
    </header>
  );
};

export default LayoutHeader;
 