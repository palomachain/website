import { VETH_ADDRESS } from "contracts/addresses";

export function shorten(val, len = 18) {
  const prior = Math.floor(len * 0.7);
  const suffix = len - prior;
  return `${val.substr(0, prior)}...${val.substr(-suffix)}`;
}

export function prevZero(val, fill = "0", len = 3) {
  return val.toString().padStart(len, fill);
}

export function parseOxString(address: string): `0x${string}` {
  return `0x${address.substring(2)}`;
}

export function parseIntString(val: string, hex = 16) {
  if (val?.includes("0x")) {
    return parseInt(val, hex).toString();
  } else {
    return val;
  }
}

export function parseDexString(val: string, hex = 16) {
  if (val?.includes("0x")) {
    return val;
  } else {
    return `0x${Number(val).toString(hex)}`;
  }
}

export function isSameContract(a: string | `0x${string}`, b: string | `0x${string}` = VETH_ADDRESS) {
  return a.toLowerCase() === b.toLowerCase();
}

export const truncate = (str, n) =>
  str ? (str.length > n ? str.substr(0, n - 1) + "...." : str) : "";
