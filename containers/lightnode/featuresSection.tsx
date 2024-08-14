import Purchase from "components/Button/purchase";
import { LightNodeFeatures } from "utils/data";

const featuresSection = () => (
  <section className="features-section">
    <h1>LightNode Features</h1>
    <p className="mt-20">
      Your Paloma LightNode Application runs the following commands automatically:
    </p>
    <Purchase className="mt-40" />
    <div className="features-cards">
      {LightNodeFeatures.map((feature, index) => (
        <div className="features-card" key={index}>
          <div className="features-card-icon">
            <img src={`/assets/features/${feature.img}`} alt={feature.title} />
          </div>
          <div className="features-card-text">
            <h3>{feature.title}</h3>
            <p>{feature.describe}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default featuresSection;
