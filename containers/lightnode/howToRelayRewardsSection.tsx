import Purchase from "components/Button/purchase";
import React, { useState } from "react";

const howToRelayRewardsSection = () => (
  <section className="relay-rewards-section">
    <div className="what-is">
      <div className="what-is-paloma">
        <h1>
          How do Paloma
          <br />
          LightNodes Collect
          <br />
          Relay Rewards
        </h1>
        <p>
          The Paloma LightNode is a Paloma blockchain program that secures the Paloma network by
          managing the delegation of stake to the most reliable cross-chain communication
          validators. Those who join the network become a pigeon and will be rewarded with GRAINs as
          their client continues to work each second to keep the Paloma network secure.
        </p>
        <Purchase className="mt-40" />
      </div>
    </div>
    <div className="describe-card mt-40">
      <div>
        <h2>
          “PALOMA LIGHTNODES
          <br />
          PROVIDE STAKING SECURITY...”
        </h2>
        <span className="mt-20">
          Paloma LightNodes provide additional staking security to Paloma’s Cosmos-SDK chain by
          automatically delegating and redelegating GRAIN to the most performant validators.
          Validators with the most uptime and voting activity on the Paloma blockchain are
          considered core to Paloma’s ongoing security.
        </span>
        <Purchase className="mt-40" />
      </div>
      <img src="/assets/home/pigeon-front.svg" alt="pigeon-front" className="img1" />
    </div>
    <div className="describe-card describe-card-white">
      <div className="flex-row">
        <img src="/assets/home/pigeon-work-22.svg" alt="pigeon-work-22" />
      </div>
      <div>
        <h2>“Paloma LightNodes Delegate Vesting GRAINs to Optimal Validators...”</h2>
        <span className="mt-20">
          Paloma LightNodes do the work of delegating their minted GRAINs to the validators with
          highest uptime and to new validators that need stake to establish their nodes on the
          network. Validators that are unable to maintain uptime or have moved on will lose stake
          quickly and automatically.
        </span>
        <Purchase className="mt-40" />
      </div>
    </div>
    <div className="describe-card" style={{ alignItems: "flex-end" }}>
      <div>
        <h2>“LightNodes Earn Staked GRAIN and Cross-Chain Relay Fee Rewards...”</h2>
        <span className="mt-20">
          LightNodes are rewarded with staked GRAIN rewards as well as cross-chain relay fee
          rewards. Staked GRAIN rewards are determined by governance and the amount of stake
          delegated on the network. Currently (as of August 9, 2024), Paloma produces 3% - 7%
          emissions on every block on the Paloma network. However, the cross-chain relay-fee rewards
          are uncapped and unlimited fee rewards collected by Paloma validators for all applications
          executing message relay commands on the Paloma network. The cross-chain relay fee rewards
          are a percentage of the individual validator’s fee rewards.
        </span>
      </div>
      <div className="flex-col">
        <img src="/assets/home/diagram-0.svg" alt="diagram-0" />
        <span className="mt-20">
          Paloma LightNode owners are able to automatically claim their cross-chain relay fee
          rewards via their Paloma LightNode client. LightNode owners do not need to manually
          collect relay free rewards and rewards are only limited to the volume of cross-chain
          communications executed by Paloma validators.
        </span>
        <Purchase className="mt-40" />
      </div>
    </div>
  </section>
);

export default howToRelayRewardsSection;
