import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

function Layout({ children }) {
  return (
    <div>
      {/* Adsense Script */}
      {/* <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5878196353426013"
        crossorigin="anonymous"
        data-ad-slot="9616717799"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></Script> */}
      <Head>
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
      </Head>
      {children}
    </div>
  );
}

export default Layout;
