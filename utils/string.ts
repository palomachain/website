import { fromBech32, fromHex, toBech32, toHex } from "@cosmjs/encoding";
import { VETH_ADDRESS, ZERO_ADDRESS_PALOMA } from "contracts/addresses";

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

export function isSameContract(
  a: string | `0x${string}`,
  b: string | `0x${string}` = VETH_ADDRESS
) {
  return a.toLowerCase() === b.toLowerCase();
}

export function truncate(str, n) {
  str ? (str.length > n ? str.substr(0, n - 1) + "...." : str) : "";
}

export function stringToHex(val: string) {
  if (!val) return "";

  var hex = "";
  for (var i = 0, l = val.length; i < l; i++) {
    hex += val.charCodeAt(i).toString(16);
  }

  if (hex.length < 64) {
    hex = "0x" + "0".repeat(64 - hex.length) + hex;
  }

  return hex;
}

export function stringToHexWithBech(val: string) {
  if (!val) return "";

  try {
    let decodeData = toHex(fromBech32(val).data);
    if (decodeData.length < 64) {
      decodeData = "0x" + "0".repeat(64 - decodeData.length) + decodeData;
    }

    return decodeData;
  } catch (error) {
    console.error(error);
    return ZERO_ADDRESS_PALOMA;
  }
}

export function hexToStringWithBech(val: string) {
  if (!val) return "";
  return toBech32("paloma", fromHex(val.slice(-40)));
}

export function convertAddressSlice(address: string | `0x${string}`) {
  return address?.includes("0x") ? address.substring(2) : address;
}

export function parseByte(value: string | number, length: number = 6) {
  const byte = value.toString(16);
  return byte.length >= 6 ? byte : byte.padStart(length, "0");
}

export function shortenString(val: string, prior = 6, suffix = 4) {
  return val && val.length > 10
    ? `${val.slice(0, prior)}...${val.slice(-suffix)}`
    : val;
}
