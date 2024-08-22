import Purchase from 'components/Button/purchase';
import React, { useState } from 'react';

const whereCanBuySection = () => (
  <section className="what-is-paloma-section">
    <div className="what-is">
      <div className="what-is-paloma">
        <h3>Participating chains</h3>
        <h1>Where can I buy a paloma Lightnode</h1>
        <p>
          The Paloma LightNode Sales will be the first cross-chain node sale. Anyone may purchase a Paloma LightNode
          with liquidity on any of the following chains.<br /><br />All purchases are settled natively on all chains. No bridging
          needed. When you register your node using your purchasing wallet, you will begin to mint GRAINs on the Paloma
          blockchain.
        </p>
        <Purchase className="mt-40" />
      </div>
      <div>
        
      </div>
    </div>
  </section>
);

export default whereCanBuySection;
