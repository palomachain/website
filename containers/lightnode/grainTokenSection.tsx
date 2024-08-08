const grainTokenSection = () => (
  <section className="grain-token-section">
    <div className="grain-token">
      <h1>Paloma GRAIN token Exchange Listings</h1>
      <p>
        Paloma GRAINs are not currently listed or trading on any centralized or decentralized
        exchanges. This will change when the exchange of GRAINs for ETH and DAI relay fees are
        executed via decentralized trading on all the Paloma target chains. Pigeon Feed, the feature
        where validators and LightNode client collect fees, is in production today.
      </p>
    </div>
    <div className="grain-trading">
      <div className="grain-trading-text">
        <h2>grain TRADING POOL DEPLOYMENT TO UNISWAP AND CURVE.</h2>
        <p>
          In the coming months, the Paloma and Volume team will propose a governance vote to deploy
          GRAIN trading pools on Uniswap and Curve AMMs on all the target chains supported by
          Paloma. When this vote passes, the GRAIN token AMM pools with automatically deploy and
          relay fees will be swapped for GRAINs to deliver to the Paloma staking community.
          <br />
          <br />
          Once GRAINs AMM pools are deployed, we expect centralized exchanges will aim to list the
          token as price discovery arises.
        </p>
      </div>
      <img src="/assets/home/paloma-and-uniswap.png" alt="paloma-and-uniswap" />
    </div>
  </section>
);

export default grainTokenSection;
