import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Zap,
  Star,
  Award,
  Target,
  BarChart3,
  Clock,
  Phone,
  Mail,
  FileText,
  Calculator,
  Camera,
  Edit,
  Globe,
  Heart
} from 'lucide-react';

const MarketplaceSell = () => {
  const steps = [
    {
      number: 1,
      title: 'Crie sua conta gratuita',
      description: 'Cadastre-se rapidamente com seu e-mail e verifique sua conta. Processo simples e seguro.',
      icon: Users,
      color: 'blue',
      details: [
        'Verificação de e-mail obrigatória',
        'Validação básica de CPF/CNPJ',
        'Sem custos para começar',
        'Suporte 24/7 durante o cadastro'
      ]
    },
    {
      number: 2,
      title: 'Configure sua loja virtual',
      description: 'Personalize seu perfil comercial com informações completas sobre seu negócio.',
      icon: Edit,
      color: 'green',
      details: [
        'Logo e banner da empresa',
        'Descrição detalhada do negócio',
        'Informações de contato e localização',
        'Especialidades e certificações'
      ]
    },
    {
      number: 3,
      title: 'Cadastre seus produtos',
      description: 'Adicione produtos com fotos de qualidade e informações completas.',
      icon: Camera,
      color: 'orange',
      details: [
        'Fotos em alta resolução',
        'Descrições detalhadas',
        'Preços e condições de venda',
        'Especificações técnicas completas'
      ]
    },
    {
      number: 4,
      title: 'Publique e ganhe visibilidade',
      description: 'Seus produtos ficam disponíveis para milhões de compradores no maior marketplace do agro.',
      icon: TrendingUp,
      color: 'purple',
      details: [
        'Alcance nacional instantâneo',
        'Sistema de busca inteligente',
        'Recomendações personalizadas',
        'Analytics de performance'
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Taxas Competitivas',
      description: 'Comissões justas que valorizam seu trabalho. Sem taxas ocultas.',
      value: 'A partir de 2,5%'
    },
    {
      icon: Users,
      title: 'Milhões de Compradores',
      description: 'Alcance produtores rurais em todo o Brasil com um clique.',
      value: '3M+ usuários ativos'
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Sistema de proteção que garante segurança nas transações.',
      value: '100% protegido'
    },
    {
      icon: Zap,
      title: 'Tecnologia IA',
      description: 'Inteligência artificial otimiza seus anúncios e preços.',
      value: 'Otimização automática'
    }
  ];

  const testimonials = [
    {
      name: 'João Silva',
      business: 'Sementes Silva Ltda',
      rating: 5,
      text: 'Em 6 meses vendi mais do que em 2 anos trabalhando sozinho. A plataforma é incrível!',
      location: 'Rio Grande do Sul'
    },
    {
      name: 'Maria Santos',
      business: 'AgroFert Distribuidora',
      rating: 5,
      text: 'O suporte é excepcional e as vendas aumentaram 300%. Recomendo para todos!',
      location: 'São Paulo'
    },
    {
      name: 'Carlos Oliveira',
      business: 'Máquinas Oliveira',
      rating: 5,
      text: 'Interface intuitiva e clientes qualificados. Melhor investimento que fiz.',
      location: 'Minas Gerais'
    }
  ];

  const faqs = [
    {
      question: 'Quanto custa para começar a vender?',
      answer: 'Completamente gratuito! Você só paga comissão sobre as vendas realizadas.'
    },
    {
      question: 'Preciso ter CNPJ para vender?',
      answer: 'Sim, é obrigatório ter CNPJ válido para garantir segurança jurídica nas transações.'
    },
    {
      question: 'Como recebo o dinheiro das vendas?',
      answer: 'Transferência bancária automática para sua conta em até 15 dias após a confirmação da entrega.'
    },
    {
      question: 'Posso vender qualquer produto agrícola?',
      answer: 'Aceitamos produtos agrícolas autorizados pelos órgãos competentes, sempre priorizando qualidade e segurança.'
    },
    {
      question: 'Como funciona o suporte?',
      answer: 'Suporte completo via chat, telefone e e-mail. Equipe especializada em agronegócio disponível 24/7.'
    },
    {
      question: 'Posso cancelar minha conta a qualquer momento?',
      answer: 'Sim, você pode pausar ou encerrar sua conta quando quiser, sem multas ou taxas de cancelamento.'
    }
  ];

  const getStepColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colors[color] || colors.blue;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'>
      {/* Hero Section */}
      <div className='bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl'>
              Comece a Vender Hoje Mesmo
            </h1>
            <p className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto'>
              Junte-se a milhares de vendedores de sucesso no maior marketplace do agronegócio brasileiro.
              Alcance milhões de compradores com tecnologia de ponta e suporte completo.
            </p>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center'>
              <Link
                to='/signup/store'
                className='inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                <TrendingUp className='mr-2 h-6 w-6' />
                Criar Conta Gratuita
              </Link>
              <Link
                to='/contato'
                className='inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                <Phone className='mr-2 h-6 w-6' />
                Falar com Consultor
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className='mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-green-600'>50K+</div>
                <div className='text-sm text-gray-600'>Vendedores Ativos</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-blue-600'>R$ 2.5M+</div>
                <div className='text-sm text-gray-600'>Vendidos Mensalmente</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-600'>4.8/5</div>
                <div className='text-sm text-gray-600'>Avaliação Média</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-purple-600'>24/7</div>
                <div className='text-sm text-gray-600'>Suporte Especializado</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        {/* Steps Section */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              4 Passos Simples para Começar
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Processo transparente e sem burocracias desnecessárias
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className={`relative rounded-2xl border-2 bg-white p-8 shadow-lg ${getStepColor(step.color)}`}>
                  <div className='flex items-center mb-6'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md'>
                      <IconComponent className='h-6 w-6' />
                    </div>
                    <div className='ml-4'>
                      <div className='flex items-center'>
                        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white'>
                          {step.number}
                        </span>
                        <h3 className='ml-3 text-xl font-bold text-gray-900'>{step.title}</h3>
                      </div>
                    </div>
                  </div>

                  <p className='mb-6 text-gray-700 leading-relaxed'>
                    {step.description}
                  </p>

                  <ul className='space-y-2'>
                    {step.details.map((detail, idx) => (
                      <li key={idx} className='flex items-center text-sm text-gray-600'>
                        <CheckCircle className='mr-2 h-4 w-4 text-green-500 flex-shrink-0' />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {index < steps.length - 1 && (
                    <div className='absolute -bottom-4 left-1/2 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-md lg:flex'>
                      <TrendingUp className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              Por que vender conosco?
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Vantagens exclusivas para vendedores do agronegócio
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className='rounded-xl bg-white p-6 shadow-lg text-center'>
                  <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                    <IconComponent className='h-6 w-6 text-green-600' />
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>{benefit.title}</h3>
                  <p className='mb-4 text-sm text-gray-600'>{benefit.description}</p>
                  <div className='text-lg font-bold text-green-600'>{benefit.value}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              Histórias de Sucesso
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Veja o que nossos vendedores dizem sobre a plataforma
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='rounded-xl bg-white p-6 shadow-lg'>
                <div className='mb-4 flex items-center'>
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className='mb-4 text-gray-700 italic'>
                  "{testimonial.text}"
                </blockquote>
                <div className='flex items-center'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold'>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className='ml-3'>
                    <div className='font-semibold text-gray-900'>{testimonial.name}</div>
                    <div className='text-sm text-gray-600'>{testimonial.business}</div>
                    <div className='text-xs text-gray-500'>{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              Perguntas Frequentes
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Tire suas dúvidas sobre venda na plataforma
            </p>
          </div>

          <div className='mx-auto max-w-4xl space-y-4'>
            {faqs.map((faq, index) => (
              <details key={index} className='group rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <summary className='flex cursor-pointer items-center justify-between font-semibold text-gray-900 hover:text-green-600 transition-colors'>
                  <span>{faq.question}</span>
                  <span className='ml-6 flex-shrink-0'>
                    <svg className='h-5 w-5 rotate-0 transform transition-transform duration-200 group-open:rotate-180' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </span>
                </summary>
                <div className='mt-4 text-gray-700'>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='rounded-2xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-white text-center shadow-xl'>
          <Award className='mx-auto mb-6 h-16 w-16' />
          <h2 className='mb-4 text-4xl font-bold'>Pronto para começar sua jornada?</h2>
          <p className='mb-8 text-xl opacity-90 max-w-3xl mx-auto'>
            Milhares de vendedores já transformaram seus negócios conosco.
            Seu sucesso no agronegócio começa hoje!
          </p>

          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Link
              to='/signup/store'
              className='inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-green-600 shadow-lg hover:bg-gray-50 transition-colors'
            >
              <TrendingUp className='mr-2 h-6 w-6' />
              Começar Agora - É Grátis!
            </Link>

            <Link
              to='/contato'
              className='inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors'
            >
              <Phone className='mr-2 h-6 w-6' />
              Agendar Demonstração
            </Link>
          </div>

          <div className='mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-75'>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4' />
              Sem taxas de adesão
            </div>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4' />
              Suporte especializado
            </div>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4' />
              Tecnologia de ponta
            </div>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4' />
              Segurança garantida
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketplaceSell;
