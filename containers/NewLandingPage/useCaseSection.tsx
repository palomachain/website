import StartButton from 'components/Button/StartButton';
import { UseCasesData } from 'utils/data';

const useCaseSection = () => (
  <section className="usecase-card-section">
    <p>USE CASES</p>
    <h1>
      From developers
      <br />
      to developers
    </h1>
    <div className="usecase-cards">
      {UseCasesData.map((data, index) => (
        <div key={index} className="usecase-card">
          <div className="usecase-card-head">
            <p className="uppercase">{data.type}</p>
            <h2>{data.title}</h2>
            <p>{data.describe}</p>
            <StartButton text={data.buttonText} link={data.buttonLink} isExternal={data.isExternal} type="black" />
          </div>
          <img src={data.bgIcon} alt={data.title} />
        </div>
      ))}
    </div>
  </section>
);

export default useCaseSection;
