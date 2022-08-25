import React from "react";

import RotatedHeader from "components/RotatedHeader";

import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_API_KEY);

export default function Home({ state, router }) {
  return (
    <div className="page-container">
      <div className="home-page-container">
        <div className="home-page-section">
          <div className="home-page-text">
            <h1>The Fastest Messenger Blockchain</h1>
            <p>
              Paloma is a Cosmos-SDK Blockchain for sending and receiving
              messages from any other Blockchain with the lowest communication
              latency possible.
            </p>
            <a href="" className="home-page-button">
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
            <h2>Permissionless Cross Chain</h2>
            <p>
              Paloma messages are low latency and bidirectional between any
              chains approved by governance. Paloma communications are secured
              by the Paloma validator network-set. For example, developers may
              write programs on any EVM chain to control contracts running on
              any other blockchain including Solana or Polygon, or Cosmos-SDK
              chain
            </p>
          </div>
          <div className="home-page-image">
            <img src="/assets/home/diagram-2.png" />
          </div>
        </div>

        <div className="home-page-propositions">
          <span className="subtitle">Paloma Value Propositions</span>
          <div className="title">send messages quickly & safely</div>
          <div className="home-proposition-list">
            <div className="home-proposition-item">
              <img src="/assets/home/fast.png" />
              <h3>Fast</h3>
              <p>
                Paloma validators known as Pigeons manage nodes on each target
                chain with the best datacenter architecture, ensuring fast
                consensus of any target blockchain state. All validators must be
                fast relayers or have their stake slashed.
              </p>
            </div>
            <div className="home-proposition-item">
              <img src="/assets/home/secure.png" />
              <h3>Secure</h3>
              <p>
                Paloma uses the Cosmos Gravity validator set security model.
                Messages on each target chain are secured by the signatures of
                175 validator nodes. Paloma pigeons act as watchers across all
                supported chains, ready to slash stake at security model
                failures.
              </p>
            </div>
            <div className="home-proposition-item">
              <img src="/assets/home/gas-fee.png" />
              <h3>Gas Fee Oracles</h3>
              <p>
                Paloma gas fee management is a decentralized gas fee oracle
                providing gas fee pricing on all target chains. Paloma
                developers can predict and assess gas costs, on any target
                blockchain, from within Paloma. Paloma validators are
                compensated for gas fee management from the usage of the gas fee
                oracle.
              </p>
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
            <span className="pink">Send Cross Chain Messages</span>
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
            <a href="" className="home-page-button" style={{ width: "100%" }}>
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
            <span className="pink">Mint a Paloma Egg</span>
            <h2>Build a Limit</h2>
            <h2>Order Bot</h2>
            <p>
              we deliver a GAME-CHANGER bLOCKCHAIN FOR DEVELOPERS. our protocol
              was built from developers to developers. Easy to use, easy to
              love. Get startet now!
            </p>
            <a href="" className="home-page-button" style={{ width: "100%" }}>
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
              <div className="title">Send your Message</div>
              <p>
                Send your Ethereum message payload with a simple command line
                entry on Paloma. Pay for gas in Grains or ETH on the command
                line. Let fly!
              </p>
            </div>

            <div className="home-how-item second">
              <img className="pigeon" src="/assets/home/pigeon.png" />
              <div className="number">2.</div>
              <div className="title">Confirm Message State</div>
              <p>
                Write and deploy a Cosmwasm contract on Paloma to confirm the
                message state and release a new message with gas fees.
              </p>
            </div>

            <div className="home-how-item third">
              <div className="number">3.</div>
              <div className="title">Send Another Message</div>
              <p>
                Use Paloma to determine when to fire the next message to the
                pigeons. Pay gas in GRAINS or ETH.
              </p>
              <a href="" className="home-page-button" style={{ width: "100%" }}>
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
