import Purchase from 'components/Button/purchase';
import React, { useState } from 'react';

const whatisPalomaSection = () => (
  <section className="what-is-paloma-section">
    <div className="what-is">
      <div className="what-is-paloma">
        <h1>WHAT IS PALOMA?</h1>
        <p>
          Paloma is decentralized blockchain computing middleware for web2.0 developers that want to interact with 
          multiple blockchain states rapidly and securely. Paloma delivers native and reliable blockchain interoperability 
          focused on web2.0 developers. These developers want familiar interfaces that include APIs, SDKs, that deliver 
          responsiveness and speed, without sacrificing security and capabilities. Paloma is a blockchain network of 
          computers and validators optimized to deliver these features with the highest throughput and at the lowest 
          possible cost and latency.
        </p>
        <Purchase className="mt-40" />
      </div>
      <img src="/assets/home/pigeons-fly-2.png" />
    </div>
    <div className="describe-card">
      <div>
        <h2 className="h-white">
          the problem:<br></br>Blockchain interoperability<br></br>for Web2.0 Developers
        </h2>
        <span className="p-white-50 mt-20">
          Blockchain interoperability is a substantial challenge for web3.0 developers who now have multiple 
          L1, L2, L3 blockchain states to program. For web2.0 developers, this is an even greater challenge 
          and limits the ability for web2.0 developers to take advantage of blockchain technologies and the 
          communities that hold liquidity on these chains. Web2.0 developers need familiar tooling that makes 
          it easy to interact with multiple blockchain states simultaneously as well as with familiar tools 
          that abstract away cryptography, distributed computing, and distributed storage complexity.
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
        <h2>Paloma</h2>
        <span className="mt-20">
          To solve this problem, Paloma delivers Blockchain Computing Middleware for Web2.0 developers to 
          build Web2.0 applications that can interact with any Web3.0 blockchain protocol. 
          <br />
          <br />
           Paloma is a protocol where validators and lightnodes perform vital roles for developers. 
           They secure the computing layer that interacts with target blockchains. 
           They also manage message communications between Web 2.0 applications and Web3.0 protocols. 
          <br />
          <br />
          Paloma validators also manage storage of off-chain data that Web2.0 applications need to 
          interact with Web3.0 smart contracts. Paloma simplifies the management of Web3.0 smart contracts 
          across multiple chains by abstracting away complex deployment and communications issues across different chains. 
          <br />
          Paloma provides security that developers expect to ensure that their applications are able to function reliably.
        </span>
        <Purchase className="mt-40" />
      </div>
    </div>
    <div className="describe-card">
      <div>
        <h2 className="h-white">the validator and light-node active set</h2>
        <span className="p-white-50 mt-20">
          Paloma validators, also known as pigeons, validate and secure blockchain state. 
          Paloma LightNodes manage delegation of stake across all validators to ensure blockchain 
          interopability across all Paloma target chains.  Validators on Paloma must all support 
          each target chain voted into governance, ensuring that there is infrastructure to 
          deliver computing middleware services on all target blockchains. Web2.0 developers 
          have an expectation of performance that Paloma has abstracted away as a concern. 
          <br />
          <br />
          If Paloma validators and Lightnodes do not meet interoperability and security 
          performance requirements, they are either jailed or their stake unbonded. 
          This aims to allow Paloma to become a trusted and reliable developer platform for Web2.0 
          developers that demand performance guarantees.
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
          blockchain computing middleware
        </h2>
        <span className="mt-20">
          Paloma aims to provide the fastest middleware that allows Web2.0 developers to deploy secure and successful 
          web3 applications against the entire public blockchain ecosystem. Paloma focuses on three main areas:
          <br />
          <br />
          Automated Interoperability: Allowing any Web2.0 developer to deliver end-to-end software applications that work seamlessly 
          against any target chain and between target chains with native automation response to state transitions. 
          <br />
          <br />
          Off-chain Data: Paloma Pigeons and LightNodes manage Web2.0 API endpoints that communicate off-chain data, 
          but still require onchain consensus. 
          <br />
          <br />
          Gas Oracle: Pigeons will price in the gas price risks, so developers will have dependable message delivery 
          costs analysis for any target chain and any message size.
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
