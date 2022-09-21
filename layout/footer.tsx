import React from "react";
import Link from "next/link";

import MobileFooter from "./menu/MobileFooter";
import { footerMenu } from "./menu/menu";

const Footer = () => (
  <div className="footer-container">
    <div className="footer-triangle-border"></div>

    <div className="footer-view desktop">
      <div className="footer-view-logo">
        <Link href="/">
          <img src="/assets/logo/paloma-logotype.svg" />
        </Link>
      </div>
      {footerMenu.map((item_1) => (
        <div
          className="footer-view-links"
          key={`footer-menu-1-${item_1.title}`}
        >
          <h3 className="footer-subtitle">{item_1.title}</h3>
          {"submenus" in item_1 &&
            item_1.submenus.map((item_2) => (
              <React.Fragment key={`footer-menu-2-${item_2.title}`}>
                {item_2.external && (
                  <a href={item_2.link} target="_blank">
                    {item_2.title}
                  </a>
                )}
                {!item_2.external && (
                  <Link href={item_2.link}>{item_2.title}</Link>
                )}
              </React.Fragment>
            ))}
        </div>
      ))}
    </div>

    <div className="footer-view mobile">
      <MobileFooter />
    </div>
  </div>
);

export default Footer;
