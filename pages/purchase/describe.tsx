import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';

const Describe = () => {
  const router = useRouter();

  return (
    <section className="purchase-flow-describe">
      <img src="/assets/logo/paloma-logotype.svg" alt="paloma-logo" width={63} />
      <h3>Paloma LightNode</h3>
      <p>
        The Paloma LightNode Client will act as a GRAINs miner. Grains will be minted on each LightNode Client address.
      </p>
      <div className="ul">LightNode v2 includes:</div>
      <ul>
        <li>Two-Year software license with full Volume support.</li>
        <li>Ledger hardware wallet integration and support.</li>
        <li>Automatic GRAIN delegation to active validators to minimize stake power differentials.</li>
        <li>Automatic re-delegation from inactive validators to active validators.</li>
        <li>Manual re-delegation to preferred validators.</li>
        <li>GRAIN mining rewards automatically claimed and delegated to validators every hour.</li>
        <li>Unbonding Support to unlock GRAINs across multiple validators.</li>
        <li>Governance support for Paloma proposal voting.</li>
        <li>Packaged binary as Docker for fast installation.</li>
        <li>Community RPC provided by NodeGuru.</li>
        <li>Linear per block mining.</li>
        <li>Easy Node Management.</li>
        <li>Easy User-Interface for all levels.</li>
      </ul>
      <div className="ul">Activate your Node</div>
      <p className="purchase-flow-describe__text">Already purchased your LightNode and need to start minting GRAINs?</p>
      <button className="purchase-flow-describe__btn flex-row" onClick={() => router.push(StaticLink.BUYMOREBOARD)}>
        Activate your Node
      </button>
    </section>
  );
};

export default Describe;
