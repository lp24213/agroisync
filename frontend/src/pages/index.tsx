import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  CubeIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const Home: NextPage = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'Dashboard Inteligente',
      description: 'Monitore suas operações agrícolas em tempo real com análises avançadas e insights preditivos.',
      color: 'text-blue-600'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Staking de Tokens',
      description: 'Ganhe recompensas fazendo stake dos seus tokens AGRO e participe da governança da plataforma.',
      color: 'text-green-600'
    },
    {
      icon: CubeIcon,
      title: 'NFTs Agrícolas',
      description: 'Tokenize suas propriedades rurais, equipamentos e colheitas como NFTs únicos e negociáveis.',
      color: 'text-purple-600'
    },
    {
      icon: ShoppingCartIcon,
      title: 'Marketplace Digital',
      description: 'Compre e venda produtos agrícolas, insumos e serviços em nossa plataforma segura.',
      color: 'text-orange-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Segurança Blockchain',
      description: 'Todas as transações são protegidas pela tecnologia blockchain mais avançada do mercado.',
      color: 'text-red-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Conectividade Global',
      description: 'Conecte-se com produtores e compradores de todo o mundo em nossa rede descentralizada.',
      color: 'text-indigo-600'
    }
  ]

  const stats = [
    { label: 'Usuários Ativos', value: '1,250+', change: '+12%', changeType: 'positive' },
    { label: 'Volume Mensal', value: '2.5M AGRO', change: '+8%', changeType: 'positive' },
    { label: 'Transações', value: '5,678+', change: '+15%', changeType: 'positive' },
    { label: 'NFTs Criados', value: '89+', change: '+23%', changeType: 'positive' }
  ]

  return (
    <>
      <Head>
        <title>AgroSync - Plataforma de Agricultura Inteligente</title>
        <meta name="description" content="Plataforma de agricultura inteligente e tokenização com Web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              O Futuro da{' '}
              <span className="text-green-600">Agricultura</span>
              <br />
              é Digital
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conecte-se ao futuro da agricultura com nossa plataforma inovadora de tokenização, 
              staking e marketplace digital. Transforme seus ativos rurais em oportunidades de investimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                Começar Agora
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o AgroSync?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma oferece todas as ferramentas necessárias para modernizar 
              sua operação agrícola e maximizar seus retornos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className={`mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para revolucionar sua agricultura?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de produtores que já estão aproveitando 
            as vantagens da agricultura digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              Criar Conta Gratuita
            </Button>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-green-600">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
