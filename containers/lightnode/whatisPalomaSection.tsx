import Purchase from 'components/Button/purchase';
import React, { useState } from 'react';

const whatisPalomaSection = () => (
  <section className="what-is-paloma-section">
    <div className="what-is">
      <div className="what-is-paloma">
        <h1>WHAT IS PALOMA?</h1>
        <p>
          Paloma AI is an artificial intelligence upgrade to the Paloma blockchain. 
          Paloma AI unlocks the future of personalized AI, empowering users with their custom AI models, 
          fine-tuned to their unique preferences and needs. Through Paloma's decentralized network, 
          your personal context data is stored securely on Paloma’s LightNodes to power your AI applications. 
          Paloma LightNodes consists of the Paloma client software, Paloma AI API functionality and local data storage. 
          The Paloma LightNode now enables you to have a custom AI with your private data stored locally, 
          on your computer, trained by the content on your computer or via your cloud accounts.
		      <br />
		      <br />
 		      Imagine having an AI that truly knows you—capable of speaking in your voice, 
 		      responding to real-time events, executing agents to complete actions in the real world, 
 		      all powered by your own data. Paloma AI allows you to deploy AI agents and 
 		      AI applications that work for you. Paloma gives you the power to harness advanced 
 		      AI features without compromising control over your identity or security.
        </p>

        <Purchase className="mt-40" />
      </div>
      <img src="/assets/home/pigeons-fly-2.png" />
    </div>
    <div className="describe-card">
      <div>
        <h2 className="h-white">
          the problem:<br></br>We All Need<br></br>Our Own Custom AI
        </h2>
        <span className="p-white-50 mt-20">
          Custom AIs are essential for individuals who want AI models fine-tuned to their personal context. 
          This contextual data includes information unique to you, such as your voice, preferences, and habits. 
          To be truly effective, these AIs need real-time access to this data.
		      <br />
		      <br />
		      However, this raises critical challenges. Storing your personal context data requires global accessibility, 
		      privacy guarantees, and control over your identity. While availability is important, 
		      ensuring that your most intimate data remains secure and private is even more crucial.
		      <br />
		      <br />
		      The best AI services are those tailored to users’ preferences and needs. AI applications can achieve this, 
		      only if they have the necessary data. Unfortunately, no blockchain currently offers the infrastructure needed 
		      to make custom AIs accessible and privacy-protected. Existing blockchains aren’t designed to handle the 
		      personal context data required for AI-powered Web3 applications.
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
        <h2>Paloma: Solving the AI and Blockchain Integration Challenge</h2>
        <span className="mt-20">
          Paloma tackles the challenge of securely integrating AI with blockchain through its innovative LightNode technology. 
          Paloma AI LightNodes are Paloma clients that do not process state, but store off-chain context data that can be 
          utilized by localized applications alongside on-chain LLM API endpoints. 
          Paloma LightNodes aim to enable access to AI models supplied by Paloma’s API layer, 
          but with data services stored locally on the node.
		      <br />
		      <br />
          With Paloma AI, developers can deploy AI-powered Web2.0 and Web3.0 applications that 
          leverage personal user context while ensuring privacy. This approach enables custom AIs 
          to execute blockchain transactions or generate outputs that can be used both on-chain and off-chain. 
          AI agents, which are conditional LLM flows and functions which are stored on Paloma. 
          This allows Paloma smart contracts to host prompts that can be read by LLMs and then execute transactions 
          on any other target smart-contract.
		      <br />
		      <br />
          Paloma validators enhance security by managing on-chain transactions for AIs interacting with target blockchains.
        </span>
        <Purchase className="mt-40" />
      </div>
    </div>
    <div className="describe-card">
      <div>
        <h2 className="h-white">the validator and light-node active set</h2>
        <span className="p-white-50 mt-20">
          Paloma validators, also known as pigeons, validate and secure blockchain state. Paloma AI LightNodes manage
          delegation of stake across all validators to ensure blockchain interopability across all Paloma target chains.
          Validators on Paloma must all support each target chain voted into governance, ensuring that there is
          infrastructure to deliver computing middleware services on all target blockchains. Web2.0 developers have an
          expectation of performance that Paloma has abstracted away as a concern.
          <br />
          <br />
          Paloma AI LightNodes locally store context window data. When a LightNode user wishes to use their Paloma 
          LightNode CustomAI application, the LightNodes access Paloma's API infrastructure to access decentralized LLM APIs 
          provisioned on the Paloma network. 
          <br />
          <br />
          If Paloma validators and Lightnodes do not meet interoperability and security performance requirements, they
          are either jailed or their stake un-bonded. This aims to allow Paloma to become a trusted and reliable
          developer platform for Web2.0 developers that demand performance guarantees.
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
          Paloma provides Blockchain AI Integration and cross-chain message automation that focuses on three main areas:
          <br />
          <br />
          Fast, Automated Interoperability: Allowing any Web2.0 developer to deliver end-to-end software applications that
          work seamlessly against any target chain and between target chains with native automation response to state
          transitions.
          <br />
          <br />
          Native AI & API Integrations: Paloma natively supports automated bots and AI responses to external data 
          and events, enabling developers to create end-to-end AI applications that operate across chains without 
          external intermediaries.
          <br />
          <br />
          Proof of Stake Mining: Paloma AI LightNodes mine GRAIN to maintain Paloma's cross-chain messaging network integrity.
          Lightnodes maintain even stake delegation work to ensure validator power consistency and security.
        </span>
        <div className="btns">
          <button className="purchase-button purchase-button-pink mt-40 row-10">
            <img src="/assets/icons/download.png" alt="download-icon" />
            Download AI Light Paper
          </button>
          <Purchase className="mt-40" />
        </div>
      </div>
    </div>
  </section>
);

export default whatisPalomaSection;
