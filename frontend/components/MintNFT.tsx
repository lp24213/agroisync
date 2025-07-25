'use client';
import { useWallet } from '../hooks/useWallet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MintNFT() {
  const { connectWallet, account } = useWallet();
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { t } = useTranslation();

  async function handleMint() {
    setMinting(true);
    try {
      const res = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: account }),
      });
      if (!res.ok) throw new Error('Erro ao mintar NFT');
      const data = await res.json();
      setTxHash(data.tx);
    } catch (err: unknown) {
      let msg = '';
      if (err instanceof Error) msg = err.message;
      else if (typeof err === 'string') msg = err;
      else msg = 'Erro desconhecido';
      alert(t('mint_error', 'Erro ao mintar NFT: ') + msg);
    }
    setMinting(false);
  }

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center">
      {!account ? (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-primary rounded-xl font-futuristic text-black hover:bg-accent"
        >
          {t('connect_wallet')}
        </button>
      ) : (
        <>
          <button
            onClick={handleMint}
            className="px-6 py-3 bg-primary rounded-xl font-futuristic text-black hover:bg-accent"
            disabled={minting}
          >
            {minting ? t('minting', 'Mintando...') : t('mint_nft')}
          </button>
          {txHash && (
            <div className="mt-3 text-green-400 text-sm">
              {t('transaction', 'Transação')}:{' '}
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txHash.slice(0, 10)}...
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
