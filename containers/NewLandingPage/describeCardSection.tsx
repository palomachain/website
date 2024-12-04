import StartButton from 'components/Button/StartButton';
import { DescribeCardsData } from 'utils/data';

const describeCardSection = () => (
  <section className="describe-card-section">
    {DescribeCardsData.map((data, index) => (
      <div key={index} className="describe-card">
        <div className="describe-card-head">
          <h2>{data.title}</h2>
          <p>{data.describe}</p>
          <StartButton text={data.buttonText} link={data.buttonLink} isExternal={data.isExternal} />
        </div>
        <img src={data.bgIcon} alt={data.title} className="describe-card-bg" />
      </div>
    ))}
  </section>
);

export default describeCardSection;
