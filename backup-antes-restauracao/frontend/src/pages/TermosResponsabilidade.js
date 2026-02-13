import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const TermosResponsabilidade = () => {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '50px', textAlign: 'center' }}
      >
        <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px' }}>
          Termos de Responsabilidade
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
          A Agroisync é uma <strong>plataforma intermediadora</strong> que conecta compradores, 
          vendedores e freteiros do agronegócio. Entenda as responsabilidades de cada parte.
        </p>
      </motion.div>

      {/* AVISO IMPORTANTE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '3px solid #f59e0b',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '40px'
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>
              ⚠️ Importante: Plataforma Intermediadora
            </h3>
            <p style={{ color: '#78350f', fontSize: '15px', lineHeight: '1.7', marginBottom: '12px' }}>
              A <strong>Agroisync NÃO se responsabiliza</strong> por:
            </p>
            <ul style={{ color: '#78350f', fontSize: '15px', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>❌ Transporte ou entrega dos produtos</li>
              <li>❌ Qualidade, autenticidade ou estado dos produtos</li>
              <li>❌ Ações de usuários fora da plataforma</li>
              <li>❌ Danos durante o transporte</li>
              <li>❌ Fraudes entre usuários (mas temos sistemas de prevenção)</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* O QUE A AGROISYNC FAZ */}
      <Section
        title="O que a Agroisync FORNECE"
        icon={<CheckCircle className="w-7 h-7 text-green-600" />}
        color="#ecfdf5"
        borderColor="#10b981"
      >
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Plataforma de conexão:</strong> Conectamos compradores, vendedores e freteiros</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Sistema de pagamento seguro:</strong> Opcional, com proteção de dados</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Sistema de avaliações:</strong> Para criar reputação e confiança</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Verificação de usuários:</strong> CPF/CNPJ validados</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Suporte a disputas:</strong> Mediação em casos de conflito</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Cotações em tempo real:</strong> CEPEA, B3, Agrolink</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>IA e analytics:</strong> Insights de mercado e precificação</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span><strong>Suporte técnico:</strong> Para todos os usuários</span>
          </li>
        </ul>
      </Section>

      {/* RESPONSABILIDADES DO VENDEDOR */}
      <Section
        title="Responsabilidades do VENDEDOR"
        icon={<Info className="w-7 h-7 text-blue-600" />}
        color="#eff6ff"
        borderColor="#3b82f6"
      >
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px' }}>
          <li>✓ Garantir qualidade e autenticidade do produto</li>
          <li>✓ Descrever produto com precisão (fotos, especificações)</li>
          <li>✓ Organizar e pagar o transporte (ou contratar freteiro)</li>
          <li>✓ Entregar produto conforme anunciado</li>
          <li>✓ Responder por problemas de qualidade</li>
          <li>✓ Cumprir prazos acordados</li>
          <li>✓ Fornecer nota fiscal (quando aplicável)</li>
        </ul>
      </Section>

      {/* RESPONSABILIDADES DO COMPRADOR */}
      <Section
        title="Responsabilidades do COMPRADOR"
        icon={<Info className="w-7 h-7 text-purple-600" />}
        color="#faf5ff"
        borderColor="#8b5cf6"
      >
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px' }}>
          <li>✓ Conferir produto ao receber</li>
          <li>✓ Pagar conforme acordado</li>
          <li>✓ Avaliar vendedor após recebimento (obrigatório)</li>
          <li>✓ Reportar problemas em até 48h</li>
          <li>✓ Não solicitar devolução sem motivo</li>
        </ul>
      </Section>

      {/* RESPONSABILIDADES DO FRETEIRO */}
      <Section
        title="Responsabilidades do FRETEIRO"
        icon={<Info className="w-7 h-7 text-orange-600" />}
        color="#fff7ed"
        borderColor="#f97316"
      >
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px' }}>
          <li>✓ Transportar carga com segurança</li>
          <li>✓ Responder por danos durante transporte</li>
          <li>✓ Fornecer rastreamento GPS</li>
          <li>✓ Ter seguro de carga (altamente recomendado)</li>
          <li>✓ Cumprir prazos de entrega</li>
          <li>✓ Embalar adequadamente a carga</li>
        </ul>
      </Section>

      {/* SISTEMA DE PROTEÇÃO */}
      <Section
        title="Sistema de Proteção Agroisync"
        icon={<Shield className="w-7 h-7 text-green-600" />}
        color="#ecfdf5"
        borderColor="#10b981"
      >
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>
              🛡️ Como nos protegemos de fraudes:
            </h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Verificação de CPF/CNPJ obrigatória</li>
              <li>Sistema de avaliações público</li>
              <li>Histórico de transações visível</li>
              <li>Pagamento em garantia (escrow) opcional</li>
              <li>IA de detecção de fraude</li>
              <li>Banimento permanente de fraudadores</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>
              💰 Pagamento Seguro (Opcional):
            </h4>
            <p style={{ marginBottom: '10px', lineHeight: '1.7' }}>
              Oferecemos sistema de <strong>pagamento em garantia (escrow)</strong>:
            </p>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Comprador paga para a Agroisync</li>
              <li>Vendedor envia o produto</li>
              <li>Comprador confirma recebimento</li>
              <li>Agroisync libera pagamento ao vendedor (menos comissão)</li>
            </ol>
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
              * Vendedor e comprador podem negociar pagamento direto (sem proteção da plataforma)
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>
              ⚖️ Resolução de Disputas:
            </h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Abra chamado em até 48h após recebimento</li>
              <li>Forneça provas (fotos, vídeos, documentos)</li>
              <li>Nossa equipe analisa em até 72h</li>
              <li>Decisão baseada em evidências e histórico</li>
              <li>Reembolso ou resolução conforme caso</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* COMISSÕES */}
      <Section
        title="Modelo de Comissões"
        icon={<span style={{ fontSize: '28px' }}>💰</span>}
        color="#fef2f2"
        borderColor="#ef4444"
      >
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '16px' }}>
            Como funciona:
          </h4>
          <ol style={{ paddingLeft: '20px', lineHeight: '2', fontSize: '15px' }}>
            <li><strong>Anúncio gratuito:</strong> Publique produtos sem custo</li>
            <li><strong>Negociação direta:</strong> Comprador e vendedor conversam diretamente</li>
            <li><strong>Comissão apenas em venda:</strong> Cobramos % apenas se venda for concluída VIA plataforma</li>
            <li><strong>Frete NÃO entra:</strong> Comissão é só sobre o produto (frete é por fora)</li>
          </ol>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>
            Tabela de Comissões:
          </h4>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Plano</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '700' }}>Comissão</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>Exemplo*</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px' }}>Gratuito</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#ef4444' }}>5%</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>R$ 500</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                <td style={{ padding: '12px' }}>Profissional</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#f59e0b' }}>3%</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>R$ 300</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Loja/Enterprise</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#10b981' }}>2%</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>R$ 200</td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
            * Exemplo para venda de R$ 10.000 (frete não incluído)
          </p>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#fef2f2',
          borderRadius: '10px',
          border: '1px solid #fecaca'
        }}>
          <p style={{ fontSize: '14px', color: '#991b1b', fontWeight: '600', marginBottom: '8px' }}>
            🔴 QUANDO NÃO COBRAMOS COMISSÃO:
          </p>
          <ul style={{ fontSize: '14px', color: '#991b1b', paddingLeft: '20px', lineHeight: '1.7' }}>
            <li>Contato inicial entre usuários (grátis)</li>
            <li>Negociação e troca de mensagens (grátis)</li>
            <li>Consulta de preços e cotações (grátis)</li>
            <li>Vendas fora da plataforma (sem proteção, mas sem custo)</li>
          </ul>
        </div>
      </Section>

      {/* SISTEMA DE AVALIAÇÕES */}
      <Section
        title="Sistema de Avaliações e Confiança"
        icon={<span style={{ fontSize: '28px' }}>⭐</span>}
        color="#fffbeb"
        borderColor="#fbbf24"
      >
        <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
          Para garantir segurança e confiança, implementamos:
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div style={{ padding: '16px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', fontSize: '15px' }}>
              Para Vendedores:
            </h4>
            <ul style={{ fontSize: '14px', paddingLeft: '20px', lineHeight: '1.7' }}>
              <li>Rating de 1 a 5 estrelas</li>
              <li>Comentários públicos</li>
              <li>Histórico de vendas visível</li>
              <li>Selo de "Verificado"</li>
              <li>Penalização por fraude</li>
            </ul>
          </div>

          <div style={{ padding: '16px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', fontSize: '15px' }}>
              Para Compradores:
            </h4>
            <ul style={{ fontSize: '14px', paddingLeft: '20px', lineHeight: '1.7' }}>
              <li>Avaliar vendedor após compra</li>
              <li>Reportar problemas em 48h</li>
              <li>Histórico de compras protegido</li>
              <li>Badge de "Comprador Confiável"</li>
              <li>Acesso a suporte</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* DICAS DE SEGURANÇA */}
      <Section
        title="Dicas de Segurança"
        icon={<Shield className="w-7 h-7 text-red-600" />}
        color="#fef2f2"
        borderColor="#ef4444"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '12px', color: '#991b1b' }}>
              ✅ FAÇA:
            </h4>
            <ul style={{ fontSize: '14px', paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
              <li>Verifique o rating do vendedor</li>
              <li>Leia as avaliações de outros compradores</li>
              <li>Use o sistema de pagamento da plataforma</li>
              <li>Peça comprovantes e documentos</li>
              <li>Confira o produto ao receber</li>
              <li>Avalie após cada transação</li>
              <li>Reporte qualquer suspeita</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '12px', color: '#991b1b' }}>
              ❌ NÃO FAÇA:
            </h4>
            <ul style={{ fontSize: '14px', paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
              <li>Pagar fora da plataforma sem garantias</li>
              <li>Aceitar "ofertas milagrosas"</li>
              <li>Comprar sem ver avaliações</li>
              <li>Ignorar vendedores não verificados</li>
              <li>Compartilhar dados bancários por mensagem</li>
              <li>Pular a conferência ao receber</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <div style={{
        marginTop: '50px',
        padding: '30px',
        background: '#f9fafb',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '16px', lineHeight: '1.7' }}>
          Ao usar a Agroisync, você concorda com estes termos de responsabilidade.
          Leia os <a href="/terms" style={{ color: '#2F5233', fontWeight: '600' }}>Termos de Uso Completos</a>.
        </p>
        
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children, color, borderColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    style={{
      background: color,
      border: `2px solid ${borderColor}`,
      borderRadius: '16px',
      padding: '28px',
      marginBottom: '30px'
    }}
  >
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
      {icon}
      <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
        {title}
      </h3>
    </div>
    
    <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#374151' }}>
      {children}
    </div>
  </motion.div>
);

export default TermosResponsabilidade;

