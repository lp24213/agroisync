import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Loja = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados simulados de produtos agrícolas
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Soja Premium',
        price: 165.00,
        quantity: 1000,
        unit: 'sc',
        location: 'Sinop - MT',
        contact: 'joao@fazenda.com',
        phone: '(66) 99999-9999',
        description: 'Soja de alta qualidade, colhida recentemente',
        category: 'grãos',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      },
      {
        id: 2,
        name: 'Milho Amarelo',
        price: 78.00,
        quantity: 500,
        unit: 'sc',
        location: 'Lucas do Rio Verde - MT',
        contact: 'maria@agro.com',
        phone: '(65) 88888-8888',
        description: 'Milho amarelo tipo 1, excelente para ração',
        category: 'grãos',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      },
      {
        id: 3,
        name: 'Trigo de Inverno',
        price: 210.00,
        quantity: 300,
        unit: 'sc',
        location: 'Cascavel - PR',
        contact: 'pedro@trigo.com',
        phone: '(45) 77777-7777',
        description: 'Trigo de inverno, qualidade superior',
        category: 'grãos',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      },
      {
        id: 4,
        name: 'Café Arábica',
        price: 870.00,
        quantity: 200,
        unit: 'sc',
        location: 'Franca - SP',
        contact: 'ana@cafe.com',
        phone: '(16) 66666-6666',
        description: 'Café arábica premium, torrado recentemente',
        category: 'café',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      },
      {
        id: 5,
        name: 'Algodão em Pluma',
        price: 150.00,
        quantity: 50,
        unit: '@',
        location: 'Campo Grande - MS',
        contact: 'carlos@algodao.com',
        phone: '(67) 55555-5555',
        description: 'Algodão em pluma, qualidade exportação',
        category: 'fibras',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      },
      {
        id: 6,
        name: 'Arroz Integral',
        price: 95.00,
        quantity: 400,
        unit: 'sc',
        location: 'Pelotas - RS',
        contact: 'lucia@arroz.com',
        phone: '(53) 44444-4444',
        description: 'Arroz integral orgânico, sem agrotóxicos',
        category: 'grãos',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'grãos', name: 'Grãos' },
    { id: 'café', name: 'Café' },
    { id: 'fibras', name: 'Fibras' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-900/20 to-yellow-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Marketplace Agrícola
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conectamos produtores, vendedores e compradores do agronegócio brasileiro. 
            Anuncie seus produtos e encontre as melhores ofertas do mercado.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-10 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar produtos ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    filter === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <p className="mt-4 text-gray-400">Carregando produtos...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Produtos Disponíveis
                </h2>
                <p className="text-gray-400">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-400">Tente ajustar os filtros ou a busca</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-900 to-yellow-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Quer anunciar seus produtos?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Cadastre-se gratuitamente e comece a vender no maior marketplace agrícola do Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-green-900 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Anunciar Produto
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-900 transition-colors duration-300">
              Ver Como Funciona
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Loja;
