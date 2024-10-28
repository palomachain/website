import { PURCHASED_WALLET, USER_ACCESS_TOKEN } from 'configs/constants';
import { StaticLink } from 'configs/links';
import useCookie from 'hooks/useCookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useLazyGetLoginConfirmationQuery,
  useLazyGetRegisterConfirmationQuery,
  usePostAddAddrMutation,
} from 'services/api/nodesale';

import style from './confirmation.module.scss';
import { checksumAddress } from 'utils/string';

const Confirmation = () => {
  const router = useRouter();
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const token = params.get('token');
  const redirect = params.get('redirect');
  const type = params.get('type');

  const { getStoredData, storeData } = useCookie();
  const [getRegisterConfirmation] = useLazyGetRegisterConfirmationQuery();
  const [getLoginConfirmation] = useLazyGetLoginConfirmationQuery();
  const [postAddAddr] = usePostAddAddrMutation();

  useEffect(() => {
    if (token) {
      const isRegister = redirect.includes('login') ? false : true;
      const confirm = async () => {
        const confirmResult = isRegister
          ? await getRegisterConfirmation({ token: token })
          : await getLoginConfirmation({ token: token });
        if (confirmResult.isSuccess) {
          const purchasedWallet = await getStoredData(PURCHASED_WALLET);
          if (purchasedWallet.data) {
            await postAddAddr({ addr: checksumAddress(purchasedWallet.data), token });
          }
          // Store user access token to cookie
          await storeData(USER_ACCESS_TOKEN, token);

          toast.success('Successfully confirmed your Email.', { toastId: 'confirmed-email-alert' });
          router.push(redirect ? (type ? `${redirect}?type=${type}` : redirect) : StaticLink.INSTRUCTIONS);
        } else {
          toast.error('Invalid token.');
          router.push(StaticLink.REGISTER);
        }
      };
      confirm();
    }
  }, [token, redirect]);

  return <img src="/assets/icons/confirm-email.svg" alt="confirm-email" className={style.loadingImg} />;
};

export default Confirmation;
