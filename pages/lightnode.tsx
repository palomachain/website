import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LightNode = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  });

  return <></>;
};

export default LightNode;
