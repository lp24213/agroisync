import React from "react";

const DocsSite = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">AGROTM Documentation</h1>

      <section className="mb-10">
        <h2 className="text-2xl mb-2">🔗 Introduction</h2>
        <p className="text-sm text-gray-300">
          AGROTM is a decentralized crypto project focused on revolutionizing the agribusiness sector through blockchain technology. This documentation provides everything developers and investors need to integrate or understand the AGROTM ecosystem.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl mb-2">📦 Smart Contract</h2>
        <ul className="text-sm text-gray-300 list-disc pl-6">
          <li>Network: Ethereum Mainnet</li>
          <li>Token: AGROTM (AGRTM)</li>
          <li>Contract: <code>0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1</code></li>
          <li>Standard: ERC-20</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl mb-2">🚀 How to Stake</h2>
        <p className="text-sm text-gray-300">
          1. Connect your MetaMask wallet. <br/>
          2. Navigate to the staking section.<br/>
          3. Enter the amount of AGRTM you wish to stake.<br/>
          4. Approve and confirm the transaction.<br/>
        </p>
      </section>

      <footer className="text-xs text-gray-500 mt-20">© 2025 AGROTM. All rights reserved.</footer>
    </div>
  );
};

export default DocsSite;