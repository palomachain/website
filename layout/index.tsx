import React from 'react'
import Head from 'next/head'
import { isMobile } from 'react-device-detect'

import LayoutHeader from './header'
import Notice from './notice'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({
  children,
  router,
  defaultNetwork,
  walletConnectChainIds,
}) {
  return (
    <>
      <Head>
        <title>Paloma</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>

      <main className='layout-container'>
        <a id="back-to-top-anchor" href="/" />
        <LayoutHeader router={router} />
        {(
          React.cloneElement(children, {
            router,
            defaultNetwork,
            walletConnectChainIds,
          })
        )}
        <Notice />
      </main>
      <ToastContainer autoClose={10000} pauseOnFocusLoss={false} position={isMobile ? 'bottom-center' : 'top-right'} />
    </>
  )
}
