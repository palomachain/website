import React, { useEffect, useState } from "react";
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import RotatedHeader from "components/RotatedHeader";
import { fetchPageValues } from "utils/storyblok";
import { PAGE_LANDING } from "utils/constants";

import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_API_KEY);

export default function Home({ state, router }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getPageData = async () => {
      const data = await fetchPageValues(PAGE_LANDING);

      setData({ ...data.content });
    };

    getPageData();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="home-page-container">
        <div className="home-page-section">
          <div className="home-page-text">
            <h1>{data.heading1}</h1>
            <p className="large">{data.text1}</p>
            <a
              href="https://palomachain.github.io/paloma-docs/guide/develop/quick-start/quick-start.html"
              className="home-page-button"
              target="_blank"
            >
              Get Started
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
          <div className="home-page-image">
            <img src="/assets/home/diagram-1.png" />
          </div>
        </div>

        <RotatedHeader
          title="We GO IN ALL DIRECTIONS!"
          theme="dark"
          rightImage="/assets/arrows/footprint.svg"
          className="home-section-header"
        />

        <div className="home-page-section reverse">
          <div className="home-page-text">
            <h2>{data.heading2}</h2>
            <p>{data.text2}</p>
          </div>
          <div className="home-page-image">
            <img src="/assets/home/diagram-2.png" />
          </div>
        </div>

        <div className="home-page-propositions">
          <span className="subtitle">Paloma Value Propositions</span>
          <div className="title">{data.valueprop_heading}</div>
          <div className="home-proposition-list">
            <div className="home-proposition-item">
              <img src="/assets/home/fast.png" />
              <h3>{data.valueprop_title1}</h3>
              <p>{data.valueprop_text1}</p>
            </div>
            <div className="home-proposition-item">
              <img src="/assets/home/secure.png" />
              <h3>{data.valueprop_title2}</h3>
              <p>{data.valueprop_text2}</p>
            </div>
            <div className="home-proposition-item">
              <img src="/assets/home/gas-fee.png" />
              <h3>{data.valueprop_title3}</h3>
              <p>{data.valueprop_text3}</p>
            </div>
          </div>
        </div>

        <RotatedHeader
          title="Use Cases"
          theme="dark"
          className="home-section-header"
        />

        <div className="home-page-section">
          <div className="home-page-text">
            <span className="pink">Ethereum NFTs</span>
            <h2>Mint a </h2>
            <h2>
              {" "}
              Paloma Egg
              <img src="/assets/home/egg.png" />{" "}
            </h2>
            <p>
              Mint one of our 100 limited Edition Developer Eggs NFTs by sending
              a message on Ethereum.
            </p>
            <a
              href="https://palomachain.github.io/paloma-docs/"
              className="home-page-button"
              style={{ width: "100%" }}
            >
              View Docs
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
          <div className="home-page-image">
            <img src="/assets/home/code-1.png" />
          </div>
        </div>

        <div className="home-page-section">
          <div className="home-page-text">
            <span className="pink">Uniswap v3 Position</span>
            <h2>Build a Limit</h2>
            <h2>Order Bot</h2>
            <p>
              We deliver a game-changer blockchain for developers. Our protocol
              was built from developers to developers. Easy to use, easy to
              love. Get started now!
            </p>
            <a
              href="https://palomachain.github.io/paloma-docs/"
              className="home-page-button"
              style={{ width: "100%" }}
            >
              View Docs
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
          <div className="home-page-image">
            <img src="/assets/home/code-2.png" />
          </div>
        </div>

        <RotatedHeader
          title="How to Build on Paloma?"
          theme="dark"
          className="home-section-header"
        />

        <div className="home-page-section">
          <div className="home-how-to-build">
            <div className="home-how-item ">
              <div className="number">1.</div>
              <div className="content">{render(data.build_text1)}</div>
            </div>

            <div className="home-how-item second">
              <img className="pigeon" src="/assets/home/pigeon.png" />
              <div className="number">2.</div>
              <div className="content">{render(data.build_text2)}</div>
            </div>

            <div className="home-how-item third">
              <div className="number">3.</div>
              <div className="content">{render(data.build_text3)}</div>
              <a
                href="https://palomachain.github.io/paloma-docs/"
                className="home-page-button"
                style={{ width: "100%" }}
                target="_blank"
              >
                View Docs
                <img src="/assets/arrows/arrow-top-right.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
