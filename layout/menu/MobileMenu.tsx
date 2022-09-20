import React, { useState } from "react";
import Link from "next/link";
import { navMenu } from "./menu";

import cn from 'classnames';

const MobileMenu = ({ onClose }) => {

  const [openMenu, setOpenMenu] = useState([]);

  const onClickMenu = (title) => {
    let open = [...openMenu];

    for (let i = 0; i < navMenu.length; i++) {
      const menu_1 = navMenu[i];
      if (menu_1.title === title) {
        if (open.includes(title)) {
          open = [];
        } else {
          open = [title]
        }
        break;
      }

      if (!("submenus" in menu_1)) continue;

      for (let j = 0; j < menu_1.submenus.length; j++) {
        const menu_2 = menu_1.submenus[j];

        if (menu_2.title === title) {
          if (open.includes(title)) {
            open = [ menu_1.title ]
          } else {
            open = [ menu_1.title, title ]
          }
          break;
        }
      }
    }

    setOpenMenu(open);
  }

  const onClickLink = () => {
    onClose();
  }

  return (
    <div className="mobile-header-menu">
      <div className="mobile-header-menu-top">
        <Link href="/"><img className="mobile-logo" src="/assets/logo/paloma-logotype.svg" onClick={(e) => onClickLink()} /></Link>
        <img
          className="mobile-menu-close"
          src="/assets/icons/close-black.png"
          onClick={(e) => onClose()}
        />
      </div>
      <div className="mobile-header-menu-wrapper">
        {navMenu.map((item_1) => (
          <React.Fragment key={`menu-1-${item_1.title}`}>
            <div className={cn("mobile_menu_1", { active: openMenu.includes(item_1.title) })}>
              {item_1.hasLink && item_1.external === false && (
                <Link href={item_1.link}>
                  <div onClick={(e) => onClickLink()} className="menu">{item_1.title}</div>
                </Link>
              )}
              {item_1.hasLink && item_1.external && (
                <a  className="menu" href={item_1.link} target="_blank">
                  {item_1.title}
                </a>
              )}
              {!item_1.hasLink && "submenus" in item_1 && (
                <>
                  <div className="menu" onClick={(e) => onClickMenu(item_1.title)}>
                    {item_1.title}
                  </div>
                  {openMenu.includes(item_1.title) && <img className="image" src="/assets/arrows/arrow-up-pink.png" />}
                  {!openMenu.includes(item_1.title) && <img className="image" src="/assets/arrows/arrow-down-black.png" />}
                </>
              )}
            </div>
            {/* SubMenu */}
            {"submenus" in item_1 && (
              <div className={cn("mobile-submenu", { show: openMenu.includes(item_1.title) })}>
                {item_1.submenus.map((item_2) => (
                  <React.Fragment key={`menu-2-${item_2.title}`}>
                    <div className="mobile_menu_2">
                      {item_2.hasLink && item_2.external === false && (
                        <Link href={item_2.link}>
                          <div onClick={(e) => onClickLink()} className="menu">{item_2.title}</div>
                        </Link>
                      )}
                      {item_2.hasLink && item_2.external && (
                        <a className="menu" href={item_2.link} target="_blank">
                          {item_2.title}
                        </a>
                      )}
                      {!item_2.hasLink && "submenus" in item_2 && (
                        <>
                          <div className="menu" onClick={(e) => onClickMenu(item_2.title)}>
                            {item_2.title}
                          </div>
                          <img  className="image" src="/assets/arrows/arrow-down-black.png" />
                        </>
                      )}
                    </div>
                    {"submenus" in item_2 && (
                      <div className={cn("mobile-submenu", { show: openMenu.includes(item_2.title) })}>
                        {item_2.submenus.map((item_3) => (
                          <div className="mobile_menu_3" key={`menu-3-${item_3.title}`}>
                            {item_3.hasLink && item_3.external === false && (
                              <Link href={item_3.link}>
                                <div onClick={(e) => onClickLink()} className="menu">{item_3.title}</div>
                              </Link>
                            )}
                            {item_3.hasLink && item_3.external && (
                              <a className="menu" href={item_3.link} target="_blank">
                                {item_3.title}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
