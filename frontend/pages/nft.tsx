import { useState } from "react";

export default function NFTMint() {
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    setStatus("Mintando...");
    await new Promise(r => setTimeout(r, 2000)); // simulação
    setStatus("NFT mintado com sucesso!");
  };

  return (
    <div>
      <h1>Mint NFT</h1>
      <button onClick={handleMint}>Mintar NFT</button>
      <p>{status}</p>
    </div>
  );
}
