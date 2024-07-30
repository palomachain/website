const topic1Section = () => (
  <section className="topic-section">
    <div className="topic">
      <p>
      "Nectar is a decentralized delta-hedged stablecoin built on Arbitrum’s GMX. We need
        decentralized custody of users' funds on a fast L2 like Arbitrum. With Paloma, we get a
        low-cost, secure, and fast state transition system. The Paloma SDK is an easy platform for us to deliver new DeFi
        composability and yield. The Paloma validator-set handles our need for decentralized liquidity
        custody, execution and security. Every DeFi app should have a Paloma strategy."
      </p>
      <div className="flex-col gap-8">
        <h3>Sam McCulloch</h3>
        <h3 className="h-black-50">Co-Founder, Nectar</h3>
      </div>
    </div>
    <div className="topic-photo">
      <img src="/assets/topic/topic1.svg" alt="topic-1" />
    </div>
  </section>
);

export default topic1Section;
