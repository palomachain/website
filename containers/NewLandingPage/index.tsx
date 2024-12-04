import StartSection from './startSection';
import EcosystemSection from './ecosystemSection';
import DescribeCardSection from './describeCardSection';
import UseCaseSection from './useCaseSection';
import BuildSection from './buildSection';
import NodeSaleLinksSection from './nodeSaleLinksSection';

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
