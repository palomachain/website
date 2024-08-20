import Modal from 'components/Modal';
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
      const callApi = await postRegister({ email: email, username: fullname });

      if (!callApi.error) {
        setConfirm(true);
      }
    } catch (error) {
      console.log(error);
      if (error?.includes('registered') || error?.msg?.includes('registered')) {
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
      {confirm && (
        <Modal className={style.confirmEmail} contentClassName={style.contentClassName}>
          <img className={style.loadingImage} src="/assets/icons/confirm-email.svg" alt="confirm-email" />
          <h3 className={style.title}>Check your Email</h3>
          <p className={style.text}>
            We emailed a magic link to
            <br />
            <b>{email}</b>
            <br />
            Click the link to confirm your email
          </p>
        </Modal>
      )}
    </div>
  );
};

export default RegisterFlow;
