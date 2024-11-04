import { StaticLink } from 'configs/links';
import Head from 'next/head';
import React from 'react';
import BoardHeader from './boardHeader';
import Footer from './footer';
import LayoutHeader from './header';

export default function Layout({ children, router }) {
  const windowUrl = window.location.pathname;

  return (
    <>
      <Head>
        <title>Paloma</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>

      <main className="layout-container">
        <a id="back-to-top-anchor" href="/" />
        {windowUrl.toLowerCase().includes(StaticLink.BUYMOREBOARD) ? <BoardHeader /> : <LayoutHeader router={router} />}
        {React.cloneElement(children, {
          router,
        })}
        {!windowUrl.toLowerCase().includes(StaticLink.BUYMOREBOARD) && <Footer />}
      </main>
    </>
  );
}
