import Purchase from 'components/Button/purchase';
import React, { useState } from 'react';

const whatisPalomaSection = () => (
  <section className="what-is-paloma-section">
    <div className="what-is">
      <div className="what-is-paloma">
        <h1>
          WHAT IS<br></br>PALOMA?
        </h1>
        <p>
          Paloma is a fast, permissionless, Cosmos-SDK blockchain that moves smart-contract messages fast and securely,
          between any other public blockchain with an active RPC endpoint. Paloma is designed for developers who wish to
          manage multi-directional messages between multiple chains in a scalable and secure manner. Blockchain smart
          contracts cannot self-execute state change on the blockchains on which they are deployed. As such, they
          require that state changes, and the accompanying computation of new logic, be sent to the smart contract from
          another state.
        </p>
        <Purchase className="mt-40" />
      </div>
      <img src="/assets/home/pigeons-fly-2.png" />
    </div>
    <div className="describe-card">
      <div>
        <h2 className="h-white">
          the problem:<br></br>Centralization and<br></br>Resource Limits
        </h2>
        <span className="p-white-50 mt-20">
          Today these state changes are commonly run by centralized, custom-designed, closed-source programs,
          human-multisignature key arrangements, or low-end, multi-party computation circuits. The complexity and
          richness of these approaches is limited by the lack of engineering resources and developer-friendly
          environments that encourage sophisticated state and logic-call development.
        </span>
        <Purchase className="purchase-button-white mt-40" />
      </div>
      <img src="/assets/home/pigeon-question-mark.svg" alt="pigeon-question-mark" className="img1" />
    </div>
    <div className="describe-card describe-card-white">
      <div className="flex-row">
        <img src="/assets/home/diagram-111.png" alt="pigeon-question-mark" />
      </div>
      <div>
        <h2>Paloma chain</h2>
        <span className="mt-20">
          To solve this problem, Paloma aims to bring multichain, gas-optimized, MEV-Protected, and scheduled, messages
          managed by a permissionless validator set that manages both chain security and message security.
          <br />
          <br />
          In the Paloma protocol, validators fulfill two crucial roles. They secure the network through the Proof of
          Stake mechanism and also act as Pigeons (Relayers) who relay multi-directional, scheduled messages between
          Paloma and any other supported blockchain.
          <br />
          <br />
          In Paloma, validators are not able to opt-out of message-relay work, without exiting the active-set.
          <br />
          To be a validator on Paloma is to secure fast relay execution on all chains approved by governance.
        </span>
        <Purchase className="mt-40" />
      </div>
    </div>
    <div className="describe-card">
      <div>
        <h2 className="h-white">the validator set</h2>
        <span className="p-white-50 mt-20">
          Since every active validator is also an active Pigeon, all messages are secured through consensus and the
          validators' stake. Validators must run nodes on every Paloma target chain and have the infrastructure and
          available funds to send messages on every chain.
          <br />
          <br />
          If these requirements are not met, validators will be jailed and their stake unbonded. This aligns validators
          interest with builders: to secure messages and deliver them on time on target chains.
        </span>
        <Purchase className="purchase-button-white mt-40" />
      </div>
      <div className="flex-row">
        <img src="/assets/home/pigeon-checked.png" alt="pigeon-checked" className="small-img" />
        <img src="/assets/home/pigeon-checked.png" alt="pigeon-checked" className="big-img" />
        <img src="/assets/home/pigeon-checked.png" alt="pigeon-checked" className="small-img small-img-right" />
      </div>
    </div>
    <div className="describe-card describe-card-white">
      <div className="flex-row">
        <img src="/assets/home/pigeons-fly.png" alt="pigeon-fly" />
      </div>
      <div>
        <h2>
          the fastest
          <br />
          messenger blockchain
        </h2>
        <span className="mt-20">
          Paloma aims to make blockchain messaging ubiquitous and extremely easy for developers. Paloma messages are
          bi-directional and may be repeated or scheduled. Developers can write smart contracts in any language accepted
          by their target blockchain.
          <br />
          <br />
          Developers can control state change logic execution with Paloma's Cosmwasm language. Paloma's gas price oracle
          is unique. Paloma aims to be a decentralized and global gas price oracle. Pigeons observe gas prices and
          provide quotes for message delivery. These quotes include a query or message relay fee for the Pigeon Relayers
          who will execute the message.
          <br />
          <br />
          Pigeons will price in the gas price risks, so developers will have dependable message delivery costs analysis
          for any target chain and any message size.
        </span>
        <div className="btns">
          <button className="purchase-button purchase-button-pink mt-40 row-10">
            <img src="/assets/icons/download.png" alt="download-icon" />
            Download White Paper
          </button>
          <Purchase className="mt-40" />
        </div>
      </div>
    </div>
  </section>
);

export default whatisPalomaSection;
