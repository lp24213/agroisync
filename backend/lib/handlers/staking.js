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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaked = exports.unstake = exports.stake = void 0;
const functions = __importStar(require("firebase-functions"));
const ethers_1 = require("ethers");
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
const stakingAbi = [
    'function stake(uint256 amount) public',
    'function unstake(uint256 amount) public',
    'function stakedBalance(address user) public view returns (uint256)',
];
const stakingAddress = process.env.STAKING_CONTRACT_ADDRESS;
const stakingContract = new ethers_1.ethers.Contract(stakingAddress, stakingAbi, wallet);
// Stake
exports.stake = functions.https.onCall(async (data) => {
    const { amount } = data;
    if (!amount)
        throw new functions.https.HttpsError('invalid-argument', 'amount é obrigatório');
    if (!stakingContract.stake)
        throw new functions.https.HttpsError('internal', 'Método stake não disponível no contrato');
    const tx = await stakingContract.stake(ethers_1.ethers.parseUnits(amount, 18));
    await tx.wait();
    return { txHash: tx.hash };
});
// Unstake
exports.unstake = functions.https.onCall(async (data) => {
    const { amount } = data;
    if (!amount)
        throw new functions.https.HttpsError('invalid-argument', 'amount é obrigatório');
    if (!stakingContract.unstake)
        throw new functions.https.HttpsError('internal', 'Método unstake não disponível no contrato');
    const tx = await stakingContract.unstake(ethers_1.ethers.parseUnits(amount, 18));
    await tx.wait();
    return { txHash: tx.hash };
});
// Query staked balance
exports.getStaked = functions.https.onCall(async (data) => {
    const { user } = data;
    if (!user)
        throw new functions.https.HttpsError('invalid-argument', 'user é obrigatório');
    if (!stakingContract.stakedBalance)
        throw new functions.https.HttpsError('internal', 'Método stakedBalance não disponível no contrato');
    const balance = await stakingContract.stakedBalance(user);
    return { user, balance: balance.toString() };
});
