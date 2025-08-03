/** 
  * Avaliação inteligente de NFT (DeFi/Agro) usando floor price, liquidez, raridade, e oráculos. 
  * Modular para usar Chainlink, OpenSea ou API interna. 
  */ 
 
 import { getFloorPrice, getMarketSales } from "../services/oracle"; 
 import { fetchRarity } from "../services/nft-rarity"; 
 
 export type NFT = { 
   collection: string; 
   tokenId: string; 
   address: string; 
 }; 
 
 /** 
  * Estima valor de um NFT, ponderando floor, vendas, e raridade (pronto para DApp DeFi real). 
  */ 
 export async function estimateNFTValue(nft: NFT): Promise<number> { 
   const [floor, recentSales, rarity] = await Promise.all([ 
     getFloorPrice(nft.collection, nft.address), 
     getMarketSales(nft.collection, nft.tokenId), 
     fetchRarity(nft.collection, nft.tokenId) 
   ]); 
   // Média ponderada e ajuste por raridade 
   const salesAvg = recentSales.length ? recentSales.reduce((a, b) => a + b, 0) / recentSales.length : floor; 
   const rarityBonus = rarity.rank <= 10 ? 2 : rarity.rank <= 100 ? 1.25 : 1; 
   return Math.round((salesAvg + floor) / 2 * rarityBonus); 
 }