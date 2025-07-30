import { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { Metadata, NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { WalletConnectForm } from '@/components/wallet/WalletConnectForm';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/format';
import { toast } from '@/utils/toast';

// Metadados SEO
export const metadata: Metadata = {
  title: 'Mint NFTs | AgroTM - Crie e Negocie NFTs Agrícolas',
  description: 'Crie, mint e negocie NFTs únicos relacionados ao agronegócio. Tokenize ativos agrícolas e participe da economia digital descentralizada.',
  keywords: ['mint', 'NFT', 'agronegócio', 'tokenização', 'blockchain', 'Solana', 'agricultura digital'],
  openGraph: {
    title: 'Mint NFTs | AgroTM',
    description: 'Crie e negocie NFTs agrícolas únicos na blockchain Solana',
    type: 'website',
    images: ['/images/mint-og.jpg']
  },
  robots: 'noindex, nofollow' // Página protegida
};

// Tipos
interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  supply: number;
  minted: number;
  category: 'farm' | 'equipment' | 'harvest' | 'land' | 'livestock';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: Record<string, any>;
  isActive: boolean;
  creator: string;
  royalty: number;
}

interface MintFilters {
  search: string;
  category: string;
  rarity: string;
  priceRange: [number, number];
  sortBy: 'price' | 'name' | 'rarity' | 'supply';
}

/**
 * Componente de loading para a página de mint
 */
function MintLoading() {
  return (
    <div className="min-h-screen bg-agro-darker flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-agro-light/60">Carregando coleções NFT...</p>
      </div>
    </div>
  );
}

/**
 * Componente de erro para a página de mint
 */
function MintError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-agro-darker flex items-center justify-center p-6"
    >
      <Card className="max-w-md w-full text-center">
        <div className="p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-agro-light mb-2">Erro no Mint</h2>
          <p className="text-agro-light/60 mb-4">{error}</p>
          <Button onClick={onRetry} variant="primary" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Página principal de mint de NFTs
 * 
 * Funcionalidades:
 * - Visualização de coleções NFT
 * - Filtros e busca avançados
 * - Mint de NFTs individuais
 * - Estatísticas de mint
 * - Interface responsiva e animada
 */
export default function MintPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isConnected, publicKey, balance } = useWeb3();
  
  // Estados locais
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState<MintFilters>({
    search: '',
    category: 'all',
    rarity: 'all',
    priceRange: [0, 1000],
    sortBy: 'price'
  });
  
  // Proteção de rota
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/mint');
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Carregamento inicial
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        // Simular dados de coleções NFT
        const mockCollections: NFTCollection[] = [
          {
            id: '1',
            name: 'Fazenda Digital',
            description: 'Coleção de fazendas virtuais tokenizadas',
            image: '/images/nft/farm-collection.jpg',
            price: 0.5,
            supply: 1000,
            minted: 234,
            category: 'farm',
            rarity: 'common',
            attributes: { size: '100 hectares', location: 'São Paulo' },
            isActive: true,
            creator: 'AgroTM',
            royalty: 5
          },
          {
            id: '2',
            name: 'Equipamentos Raros',
            description: 'Tratores e equipamentos agrícolas únicos',
            image: '/images/nft/equipment-collection.jpg',
            price: 1.2,
            supply: 500,
            minted: 89,
            category: 'equipment',
            rarity: 'rare',
            attributes: { type: 'Trator', power: '200HP' },
            isActive: true,
            creator: 'TechAgro',
            royalty: 7.5
          },
          {
            id: '3',
            name: 'Colheita Épica',
            description: 'Momentos únicos de colheita documentados',
            image: '/images/nft/harvest-collection.jpg',
            price: 2.0,
            supply: 250,
            minted: 156,
            category: 'harvest',
            rarity: 'epic',
            attributes: { season: 'Verão 2024', crop: 'Soja' },
            isActive: true,
            creator: 'FarmDAO',
            royalty: 10
          },
          {
            id: '4',
            name: 'Terras Lendárias',
            description: 'Propriedades históricas e valiosas',
            image: '/images/nft/land-collection.jpg',
            price: 5.0,
            supply: 100,
            minted: 23,
            category: 'land',
            rarity: 'legendary',
            attributes: { heritage: 'Século XIX', area: '500 hectares' },
            isActive: true,
            creator: 'Heritage Farms',
            royalty: 15
          }
        ];
        
        setCollections(mockCollections);
      } catch (err) {
        console.error('Erro ao carregar coleções:', err);
        setError('Falha ao carregar coleções NFT.');
        toast.error('Erro ao carregar coleções');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCollections();
  }, []);
  
  // Função para fazer mint
  const handleMint = useCallback(async (collectionId: string, amount: number) => {
    try {
      setIsMinting(true);
      
      const collection = collections.find(c => c.id === collectionId);
      if (!collection) {
        throw new Error('Coleção não encontrada');
      }
      
      const totalCost = collection.price * amount;
      
      if (balance < totalCost) {
        throw new Error('Saldo insuficiente');
      }
      
      // Simular processo de mint
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Atualizar dados da coleção
      setCollections(prev => prev.map(c => 
        c.id === collectionId 
          ? { ...c, minted: c.minted + amount }
          : c
      ));
      
      toast.success(`${amount} NFT(s) mintado(s) com sucesso!`);
      setSelectedCollection(null);
      setMintAmount(1);
      
    } catch (error: any) {
      console.error('Erro ao fazer mint:', error);
      toast.error(`Erro ao fazer mint: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  }, [collections, balance]);
  
  // Filtrar e ordenar coleções
  const filteredCollections = useMemo(() => {
    let filtered = collections.filter(collection => {
      // Filtro de busca
      if (filters.search && !collection.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filtro de categoria
      if (filters.category !== 'all' && collection.category !== filters.category) {
        return false;
      }
      
      // Filtro de raridade
      if (filters.rarity !== 'all' && collection.rarity !== filters.rarity) {
        return false;
      }
      
      // Filtro de preço
      if (collection.price < filters.priceRange[0] || collection.price > filters.priceRange[1]) {
        return false;
      }
      
      return collection.isActive;
    });
    
    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'supply':
          return (b.supply - b.minted) - (a.supply - a.minted);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [collections, filters]);
  
  // Estatísticas calculadas
  const stats = useMemo(() => {
    const totalCollections = collections.length;
    const totalSupply = collections.reduce((sum, c) => sum + c.supply, 0);
    const totalMinted = collections.reduce((sum, c) => sum + c.minted, 0);
    const averagePrice = collections.length > 0 
      ? collections.reduce((sum, c) => sum + c.price, 0) / collections.length 
      : 0;
    
    return {
      totalCollections,
      totalSupply,
      totalMinted,
      averagePrice,
      mintProgress: totalSupply > 0 ? (totalMinted / totalSupply) * 100 : 0
    };
  }, [collections]);
  
  // Estados de loading
  if (authLoading || isLoading) {
    return <MintLoading />;
  }
  
  // Estado de erro
  if (error) {
    return <MintError error={error} onRetry={() => window.location.reload()} />;
  }
  
  // Não autenticado
  if (!isAuthenticated) {
    return <MintLoading />; // Vai redirecionar via useEffect
  }
  
  // Carteira não conectada
  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-agro-darker flex items-center justify-center p-6"
      >
        <Card className="max-w-md w-full">
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-xl font-bold text-agro-light mb-2">Conecte sua Carteira</h2>
            <p className="text-agro-light/60 mb-6">
              Para fazer mint de NFTs, você precisa conectar uma carteira Solana.
            </p>
            <WalletConnectForm 
              onConnect={() => window.location.reload()}
              showWalletSelection={true}
            />
          </div>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-agro-darker"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header com estatísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-agro-light mb-2">
                Mint NFTs
              </h1>
              <p className="text-agro-light/60 text-lg">
                Crie e colecione NFTs únicos do agronegócio
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <Badge variant="info" className="flex items-center gap-2">
                💰 {formatCurrency(balance)} SOL
              </Badge>
              <Badge variant="success" className="flex items-center gap-2">
                🟢 Conectado
              </Badge>
            </div>
          </div>
          
          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-agro-primary">
                  {stats.totalCollections}
                </div>
                <div className="text-sm text-agro-light/60">Coleções</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatNumber(stats.totalSupply)}
                </div>
                <div className="text-sm text-agro-light/60">Supply Total</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatNumber(stats.totalMinted)}
                </div>
                <div className="text-sm text-agro-light/60">Mintados</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(stats.averagePrice)}
                </div>
                <div className="text-sm text-agro-light/60">Preço Médio</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {formatPercentage(stats.mintProgress)}
                </div>
                <div className="text-sm text-agro-light/60">Progresso</div>
              </div>
            </Card>
          </div>
        </motion.div>
        
        {/* Filtros e busca */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Buscar Coleção
                </label>
                <Input
                  type="text"
                  placeholder="Nome da coleção..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Categoria
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <option value="all">Todas</option>
                  <option value="farm">Fazendas</option>
                  <option value="equipment">Equipamentos</option>
                  <option value="harvest">Colheitas</option>
                  <option value="land">Terras</option>
                  <option value="livestock">Gado</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Raridade
                </label>
                <Select
                  value={filters.rarity}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rarity: value }))}
                >
                  <option value="all">Todas</option>
                  <option value="common">Comum</option>
                  <option value="rare">Raro</option>
                  <option value="epic">Épico</option>
                  <option value="legendary">Lendário</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Ordenar por
                </label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                >
                  <option value="price">Preço</option>
                  <option value="name">Nome</option>
                  <option value="rarity">Raridade</option>
                  <option value="supply">Disponível</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-agro-light mb-2">
                  Preço Máximo
                </label>
                <Input
                  type="number"
                  placeholder="10.0"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [prev.priceRange[0], Number(e.target.value)] 
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Lista de coleções */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredCollections.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-agro-light mb-2">
                Nenhuma coleção encontrada
              </h3>
              <p className="text-agro-light/60 mb-4">
                Tente ajustar os filtros ou buscar por outro termo.
              </p>
              <Button 
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  rarity: 'all',
                  priceRange: [0, 1000],
                  sortBy: 'price'
                })}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      {/* Imagem da coleção */}
                      <div className="relative h-48 bg-gradient-to-br from-agro-primary/20 to-agro-secondary/20">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                          {collection.category === 'farm' && '🚜'}
                          {collection.category === 'equipment' && '⚙️'}
                          {collection.category === 'harvest' && '🌾'}
                          {collection.category === 'land' && '🏞️'}
                          {collection.category === 'livestock' && '🐄'}
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge 
                            variant={
                              collection.rarity === 'common' ? 'default' :
                              collection.rarity === 'rare' ? 'info' :
                              collection.rarity === 'epic' ? 'warning' : 'error'
                            }
                            className="text-xs"
                          >
                            {collection.rarity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-agro-light group-hover:text-agro-primary transition-colors">
                              {collection.name}
                            </h3>
                            <p className="text-sm text-agro-light/60 mt-1">
                              {collection.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-agro-primary">
                              {formatCurrency(collection.price)} SOL
                            </div>
                          </div>
                        </div>
                        
                        {/* Progresso de mint */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-agro-light/60 mb-2">
                            <span>Mintados: {collection.minted}</span>
                            <span>Supply: {collection.supply}</span>
                          </div>
                          <div className="w-full bg-agro-dark rounded-full h-2">
                            <div 
                              className="bg-agro-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(collection.minted / collection.supply) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Informações adicionais */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-agro-light/60">Criador:</span>
                            <span className="text-agro-light">{collection.creator}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-agro-light/60">Royalty:</span>
                            <span className="text-agro-light">{collection.royalty}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-agro-light/60">Disponível:</span>
                            <span className="text-green-400">
                              {collection.supply - collection.minted}
                            </span>
                          </div>
                        </div>
                        
                        {/* Ações */}
                        <div className="space-y-2">
                          <Button 
                            onClick={() => setSelectedCollection(collection.id)}
                            variant="primary"
                            className="w-full"
                            disabled={collection.minted >= collection.supply}
                          >
                            {collection.minted >= collection.supply 
                              ? 'Esgotado' 
                              : selectedCollection === collection.id 
                                ? 'Selecionado' 
                                : 'Mint NFT'
                            }
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        
        {/* Modal de mint */}
        <AnimatePresence>
          {selectedCollection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCollection(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="p-6">
                  {(() => {
                    const collection = collections.find(c => c.id === selectedCollection);
                    if (!collection) return null;
                    
                    const totalCost = collection.price * mintAmount;
                    const canAfford = balance >= totalCost;
                    const available = collection.supply - collection.minted;
                    
                    return (
                      <>
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-agro-light mb-2">
                            Mint {collection.name}
                          </h3>
                          <p className="text-agro-light/60">
                            {collection.description}
                          </p>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-agro-light mb-2">
                              Quantidade (máx: {Math.min(available, 10)})
                            </label>
                            <Input
                              type="number"
                              min="1"
                              max={Math.min(available, 10)}
                              value={mintAmount}
                              onChange={(e) => setMintAmount(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="bg-agro-dark/50 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span className="text-agro-light/60">Preço unitário:</span>
                              <span className="text-agro-light">{formatCurrency(collection.price)} SOL</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-agro-light/60">Quantidade:</span>
                              <span className="text-agro-light">{mintAmount}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                              <span className="text-agro-light">Total:</span>
                              <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                                {formatCurrency(totalCost)} SOL
                              </span>
                            </div>
                            {!canAfford && (
                              <p className="text-red-400 text-sm mt-2">
                                Saldo insuficiente
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => setSelectedCollection(null)}
                            variant="outline"
                            className="flex-1"
                            disabled={isMinting}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={() => handleMint(collection.id, mintAmount)}
                            variant="primary"
                            className="flex-1"
                            disabled={!canAfford || isMinting || mintAmount > available}
                          >
                            {isMinting ? (
                              <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                Mintando...
                              </div>
                            ) : (
                              'Confirmar Mint'
                            )}
                          </Button>
                        </div>
                      </>
                    );
                  })()} 
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}