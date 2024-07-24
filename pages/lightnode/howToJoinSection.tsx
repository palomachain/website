import { JoinFlow } from "utils/data";

const howToJoinSection = () => (
  <section className="howtojoin-section">
    <div className="join-flow">
      <h1>
        How to Join<br></br>
        <span>The Flock</span>
      </h1>
      <p>
        The Paloma LightNode is a Paloma blockchain program that secures the Paloma network by
        managing the delegation of stake to the most reliable cross-chain communication validators.
        Those who join the network become a pigeon and will be rewarded with GRAINs as their client
        continues to work each second to keep the Paloma network secure.
      </p>
      <button className="purchase-button mt-40">Purchase your LightNode</button>
      <img src="/assets/home/pigeons-fly-2.png" alt="pigeons-flow-2" />
    </div>
    <div className="join-flow-step">
      {JoinFlow.map((joinText, index) => (
        <div key={index} className="flex-col flow-diagram">
          <h1>{index + 1}.</h1>
          <p>{joinText}</p>
        </div>
      ))}
    </div>
  </section>
);

export default howToJoinSection;
