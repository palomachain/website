import { Advisors } from "utils/data";

const advisorsSection = () => (
  <section className="advisors-section">
    <h1>Advisors</h1>
    <div className="advisors-items">
      {Advisors.map((advisor, index) => (
        <div key={index} className="advisors-item">
          <div className="advisors-item-img">
            <img src={advisor.img} />
          </div>
          <p>{advisor.name}</p>
          <span>{advisor.company}</span>
          <img src={advisor.logo} className="advisors-item-logo" />
        </div>
      ))}
    </div>
  </section>
);

export default advisorsSection;
