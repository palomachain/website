import EcosystemSection from "./ecosystemSection";
import FeaturesSection from "./featuresSection";
import GrainTokenSection from "./grainTokenSection";
import HowToJoinSection from "./howToJoinSection";
import HowToRelayRewardsSection from "./howToRelayRewardsSection";
import HowToWorkSection from "./howToWorkSection";
import InvestorSection from "./investorSection";
import LightNodeSection from "./lightnodeSection";
import NodeSaleLinksSection from "./nodeSaleLinksSection";
import NodeSaleSection from "./nodesaleSection";
import RewardCalculatorSection from "./rewardCalculatorSection";
import SubscriptionSection from "./subscriptionSection";
import TeamsSection from "./teamsSection";
import TokenomicsSection from "./tokenomicsSection";
import TopicSection1 from "./topic1Section";
import TopicSection2 from "./topic2Section";
import TopicSection3 from "./topic3Section";
import TopicSection4 from "./topic4Section";
import VolumesSection from "./volumesSection";
import WhatIsPalomaSection from "./whatisPalomaSection";

const lightnode = () => (
  <div className="page-container lightnode-container">
    <NodeSaleSection />
    <LightNodeSection />
    <WhatIsPalomaSection />
    <HowToJoinSection />
    <HowToWorkSection />
    <HowToRelayRewardsSection />
    <FeaturesSection />
    <VolumesSection />
    <TopicSection1 />
    <EcosystemSection />
    <TopicSection2 />
    <TokenomicsSection />
    <InvestorSection />
    <TopicSection3 />
    <GrainTokenSection />
    <TeamsSection />
    <TopicSection4 />
    <SubscriptionSection />
    <RewardCalculatorSection />
    <NodeSaleLinksSection />
  </div>
);

export default lightnode;
