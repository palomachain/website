import classNames from 'classnames';
import ConfirmationModal from 'components/Modal/ConfirmationModal';
import { StaticLink } from 'configs/links';
import { useWallet } from 'hooks/useWallet';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { usePostLoginMutation } from 'services/api/nodesale';
import { isValidEmail } from 'utils/common';

import style from './login.module.scss';

const Login = () => {
  const { connectMetaMask, connectWalletConnect, wallet } = useWallet();
  const router = useRouter();
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const redirect = params.get('redirect');
  const type = params.get('type');

  const [postLogin] = usePostLoginMutation();

  const [loadingMetamask, setLoadingMetamask] = useState(false);
  const [loadingWalletconnect, setLoadingWalletconnect] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleChooseMetamask = async () => {
    if (!loadingMetamask) {
      setLoadingMetamask(true);
      const isConnectedWallet = await connectMetaMask();
      !isConnectedWallet && setLoadingMetamask(false);
    }
  };

  const handleChooseWalletConnect = async () => {
    if (!loadingWalletconnect) {
      setLoadingWalletconnect(true);
      await connectWalletConnect();
      setLoadingWalletconnect(false);
    }
  };

  const onClickLogin = async () => {
    if (!loadingLogin && isValidEmail(email)) {
      try {
        setLoadingLogin(true);
        const result = await postLogin({
          email,
          redirect: redirect ? (type ? `${redirect}&type=${type}_login` : redirect) : StaticLink.BUYMOREBOARD,
        });

        if (result.error && result.error['status'] === 400 && result.error['data']['msg'].includes('not found')) {
          setNotRegistered(true);
        } else if (!result.error) {
          setConfirm(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
    setLoadingLogin(false);
  };

  return (
    <section className={style.container}>
      <div className={style.walletModal}>
        <h1 className={style.title}>Login</h1>
        <p>
          New?{' '}
          <span
            className={style.register}
            onClick={() => router.push(`${StaticLink.REGISTER}?redirect=${redirect}&type=${type}_register`)}
          >
            Create an Account
          </span>
        </p>
        {notRegistered && <p className={style.notRegistered}>The e-mail address you specified is not correct.</p>}
        <h3 className={style.palomaAddress}>Email</h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={style.inputWallet}
          placeholder="name@contact.com"
        />
        <button
          className={classNames(style.activateBtn, !isValidEmail(email) ? style.invalid : undefined)}
          onClick={onClickLogin}
        >
          {loadingLogin ? (
            <img src="/assets/icons/loading_circle.svg" height="33px" style={{ marginTop: 5, marginLeft: 6 }} />
          ) : (
            'Log in'
          )}
        </button>

        {/* <div className={style.walletBtns}>
          <p className={style.chooseWallet}>Or</p>
          <Button className={style.connectWalletBtn} type="grey" onClick={() => handleChooseMetamask()}>
            {loadingMetamask ? (
              <img src="/assets/icons/loading_circle.svg" height="33px" style={{ marginTop: 5, marginLeft: 6 }} />
            ) : (
              <img src="/assets/wallets/metamask.svg" alt="" />
            )}
          </Button>
          <Button className={style.connectWalletBtn} type="grey" onClick={() => handleChooseWalletConnect()}>
            {loadingWalletconnect ? (
              <img src="/assets/icons/loading_circle.svg" height="33px" style={{ marginTop: 5, marginLeft: 6 }} />
            ) : (
              <img src="/assets/wallets/walletconnect.svg" alt="" />
            )}
          </Button>
        </div> */}
      </div>
      {confirm && <ConfirmationModal email={email} setConfirm={setConfirm} />}
    </section>
  );
};

export default Login;
