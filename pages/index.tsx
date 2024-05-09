import React, { useEffect, useState } from "react";

import RotatedHeader from "components/RotatedHeader";
import { fetchPageValues } from "utils/storyblok";
import { PAGE_LANDING } from "utils/constants";
import {
  getMessageCount,
  getFollowersCount,
  getPalomaBotStats,
} from "utils/axios";

import mixpanel from "mixpanel-browser";
import { getCookie } from "cookies-next";
import { setCookie } from "cookies-next";
import PalomaBotIntro from "elements/home/PalomaBotIntro";
mixpanel.init(process.env.MIXPANEL_API_KEY);

export default function Home({ state, router }) {
  const [data, setData] = useState(null);
  const [botStats, setBotStats] = useState({
    totalBots: 483,
    sumBotNumbers: 0,
  });
  const [palomaMsgs, setPalomaMsgs] = useState({
    totalMessagesCount: 19673,
    todayMessageCount: 0,
  });
  const [followers, setFollowers] = useState("");

  useEffect(() => {
    const getPageData = async () => {
      const data = await fetchPageValues(PAGE_LANDING);
      setData({ ...data.content });

      const msgs = await getMessageCount();
      setPalomaMsgs(msgs);

      const stats = await getPalomaBotStats();
      setBotStats(stats);

      const followers = await getFollowersCount();
      setFollowers(followers);
    };

    getPageData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const stats = await getPalomaBotStats();
      setBotStats(stats);

      const msgs = await getMessageCount();
      setPalomaMsgs(msgs);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ignore = getCookie("ignore");

    if (ignore) {
      // extend the time the user is ignored
      setCookie("ignore", "true", { maxAge: 60 * 60 * 24 * 7 * 10000 });
    }
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="home-page-container">
        <PalomaBotIntro />

        <div className="home-page-section">
          <div className="home-messages-total">
            <div className="count">
              <div className="title">Total Bot Messages</div>
              <div className="number">{palomaMsgs.totalMessagesCount}</div>
            </div>
            <div className="count">
              <div className="title">Total Bots</div>
              <div className="number">{botStats.totalBots}</div>
            </div>
          </div>
        </div>

        <RotatedHeader
          title="We go in all directions!"
          theme="dark"
          rightImage="/assets/arrows/footprint.svg"
          className="home-section-header"
        />

        <div className="home-page-section reverse">
          <div className="home-page-text">
            <h2>Permissionless Bots</h2>
            <p>
              Paloma's bots are low-latency and bidirectional smart contracts
              that are managed by the Paloma blockchain. Paloma validators act
              as custodians to monitor and execute state change instructions
              sent by developers and by users on target blockchains including
              Ethereum, BSC Chain, Polygon, Ethereum L2s, and any Cosmos-SDK
              Chain
            </p>
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
            <span className="pink">Uniswap V2 Position</span>
            <h2>Build a Limit</h2>
            <h2>Order Bot</h2>
            <p style={{ textAlign: "left" }}>
              We deliver a game-changer blockchain for developers. our protocol
              was built from developers to developers. Easy to use, easy to
              love. Get started now!
            </p>
            <a
              href="https://docs.palomachain.com/"
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
              href="https://docs.palomachain.com/"
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
              <div className="content">
                <h1>Create a Bot</h1>
                <p>
                  Create your bot with a simple command-line entry on Paloma.
                  Pay for your bot's gas in GRAINS or ETH at the command line.
                  Let fly!
                </p>
              </div>
            </div>

            <div className="home-how-item second">
              {/* <img className="pigeon" src="/assets/home/pigeon.png" /> */}
              <div className="number">2.</div>
              <div className="content">
                <h1>Deploy Your Bot</h1>
                <p>
                  Use Paloma's Python or JavaScript SDK to send a transaction or
                  command to your bot on Paloma and your desired target chain.
                  Watch your bot interact with other contracts.
                </p>
              </div>
            </div>

            <div className="home-how-item third">
              <div className="number">3.</div>
              <div className="content">
                <h1>Create Another Bot</h1>
                <p>
                  Use Paloma to determine when to fire the next bot message to
                  the pigeons. Pay gas in GRAINS or ETH.
                </p>
              </div>
              <a
                href="https://docs.palomachain.com/"
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

        <div className="home-page-propositions">
          <div className="subtitle">Stay Updated</div>
          <div className="title">Join the Flock</div>
          <div className="home-join-flock">
            <div className="flock-numbers">{followers}</div>
            <div className="pigeons">Pigeons</div>
            <a
              href="https://discord.gg/tNqkNHvVNc"
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
