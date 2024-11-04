import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { BoardNavData } from 'utils/data';

import style from './boardModal.module.scss';

interface SuccessModalProps {
  navbar: number;
  onClose: () => void;
}

const BoardModal = ({ navbar, onClose }: SuccessModalProps) => {
  return (
    <section className={style.container}>
      <section className={style.mask} />
      <section className={style.content}>
        <section className={style.dialog}>
          <section className={style.headContainer}>
            <div className={classNames(style.actionBtn, style.close)} onClick={(e) => onClose()}>
              <img src="/assets/icons/close-black.png" alt="" width={13} height={13} />
            </div>
            <img src={BoardNavData[navbar].bg} width={509} />
          </section>
          <div className={style.contentContainer}>
            <h3>{BoardNavData[navbar].title}</h3>
            <p>{BoardNavData[navbar].describe}</p>
            <Link href={BoardNavData[navbar].buttonLink} target="_blank" className={style.actionBtn}>
              {BoardNavData[navbar].buttonText}
            </Link>
          </div>
        </section>
      </section>
    </section>
  );
};

export default BoardModal;
