export function getExternalMarketplaces(address) {
  return {
    opensea: `https://opensea.io/assets/ethereum/${address}`,
    rarible: `https://rarible.com/token/${address}`
  }
}