import EcosystemSection from "./ecosystemSection";
import FeaturesSection from "./featuresSection";
import GrainTokenSection from "./grainTokenSection";
import HowToJoinSection from "./howToJoinSection";
import HowToRelayRewardsSection from "./howToRelayRewardsSection";
import HowToWorkSection from "./howToWorkSection";
import InvestorSection from "./investorSection";
import LightNodeSection from "./lightnodeSection";
import NodeSaleSection from "./nodesaleSection";
import SubscriptionSection from "./subscriptionSection";
import TeamsSection from "./teamsSection";
import TopicSection1 from "./topic1Section";
import TopicSection2 from "./topic2Section";
import TopicSection3 from "./topic3Section";
import TopicSection4 from "./topic4Section";
import VolumesSection from "./volumesSection";
import WhatIsPalomaSection from "./whatisPalomaSection";
import TokenomicsSection from "./tokenomicsSection";
import RewardCalculatorSection from "./rewardCalculatorSection";

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
    {/* <RewardCalculatorSection /> */}
  </div>
);

export default lightnode;
