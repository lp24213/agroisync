'use client';
import { useWallet } from '../hooks/useWallet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast, ToastProps } from './Toast';

export default function MintNFT() {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const { connectWallet, account } = useWallet(setToast);
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
      setToast({
        message: t('mint_error', 'Erro ao mintar NFT: ') + msg,
        type: 'error',
        onClose: () => setToast(null),
      });
    }
    setMinting(false);
  }

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center">
      {/* NFT Minting Neon Premium */}
      <picture>
        <source srcSet="/assets/img/nft-minting-neon.png" type="image/png" />
        <img
          src="/assets/img/nft-minting-neon.png"
          alt="NFT Minting AGROTM Neon"
          title="NFT Minting - AGROTM"
          className="w-full max-w-xs rounded-xl mb-6 shadow-lg object-cover animate-fade-in"
          loading="lazy"
        />
      </picture>
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
