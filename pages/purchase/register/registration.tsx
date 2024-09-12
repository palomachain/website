import ConfirmationModal from 'components/Modal/ConfirmationModal';
import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { usePostRegisterMutation } from 'services/api/nodesale';
import { isValidEmail, isValidName } from 'utils/common';

import style from './registration.module.scss';

const RegisterFlow = () => {
  const router = useRouter();
  const [postRegister] = usePostRegisterMutation();
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const redirect = params.get('redirect');
  const type = params.get('type');

  const [fullname, setFullname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const isValid = useMemo(() => {
    if (fullname.length > 0 && email.length > 0) {
      return isValidName(fullname) && isValidEmail(email);
    }
    return false;
  }, [fullname, email]);

  const returnRegisterText = useMemo(() => {
    if (fullname.length > 0 && !isValidName(fullname)) {
      return 'Input Valid Full Name';
    } else if (email.length > 0 && !isValidEmail(email)) {
      return 'Input Valid Email';
    }
    return 'Register';
  }, [fullname, email]);

  const handleRegister = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);
      const callApi = await postRegister({
        email: email,
        username: fullname,
        redirect: redirect ? (type ? `${redirect}&type=${type}` : redirect) : StaticLink.INSTRUCTIONS,
      });

      if (!callApi.error) {
        setConfirm(true);
      } else {
        if (callApi?.error['data']['msg'].includes('already exists')) {
          toast.info('We already sent a confirmation email to your email address. Please confirm your email.');
        }
      }
    } catch (error) {
      console.log(error);
      if (error?.includes('already exists') || error?.msg?.includes('already exists')) {
        toast.info('We already sent a confirmation email to your email address. Please confirm your email.');
      } else {
        toast.error('Failed! Please try again...');
      }
    }
    setLoading(false);
  };

  return (
    <div className={style.container}>
      <div className={style.back} onClick={() => router.push(StaticLink.PURCHASE)}>
        <img src="/assets/icons/back.svg" alt="back" /> Registration for LightNode Software Support.
      </div>
      <h3>Full Name</h3>
      <input value={fullname} placeholder="Full Name" onChange={(e) => setFullname(e.target.value)} />
      <h3>Email</h3>
      <input value={email} placeholder="name@contact.com" onChange={(e) => setEmail(e.target.value)} />
      <button disabled={!isValid} onClick={handleRegister} className={isValid ? undefined : style.disableBtn}>
        {loading ? (
          <img src="/assets/icons/loading_circle.svg" width={24} alt="loading" style={{ margin: 'auto' }} />
        ) : (
          returnRegisterText
        )}
      </button>
      {confirm && <ConfirmationModal email={email} setConfirm={setConfirm} />}
    </div>
  );
};

export default RegisterFlow;
