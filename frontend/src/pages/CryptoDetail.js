import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, Globe, Heart, Share2 } from 'lucide-react';
// import AgroisyncHeader from '../components/AgroisyncHeader'; // Já incluído no App.js
// import AgroisyncFooter from '../components/AgroisyncFooter'; // Já incluído no App.js

const CryptoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    // Simular carregamento de dados da criptomoeda
    const mockCrypto = {
      id: id,
      name: id === 'bitcoin' ? 'Bitcoin' : id === 'ethereum' ? 'Ethereum' : 'Cardano',
      symbol: id === 'bitcoin' ? 'BTC' : id === 'ethereum' ? 'ETH' : 'ADA',
      price: id === 'bitcoin' ? 43250.5 : id === 'ethereum' ? 2650.3 : 0.45,
      change24h: id === 'bitcoin' ? 2.34 : id === 'ethereum' ? -1.56 : 3.21,
      volume: id === 'bitcoin' ? 28500000000 : id === 'ethereum' ? 15000000000 : 850000000,
      marketCap: id === 'bitcoin' ? 850000000000 : id === 'ethereum' ? 320000000000 : 15000000000,
      description:
        id === 'bitcoin'
          ? 'Bitcoin é a primeira e maior criptomoeda do mundo, criada em 2009 por Satoshi Nakamoto.'
          : id === 'ethereum'
            ? 'Ethereum é uma plataforma blockchain que permite a criação de aplicações descentralizadas.'
            : 'Cardano é uma plataforma blockchain de terceira geração focada em sustentabilidade e escalabilidade.',
      website:
        id === 'bitcoin' ? 'https://bitcoin.org' : id === 'ethereum' ? 'https://ethereum.org' : 'https://cardano.org',
      whitepaper:
        id === 'bitcoin'
          ? 'https://bitcoin.org/bitcoin.pdf'
          : id === 'ethereum'
            ? 'https://ethereum.org/en/whitepaper/'
            : 'https://cardano.org/whitepaper/',
      maxSupply: id === 'bitcoin' ? 21000000 : id === 'ethereum' ? null : 45000000000,
      circulatingSupply: id === 'bitcoin' ? 19500000 : id === 'ethereum' ? 120000000 : 35000000000,
      allTimeHigh: id === 'bitcoin' ? 69000 : id === 'ethereum' ? 4800 : 3.1,
      allTimeLow: id === 'bitcoin' ? 0.05 : id === 'ethereum' ? 0.43 : 0.017,
      founded: id === 'bitcoin' ? '2009' : id === 'ethereum' ? '2015' : '2017',
      founder: id === 'bitcoin' ? 'Satoshi Nakamoto' : id === 'ethereum' ? 'Vitalik Buterin' : 'Charles Hoskinson',
      features:
        id === 'bitcoin'
          ? ['Primeira criptomoeda', 'Reserva de valor digital', 'Meio de pagamento global', 'Descentralizada']
          : id === 'ethereum'
            ? ['Smart contracts', 'DeFi', 'NFTs', 'Aplicações descentralizadas']
            : ['Prova de participação', 'Sustentabilidade', 'Escalabilidade', 'Interoperabilidade'],
      chartData: generateChartData(id === 'bitcoin' ? 43250.5 : id === 'ethereum' ? 2650.3 : 0.45)
    };

    setTimeout(() => {
      setCrypto(mockCrypto);
      setLoading(false);
    }, 1000);
  }, [id]);

  const generateChartData = basePrice => {
    const data = [];
    const points = 30;

    for (let i = 0; i < points; i++) {
      const time = new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000);
      const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      data.push({
        time: time.getTime(),
        price: Math.max(price, basePrice * 0.8)
      });
    }

    return data;
  };

  const formatPrice = price => {
    if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 100) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  const formatVolume = volume => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    }
    return `$${volume}`;
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${crypto.name} (${crypto.symbol})`,
        text: `Confira os dados de ${crypto.name} no AgroSync`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleTrade = () => {
    alert('Funcionalidade de trading será implementada em breve!');
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-green-500'></div>
          <p className='mt-4 text-gray-600'>Carregando dados da criptomoeda...</p>
        </div>
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-800'>Criptomoeda não encontrada</h1>
          <button onClick={() => navigate('/crypto')} className='btn btn-primary'>
            Voltar ao Crypto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header já incluído no App.js */}

      <div className='container mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <div className='mb-6 flex items-center gap-2 text-sm text-gray-600'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-1 transition-colors hover:text-green-600'
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <span>/</span>
          <span>Crypto</span>
          <span>/</span>
          <span className='font-medium text-gray-800'>{crypto.name}</span>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Informações Principais */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Header */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white'>
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900'>{crypto.name}</h1>
                    <p className='text-gray-600'>{crypto.symbol}</p>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <button className='rounded-lg border border-gray-200 p-2 hover:bg-gray-50' onClick={handleFavorite}>
                    <Heart size={20} className={isFavorite ? 'fill-current text-red-500' : 'text-gray-400'} />
                  </button>
                  <button className='rounded-lg border border-gray-200 p-2 hover:bg-gray-50' onClick={handleShare}>
                    <Share2 size={20} className='text-gray-400' />
                  </button>
                </div>
              </div>

              <div className='mb-6 flex items-center gap-4'>
                <span className='text-4xl font-bold text-gray-900'>{formatPrice(crypto.price)}</span>
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                    crypto.change24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {crypto.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className='font-medium'>
                    {crypto.change24h >= 0 ? '+' : ''}
                    {crypto.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              <button
                className='w-full rounded-lg bg-gradient-to-r from-green-500 to-blue-500 py-3 font-medium text-white transition-all hover:from-green-600 hover:to-blue-600'
                onClick={handleTrade}
              >
                Comprar {crypto.symbol}
              </button>
            </div>

            {/* Gráfico */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900'>Preço</h3>
                <div className='flex gap-2'>
                  {['1h', '24h', '7d', '30d'].map(period => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`rounded-lg px-3 py-1 text-sm ${
                        timeframe === period ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className='flex h-64 items-center justify-center rounded-lg bg-gray-50'>
                <div className='text-center text-gray-500'>
                  <BarChart3 size={48} className='mx-auto mb-2' />
                  <p>Gráfico será implementado em breve</p>
                </div>
              </div>
            </div>

            {/* Sobre */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Sobre {crypto.name}</h3>
              <p className='mb-4 leading-relaxed text-gray-700'>{crypto.description}</p>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className='text-sm text-gray-600'>Fundado em:</span>
                  <p className='font-medium'>{crypto.founded}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-600'>Fundador:</span>
                  <p className='font-medium'>{crypto.founder}</p>
                </div>
              </div>

              <div className='mt-4 flex gap-4'>
                <a
                  href={crypto.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
                >
                  <Globe size={16} />
                  Site Oficial
                </a>
                <a
                  href={crypto.whitepaper}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-blue-600 hover:text-blue-800'
                >
                  <Activity size={16} />
                  Whitepaper
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Estatísticas */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Estatísticas</h3>

              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Volume 24h:</span>
                  <span className='font-medium'>{formatVolume(crypto.volume)}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600'>Market Cap:</span>
                  <span className='font-medium'>{formatVolume(crypto.marketCap)}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600'>Supply Circulante:</span>
                  <span className='font-medium'>{crypto.circulatingSupply?.toLocaleString() || 'N/A'}</span>
                </div>

                {crypto.maxSupply && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Supply Máximo:</span>
                    <span className='font-medium'>{crypto.maxSupply.toLocaleString()}</span>
                  </div>
                )}

                <div className='flex justify-between'>
                  <span className='text-gray-600'>ATH:</span>
                  <span className='font-medium'>{formatPrice(crypto.allTimeHigh)}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600'>ATL:</span>
                  <span className='font-medium'>{formatPrice(crypto.allTimeLow)}</span>
                </div>
              </div>
            </div>

            {/* Características */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Características</h3>

              <ul className='space-y-2'>
                {crypto.features.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                    <span className='text-gray-700'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aviso de Risco */}
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
              <h4 className='mb-2 font-medium text-yellow-800'>⚠️ Aviso de Risco</h4>
              <p className='text-sm text-yellow-700'>
                Investimentos em criptomoedas são altamente voláteis e podem resultar em perdas significativas.
                Considere cuidadosamente sua tolerância ao risco antes de investir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer já incluído no App.js */}
    </div>
  );
};

export default CryptoDetail;
