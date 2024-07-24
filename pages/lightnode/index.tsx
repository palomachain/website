import EcosystemSection from "./ecosystemSection";
import FeaturesSection from "./featuresSection";
import GrainTokenSection from "./grainTokenSection";
import HowToJoinSection from "./howToJoinSection";
import HowToWorkSection from "./howToWorkSection";
import InvestorSection from "./investorSection";
import LightNodeSection from "./lightnodeSection";
import NodeSaleSection from "./nodesaleSection";
import SubscriptionSection from "./subscriptionSection";
import TeamsSection from "./teamsSection";
import TopicSection from "./topicSection";
import VolumesSection from "./volumesSection";
import WhatIsPalomaSection from "./whatisPalomaSection";

const lightnode = () => (
  <div className="page-container lightnode-container">
    <NodeSaleSection />
    <LightNodeSection />
    <WhatIsPalomaSection />
    <HowToJoinSection />
    <HowToWorkSection />
    <FeaturesSection />
    <VolumesSection />
    <EcosystemSection />
    <TopicSection />
    <InvestorSection />
    <GrainTokenSection />
    <TeamsSection />
    <SubscriptionSection />
  </div>
);

export default lightnode;
