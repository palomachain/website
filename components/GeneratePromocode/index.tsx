import { randomNumber, randomString } from 'utils/string';

export const generatePromocode = () => {
  const stringCode = randomString();
  const numberCode = randomNumber();
  if (stringCode && stringCode.length === 4 && numberCode && numberCode.length === 4) {
    return stringCode + numberCode;
  }
  return '';
};
