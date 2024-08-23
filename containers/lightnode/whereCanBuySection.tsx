import Purchase from 'components/Button/purchase';
import { SupportChains } from 'utils/data';

const whereCanBuySection = () => (
  <section className="where-can-buy-section">
    <div className="where-can-buy">
      <div className="where-can-buy__head">
        <h3>Participating chains</h3>
        <h1>Where can I buy a paloma Lightnode</h1>
        <p>
          The Paloma LightNode Sales will be the first cross-chain node sale. Anyone may purchase a Paloma LightNode
          with liquidity on any of the following chains.
          <br />
          <br />
          All purchases are settled natively on all chains. No bridging needed. When you register your node using your
          purchasing wallet, you will begin to mint GRAINs on the Paloma blockchain.
        </p>
        <Purchase className="mt-40" />
      </div>
      <div className="where-can-buy__chains">
        {SupportChains.map(
          (chain, index) =>
            chain !== 'b' && (
              <div key={index} className="where-can-buy__chains-chain">
                <img src={`/assets/chains/${chain}.svg`} alt={`${chain}-chain`} />
                <p>{chain}</p>
              </div>
            ),
        )}
      </div>
    </div>
  </section>
);

export default whereCanBuySection;
