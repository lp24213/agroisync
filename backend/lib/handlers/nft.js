"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNFT = exports.transferNFT = exports.mintNFT = void 0;
const functions = __importStar(require("firebase-functions"));
const ethers_1 = require("ethers");
// Configurações do contrato e provider (ajuste para seu ambiente)
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
const nftAbi = [
    'function mint(address to, string memory tokenURI) public returns (uint256)',
    'function transferFrom(address from, address to, uint256 tokenId) public',
    'function tokenURI(uint256 tokenId) public view returns (string memory)',
    'function ownerOf(uint256 tokenId) public view returns (address)',
];
const nftAddress = process.env.NFT_CONTRACT_ADDRESS;
const nftContract = new ethers_1.ethers.Contract(nftAddress, nftAbi, wallet);
// Mint NFT
exports.mintNFT = functions.https.onCall(async (data, context) => {
    const { to, tokenURI } = data;
    if (!to || !tokenURI)
        throw new functions.https.HttpsError('invalid-argument', 'to e tokenURI são obrigatórios');
    const tx = await nftContract.mint(to, tokenURI);
    const receipt = await tx.wait();
    const event = receipt.logs.find((log) => log.fragment?.name === 'Transfer');
    const tokenId = event?.args?.tokenId?.toString() || null;
    return { txHash: tx.hash, tokenId };
});
// Transfer NFT
exports.transferNFT = functions.https.onCall(async (data, context) => {
    const { from, to, tokenId } = data;
    if (!from || !to || !tokenId)
        throw new functions.https.HttpsError('invalid-argument', 'from, to e tokenId são obrigatórios');
    const tx = await nftContract.transferFrom(from, to, tokenId);
    await tx.wait();
    return { txHash: tx.hash };
});
// Query NFT
exports.getNFT = functions.https.onCall(async (data, context) => {
    const { tokenId } = data;
    if (!tokenId)
        throw new functions.https.HttpsError('invalid-argument', 'tokenId é obrigatório');
    const owner = await nftContract.ownerOf(tokenId);
    const uri = await nftContract.tokenURI(tokenId);
    return { owner, tokenId, tokenURI: uri };
});
