import useCookie from 'hooks/useCookie';
import { useEffect, useState } from 'react';
import Describe from './describe';
import PurchaseFlow from './flow';

const Purchase = () => {
  const { isAlreadyPassedCode } = useCookie();
  const [loading, setLoading] = useState(true);

  const checkAlreadyPassedCode = async () => {
    const date = await isAlreadyPassedCode();
    date !== 0 && setLoading(false);
  };

  useEffect(() => {
    checkAlreadyPassedCode();
  }, []);

  return loading ? (
    <div style={{ height: '100vh' }}></div>
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
