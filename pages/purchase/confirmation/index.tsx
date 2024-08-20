import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLazyGetRegisterConfirmationQuery } from 'services/api/nodesale';

import style from './confirmation.module.scss';

const Confirmation = () => {
  const router = useRouter();
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const token = params.get('token');

  const [getConfirmation] = useLazyGetRegisterConfirmationQuery();

  useEffect(() => {
    const confirm = async () => {
      const confirmResult = await getConfirmation({ token: token });
      if (confirmResult.isSuccess) {
        toast.success('Successfully confirmed your Email.');
        router.push(StaticLink.DOWNLOAD);
      } else {
        toast.error('Invalid token.');
        router.push(StaticLink.REGISTER);
      }
    };
    confirm();
  }, [token]);

  return <img src="/assets/icons/confirm-email.svg" alt="confirm-email" className={style.loadingImg} />;
};

export default Confirmation;
