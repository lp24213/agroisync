import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const GrainInfo = () => {
  const { t, i18n } = useTranslation();
  
  const getGrainsData = () => {
    const lang = i18n.language;
    
    if (lang === 'en') {
      return [
        {
          name: 'Cotton',
          image: 'https://images.unsplash.com/photo-1634337781106-4c6a12b820a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsZ29kJUMzJUEzb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '3.1 million tons (2024)',
            principais_estados: ['Mato Grosso', 'Bahia', 'Goiás'],
            exportacao: 'China, Vietnam, Pakistan and Bangladesh',
            plantio: 'November to January',
            importancia: 'Main natural fiber used in the textile industry',
            curiosidade: 'Brazil is the fourth largest cotton producer in the world'
          }
        },
        {
          name: 'Wheat',
          image: 'https://media.istockphoto.com/id/1557875324/pt/foto/wheat-grain-in-a-hand-after-good-harvest-of-successful-farmer.jpg?s=612x612&w=0&k=20&c=BaILt6GTN6cTPmKKNhuzeeKj1xagyRRvcOJH3vGsG28=',
          info: {
            producao: '9.7 million tons (2024)',
            principais_estados: ['Paraná', 'Rio Grande do Sul', 'Santa Catarina'],
            exportacao: 'Mainly to Mercosur countries',
            plantio: 'March to June (winter crop)',
            importancia: 'Base for production of breads, pasta and bakery products',
            curiosidade: 'Brazil is the largest wheat importer in South America'
          }
        },
        {
          name: 'Soybean',
          image: 'https://plus.unsplash.com/premium_photo-1661840453139-aef1ff57f4da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U09KQXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '154.8 million tons (2024)',
            principais_estados: ['Mato Grosso', 'Paraná', 'Rio Grande do Sul'],
            exportacao: 'China, European Union and other Asian countries',
            plantio: 'October to December',
            importancia: 'Main agricultural commodity in Brazil, used for animal feed and oil',
            curiosidade: 'Brazil is the world\'s largest soybean exporter'
          }
        },
        {
          name: 'Corn',
          image: 'https://media.istockphoto.com/id/2156174738/pt/foto/corn-grains-in-the-hands-of-a-successful-farmer-in-a-background-green-corn-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=-illkQsnyqKgTiq7MDKa5YjFGCGe15Mr_x3n7HXQrtc=',
          info: {
            producao: '125.5 million tons (2024)',
            principais_estados: ['Mato Grosso', 'Goiás', 'Paraná'],
            exportacao: 'Iran, Japan, Vietnam and European Union countries',
            plantio: 'First crop: Sep-Nov, Second crop: Jan-Mar',
            importancia: 'Essential for animal feed and ethanol production',
            curiosidade: 'Second largest crop by production volume in Brazil'
          }
        },
        {
          name: 'Beans',
          image: 'https://plus.unsplash.com/premium_photo-1671130295735-25af5e78d40c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVpaiVDMyVBM298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '3.0 million tons (2024)',
            principais_estados: ['Paraná', 'Minas Gerais', 'Mato Grosso'],
            exportacao: 'India, Venezuela and African countries',
            plantio: 'Three crops: wet, dry and winter',
            importancia: 'Main source of protein in the Brazilian diet',
            curiosidade: 'Brazil is the world\'s largest bean consumer'
          }
        },
        {
          name: 'Coffee',
          image: 'https://images.unsplash.com/photo-1740993384782-369875958aa9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVpaiVDMyVBM28lMjBuYXMlMjBtJUMzJUEzb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '54.7 million bags (2024)',
            principais_estados: ['Minas Gerais', 'São Paulo', 'Espírito Santo'],
            exportacao: 'USA, Germany, Italy and Japan',
            plantio: 'October to March',
            importancia: 'World\'s leading coffee exporter',
            curiosidade: 'Represents 40% of world coffee production'
          }
        }
      ];
    } else if (lang === 'es') {
      return [
        {
          name: 'Algodón',
          image: 'https://images.unsplash.com/photo-1634337781106-4c6a12b820a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsZ29kJUMzJUEzb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '3,1 millones de toneladas (2024)',
            principais_estados: ['Mato Grosso', 'Bahia', 'Goiás'],
            exportacao: 'China, Vietnam, Pakistán y Bangladesh',
            plantio: 'Noviembre a Enero',
            importancia: 'Principal fibra natural utilizada en la industria textil',
            curiosidade: 'Brasil es el cuarto mayor productor mundial de algodón'
          }
        },
        {
          name: 'Trigo',
          image: 'https://media.istockphoto.com/id/1557875324/pt/foto/wheat-grain-in-a-hand-after-good-harvest-of-successful-farmer.jpg?s=612x612&w=0&k=20&c=BaILt6GTN6cTPmKKNhuzeeKj1xagyRRvcOJH3vGsG28=',
          info: {
            producao: '9,7 millones de toneladas (2024)',
            principais_estados: ['Paraná', 'Rio Grande do Sul', 'Santa Catarina'],
            exportacao: 'Principalmente para países del Mercosur',
            plantio: 'Marzo a Junio (cosecha de invierno)',
            importancia: 'Base para producción de panes, pastas y productos de panadería',
            curiosidade: 'Brasil es el mayor importador de trigo de América del Sur'
          }
        },
        {
          name: 'Soja',
          image: 'https://plus.unsplash.com/premium_photo-1661840453139-aef1ff57f4da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U09KQXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '154,8 millones de toneladas (2024)',
            principais_estados: ['Mato Grosso', 'Paraná', 'Rio Grande do Sul'],
            exportacao: 'China, Unión Europea y otros países asiáticos',
            plantio: 'Octubre a Diciembre',
            importancia: 'Principal commodity agrícola de Brasil, usada para alimento animal y aceite',
            curiosidade: 'Brasil es el mayor exportador mundial de soja'
          }
        },
        {
          name: 'Maíz',
          image: 'https://media.istockphoto.com/id/2156174738/pt/foto/corn-grains-in-the-hands-of-a-successful-farmer-in-a-background-green-corn-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=-illkQsnyqKgTiq7MDKa5YjFGCGe15Mr_x3n7HXQrtc=',
          info: {
            producao: '125,5 millones de toneladas (2024)',
            principais_estados: ['Mato Grosso', 'Goiás', 'Paraná'],
            exportacao: 'Irán, Japón, Vietnam y países de la Unión Europea',
            plantio: 'Primera cosecha: Sep-Nov, Segunda cosecha: Ene-Mar',
            importancia: 'Esencial para alimento animal y producción de etanol',
            curiosidade: 'Segundo mayor cultivo por volumen de producción en Brasil'
          }
        },
        {
          name: 'Frijol',
          image: 'https://plus.unsplash.com/premium_photo-1671130295735-25af5e78d40c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVpaiVDMyVBM298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '3,0 millones de toneladas (2024)',
            principais_estados: ['Paraná', 'Minas Gerais', 'Mato Grosso'],
            exportacao: 'India, Venezuela y países africanos',
            plantio: 'Tres cosechas: aguas, seca e invierno',
            importancia: 'Principal fuente de proteína en la dieta brasileña',
            curiosidade: 'Brasil es el mayor consumidor mundial de frijol'
          }
        },
        {
          name: 'Café',
          image: 'https://images.unsplash.com/photo-1740993384782-369875958aa9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVpaiVDMyVBM28lMjBuYXMlMjBtJUMzJUEzb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '54,7 millones de sacos (2024)',
            principais_estados: ['Minas Gerais', 'São Paulo', 'Espírito Santo'],
            exportacao: 'EE.UU., Alemania, Italia y Japón',
            plantio: 'Octubre a Marzo',
            importancia: 'Principal exportador mundial de café',
            curiosidade: 'Representa el 40% de la producción mundial de café'
          }
        }
      ];
    } else if (lang === 'zh') {
      return [
        {
          name: '棉花',
          image: 'https://images.unsplash.com/photo-1634337781106-4c6a12b820a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsZ29kJUMzJUEzb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '310万吨（2024）',
            principais_estados: ['马托格罗索', '巴伊亚', '戈亚斯'],
            exportacao: '中国、越南、巴基斯坦和孟加拉国',
            plantio: '11月至1月',
            importancia: '纺织工业中使用的主要天然纤维',
            curiosidade: '巴西是世界第四大棉花生产国'
          }
        },
        {
          name: '小麦',
          image: 'https://media.istockphoto.com/id/1557875324/pt/foto/wheat-grain-in-a-hand-after-good-harvest-of-successful-farmer.jpg?s=612x612&w=0&k=20&c=BaILt6GTN6cTPmKKNhuzeeKj1xagyRRvcOJH3vGsG28=',
          info: {
            producao: '970万吨（2024）',
            principais_estados: ['巴拉那', '南里奥格兰德', '圣卡塔琳娜'],
            exportacao: '主要出口到南方共同市场国家',
            plantio: '3月至6月（冬季作物）',
            importancia: '面包、意大利面和烘焙产品生产的基础',
            curiosidade: '巴西是南美洲最大的小麦进口国'
          }
        },
        {
          name: '大豆',
          image: 'https://plus.unsplash.com/premium_photo-1661840453139-aef1ff57f4da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U09KQXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '1.548亿吨（2024）',
            principais_estados: ['马托格罗索', '巴拉那', '南里奥格兰德'],
            exportacao: '中国、欧盟和其他亚洲国家',
            plantio: '10月至12月',
            importancia: '巴西主要农业商品，用于动物饲料和油',
            curiosidade: '巴西是世界最大的大豆出口国'
          }
        },
        {
          name: '玉米',
          image: 'https://media.istockphoto.com/id/2156174738/pt/foto/corn-grains-in-the-hands-of-a-successful-farmer-in-a-background-green-corn-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=-illkQsnyqKgTiq7MDKa5YjFGCGe15Mr_x3n7HXQrtc=',
          info: {
            producao: '1.255亿吨（2024）',
            principais_estados: ['马托格罗索', '戈亚斯', '巴拉那'],
            exportacao: '伊朗、日本、越南和欧盟国家',
            plantio: '第一季：9-11月，第二季：1-3月',
            importancia: '动物饲料和乙醇生产必不可少',
            curiosidade: '巴西产量第二大作物'
          }
        },
        {
          name: '豆类',
          image: 'https://plus.unsplash.com/premium_photo-1671130295735-25af5e78d40c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVpaiVDMyVBM298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '300万吨（2024）',
            principais_estados: ['巴拉那', '米纳斯吉拉斯', '马托格罗索'],
            exportacao: '印度、委内瑞拉和非洲国家',
            plantio: '三季：雨季、旱季和冬季',
            importancia: '巴西饮食中的主要蛋白质来源',
            curiosidade: '巴西是世界最大的豆类消费国'
          }
        },
        {
          name: '咖啡',
          image: 'https://images.unsplash.com/photo-1740993384782-369875958aa9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVpaiVDMyVBM28lMjBuYXMlMjBtJUMzJUEzb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500',
          info: {
            producao: '5470万袋（2024）',
            principais_estados: ['米纳斯吉拉斯', '圣保罗', '圣埃斯皮里图'],
            exportacao: '美国、德国、意大利和日本',
            plantio: '10月至3月',
            importancia: '世界主要咖啡出口国',
            curiosidade: '占世界咖啡产量的40%'
          }
        }
      ];
    } else {
      // Português (padrão)
      return [
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
    }
  };
  
  const grains = getGrainsData();

  return (
    <section className='agro-grains-section'>
      <h2 className='agro-section-title'>{t('grains.title')}</h2>
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
              <img src={grain.image} alt={`${t('grains.productionOf')} ${grain.name}`} />
            </div>
            <h3 className='agro-grain-title'>{grain.name}</h3>
            <div className='agro-grain-info'>
              <p><strong>{t('grains.production')}:</strong> {grain.info.producao}</p>
              <p><strong>{t('grains.mainStates')}:</strong> {grain.info.principais_estados.join(', ')}</p>
              <p><strong>{t('grains.export')}:</strong> {grain.info.exportacao}</p>
              <p><strong>{t('grains.planting')}:</strong> {grain.info.plantio}</p>
              <p><strong>{t('grains.importance')}:</strong> {grain.info.importancia}</p>
              <p><strong>{t('grains.curiosity')}:</strong> {grain.info.curiosidade}</p>
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