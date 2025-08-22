import React from 'react';

const ProductCard = ({ product }) => {
  const {
    name,
    price,
    quantity,
    unit,
    location,
    contact,
    phone,
    description,
    image
  } = product;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-700 rounded-t-lg overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
            Disponível
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {description}
          </p>
        </div>

        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-400">Preço</span>
            <p className="text-2xl font-bold text-green-400">
              R$ {price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Quantidade</span>
            <p className="text-lg font-semibold text-white">
              {quantity.toLocaleString()} {unit}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-gray-400 text-sm">{location}</span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-gray-400 text-sm">{contact}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="text-gray-400 text-sm">{phone}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Ligar</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>Email</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">ID do Produto</span>
            <span className="text-gray-300 font-mono">#{product.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
