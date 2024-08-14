import Describe from './describe';
import PurchaseFlow from './flow';

const Purchase = () => {
  return (
    <div className="page-container light-node-sale">
      <div className=" purchase-flow-page">
        <Describe />
        <PurchaseFlow />
      </div>
    </div>
  );
};

export default Purchase;
