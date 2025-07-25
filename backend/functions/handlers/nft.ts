import * as functions from 'firebase-functions';
import { ethers } from 'ethers';

// Configurações do contrato e provider (ajuste para seu ambiente)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY as string;
const wallet = new ethers.Wallet(privateKey, provider);
const nftAbi = [
  'function mint(address to, string memory tokenURI) public returns (uint256)',
  'function transferFrom(address from, address to, uint256 tokenId) public',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
];
const nftAddress = process.env.NFT_CONTRACT_ADDRESS as string;
const nftContract = new ethers.Contract(nftAddress, nftAbi, wallet) as {
  mint?: (to: string, tokenURI: string) => Promise<any>;
  transferFrom?: (from: string, to: string, tokenId: string) => Promise<any>;
  tokenURI?: (tokenId: string) => Promise<string>;
  ownerOf?: (tokenId: string) => Promise<string>;
};

// Mint NFT
export const mintNFT = functions.https.onCall(async (data: { to: string; tokenURI: string }) => {
  const { to, tokenURI } = data;
  if (!to || !tokenURI)
    throw new functions.https.HttpsError('invalid-argument', 'to e tokenURI são obrigatórios');
  if (!nftContract.mint)
    throw new functions.https.HttpsError('internal', 'Método mint não disponível no contrato');
  const tx = await nftContract.mint(to, tokenURI);
  const receipt = await tx.wait();
  const event = receipt.logs.find((log: any) => log.fragment?.name === 'Transfer');
  const tokenId = event?.args?.tokenId?.toString() || null;
  return { txHash: tx.hash, tokenId };
});

// Transfer NFT
export const transferNFT = functions.https.onCall(
  async (data: { from: string; to: string; tokenId: string }) => {
    const { from, to, tokenId } = data;
    if (!from || !to || !tokenId)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'from, to e tokenId são obrigatórios',
      );
    if (!nftContract.transferFrom)
      throw new functions.https.HttpsError(
        'internal',
        'Método transferFrom não disponível no contrato',
      );
    const tx = await nftContract.transferFrom(from, to, tokenId);
    await tx.wait();
    return { txHash: tx.hash };
  },
);

// Query NFT
export const getNFT = functions.https.onCall(async (data: { tokenId: string }) => {
  const { tokenId } = data;
  if (!tokenId) throw new functions.https.HttpsError('invalid-argument', 'tokenId é obrigatório');
  if (!nftContract.ownerOf || !nftContract.tokenURI)
    throw new functions.https.HttpsError(
      'internal',
      'Métodos ownerOf ou tokenURI não disponíveis no contrato',
    );
  const owner = await nftContract.ownerOf(tokenId);
  const uri = await nftContract.tokenURI(tokenId);
  return { owner, tokenId, tokenURI: uri };
});
