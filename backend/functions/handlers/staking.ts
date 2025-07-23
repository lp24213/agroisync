import * as functions from 'firebase-functions';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY as string;
const wallet = new ethers.Wallet(privateKey, provider);
const stakingAbi = [
  'function stake(uint256 amount) public',
  'function unstake(uint256 amount) public',
  'function stakedBalance(address user) public view returns (uint256)',
];
const stakingAddress = process.env.STAKING_CONTRACT_ADDRESS as string;
const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, wallet);

// Stake
export const stake = functions.https.onCall(async (data, context) => {
  const { amount } = data;
  if (!amount) throw new functions.https.HttpsError('invalid-argument', 'amount é obrigatório');
  const tx = await stakingContract.stake(ethers.parseUnits(amount, 18));
  await tx.wait();
  return { txHash: tx.hash };
});

// Unstake
export const unstake = functions.https.onCall(async (data, context) => {
  const { amount } = data;
  if (!amount) throw new functions.https.HttpsError('invalid-argument', 'amount é obrigatório');
  const tx = await stakingContract.unstake(ethers.parseUnits(amount, 18));
  await tx.wait();
  return { txHash: tx.hash };
});

// Query staked balance
export const getStaked = functions.https.onCall(async (data, context) => {
  const { user } = data;
  if (!user) throw new functions.https.HttpsError('invalid-argument', 'user é obrigatório');
  const balance = await stakingContract.stakedBalance(user);
  return { user, balance: balance.toString() };
}); 