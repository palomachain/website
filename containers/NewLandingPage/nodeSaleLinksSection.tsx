import React from 'react';
import { NodeSaleLinks } from 'utils/data';

const nodeSaleLinksSection = () => (
  <section className="new-node-sale-links-section">
    <p>THE PALOMA ECOSYSTEM</p>
    <h1>Important Links</h1>
    <div className="node-sale-links">
      {Object.keys(NodeSaleLinks).map((sale, index) => (
        <div key={index} className="full-width">
          <h3>{sale}</h3>
          <div className="node-sale-links-items">
            {NodeSaleLinks[sale].map((item, key) => (
              <div className="node-sale-item" key={key}>
                {item.icon && (
                  <div className="node-sale-item-icon">
                    <img src={item.icon} alt={`item-${index}-${key}`} />
                  </div>
                )}
                <div key={key} className={`node-sale-links-item ${index === 0 ? 'node-sale-links-item-pink' : ''}`}>
                  <a href={item.link} target="_blank">
                    {item.title}
                  </a>
                  <img src="/assets/arrows/arrow-right-black.svg/" alt={`arrow-${sale}-${key}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default nodeSaleLinksSection;
