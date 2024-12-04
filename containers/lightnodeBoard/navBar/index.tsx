import classNames from 'classnames';
import { boardNavMenu } from 'layout/menu/menu';
import Link from 'next/link';
import React from 'react';

import style from './navbar.module.scss';

export default function NavBar({ selectedBarIndex, onChangeBar }) {
  return (
    <section className={style.container}>
      <Link href="/">
        <img className="" src="/assets/logo/paloma-logotype.svg" alt="Paloma" width={112} />
      </Link>
      <div className={style.navbar}>
        {boardNavMenu.map((navbar, index) => (
          <div
            key={index}
            className={classNames(
              style.bar,
              boardNavMenu[selectedBarIndex].title === navbar.title ? style.selected : undefined,
            )}
            onClick={() => onChangeBar(index)}
          >
            <img src={navbar.icon} alt={`${navbar.title}-${index}`} />
            <p>{navbar.title}</p>
            {navbar.isNew && <span>New</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
