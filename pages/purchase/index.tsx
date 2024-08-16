import usePasscode from 'hooks/usePasscode';
import { useEffect, useState } from 'react';
import Describe from './describe';
import PurchaseFlow from './flow';

const Purchase = () => {
  const { isAlreadyPassedCode } = usePasscode();
  const [loading, setLoading] = useState(true);

  const checkAlreadyPassedCode = async () => {
    await isAlreadyPassedCode();
    setLoading(false);
  };

  useEffect(() => {
    checkAlreadyPassedCode();
  }, []);

  return loading ? (
    <></>
  ) : (
    <div className="page-container light-node-sale">
      <div className=" purchase-flow-page">
        <Describe />
        <PurchaseFlow />
      </div>
    </div>
  );
};

export default Purchase;
