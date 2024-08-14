import React from 'react';
import Link from 'next/link';

const Custom404 = () => (
  <div className="page-container">
    <div className="custom-404-container">
      <img src="/assets/logo/paloma-white.png" />
      <span>
        Paloma couldn’t find this page. But you can have plenty of fun in our <Link href="/">Landing Page</Link>
      </span>
    </div>
  </div>
);

export default Custom404;
