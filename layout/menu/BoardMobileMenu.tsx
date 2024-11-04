import cn from 'classnames';
import Link from 'next/link';
import React from 'react';
import { boardNavMenu } from './menu';

import style from './boardMobileMenu.module.scss';

const BoardMobileMenu = ({ onClose }) => {
  const onClickLink = () => {
    onClose();
  };

  return (
    <div className="mobile-header-menu">
      <div className="mobile-header-menu-top">
        <Link href="/">
          <img className="mobile-logo" src="/assets/logo/paloma-logotype.svg" onClick={(e) => onClickLink()} />
        </Link>
        <img className="mobile-menu-close" src="/assets/icons/close-black.png" onClick={(e) => onClose()} />
      </div>
      <div className={style.navbar}>
        {boardNavMenu.map((navbar, index) =>
          index === 0 ? (
            <div
              key={index}
              className={cn(style.bar, index === 0 ? style.selected : undefined)}
              onClick={() => onClose()}
            >
              <img src={navbar.icon} alt={`${navbar.title}-${index}`} />
              <p>{navbar.title}</p>
              {navbar.isNew && <span>New</span>}
            </div>
          ) : (
            <Link href={navbar.link} target="_blank" className={style.bar}>
              <img src={navbar.icon} alt={`${navbar.title}-${index}`} />
              <p>{navbar.title}</p>
              {navbar.isNew && <span>New</span>}
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default BoardMobileMenu;
