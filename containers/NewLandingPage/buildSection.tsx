import StartButton from 'components/Button/StartButton';
import { MessageBuildData } from 'utils/data';

const buildSection = () => (
  <section className="build-card-section">
    <p>HOW TO BUILD ON PALOMA</p>
    <h1>
      Three Simple Steps
      <br />
      To Start Building
    </h1>
    <div className="build-cards">
      {MessageBuildData.map((data, index) => (
        <div key={index} className="build-card">
          <img src={data.bgIcon} alt={data.title} />
          <h2>{data.title}</h2>
          <p>{data.describe}</p>
          <StartButton text={data.buttonText} link={data.buttonLink} isExternal={data.isExternal} type="black" />
        </div>
      ))}
    </div>
  </section>
);

export default buildSection;
