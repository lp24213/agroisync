/* eslint-disable no-console */
// PUBLIC API WORKER - DADOS LIMITADOS PARA VISUALIZAÇÃO PÚBLICA
// APENAS INFORMAÇÕES BÁSICAS - DADOS SENSÍVEIS APENAS PARA ASSINANTES

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // PRODUTOS PÚBLICOS - APENAS: nome, categoria, cidade/estado, preço por ton
    if (url.pathname === '/api/public/products' && request.method === 'GET') {
      try {
        const products = await env.DB.prepare(
          `
          SELECT 
            p.id, 
            p.name, 
            p.category, 
            p.origin as state,
            p.price,
            p.unit,
            p.created_at
          FROM products p
          WHERE p.status = 'active'
          ORDER BY p.created_at DESC
          LIMIT 20
        `
        ).all();

        // Converter preço para R$ por tonelada
        const publicProducts = products.results.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          state: product.state,
          pricePerTon: product.unit === 'sacas' ? product.price * 0.06 : product.price, // 1 saca = 60kg = 0.06 ton
          unit: 'ton',
          postedAt: new Date(product.created_at * 1000).toLocaleDateString('pt-BR')
        }));

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Produtos disponíveis',
            data: publicProducts,
            note: 'Para ver telefone do vendedor e localização exata, assine um plano'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('❌ Erro ao buscar produtos públicos:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao buscar produtos'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // FRETES PÚBLICOS - APENAS: origem/destino, preço por km, capacidade
    if (url.pathname === '/api/public/freight' && request.method === 'GET') {
      try {
        const freight = await env.DB.prepare(
          `
          SELECT 
            f.id,
            f.origin_city,
            f.origin_state,
            f.destination_city,
            f.destination_state,
            f.price_per_km,
            f.capacity,
            f.vehicle_type,
            f.created_at
          FROM freight f
          WHERE f.status = 'available'
          ORDER BY f.created_at DESC
          LIMIT 20
        `
        ).all();

        const publicFreight = freight.results.map(f => ({
          id: f.id,
          route: `${f.origin_city}/${f.origin_state} → ${f.destination_city}/${f.destination_state}`,
          pricePerKm: f.price_per_km,
          capacity: f.capacity,
          vehicleType: f.vehicle_type,
          postedAt: new Date(f.created_at * 1000).toLocaleDateString('pt-BR')
        }));

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Fretes disponíveis',
            data: publicFreight,
            note: 'Para ver telefone do transportador e dados da empresa, assine um plano'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('❌ Erro ao buscar fretes públicos:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao buscar fretes'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // LOJAS PÚBLICAS - APENAS: nome da loja, cidade/estado, tipo de negócio
    if (url.pathname === '/api/public/stores' && request.method === 'GET') {
      try {
        const stores = await env.DB.prepare(
          `
          SELECT 
            s.id,
            s.store_name,
            s.city,
            s.state,
            s.business_type,
            s.created_at
          FROM stores s
          WHERE s.status = 'active'
          ORDER BY s.created_at DESC
          LIMIT 20
        `
        ).all();

        const publicStores = stores.results.map(store => ({
          id: store.id,
          storeName: store.store_name,
          location: `${store.city}/${store.state}`,
          businessType: store.business_type,
          postedAt: new Date(store.created_at * 1000).toLocaleDateString('pt-BR')
        }));

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Lojas disponíveis',
            data: publicStores,
            note: 'Para ver telefone, endereço completo e CNPJ, assine um plano'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('❌ Erro ao buscar lojas públicas:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao buscar lojas'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // DADOS COMPLETOS PARA ASSINANTES - COM TELEFONE E DADOS SENSÍVEIS
    if (url.pathname === '/api/subscriber/products' && request.method === 'GET') {
      try {
        // Verificar se usuário tem plano ativo (implementar lógica de assinatura)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Token de assinatura necessário'
            }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const products = await env.DB.prepare(
          `
          SELECT 
            p.id, 
            p.name, 
            p.description,
            p.category, 
            p.price,
            p.quantity,
            p.unit,
            p.origin,
            p.quality_grade,
            p.harvest_date,
            p.certifications,
            p.images,
            p.created_at,
            u.name as seller_name,
            u.phone as seller_phone,
            u.email as seller_email
          FROM products p
          JOIN users u ON p.user_id = u.id
          WHERE p.status = 'active'
          ORDER BY p.created_at DESC
          LIMIT 20
        `
        ).all();

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Dados completos para assinantes',
            data: products.results || []
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('❌ Erro ao buscar dados de assinantes:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao buscar dados'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Rota não encontrada
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Rota não encontrada'
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
