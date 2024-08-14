import { setCookie } from 'cookies-next';

const Ignore = () => {
  setCookie('ignore', 'true', { maxAge: 60 * 60 * 24 * 7 * 10000 });

  return <div>Ignore</div>;
};

export default Ignore;
