import React from 'react';
import { motion } from 'framer-motion';

const GrainInfo = () => {
  const grains = [
    {
      name: 'Algodão',
      image: 'https://images.unsplash.com/photo-1634337781106-4c6a12b820a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsZ29kJUMzJUEzb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
      info: {
        producao: '3,1 milhões de toneladas (2024)',
        principais_estados: ['Mato Grosso', 'Bahia', 'Goiás'],
        exportacao: 'China, Vietnã, Paquistão e Bangladesh',
        plantio: 'Novembro a Janeiro',
        importancia: 'Principal fibra natural utilizada na indústria têxtil',
        curiosidade: 'Brasil é o quarto maior produtor mundial de algodão'
      }
    },
    {
      name: 'Trigo',
      image: 'https://media.istockphoto.com/id/1557875324/pt/foto/wheat-grain-in-a-hand-after-good-harvest-of-successful-farmer.jpg?s=612x612&w=0&k=20&c=BaILt6GTN6cTPmKKNhuzeeKj1xagyRRvcOJH3vGsG28=',
      info: {
        producao: '9,7 milhões de toneladas (2024)',
        principais_estados: ['Paraná', 'Rio Grande do Sul', 'Santa Catarina'],
        exportacao: 'Principalmente para países do Mercosul',
        plantio: 'Março a Junho (safra de inverno)',
        importancia: 'Base para produção de pães, massas e produtos de panificação',
        curiosidade: 'O Brasil é o maior importador de trigo da América do Sul'
      }
    },
    {
      name: 'Soja',
      image: 'https://plus.unsplash.com/premium_photo-1661840453139-aef1ff57f4da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U09KQXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
      info: {
        producao: '154,8 milhões de toneladas (2024)',
        principais_estados: ['Mato Grosso', 'Paraná', 'Rio Grande do Sul'],
        exportacao: 'China, União Europeia e outros países asiáticos',
        plantio: 'Outubro a Dezembro',
        importancia: 'Principal commodity agrícola do Brasil, usada para ração animal e óleo',
        curiosidade: 'Brasil é o maior exportador mundial de soja'
      }
    },
    {
      name: 'Milho',
      image: 'https://media.istockphoto.com/id/2156174738/pt/foto/corn-grains-in-the-hands-of-a-successful-farmer-in-a-background-green-corn-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=-illkQsnyqKgTiq7MDKa5YjFGCGe15Mr_x3n7HXQrtc=',
      info: {
        producao: '125,5 milhões de toneladas (2024)',
        principais_estados: ['Mato Grosso', 'Goiás', 'Paraná'],
        exportacao: 'Irã, Japão, Vietnã e países da União Europeia',
        plantio: 'Primeira safra: Set-Nov, Segunda safra: Jan-Mar',
        importancia: 'Essencial para ração animal e produção de etanol',
        curiosidade: 'Segunda maior cultura em volume de produção no Brasil'
      }
    },
    {
      name: 'Feijão',
      image: 'https://plus.unsplash.com/premium_photo-1671130295735-25af5e78d40c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVpaiVDMyVBM298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
      info: {
        producao: '3,0 milhões de toneladas (2024)',
        principais_estados: ['Paraná', 'Minas Gerais', 'Mato Grosso'],
        exportacao: 'Índia, Venezuela e países africanos',
        plantio: 'Três safras: águas, seca e inverno',
        importancia: 'Principal fonte de proteína na dieta brasileira',
        curiosidade: 'Brasil é o maior consumidor mundial de feijão'
      }
    },
    {
      name: 'Café',
      image: 'https://images.unsplash.com/photo-1740993384782-369875958aa9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVpaiVDMyVBM28lMjBuYXMlMjBtJUMzJUEzb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
      info: {
        producao: '54,7 milhões de sacas (2024)',
        principais_estados: ['Minas Gerais', 'São Paulo', 'Espírito Santo'],
        exportacao: 'EUA, Alemanha, Itália e Japão',
        plantio: 'Outubro a Março',
        importancia: 'Principal exportador mundial de café',
        curiosidade: 'Representa 40% da produção mundial de café'
      }
    }
  ];

  return (
    <section className='agro-grains-section'>
      <h2 className='agro-section-title'>Principais Culturas Brasileiras</h2>
      <div className='agro-grains-grid'>
        {grains.map((grain, index) => (
          <motion.div
            key={grain.name}
            className='agro-grain-card'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className='agro-grain-image'>
              <img src={grain.image} alt={`Produção de ${grain.name}`} />
            </div>
            <h3 className='agro-grain-title'>{grain.name}</h3>
            <div className='agro-grain-info'>
              <p><strong>Produção:</strong> {grain.info.producao}</p>
              <p><strong>Principais Estados:</strong> {grain.info.principais_estados.join(', ')}</p>
              <p><strong>Exportação:</strong> {grain.info.exportacao}</p>
              <p><strong>Plantio:</strong> {grain.info.plantio}</p>
              <p><strong>Importância:</strong> {grain.info.importancia}</p>
              <p><strong>Curiosidade:</strong> {grain.info.curiosidade}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .agro-grains-section {
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin: 2rem 0;
        }

        .agro-section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2a7f4f;
          text-align: center;
          margin-bottom: 2rem;
        }

        .agro-grains-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .agro-grain-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .agro-grain-card:hover {
          transform: translateY(-5px);
        }

        .agro-grain-image {
          height: 200px;
          overflow: hidden;
        }

        .agro-grain-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .agro-grain-card:hover .agro-grain-image img {
          transform: scale(1.05);
        }

        .agro-grain-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2a7f4f;
          padding: 1rem;
          text-align: center;
        }

        .agro-grain-info {
          padding: 1rem;
        }

        .agro-grain-info p {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .agro-grain-info strong {
          color: #2a7f4f;
        }

        @media (max-width: 768px) {
          .agro-grains-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default GrainInfo;