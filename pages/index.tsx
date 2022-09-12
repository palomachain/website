import React, { useEffect, useState } from "react";
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import RotatedHeader from "components/RotatedHeader";
import { fetchPageValues } from "utils/storyblok";
import { PAGE_LANDING } from "utils/constants";
import { getMessageCount, getPalomaTwitterFollowersCount } from "utils/axios";

import cn from "classnames";

import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_API_KEY);

const comingNext = [
  {
    date: "September 2022",
    title: "Other EVM Chains",
    desc: "Add all other EVM chains (mainnet chains)",
    active: true,
  },
  {
    date: "October 2022",
    title: "Gas Management",
    desc: "Pigeons get pay for all messages they deliver",
    active: false,
  },
  {
    date: "November 2022",
    title: "Scheduling",
    desc: "Remote messages can be scheduled in advance",
    active: false,
  },
  {
    date: "December 2022",
    title: "Solana",
    desc: "Add Solana Mainnet as Paloma target chain",
    active: false,
  },
];

export default function Home({ state, router }) {
  const [data, setData] = useState(null);
  const [msgs, setMsgs] = useState({
    totalMessagesCount: 0,
    todayMessageCount: 0,
  });
  const [followers, setFollowers] = useState('')

  useEffect(() => {
    const getPageData = async () => {
      const data = await fetchPageValues(PAGE_LANDING);
      console.log(data);
      setData({ ...data.content });

      const msgs = await getMessageCount();
      setMsgs(msgs);
      
      const followers = await getPalomaTwitterFollowersCount();
      setFollowers(followers);
    };

    getPageData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const msgs = await getMessageCount();
      setMsgs(msgs);
    }, 30000);

    return () => clearInterval(interval);
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
              href="https://guaya23l1on.typeform.com/to/r0NYlO5S"
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

        <div className="home-page-section">
          <div className="home-messages-total">
            <div className="count">
              <div className="title">Total Messages</div>
              <div className="number">
                {msgs.totalMessagesCount.toLocaleString("en-US")}
              </div>
            </div>
            <div className="count">
              <div className="title">Messages per day</div>
              <div className="number">
                {msgs.todayMessageCount.toLocaleString("en-US")}
              </div>
            </div>
          </div>
        </div>

        <RotatedHeader
          title="We message in all directions!"
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
              <img src="/assets/home/scalable.png" />
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
            <span className="pink">Cross Chain NFTs</span>
            <h2>Mint an Egg </h2>
            <h2>
              {" "}
              on Ethereum
            </h2>
              <h2>
              {" "}
              From The Cosmos </h2>
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

        {/* <div className="home-page-section">
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
        </div> */}

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
              {/* <img className="pigeon" src="/assets/home/pigeon.png" /> */}
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

        {/* <div className="home-page-next">
          <div className="title">What is coming next?</div>
          <div className="home-page-next-wrapper">
            <div className="coming-next-flows">
              {comingNext.map((item, index) => (
                <React.Fragment key={`coming-next-item-${index}`}>
                  {index > 0 && <div className="coming-next-line" />}
                  <div className="coming-next-item">
                    <div className="number-wrapper">
                      <div
                        className="spacer"
                        style={{
                          visibility: index === 0 ? "hidden" : "visible",
                        }}
                      />
                      <div
                        className={cn("circle-number", { active: item.active })}
                      >
                        {index + 1}.
                      </div>
                      <div
                        className="spacer"
                        style={{
                          visibility:
                            index < comingNext.length - 1
                              ? "visible"
                              : "hidden",
                        }}
                      />
                    </div>
                    <div className="content-wrapper">
                      <div className="date">{item.date}</div>
                      <div className="title">{item.title}</div>
                      <div className="desc">{item.desc}</div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="home-page-next-image">
              <img src="/assets/home/diagram-3.png" />
            </div>
          </div>
        </div> */}

        <div className="home-page-propositions">
          <div className="subtitle">Stay Updated</div>
          <div className="title">Join the Flock</div>
          <div className="home-join-flock">
            <div className="flock-numbers">{followers}</div>
            <div className="pigeons">Pigeons</div>
            <a
              href="https://discord.gg/YBMrQxHp"
              className="home-page-button"
              target="_blank"
              style={{ background: "#fff" }}
            >
              Join The Flock
              <img src="/assets/arrows/arrow-top-right.png" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
