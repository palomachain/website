import React, { useState, useEffect } from "react";
import Link from "next/link";

import { DISCORD_LINK } from "utils/constants";
import { navMenu } from './menu/menu';
import MobileMenu from "./menu/MobileMenu";

import cn from "classnames";

const LayoutHeader = ({ router }) => {
  const [curLink, setCurLink] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurLink(router.route);
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
            {item_1.hasLink && item_1.external && (
              <a href={item_1.link} className="header-button" target="_blank">{item_1.title}</a>
            )}
            {item_1.hasLink && !item_1.external && (
              <Link href={item_1.link}>
                <div className={cn("header-button", { active: curLink.includes(item_1.link) })}>
                  <span>{item_1.title}</span>
                </div>
              </Link>
            )}
            {!item_1.hasLink && (
              <div className="header-parent-menu">
                <div className="header-button">
                  <span>{item_1.title}</span>
                  <img src="/assets/arrows/arrow-down-black.png" />
                </div>
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
                          {item_2.hasLink && (
                            <a className="submenu-section-title link" href={item_2.link} target="_blank">{item_2.title}</a>
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
