/* eslint-disable no-console */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Rotas de Pagamento - Planos
    if (url.pathname === '/api/payment/plans' && request.method === 'GET') {
      const plans = [
        {
          id: 'basico',
          name: 'Básico',
          price: 14.99,
          description: 'Ideal para começar no agronegócio',
          features: [
            '1 anúncio de produto por mês',
            'Suporte por email',
            'Dashboard básico',
            'Relatórios simples'
          ],
          popular: false,
          color: 'green'
        },
        {
          id: 'profissional',
          name: 'Profissional',
          price: 29.99,
          description: 'Para produtores em crescimento',
          features: [
            '3 anúncios de produtos por mês',
            'Suporte prioritário',
            'Dashboard avançado',
            'Relatórios detalhados',
            'Prioridade nas buscas'
          ],
          popular: true,
          color: 'blue'
        },
        {
          id: 'empresarial',
          name: 'Empresarial',
          price: 149.99,
          description: 'Para grandes operações',
          features: [
            '20 anúncios de produtos por mês',
            'Suporte 24/7',
            'Dashboard personalizado',
            'Relatórios avançados',
            'API de integração',
            'Notificações personalizadas'
          ],
          popular: false,
          color: 'purple'
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 459.99,
          description: 'Para grandes empresas',
          features: [
            'Anúncios ilimitados',
            'Suporte 24/7 dedicado',
            'Dashboard personalizado',
            'Relatórios avançados',
            'API completa',
            'Notificações personalizadas',
            'Gerente de conta dedicado',
            'Treinamento especializado',
            'Prioridade máxima'
          ],
          popular: false,
          color: 'gold'
        }
      ];

      return new Response(
        JSON.stringify({
          success: true,
          data: { plans }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Processar Pagamento
    if (url.pathname === '/api/payment/process' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { planId, paymentMethod, amount, userEmail } = body;

        const validPlans = {
          basico: 14.99,
          profissional: 29.99,
          empresarial: 149.99,
          premium: 459.99
        };

        if (!validPlans[planId]) {
          return new Response(JSON.stringify({ success: false, message: 'Plano inválido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (amount !== validPlans[planId]) {
          return new Response(
            JSON.stringify({ success: false, message: 'Valor incorreto para o plano' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Simular processamento de pagamento
        const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Pagamento processado com sucesso',
            data: {
              paymentId,
              planId,
              amount,
              status: 'completed',
              redirectUrl: '/payment/success'
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        return new Response(
          JSON.stringify({ success: false, message: 'Erro ao processar pagamento' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Rota não encontrada
    return new Response(JSON.stringify({ success: false, message: 'Rota não encontrada' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
