import Head from 'next/head';
import React from 'react';
import Footer from './footer';
import LayoutHeader from './header';
import { StaticLink } from 'configs/links';
import BoardHeader from './boardHeader';

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
        {windowUrl.toLowerCase().includes(StaticLink.BUYMOREBOARD) ? (
          <BoardHeader />
        ) : (
          <LayoutHeader router={router} />
        )}
        {React.cloneElement(children, {
          router,
        })}
        <Footer />
      </main>
    </>
  );
}
