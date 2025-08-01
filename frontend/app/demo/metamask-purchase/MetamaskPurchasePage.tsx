'use client';

import BuyWithCommission from '../../../components/BuyWithCommission';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';

import React, { useState } from 'react';

// Toast hook replacement
const useToast = () => {
  return (options: {
    title: string;
    description?: string;
    status: string;
    duration?: number;
    isClosable?: boolean;
  }) => {
    // Simple alert replacement for now
    alert(`${options.title}${options.description ? '\n' + options.description : ''}`);
  };
};

const MetamaskPurchasePage: React.FC = () => {
  const toast = useToast();

  // Estado para os parâmetros de compra
  const [purchaseParams, setPurchaseParams] = useState({
    tokenType: 'ERC20',
    tokenAddress: '0x1234567890123456789012345678901234567890', // Endereço de exemplo
    tokenId: 1,
    amount: 10,
    price: '0.01',
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço de exemplo
  });

  // Endereço do contrato de comissão (simulado)
  const commissionContractAddress = '0x9876543210987654321098765432109876543210';

  // Função para atualizar os parâmetros de compra
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPurchaseParams(prev => ({
      ...prev,
      [name]:
        name === 'price' || name === 'amount' || name === 'tokenId'
          ? name === 'price'
            ? value
            : parseInt(value)
          : value,
    }));
  };

  // Função para lidar com o sucesso da compra
  const handleSuccess = () => {
    toast({
      title: 'Compra realizada com sucesso!',
      description: 'Transação confirmada!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div className='container mx-auto py-8 px-4 max-w-7xl'>
      <h1 className='text-3xl font-bold mb-2'>Demonstração de Compra com MetaMask</h1>
      <p className='mb-6 text-gray-600'>
        Esta página demonstra como usar o sistema de compra com comissão automática via MetaMask.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Painel de configuração */}
        <Card>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Configurar Parâmetros</h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Tipo de Token</label>
                <select
                  name='tokenType'
                  value={purchaseParams.tokenType}
                  onChange={handleParamChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='ERC20'>Token (ERC-20)</option>
                  <option value='ERC721'>NFT (ERC-721)</option>
                  <option value='ERC1155'>Multi-Token (ERC-1155)</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Endereço do Token</label>
                <Input
                  name='tokenAddress'
                  value={purchaseParams.tokenAddress}
                  onChange={handleParamChange}
                  placeholder='0x...'
                />
              </div>

              {(purchaseParams.tokenType === 'ERC721' ||
                purchaseParams.tokenType === 'ERC1155') && (
                <div>
                  <label className='block text-sm font-medium mb-2'>ID do Token</label>
                  <Input
                    name='tokenId'
                    type='number'
                    value={purchaseParams.tokenId}
                    onChange={handleParamChange}
                    min={1}
                  />
                </div>
              )}

              {(purchaseParams.tokenType === 'ERC20' || purchaseParams.tokenType === 'ERC1155') && (
                <div>
                  <label className='block text-sm font-medium mb-2'>Quantidade</label>
                  <Input
                    name='amount'
                    type='number'
                    value={purchaseParams.amount}
                    onChange={handleParamChange}
                    min={1}
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-medium mb-2'>Preço (ETH)</label>
                <Input
                  name='price'
                  type='text'
                  value={purchaseParams.price}
                  onChange={handleParamChange}
                  placeholder='0.01'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Endereço do Vendedor</label>
                <Input
                  name='sellerAddress'
                  value={purchaseParams.sellerAddress}
                  onChange={handleParamChange}
                  placeholder='0x...'
                />
              </div>

              <div className='pt-2'>
                <p className='text-sm text-gray-600'>
                  Contrato de Comissão: {commissionContractAddress.substring(0, 6)}...
                  {commissionContractAddress.substring(38)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Componente de compra */}
        <Card>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Comprar com Comissão</h3>
            <BuyWithCommission
              type={purchaseParams.tokenType === 'ERC20' ? 'token' : 'nft'}
              tokenAddress={purchaseParams.tokenAddress}
              tokenId={purchaseParams.tokenId}
              amount={purchaseParams.amount.toString()}
              sellerAddress={purchaseParams.sellerAddress}
              price={purchaseParams.price}
              onSuccess={handleSuccess}
            />
          </div>
        </Card>
      </div>

      <div className='mt-12 p-6 bg-blue-50 rounded-md'>
        <h3 className='text-lg font-semibold mb-4 text-blue-700'>Como funciona?</h3>
        <p className='mb-3'>
          Este sistema permite que usuários comprem tokens ou NFTs com uma comissão automática
          enviada para o administrador da plataforma.
        </p>
        <p className='mb-3'>
          Quando uma compra é realizada, o valor é dividido automaticamente: uma parte (comissão)
          vai para o administrador e o restante vai para o vendedor.
        </p>
        <p className='mb-3'>
          O contrato inteligente garante que essa divisão seja feita de forma segura e transparente,
          sem necessidade de intermediários.
        </p>
        <hr className='my-4' />
        <p className='font-bold'>Fluxo da transação:</p>
        <ol style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>Usuário conecta sua carteira MetaMask</li>
          <li>Usuário seleciona o token/NFT e confirma a compra</li>
          <li>MetaMask solicita aprovação da transação</li>
          <li>O contrato inteligente processa a compra e divide o pagamento</li>
          <li>O comprador recebe o token/NFT automaticamente</li>
          <li>O vendedor recebe o pagamento (menos a comissão)</li>
          <li>O administrador recebe a comissão</li>
        </ol>
      </div>
    </div>
  );
};

export default MetamaskPurchasePage;
