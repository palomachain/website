import BuildSection from './buildSection';
import DescribeCardSection from './describeCardSection';
import EcosystemSection from './ecosystemSection';
import NodeSaleLinksSection from './nodeSaleLinksSection';
import StartSection from './startSection';
import UseCaseSection from './useCaseSection';

const newLandingPage = () => (
  <div className="page-container light-node-sale newLanding-container">
    <StartSection />
    <EcosystemSection />
    <DescribeCardSection />
    <UseCaseSection />
    <BuildSection />
    <NodeSaleLinksSection />
  </div>
);

export default newLandingPage;
