import { useRouter } from 'next/router';
import style from './registration.module.scss';
import { StaticLink } from 'configs/links';
import { useState } from 'react';

const RegisterFlow = () => {
  const router = useRouter();

  const [fullname, setFullname] = useState<string>();
  const [email, setEmail] = useState<string>();

  const handleRegister = async () => {};

  return (
    <div className={style.container}>
      <div className={style.back} onClick={() => router.push(StaticLink.PURCHASE)}>
        <img src="/assets/icons/back.svg" alt="back" /> Registration for LightNode Software Support.
      </div>
      <h3>Full Name</h3>
      <input value={fullname} placeholder="Full Name" onChange={(e) => setFullname(e.target.value)} />
      <h3>Email</h3>
      <input value={email} placeholder="name@contact.com" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterFlow;
