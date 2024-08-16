import { envParam } from 'configs/constants';
import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import { NodeSaleStartDate } from 'utils/constants';

const cookies = new Cookies();

const usePasscode = () => {
  const router = useRouter();
  const invitationCode = async (code: (string | number)[]) => {
    try {
      const myCode = code.toString().replaceAll(',', '');
      const time = Date.now() + 60 * 60 * 1000; // until 1 hour from now

      // TODO: check api with myCode
      if (myCode === envParam.PASSCODE.toString()) {
        // Set cookie for passcode
        cookies.set(
          'passcode',
          {
            isPassed: true,
            expiresTime: new Date(time),
          },
          {
            expires: new Date(time),
            path: '/',
          },
        );

        return { success: true, time: time };
      } else return { success: false, time: 0 };
    } catch (error) {
      console.error(error);
      return { success: false, time: 0 };
    }
  };

  const isAlreadyPassedCode = async () => {
    let date = 0;

    try {
      console.log('date', Date.now());

      if (Date.now() >= NodeSaleStartDate) {
        date = Date.now();
      } else {
        // Load passcode cookie
        const walletFromCookie = await cookies.get('passcode');
        if (walletFromCookie && walletFromCookie.isPassed) {
          const expireTime = new Date(walletFromCookie.expiresTime).getTime();
          if (expireTime > Date.now()) date = expireTime;
        }
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      if (date === 0) router.push(StaticLink.PASSCODE);
      return date;
    }
  };

  return { invitationCode, isAlreadyPassedCode };
};

export default usePasscode;
