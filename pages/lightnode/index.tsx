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
import TopicSection1 from "./topicSection";
import TopicSection2 from "./topic2Section";
import TopicSection3 from "./topic3Section";
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
    <EcosystemSection />
    <TopicSection1 />
    <InvestorSection />
    <TopicSection2 />
    <GrainTokenSection />
    <TeamsSection />
    <TopicSection3 />
    <SubscriptionSection />
  </div>
);

export default lightnode;
