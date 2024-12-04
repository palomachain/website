import StartButton from 'components/Button/StartButton';
import { StaticLink } from 'configs/links';

const startSection = () => {
  const handleGetStartClick = () => {
    const element = document.getElementById('paloma-ai-lightnodes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="start-section">
      <div className="start-bg1" />
      <div className="start-main">
        <h1>
          Your Talent and Your AI
          <br />
          Now Lives on The Blockchain.
        </h1>
        <p>
          Paloma Blockchain is a growing nest of Pigeons who secure your talent, your liquidity, and your AI agents on
          the fastest decentralized automation layer.
        </p>
        <div className="start-btns">
          <StartButton text="Get Started" link={''} onClick={handleGetStartClick} />
          <StartButton text="Learn More" type="black" link={''} />
        </div>
      </div>
      <div className="start-bg2" />
    </section>
  );
};

export default startSection;
