import cn from 'classnames';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { PALOMABOT_WEBSITE_LINK } from 'utils/constants';
import MobileMenu from './menu/MobileMenu';
import Purchase from 'components/Button/purchase';

const BoardHeader = () => {
  const ref = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="layout-container__header">
      <div className="layout-container__header__logo">
        <Link href="/">
          <img className="" src="/assets/logo/paloma-logotype.svg" alt="Paloma" width={112} />
        </Link>
      </div>
      <div className="layout-container__header__buttons" ref={ref}>
        <Purchase type="pink" text="+ Add a LightNode" />
      </div>

      <div className="layout-container__header__hamburger">
        <img src="/assets/icons/hamburger.png" onClick={(e) => setMobileMenuOpen(true)} />
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          onClose={() => {
            setMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default BoardHeader;
