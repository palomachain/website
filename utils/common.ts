export function toNumber(value, decimal = 12) {
  const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`);
  const val = Number(value.toString().match(regex)[0]);
  return val < 0.1 ** Math.max(decimal - 5, 2) ? 0 : val;
}

export const getWalletAddressEllipsis = (address, head = 6, tail = 4) => {
  return `${address.substring(0, head)}...${address.substring(address.length - tail)}`;
};

const validEmailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const isValidEmail = (email: string) => {
  if (email.match(validEmailRegex)) return true;
  else return false;
};

const validNameRegex = /^[A-zÀ-ÖØ-öø-ÿ]+$/;
export const isValidName = (value: string) => {
  const val = value.trim();
  if (val === '') return false;
  const arr = value.split(' ');
  if (arr.length < 2 || arr.length > 4) return false;
  const [firstName, middleName1, middleName2, lastName] = arr;

  return (
    validNameRegex.test(firstName) &&
    validNameRegex.test(middleName1) &&
    (middleName2 ? validNameRegex.test(middleName2) : true) &&
    (lastName ? validNameRegex.test(lastName) : true)
  );
};

const validPromoCodeRegex = /^[a-zA-Z0-9]+$/;
export const isValidPromoCode = (value: string) => {
  if (value.match(validPromoCodeRegex)) return true;
  else return false;
};
