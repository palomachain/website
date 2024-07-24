import React, { useState } from "react";
import Countdown from "react-countdown";
import { SupportChains } from "utils/data";

const nodesaleSection = () => {
  const [remainStartDate, setRemainStartDate] = useState(Date.now() + 1000000);
  const CompleteTime = () => <span>-- Started --</span>;
  // Table style
  const rendererTime = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <CompleteTime />;
    } else {
      // Render a countdown
      return (
        <div className="flex-row">
          <div className="timeView">
            <h1>{days}</h1>
            <span>DAYS</span>
          </div>
          <div className="timeView">
            <h1>{hours}</h1>
            <span>HOURS</span>
          </div>
          <div className="timeView">
            <h1>{minutes}</h1>
            <span>MINUTES</span>
          </div>
          {/* <div className="timeView">
            <h1>{seconds}</h1>
            <span>SECONDS</span>
          </div> */}
        </div>
      );
    }
  };

  return (
    <section className="nodesale-section">
      <div className="nodesale-describe">
        <h3>JOIN THE FLOCK</h3>
        <h1>PALOMA LIGHT NODES</h1>
        <p>
          Introducing a new way to work and a participate in a global community: The Paloma Flock.
          Paloma is a new blockchain network that is secured by community of global pigeons that
          deliver transaction messages to any blockchain.
        </p>
        <button className="purchase-button">Purchase your LightNode</button>
      </div>
      <div className="nodesale-center" />
      <div className="nodesale-start flex-col">
        <div className="nodesale-bg" />
        <div className="flex-col gap-16">
          <h2>NODE SALE STARTS IN</h2>
          <Countdown date={remainStartDate} renderer={rendererTime} />
        </div>
        <div className="flex-col gap-16">
          <p>SUPPORTED CHAINS</p>
          <div className="nodesale-chains">
            {SupportChains.map((chain, index) => (
              <img src={`/assets/chains/${chain}.png`} alt={chain} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default nodesaleSection;
