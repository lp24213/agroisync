'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../../contexts/Web3Context';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface MarketplaceBuyPageProps {
  className?: string;
}

export const MarketplaceBuyPage: React.FC<MarketplaceBuyPageProps> = ({
  className = ''
}) => {
  const { isConnected, publicKey } = useWeb3();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock purchase transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setAmount('');
      alert('Purchase successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`marketplace-buy-page ${className}`}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Buy AGRO Tokens</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchase Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Purchase Tokens</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (AGRO)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={setAmount}
                  placeholder="Enter amount..."
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleBuy}
                disabled={!isConnected || loading}
                loading={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Buy Tokens'}
              </Button>
            </div>
          </Card>

          {/* Market Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Market Information</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="font-semibold">$0.25</span>
              </div>
              
              <div className="flex justify-between">
                <span>24h Volume:</span>
                <span className="font-semibold">$1,250,000</span>
              </div>
              
              <div className="flex justify-between">
                <span>Market Cap:</span>
                <span className="font-semibold">$50,000,000</span>
              </div>
              
              <div className="flex justify-between">
                <span>Circulating Supply:</span>
                <span className="font-semibold">200,000,000 AGRO</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Wallet Status */}
        {!isConnected && (
          <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200">
            <p className="text-yellow-800">
              Please connect your wallet to purchase tokens.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarketplaceBuyPage;
