import { useState } from "react";

export default function StakePage() {
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState("");

  const handleStake = async () => {
    const reward = amount * 0.15;
    setResult(\`Você stakou \${amount} AGROTM e ganhou \${reward} de recompensa!\`);
  };

  return (
    <div>
      <h1>Stake Tokens</h1>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button onClick={handleStake}>Stake</button>
      <p>{result}</p>
    </div>
  );
}
