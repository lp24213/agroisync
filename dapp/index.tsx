import React, { useState } from "react";

const DappHome = () => {
  const [stakeAmount, setStakeAmount] = useState("");

  const handleStake = () => {
    alert("Staking " + stakeAmount + " AGRTM via MetaMask...");
    // Aqui conectaria com Web3
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">AGROTM Staking Platform</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl mb-4">Stake AGRTM</h2>
          <input
            type="number"
            className="w-full p-2 rounded bg-[#222] text-white mb-3"
            placeholder="Amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <button
            onClick={handleStake}
            className="bg-blue-600 hover:bg-blue-800 transition p-2 rounded w-full"
          >
            Stake Now
          </button>
        </div>

        <div className="bg-[#111] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl mb-2">Your Staking Stats</h2>
          <ul className="text-sm space-y-1">
            <li><strong>Wallet:</strong> 0xYourWallet...</li>
            <li><strong>Staked:</strong> 3,200 AGRTM</li>
            <li><strong>APR:</strong> 18% annually</li>
            <li><strong>Rewards:</strong> 192 AGRTM</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DappHome;