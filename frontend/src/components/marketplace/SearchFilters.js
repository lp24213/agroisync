import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, DollarSign, Star, Tag } from 'lucide-react';
import { getAllCategorias, getSubcategorias } from '../../data/agroCategorias';
import { motion, AnimatePresence } from 'framer-motion';

const SearchFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    query: initialFilters.query || '',
    categoria: initialFilters.categoria || '',
    subcategoria: initialFilters.subcategoria || '',
    precoMin: initialFilters.precoMin || '',
    precoMax: initialFilters.precoMax || '',
    estado: initialFilters.estado || '',
    cidade: initialFilters.cidade || '',
    raio: initialFilters.raio || '50',
    qualidade: initialFilters.qualidade || [],
    apenasOportunidades: initialFilters.apenasOportunidades || false,
    vendedorVerificado: initialFilters.vendedorVerificado || false,
    comFrete: initialFilters.comFrete || false,
    minRating: initialFilters.minRating || 0,
    organico: initialFilters.organico || false,
    entregaImediata: initialFilters.entregaImediata || false
  });

  const categorias = getAllCategorias();
  const subcategorias = filters.categoria ? getSubcategorias(filters.categoria) : [];

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  function handleFilterChange(key, value) {
    const newFilters = { ...filters, [key]: value };
    
    // Se mudou categoria, limpar subcategoria
    if (key === 'categoria') {
      newFilters.subcategoria = '';
    }
    
    setFilters(newFilters);
    
    // Notificar componente pai
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }

  function clearFilters() {
    const emptyFilters = {
      query: '',
      categoria: '',
      subcategoria: '',
      precoMin: '',
      precoMax: '',
      estado: '',
      cidade: '',
      raio: '50',
      qualidade: [],
      apenasOportunidades: false,
      vendedorVerificado: false,
      comFrete: false,
      minRating: 0,
      organico: false,
      entregaImediata: false
    };
    
    setFilters(emptyFilters);
    if (onFilterChange) onFilterChange(emptyFilters);
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'query' || key === 'raio') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== '' && value !== 0;
  }).length;

  return (
    <div className="search-filters" style={{ marginBottom: '30px' }}>
      
      {/* BARRA DE BUSCA PRINCIPAL */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search 
            className="w-5 h-5"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
          <input
            type="search"
            placeholder="Buscar produtos: soja, milho, gado, máquinas..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 50px',
              fontSize: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2F5233'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            aria-label="Buscar produtos agrícolas"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '14px 24px',
            background: showFilters ? '#2F5233' : 'white',
            color: showFilters ? 'white' : '#374151',
            border: `2px solid ${showFilters ? '#2F5233' : '#e5e7eb'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative'
          }}
          aria-label="Mostrar filtros avançados"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filtros
          {activeFiltersCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* FILTROS ATIVOS (CHIPS) */}
      {activeFiltersCount > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          flexWrap: 'wrap',
          marginBottom: '16px' 
        }}>
          {filters.categoria && (
            <FilterChip 
              label={`Categoria: ${categorias.find(c => c.id === filters.categoria)?.nome}`}
              onRemove={() => handleFilterChange('categoria', '')}
            />
          )}
          {filters.subcategoria && (
            <FilterChip 
              label={`Tipo: ${subcategorias.find(s => s.id === filters.subcategoria)?.nome}`}
              onRemove={() => handleFilterChange('subcategoria', '')}
            />
          )}
          {filters.estado && (
            <FilterChip 
              label={`Estado: ${filters.estado}`}
              onRemove={() => handleFilterChange('estado', '')}
            />
          )}
          {filters.apenasOportunidades && (
            <FilterChip 
              label="🔥 Apenas Oportunidades"
              onRemove={() => handleFilterChange('apenasOportunidades', false)}
            />
          )}
          {filters.vendedorVerificado && (
            <FilterChip 
              label="✓ Vendedor Verificado"
              onRemove={() => handleFilterChange('vendedorVerificado', false)}
            />
          )}
          {filters.organico && (
            <FilterChip 
              label="🌿 Orgânico"
              onRemove={() => handleFilterChange('organico', false)}
            />
          )}
          
          <button
            onClick={clearFilters}
            style={{
              padding: '6px 14px',
              background: '#fee2e2',
              color: '#991b1b',
              border: 'none',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            aria-label="Limpar todos os filtros"
          >
            <X className="w-4 h-4" />
            Limpar Tudo
          </button>
        </div>
      )}

      {/* PAINEL DE FILTROS AVANÇADOS */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden'
            }}
          >
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
              marginTop: '16px'
            }}>
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* CATEGORIA */}
                <div>
                  <label style={labelStyle}>
                    <Tag className="w-4 h-4 inline mr-2" />
                    Categoria
                  </label>
                  <select
                    value={filters.categoria}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    style={selectStyle}
                    aria-label="Selecionar categoria de produto"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icone} {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUBCATEGORIA */}
                {subcategorias.length > 0 && (
                  <div>
                    <label style={labelStyle}>Tipo Específico</label>
                    <select
                      value={filters.subcategoria}
                      onChange={(e) => handleFilterChange('subcategoria', e.target.value)}
                      style={selectStyle}
                      aria-label="Selecionar tipo específico de produto"
                    >
                      <option value="">Todos os tipos</option>
                      {subcategorias.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.icone} {sub.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* ESTADO */}
                <div>
                  <label style={labelStyle}>
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Estado
                  </label>
                  <select
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    style={selectStyle}
                    aria-label="Selecionar estado"
                  >
                    <option value="">Todos os estados</option>
                    {estados.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>

                {/* PREÇO MÍNIMO */}
                <div>
                  <label style={labelStyle}>
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Preço Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.precoMin}
                    onChange={(e) => handleFilterChange('precoMin', e.target.value)}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    aria-label="Preço mínimo"
                  />
                </div>

                {/* PREÇO MÁXIMO */}
                <div>
                  <label style={labelStyle}>Preço Máximo</label>
                  <input
                    type="number"
                    placeholder="R$ 999999"
                    value={filters.precoMax}
                    onChange={(e) => handleFilterChange('precoMax', e.target.value)}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                    aria-label="Preço máximo"
                  />
                </div>

                {/* RAIO DE ENTREGA */}
                <div>
                  <label style={labelStyle}>
                    Raio de Entrega: {filters.raio} km
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={filters.raio}
                    onChange={(e) => handleFilterChange('raio', e.target.value)}
                    style={{ width: '100%' }}
                    aria-label="Raio de entrega em quilômetros"
                  />
                </div>
              </div>

              {/* CHECKBOXES */}
              <div style={{ 
                marginTop: '24px', 
                paddingTop: '24px', 
                borderTop: '1px solid #e5e7eb',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <CheckboxFilter
                  label="🔥 Apenas Oportunidades"
                  checked={filters.apenasOportunidades}
                  onChange={(val) => handleFilterChange('apenasOportunidades', val)}
                  tooltip="Produtos com preço abaixo do mercado"
                />
                
                <CheckboxFilter
                  label="✓ Vendedor Verificado"
                  checked={filters.vendedorVerificado}
                  onChange={(val) => handleFilterChange('vendedorVerificado', val)}
                />
                
                <CheckboxFilter
                  label="🚛 Com Frete Disponível"
                  checked={filters.comFrete}
                  onChange={(val) => handleFilterChange('comFrete', val)}
                />
                
                <CheckboxFilter
                  label="🌿 Orgânico"
                  checked={filters.organico}
                  onChange={(val) => handleFilterChange('organico', val)}
                />
                
                <CheckboxFilter
                  label="⚡ Entrega Imediata"
                  checked={filters.entregaImediata}
                  onChange={(val) => handleFilterChange('entregaImediata', val)}
                />
              </div>

              {/* AVALIAÇÃO */}
              <div style={{ marginTop: '24px' }}>
                <label style={labelStyle}>
                  <Star className="w-4 h-4 inline mr-2 text-yellow-500" />
                  Avaliação Mínima
                </label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  {[0, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', rating)}
                      style={{
                        padding: '10px 18px',
                        background: filters.minRating === rating ? '#fef3c7' : '#f9fafb',
                        border: `2px solid ${filters.minRating === rating ? '#f59e0b' : '#e5e7eb'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      aria-label={`Filtrar por avaliação mínima de ${rating} estrelas`}
                    >
                      {rating > 0 && (
                        <>
                          {rating}
                          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          +
                        </>
                      )}
                      {rating === 0 && 'Qualquer'}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div style={{ 
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  aria-label="Limpar filtros"
                >
                  Limpar Filtros
                </button>
                
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#2F5233',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  aria-label="Aplicar filtros"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckboxFilter = ({ label, checked, onChange, tooltip }) => (
  <label style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px',
    cursor: 'pointer',
    padding: '12px',
    background: checked ? '#ecfdf5' : '#f9fafb',
    borderRadius: '10px',
    border: `2px solid ${checked ? '#10b981' : '#e5e7eb'}`,
    transition: 'all 0.2s'
  }}
  title={tooltip}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        accentColor: '#2F5233'
      }}
    />
    <span style={{ 
      fontSize: '14px', 
      fontWeight: '600',
      color: checked ? '#065f46' : '#374151'
    }}>
      {label}
    </span>
  </label>
);

const FilterChip = ({ label, onRemove }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    background: '#dbeafe',
    color: '#1e40af',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  }}>
    {label}
    <button
      onClick={onRemove}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center'
      }}
      aria-label={`Remover filtro ${label}`}
    >
      <X className="w-4 h-4" />
    </button>
  </span>
);

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '14px',
  border: '2px solid #e5e7eb',
  borderRadius: '10px',
  outline: 'none',
  transition: 'all 0.2s'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer'
};

export default SearchFilters;

