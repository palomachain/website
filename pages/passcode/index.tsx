import PasscodeInput from 'components/PasscodeInput';
import { StaticLink } from 'configs/links';
import useCookie from 'hooks/useCookie';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import style from './passcode.module.scss';

const Passcode = () => {
  const router = useRouter();
  const { invitationCode } = useCookie();

  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const redirect = params.get('redirect');
  const type = params.get('type');
  const promocode = params.get('code');

  const [loading, setLoading] = useState(false);
  const [passcodeValue, setPasscodeValue] = useState<(string | number)[]>(['', '', '', '']);

  const checkCode = async (code: (string | number)[]) => {
    if (isAvailableCode) {
      const result = await invitationCode(code);
      if (result.success) {
        let redirectUrl = '';
        if (redirect) redirectUrl = redirectUrl + `redirect=${redirect}`;
        if (type) redirectUrl = redirectUrl.concat(redirectUrl.length > 0 ? '&' : '') + `type=${type}`;
        if (promocode) redirectUrl = redirectUrl.concat(redirectUrl.length > 0 ? '&' : '') + `code=${promocode}`;
        router.push(`${StaticLink.PURCHASE}?${redirectUrl}`);
      } else {
        toast.error('Invalid Code');
        setPasscodeValue(['', '', '', '']);
      }
    }
  };

  useEffect(() => {
    const isEmpty = passcodeValue.findIndex((value) => value === '');
    if (isEmpty < 0) {
      setLoading(true);
      const delayDebounceFn = setTimeout(async () => {
        await checkCode(passcodeValue);
        setLoading(false);
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [passcodeValue]);

  const isAvailableCode = useMemo(() => {
    return passcodeValue.filter((value) => value === '').length === 0;
  }, [passcodeValue]);

  return (
    <div className={style.container}>
      <div className={style.cardWrapper}>
        <img className={style.logo} src="/assets/logo/paloma-black.png" />
        <h2 className={style.title}>Paloma LightNode Sale</h2>
        <h4 className={style.description}>Enter your 4 digit code to enter the website</h4>
        <div className={style.inputs}>
          {loading ? (
            <img src="/assets/icons/loading_circle.svg" height="62px" />
          ) : (
            <PasscodeInput passcodeValue={passcodeValue} setPasscodeValue={setPasscodeValue} />
          )}
        </div>
        <p>Already Purchased?</p>
        <p className={style.activate} onClick={() => router.push(StaticLink.ACTIVATE)}>
          Activate your node here
        </p>
      </div>
    </div>
  );
};

export default Passcode;
