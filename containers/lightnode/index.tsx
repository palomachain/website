import EcosystemSection from "./ecosystemSection";
import FeaturesSection from "./featuresSection";
import HowToJoinSection from "./howToJoinSection";
import HowToRelayRewardsSection from "./howToRelayRewardsSection";
import HowToWorkSection from "./howToWorkSection";
import LightNodeSection from "./lightnodeSection";
import NodeSaleLinksSection from "./nodeSaleLinksSection";
import NodeSaleSection from "./nodesaleSection";
import RewardCalculatorSection from "./rewardCalculatorSection";
import SubscriptionSection from "./subscriptionSection";
import TeamsSection from "./teamsSection";
import TokenomicsEngineSection from "./tokenomicsEngineSection";
import TokenomicsSection from "./tokenomicsSection";
import TopicSection1 from "./topic1Section";
import TopicSection2 from "./topic2Section";
import TopicSection3 from "./topic3Section";
import TopicSection4 from "./topic4Section";
import TopicSection5 from "./topic5Section";
import TopicSection6 from "./topic6Section";
import VolumesSection from "./volumesSection";
import WhatIsPalomaSection from "./whatisPalomaSection";

const lightnode = () => (
  <div className="page-container lightnode-container">
    <NodeSaleSection />
    <LightNodeSection />
    <WhatIsPalomaSection />
    <HowToJoinSection />
    <HowToWorkSection />
    <TopicSection5 />
    <HowToRelayRewardsSection />
    <FeaturesSection />
    <VolumesSection />
    <TopicSection1 />
    <EcosystemSection />
    <TopicSection2 />
    <TokenomicsSection />
    <TokenomicsEngineSection />
    <TopicSection3 />
    <TeamsSection />
    <TopicSection4 />
    <SubscriptionSection />
    <TopicSection6 />
    <RewardCalculatorSection />
    <NodeSaleLinksSection />
  </div>
);

export default lightnode;
