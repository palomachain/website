import Purchase from 'components/Button/purchase';
import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { NodeSaleEndDate } from 'utils/constants';
import { SupportChains } from 'utils/data';

const nodesaleSection = () => {
  const [remainStartDate, setRemainStartDate] = useState(NodeSaleEndDate);

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
        <h1>PALOMA AI LIGHT NODES</h1>
        <p>
          Introducing a new way to mine digital tokens, create cross-chain applications, and use the blockchain to
          access new AI applications. Paloma is a new blockchain and AI applications network that is secured by
          community of global pigeons that deliver messages to any blockchain and store your AI context for use with any
          LLM of your choice.
        </p>
        <Purchase />
      </div>
      <div className="nodesale-center" />
      <div className="nodesale-start flex-col">
        <div className="nodesale-bg" />
        <div className="flex-col gap-16">
          <h2>NODE SALE WILL END</h2>
          <Countdown date={remainStartDate} renderer={rendererTime} />
        </div>
        <div className="flex-col gap-36">
          <p>PARTICIPATING CHAINS</p>
          <div className="nodesale-chains">
            {SupportChains.map((chain, index) => (
              <img src={`/assets/chains/${chain}.svg`} alt={chain} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default nodesaleSection;
