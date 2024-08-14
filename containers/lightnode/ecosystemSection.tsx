import { EcosystemData } from "utils/data";

const ecosystemSection = () => (
  <section className="ecosystem-section">
    <h2>Paloma Apps</h2>
    <h1>The paloma ecosystem</h1>
    <p>
      Paloma secures an increasing number of trading applications, ensuring
      reliable and efficient performance as the platform continues to grow.
    </p>
    <div className="flex-col gap-36 ecosystem-cards">
      {EcosystemData.map((data, index) => (
        <div key={index} className="ecosystem-card">
          <div className="ecosystem-head">
            <img src={`/assets/ecosystem/${data.icon}`} alt={data.title} />
            <h1>{data.title}</h1>
            <p>{data.describe}</p>
          </div>
          <div className="ecosystem-body">
            <img
              src={`/assets/ecosystem/${data.backgroundImg}`}
              alt={data.title}
            />
            <div className="ecosystem-items">
              {data.items.map((item, j) => (
                <div className="ecosystem-item" key={j}>
                  {item.name && <h3>{item.name}</h3>}
                  {item.text && <p>{item.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ecosystemSection;
