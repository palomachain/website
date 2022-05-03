export function getEtherscan(hash, network = 1, type = 'tx') {
  if (network === 1) {
    return `https://etherscan.io/${type}/${hash}`
  } else if (network === 4) {
    return `https://rinkeby.etherscan.io/${type}/${hash}`
  }
}
