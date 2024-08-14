import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';

const Describe = () => {
  const router = useRouter();

  return (
    <section className="purchase-flow-describe">
      <img src="/assets/logo/paloma-logotype.svg" alt="paloma-logo" width={63} />
      <h3>Paloma LightNode</h3>
      <p>
        The Paloma LightNode Client will act as a GRAINs miner. Grains will be vested on each LightNode Client address.
      </p>
      <div className="ul">LightNode includes:</div>
      <ul>
        <li>Two-Year Software License with full Volume support.</li>
        <li>Automatic delegation to active validators to maximize low-stake validators.</li>
        <li>Automatic re-delegation from inactive validators to active validators.</li>
        <li>GRAIN rewards claimed and delegated to validators every 24-hours.</li>
        <li>Package: Packaged binary as Docker for fast installation.</li>
        <li>Community RPC provided by NodeGuru.</li>
        <li>Linear per block vesting.</li>
        <li>Easy User-Interface for all levels.</li>
      </ul>
      <div className="ul">Activate your Node</div>
      <p className="purchase-flow-describe__text">Already purchased your LightNode and need to start minting GRAINs?</p>
      <button className="purchase-flow-describe__btn flex-row" onClick={() => router.push(StaticLink.ACTIVATE)}>
        Activate your Node
      </button>
    </section>
  );
};

export default Describe;
