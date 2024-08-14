import { Investors } from "utils/data";

const investorSection = () => (
  <section className="investor-section">
    <div className="investors">
      {Investors.map((investor, index) => (
        <div className="investor-card" key={index}>
          <img src={`/assets/investors/${investor}`} alt={investor} />
        </div>
      ))}
    </div>
    <div className="investor-body">
      <h2>Paloma Investment Rounds</h2>
      <h1>
        Paloma Mainnet Round Closed December 2022 for $1.5MM at $50MM valuation.
      </h1>
      <p>
        Paloma Investors include the leading blockchain and startup investors.
      </p>
      <button className="purchase-button purchase-button-white">
        Purchase your LightNode
      </button>
    </div>
  </section>
);

export default investorSection;
