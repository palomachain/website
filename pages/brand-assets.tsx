import React, { useEffect, useState } from "react";
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import RotatedHeader from "components/RotatedHeader";
import { fetchPageValues } from "utils/storyblok";
import { PAGE_LANDING } from "utils/constants";

import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_API_KEY);

const brandAssets = [
  {
    title: "Paloma Pink",
    background: "#F1D1E5",
    color: "#2C2C2C",
    rgb: "RGB: 241, 209, 229",
  },
  {
    title: "Grey",
    background: "#2C2C2C",
    color: "#EAE5E5",
    rgb: "RGB: 44, 44, 44",
  },
  {
    title: "Secondary Pink",
    background: "#FE7DCD",
    color: "#EAE5E5",
    rgb: "RGB: 254, 125, 205",
  },
];

export default function BrandAssets({ state, router }) {
  return (
    <div className="page-container">
      <div className="brand-assets-page-container">
        <div className="brand-assets-page-section">
          <div className="brand-assets-page-text">
            <h1>Logotype</h1>
            <p className="large">
              Download here Paloma official logotypes (.PNG, .SVG, .EPS)
            </p>
            <a
              href="https://drive.google.com/uc?export=download&id=1b6EFGGteM4LZEOqx3hgoTkrVQgc6vDHf"
              className="brand-assets-page-button"
              target="_blank"
            >
              Download (.zip)
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
          <div className="brand-assets-page-image">
            <img src="/assets/logo/paloma-logotype.svg" />
          </div>
        </div>

        <div className="brand-assets-page-propositions">
          <span className="subtitle">Brand Assets</span>
          <div className="title">Brand Colors</div>
          <div className="brand-assets-color-list">
            {brandAssets.map((item, index) => (
              <div
                key={`brand-assets-color-${index}`}
                className="color-item"
                style={{ background: item.background, color: item.color }}
              >
                <div className="color-title">{item.title}</div>
                <div className="color-bg">{item.background}</div>
                <div className="color-rgb">{item.rgb}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
