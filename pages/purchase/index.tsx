import useCookie from 'hooks/useCookie';
import { useEffect, useState } from 'react';
import Describe from './describe';
import PurchaseFlow from './flow';
import { useRouter } from 'next/router';
import { StaticLink } from 'configs/links';
import { toast } from 'react-toastify';

const Purchase = () => {
  const { confirmPasscode } = useCookie();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const redirect = params.get('redirect');
  const type = params.get('type');
  const code = params.get('code');

  const checkAlreadyPassedCode = async () => {
    let redirectUrl = '';
    if (redirect) redirectUrl = redirectUrl + `redirect=${redirect}`;
    if (type) redirectUrl = redirectUrl.concat(redirectUrl.length > 0 ? '&' : '') + `type=${type}`;
    if (code) redirectUrl = redirectUrl.concat(redirectUrl.length > 0 ? '&' : '') + `code=${code}`;

    const date = await confirmPasscode(redirectUrl);
    date !== 0 && setLoading(false);
  };

  useEffect(() => {
    checkAlreadyPassedCode();
  }, []);

  // TODO: hide purchase page
  useEffect(() => {
    toast.info('Coming Soon!', { toastId: 'redirect-homepage' });
    router.push(StaticLink.Home);
  }, []);

  return loading ? (
    <div style={{ height: '100vh' }}></div>
  ) : (
    <div className="page-container light-node-sale">
      <div className=" purchase-flow-page">
        {/* <Describe /> */}
        <PurchaseFlow />
      </div>
    </div>
  );
};

export default Purchase;
