import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';

const Describe = () => {
  const router = useRouter();

  return (
    <section className="purchase-flow-describe">
      <img src="/assets/logo/paloma-logotype.svg" alt="paloma-logo" width={63} />
      <h3>
        Get Your Paloma AI LightNode Today
        <br />
        Before Prices Increase!
      </h3>
      <p>
        Secure your Light Node, become a Paloma network active participant, and be rewarded.
        <br />
        <br />
        Paloma is a new blockchain for pigeons, enabling fast blockchain interoperability and fast Web2.0 API
        integration to power autonomous artificial intelligence and custom LLM models.
      </p>
      <div className="ul">Paloma AI LightNode includes:</div>
      <ul>
        <li>
          <b>Personal Discount Code:</b> Receive a 10% commission in USDC and a 5% discount for every sale made with
          your discount code.
        </li>
        <li>
          <b>50,000 GRAIN Rewards:</b> Mine GRAIN tokens and stake your mining rewards.
        </li>
        <li>Two-Year software license with standard Volume support.</li>
        <li>Tailored(ai) Custom Twitter Bot with AI generated tweets</li>
        <li>Local Storage of AI context window data and model training data</li>
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
      <div className="ul">Activate your LightNode</div>
      <p className="purchase-flow-describe__text">Already purchased your LightNode and need to start minting GRAINs?</p>
      <button className="purchase-flow-describe__btn flex-row" onClick={() => router.push(StaticLink.BUYMOREBOARD)}>
        Activate your LightNode
      </button>
    </section>
  );
};

export default Describe;
