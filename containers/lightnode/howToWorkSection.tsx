import { WorkFlow } from 'utils/data';

const howToWorkSection = () => (
  <section className="howtowork-section">
    <img src="/assets/home/pigeons-fly.png" alt="pigeons-fly" className="work-section-bg" />
    <h3 className="h3-title">deliver messages to all blockchains</h3>
    <h1 className="h-white">how does it work</h1>
    <p className="p-describe p-white">
      The Paloma Protocol is the FedEx for Blockchains. When you need to get a message to any blockchain smart contract,
      with speed, trust the Paloma pigeons to deliver the message.
    </p>
    <div className="work-flow">
      {WorkFlow.map((flow, index) => (
        <div key={index} className="work-flow-card">
          <div className="work-flow-img">
            <img src={`/assets/home/${flow.icon}`} alt={flow.icon} />
          </div>
          <h3>{flow.title}</h3>
          <p>{flow.describe}</p>
        </div>
      ))}
    </div>
  </section>
);

export default howToWorkSection;
