import { useStaking } from '../hooks/useStaking';
import { useWallet } from '../hooks/useWallet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast, { ToastProps } from './Toast';

export default function StakingCard() {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const { account } = useWallet(setToast);
  const { stake, unstake, balance } = useStaking(account);
  const [amount, setAmount] = useState('');
  const { t } = useTranslation();

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center">
      {/* Staking Farming Neon Premium */}
      <picture>
        <source srcSet="/assets/img/staking-farming-neon.png" type="image/png" />
        <img
          src="/assets/img/staking-farming-neon.png"
          alt="AGROTM Staking Farming Neon"
          title="Staking Farming Neon - AGROTM"
          className="w-full max-w-xs rounded-xl mb-6 shadow-lg object-cover animate-fade-in"
          loading="lazy"
        />
      </picture>
      <div className="mb-4 text-white/80">
        {t('staking_balance', 'Seu saldo em staking')}:{' '}
        <span className="text-primary">{balance}</span>
      </div>
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 px-4 py-2 rounded-xl bg-background text-primary border border-primary focus:outline-none"
        placeholder={t('amount', 'Quantidade')}
      />
      <div className="flex gap-4">
        <button
          onClick={() => stake(amount)}
          className="px-6 py-2 bg-primary text-black rounded-xl font-futuristic shadow-neon hover:bg-accent transition-all"
        >
          {t('stake', 'Stake')}
        </button>
        <button
          onClick={() => unstake(amount)}
          className="px-6 py-2 bg-background text-primary border border-primary rounded-xl font-futuristic hover:bg-primary hover:text-black transition-all"
        >
          {t('unstake', 'Unstake')}
        </button>
      </div>
    </div>
    {toast && <Toast {...toast} />}
  );
}
