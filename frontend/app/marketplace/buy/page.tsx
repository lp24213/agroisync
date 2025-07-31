'use client';

import BuyWithCommission from '@/components/BuyWithCommission';
import { Button } from '@/components/ui/Button';
import { useWeb3 } from '@/hooks/useWeb3';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

// Modal hook replacement
const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
  };
};

// Modal components replacement
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div className='bg-white rounded-lg max-w-md w-full mx-4' onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const ModalOverlay = () => null;
const ModalContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ModalHeader = ({ children }: { children: React.ReactNode }) => (
  <div className='p-6 border-b'>
    <h3 className='text-lg font-semibold'>{children}</h3>
  </div>
);
const ModalBody = ({ children }: { children: React.ReactNode }) => (
  <div className='p-6'>{children}</div>
);
const ModalCloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'>
    ×
  </button>
);

// Tipos de ativos disponíveis para compra
type AssetType = 'token' | 'nft' | 'erc1155';

// Interface para os itens à venda
interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: string; // em ETH
  image: string;
  type: AssetType;
  tokenAddress: string;
  tokenId?: number;
  amount?: number;
  sellerAddress: string;
}

// Dados simulados para o marketplace
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'AGROTM Token',
    description: 'Token oficial da plataforma AGROTM para acesso a recursos premium.',
    price: '0.05',
    image: '/assets/images/token-agrotm.png',
    type: 'token',
    tokenAddress: '0x1234567890123456789012345678901234567890', // Endereço simulado do token ERC-20
    amount: 100,
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço simulado do vendedor
  },
  {
    id: '2',
    name: 'Fazenda Digital #042',
    description: 'NFT representando uma fazenda digital com 500 hectares de área cultivável.',
    price: '0.2',
    image: '/assets/images/nft-farm-042.png',
    type: 'nft',
    tokenAddress: '0x2345678901234567890123456789012345678901', // Endereço simulado do NFT ERC-721
    tokenId: 42,
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço simulado do vendedor
  },
  {
    id: '3',
    name: 'Lote de Grãos Premium',
    description: 'Lote de grãos premium certificados, representados como NFT multi-token.',
    price: '0.1',
    image: '/assets/images/nft-grain-lot.png',
    type: 'erc1155',
    tokenAddress: '0x3456789012345678901234567890123456789012', // Endereço simulado do NFT ERC-1155
    tokenId: 7,
    amount: 5,
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço simulado do vendedor
  },
  {
    id: '4',
    name: 'Drone Agrícola #013',
    description: 'NFT representando um drone agrícola para monitoramento de plantações.',
    price: '0.15',
    image: '/assets/images/nft-drone-013.png',
    type: 'nft',
    tokenAddress: '0x4567890123456789012345678901234567890123', // Endereço simulado do NFT ERC-721
    tokenId: 13,
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço simulado do vendedor
  },
  {
    id: '5',
    name: 'Pacote de Sementes',
    description: 'Pacote de sementes certificadas, representadas como NFT multi-token.',
    price: '0.08',
    image: '/assets/images/nft-seeds.png',
    type: 'erc1155',
    tokenAddress: '0x5678901234567890123456789012345678901234', // Endereço simulado do NFT ERC-1155
    tokenId: 3,
    amount: 10,
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço simulado do vendedor
  },
  {
    id: '6',
    name: 'AGROTM Governance',
    description: 'Token de governança da DAO AGROTM para participação em votações.',
    price: '0.12',
    image: '/assets/images/token-governance.png',
    type: 'token',
    tokenAddress: '0x6789012345678901234567890123456789012345', // Endereço simulado do token ERC-20
    amount: 50,
    sellerAddress: '0x0987654321098765432109876543210987654321', // Endereço simulado do vendedor
  },
];

// Endereço do contrato BuyWithCommission (simulado)
const COMMISSION_CONTRACT_ADDRESS = '0x9876543210987654321098765432109876543210';

const MarketplacePage: React.FC = () => {
  const { isConnected, connect } = useWeb3();
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ txHash: string; itemId: string } | null>(
    null,
  );

  // Função para abrir o modal de compra
  const handleBuyClick = (item: MarketplaceItem) => {
    setSelectedItem(item);
    onOpen();
  };

  // Função para lidar com o sucesso da compra
  const handlePurchaseSuccess = (txHash: string) => {
    if (selectedItem) {
      setPurchaseSuccess({
        txHash,
        itemId: selectedItem.id,
      });
      onClose();
    }
  };

  // Função para lidar com erro na compra
  const handlePurchaseError = (error: Error) => {
    console.error('Erro na compra:', error);
    // Aqui você pode adicionar uma notificação de erro
  };

  return (
    <div className='container mx-auto py-8 px-4 max-w-7xl'>
      <h1 className='text-3xl font-bold mb-2'>Marketplace AGROTM</h1>
      <p className='mb-6 text-gray-600'>
        Compre tokens e NFTs agrícolas com comissão automática usando MetaMask
      </p>

      {purchaseSuccess && (
        <div className='mb-6 p-4 bg-green-50 rounded-md border-l-4 border-green-500'>
          <h3 className='text-lg font-semibold text-green-600 mb-2'>
            Compra realizada com sucesso!
          </h3>
          <p>
            O item{' '}
            <strong>
              {mockMarketplaceItems.find(item => item.id === purchaseSuccess.itemId)?.name}
            </strong>{' '}
            foi adquirido.
          </p>
          <p className='mt-1'>
            Hash da transação:{' '}
            <span className='font-medium text-blue-600'>{purchaseSuccess.txHash}</span>
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockMarketplaceItems.map(item => (
          <div
            key={item.id}
            className='border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:-translate-y-1'
          >
            <div
              className='h-48 bg-gray-200 relative bg-cover bg-center'
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div
                className={cn(
                  'absolute top-2 right-2 text-white px-2 py-1 rounded-md text-sm',
                  item.type === 'token'
                    ? 'bg-blue-500'
                    : item.type === 'nft'
                      ? 'bg-purple-500'
                      : 'bg-orange-500',
                )}
              >
                {item.type === 'token' ? 'Token' : item.type === 'nft' ? 'NFT' : 'ERC-1155'}
              </div>
            </div>

            <div className='p-4'>
              <h3 className='text-lg font-semibold mb-2'>{item.name}</h3>
              <p className='text-gray-600 mb-3 text-sm'>{item.description}</p>

              <div className='flex justify-between items-center mb-2'>
                <span className='text-lg font-bold text-green-600'>{item.price} ETH</span>
                <Button
                  variant='default'
                  size='sm'
                  onClick={() => handleBuyClick(item)}
                  disabled={!isConnected}
                >
                  Comprar
                </Button>
              </div>

              {item.type === 'token' && (
                <p className='text-sm mt-2'>Quantidade: {item.amount} tokens</p>
              )}

              {(item.type === 'nft' || item.type === 'erc1155') && (
                <p className='text-sm mt-2'>ID: #{item.tokenId}</p>
              )}

              {item.type === 'erc1155' && (
                <p className='text-sm'>Quantidade: {item.amount} unidades</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de compra com o componente BuyWithCommission */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comprar {selectedItem?.name}</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            {selectedItem && (
              <BuyWithCommission
                contractAddress={COMMISSION_CONTRACT_ADDRESS}
                tokenAddress={selectedItem.tokenAddress}
                tokenType={
                  selectedItem.type === 'token'
                    ? 'ERC20'
                    : selectedItem.type === 'nft'
                      ? 'ERC721'
                      : 'ERC1155'
                }
                tokenId={selectedItem.tokenId}
                amount={selectedItem.amount?.toString()}
                sellerAddress={selectedItem.sellerAddress}
                price={selectedItem.price}
                onSuccess={() => handlePurchaseSuccess('tx-hash-placeholder')}
                onError={handlePurchaseError}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MarketplacePage;
