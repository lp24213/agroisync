import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
  description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">AGROTM.SOL</div>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-white hover:text-green-200 transition-colors">Home</a>
              <a href="/marketplace" className="text-white hover:text-green-200 transition-colors">Marketplace</a>
              <a href="/staking" className="text-white hover:text-green-200 transition-colors">Staking</a>
              <a href="/governance" className="text-white hover:text-green-200 transition-colors">Governança</a>
              <a href="/dashboard" className="text-white hover:text-green-200 transition-colors">Dashboard</a>
            </div>
            <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-100 transition-colors">
              Conectar Carteira
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
          AGROTM.SOL
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-4xl mx-auto">
          Revolucione a Agricultura com DeFi na Solana
        </p>
        <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
          A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, 
          governança descentralizada e sustentabilidade em uma única plataforma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-100 transition-colors">
            Entrar na Plataforma
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-white/10 transition-colors">
            Saiba Mais
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Principais Funcionalidades
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Staking Sustentável</h3>
            <p className="text-white/80">
              Stake seus tokens e ganhe recompensas enquanto apoia projetos agrícolas sustentáveis.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-white mb-4">NFTs Agrícolas</h3>
            <p className="text-white/80">
              Tokenize propriedades rurais e participe do mercado de NFTs agrícolas.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Governança</h3>
            <p className="text-white/80">
              Participe das decisões da plataforma através de votação descentralizada.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">$50M+</div>
            <div className="text-white/80">TVL Total</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/80">Usuários Ativos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80">Projetos Sustentáveis</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">15%</div>
            <div className="text-white/80">APY Médio</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">AGROTM.SOL</h3>
              <p className="text-white/80">
                Revolucionando a agricultura com tecnologia blockchain.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="/marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="/staking" className="hover:text-white transition-colors">Staking</a></li>
                <li><a href="/nfts" className="hover:text-white transition-colors">NFTs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Comunidade</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="/governance" className="hover:text-white transition-colors">Governança</a></li>
                <li><a href="/docs" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="https://twitter.com/agrotm" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://discord.gg/agrotm" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://github.com/agrotm" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 AGROTM.SOL. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
