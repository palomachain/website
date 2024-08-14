import React, { useState } from "react";
import Link from "next/link";
import { footerMenu } from "./menu";

import cn from "classnames";

const MobileFooter = () => {
  const [openMenu, setOpenMenu] = useState([]);

  const onClickMenu = (title) => {
    let open = [...openMenu];

    for (let i = 0; i < footerMenu.length; i++) {
      const menu_1 = footerMenu[i];
      if (menu_1.title === title) {
        if (open.includes(title)) {
          open = [];
        } else {
          open = [title];
        }
        break;
      }
    }

    setOpenMenu(open);
  };

  return (
    <div className="mobile-header-menu footer">
      <div className="mobile-header-menu-wrapper">
        {footerMenu.map((item_1) => (
          <React.Fragment key={`m-menu-1-${item_1.title}`}>
            <div
              className={cn("mobile_menu_1", {
                active: openMenu.includes(item_1.title),
              })}
            >
              <div className="menu" onClick={(e) => onClickMenu(item_1.title)}>
                {item_1.title}
              </div>
              {openMenu.includes(item_1.title) && (
                <img className="image" src="/assets/arrows/arrow-up-pink.png" />
              )}
              {!openMenu.includes(item_1.title) && (
                <img
                  className="image"
                  src="/assets/arrows/arrow-down-black.png"
                />
              )}
            </div>
            {/* SubMenu */}
            {"submenus" in item_1 && (
              <div
                className={cn("mobile-submenu", {
                  show: openMenu.includes(item_1.title),
                })}
              >
                {item_1.submenus.map((item_2) => (
                  <div
                    className="mobile_menu_2"
                    key={`m-menu-2-${item_2.title}`}
                  >
                    {item_2.hasLink && item_2.external === false && (
                      <Link href={item_2.link}>
                        <div className="menu footer">{item_2.title}</div>
                      </Link>
                    )}
                    {item_2.hasLink && item_2.external && (
                      <a
                        className="menu footer"
                        href={item_2.link}
                        target="_blank"
                      >
                        {item_2.title}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileFooter;
