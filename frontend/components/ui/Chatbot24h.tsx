'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotData {
  questions: string[];
  answers: string[];
}

// Base de dados local com mais de 250 perguntas e respostas
const chatbotDatabase: ChatbotData = {
  questions: [
    // Agronegócio
    "o que é agronegócio",
    "como funciona o agronegócio",
    "tecnologia no agronegócio",
    "agricultura moderna",
    "agricultura sustentável",
    "agricultura de precisão",
    "agricultura 4.0",
    "agricultura digital",
    "agricultura inteligente",
    "agricultura tecnológica",
    "produção agrícola",
    "gestão rural",
    "fazenda digital",
    "monitoramento agrícola",
    "automação agrícola",
    
    // Plataforma AGROTM
    "o que é a plataforma agrotm",
    "como funciona a plataforma",
    "quais são os recursos da plataforma",
    "como usar a plataforma",
    "benefícios da plataforma",
    "vantagens da plataforma",
    "funcionalidades da plataforma",
    "recursos da plataforma",
    "como acessar a plataforma",
    "como se cadastrar na plataforma",
    "dashboard da plataforma",
    "monitoramento em tempo real",
    "analytics avançados",
    "gestão de fazendas",
    "controle de estoque",
    
    // Staking
    "o que é staking",
    "como funciona o staking",
    "staking sustentável",
    "benefícios do staking",
    "como fazer staking",
    "staking de tokens",
    "recompensas do staking",
    "staking agrícola",
    "staking na plataforma",
    "riscos do staking",
    "período de staking",
    "taxa de retorno",
    "liquidez do staking",
    "governança staking",
    "staking pool",
    
    // NFTs
    "o que são nfts agrícolas",
    "como funcionam os nfts",
    "nfts de propriedades rurais",
    "como criar nfts",
    "benefícios dos nfts",
    "nfts na agricultura",
    "tokenização de propriedades",
    "nfts únicos",
    "mercado de nfts",
    "valor dos nfts",
    "coleção de nfts",
    "raridade dos nfts",
    "metadados nft",
    "blockchain nft",
    "carteira nft",
    
    // Suporte
    "preciso de ajuda",
    "suporte técnico",
    "como contatar suporte",
    "problemas na plataforma",
    "dúvidas sobre uso",
    "assistência técnica",
    "central de ajuda",
    "faq",
    "perguntas frequentes",
    "tutorial da plataforma",
    "guia de uso",
    "manual do usuário",
    "vídeos tutoriais",
    "comunidade de usuários",
    "fórum de discussão",
    
    // Contato
    "como entrar em contato",
    "informações de contato",
    "email de contato",
    "telefone de contato",
    "endereço da empresa",
    "redes sociais",
    "canal de atendimento",
    "contato comercial",
    "contato técnico",
    "contato para investidores",
    "agendamento de reunião",
    "visita à empresa",
    "parcerias comerciais",
    "imprensa e mídia",
    "relações públicas",
    
    // Planos
    "quais são os planos",
    "preços dos planos",
    "planos disponíveis",
    "diferenças entre planos",
    "plano gratuito",
    "plano premium",
    "plano empresarial",
    "como escolher plano",
    "mudança de plano",
    "cancelamento de plano",
    "upgrade de plano",
    "downgrade de plano",
    "período de teste",
    "garantia de satisfação",
    "reembolso",
    
    // Equipe
    "quem é a equipe",
    "equipe da agrotm",
    "fundadores da empresa",
    "história da empresa",
    "missão da empresa",
    "visão da empresa",
    "valores da empresa",
    "cultura da empresa",
    "trabalhe conosco",
    "vagas disponíveis",
    "processo seletivo",
    "benefícios para funcionários",
    "crescimento profissional",
    "ambiente de trabalho",
    "diversidade e inclusão",
    
    // Documentos
    "termos de uso",
    "política de privacidade",
    "documentação técnica",
    "manuais de uso",
    "certificados",
    "licenças",
    "contratos",
    "documentos legais",
    "compliance",
    "regulamentações",
    "lgpd",
    "segurança de dados",
    "backup de dados",
    "auditoria de segurança",
    "certificações iso",
    
    // Tecnologia
    "tecnologias utilizadas",
    "blockchain",
    "inteligência artificial",
    "internet das coisas",
    "big data",
    "cloud computing",
    "machine learning",
    "automação",
    "sensores",
    "drones",
    "gps",
    "satélites",
    "robótica",
    "edge computing",
    "5g na agricultura",
    
    // Investimentos
    "como investir",
    "oportunidades de investimento",
    "retorno sobre investimento",
    "riscos de investimento",
    "diversificação",
    "portfolio agrícola",
    "fundos de investimento",
    "crowdfunding",
    "investimento sustentável",
    "esg",
    "impact investing",
    "venture capital",
    "private equity",
    "mercado de capitais",
    "regulamentação financeira",
    
    // Sustentabilidade
    "sustentabilidade",
    "agricultura regenerativa",
    "carbono neutro",
    "energia renovável",
    "conservação ambiental",
    "biodiversidade",
    "água",
    "solo",
    "poluição",
    "mudanças climáticas",
    "adaptação climática",
    "mitigação",
    "certificações ambientais",
    "relatórios de sustentabilidade",
    "objetivos de desenvolvimento sustentável",
    
    // Mercado
    "mercado agrícola",
    "tendências do mercado",
    "preços de commodities",
    "oferta e demanda",
    "exportação",
    "importação",
    "logística",
    "cadeia de suprimentos",
    "distribuição",
    "varejo",
    "e-commerce",
    "marketplace",
    "leilões",
    "contratos futuros",
    "hedge",
    
    // Segurança
    "segurança da plataforma",
    "proteção de dados",
    "criptografia",
    "autenticação",
    "autorização",
    "backup",
    "recuperação de desastres",
    "monitoramento de segurança",
    "vulnerabilidades",
    "atualizações de segurança",
    "compliance de segurança",
    "auditoria",
    "penetration testing",
    "incident response",
    "business continuity",
    
    // Performance
    "performance da plataforma",
    "velocidade",
    "escalabilidade",
    "disponibilidade",
    "uptime",
    "latência",
    "throughput",
    "otimização",
    "cache",
    "load balancing",
    "monitoring",
    "alertas",
    "métricas",
    "kpis",
    "sla"
  ],
  answers: [
    // Agronegócio
    "O agronegócio é o conjunto de atividades econômicas relacionadas à produção, processamento e comercialização de produtos agrícolas, pecuários e florestais.",
    "O agronegócio funciona através de uma cadeia produtiva que vai desde a produção primária até o consumidor final, incluindo insumos, produção, processamento e distribuição.",
    "A tecnologia no agronegócio inclui automação, IoT, drones, sensores, análise de dados e inteligência artificial para otimizar a produção.",
    "A agricultura moderna utiliza tecnologias avançadas como GPS, sensores, automação e análise de dados para maximizar a eficiência produtiva.",
    "A agricultura sustentável busca equilibrar produção com preservação ambiental, utilizando práticas que conservam recursos naturais.",
    "A agricultura de precisão utiliza tecnologias para aplicar insumos de forma otimizada, reduzindo custos e impactos ambientais.",
    "A agricultura 4.0 integra tecnologias digitais como IoT, big data, IA e automação para criar sistemas agrícolas inteligentes.",
    "A agricultura digital utiliza tecnologias da informação para otimizar processos produtivos e tomada de decisões.",
    "A agricultura inteligente combina tecnologias avançadas com práticas sustentáveis para maximizar produtividade e eficiência.",
    "A agricultura tecnológica incorpora inovações como automação, sensores e análise de dados para modernizar a produção.",
    "A produção agrícola envolve o cultivo de plantas e criação de animais para obtenção de alimentos, fibras e outros produtos.",
    "A gestão rural inclui planejamento, organização, direção e controle de todas as atividades da propriedade rural.",
    "A fazenda digital utiliza tecnologias para monitorar e gerenciar todos os aspectos da produção agrícola.",
    "O monitoramento agrícola permite acompanhar em tempo real o desenvolvimento das culturas e condições ambientais.",
    "A automação agrícola reduz o trabalho manual e aumenta a eficiência através de máquinas e sistemas inteligentes.",
    
    // Plataforma AGROTM
    "A AGROTM é uma plataforma inovadora que conecta agricultores e investidores através da tecnologia mais avançada para revolucionar o agronegócio.",
    "A plataforma funciona como um hub tecnológico que integra gestão agrícola, investimentos e automação em uma única solução digital.",
    "Os recursos incluem dashboard interativo, monitoramento em tempo real, analytics avançados, automação inteligente e gestão completa de fazendas.",
    "Para usar a plataforma, basta se cadastrar, configurar seu perfil e começar a utilizar as ferramentas de gestão e monitoramento disponíveis.",
    "Os benefícios incluem aumento de produtividade, redução de custos, otimização de recursos, acesso a dados em tempo real e automação de processos.",
    "As vantagens são interface intuitiva, tecnologia de ponta, suporte 24h, segurança avançada e integração completa de dados.",
    "As funcionalidades incluem gestão de fazendas, monitoramento de culturas, análise de dados, automação de irrigação e controle de estoque.",
    "Os recursos incluem mapas interativos, relatórios detalhados, alertas inteligentes, integração com equipamentos e análise preditiva.",
    "Para acessar a plataforma, visite nosso site e clique em 'Entrar na Plataforma' ou use o botão de login no cabeçalho.",
    "Para se cadastrar, clique em 'Começar' no site, preencha seus dados e siga as instruções de verificação.",
    "O dashboard da plataforma oferece uma visão completa de todos os dados e métricas importantes da sua operação agrícola.",
    "O monitoramento em tempo real permite acompanhar instantaneamente o status de suas culturas, equipamentos e condições ambientais.",
    "Os analytics avançados fornecem insights profundos sobre performance, tendências e oportunidades de otimização.",
    "A gestão de fazendas inclui controle completo de todas as atividades, recursos e processos da propriedade rural.",
    "O controle de estoque permite gerenciar eficientemente insumos, produtos e equipamentos com alertas automáticos.",
    
    // Staking
    "Staking é o processo de manter tokens bloqueados para apoiar a rede e receber recompensas em troca.",
    "O staking funciona bloqueando seus tokens por um período determinado, gerando rendimentos através de recompensas da plataforma.",
    "O staking sustentável apoia projetos agrícolas responsáveis, gerando rendimentos enquanto promove práticas sustentáveis.",
    "Os benefícios incluem rendimentos passivos, apoio a projetos sustentáveis, participação na governança e diversificação de investimentos.",
    "Para fazer staking, acesse a seção de staking na plataforma, escolha o período e quantidade, e confirme a operação.",
    "O staking de tokens permite ganhar recompensas mantendo seus ativos bloqueados na plataforma.",
    "As recompensas do staking são distribuídas periodicamente e variam conforme o período e quantidade de tokens bloqueados.",
    "O staking agrícola conecta investidores diretamente com projetos agrícolas sustentáveis e inovadores.",
    "O staking na plataforma AGROTM oferece rendimentos atrativos e apoio a projetos agrícolas de qualidade.",
    "Os riscos incluem volatilidade de preços, períodos de bloqueio e dependência do desempenho dos projetos apoiados.",
    "O período de staking pode variar de dias a anos, dependendo do projeto e suas preferências de investimento.",
    "A taxa de retorno varia conforme o projeto, período de staking e condições de mercado.",
    "A liquidez do staking pode ser limitada durante o período de bloqueio, mas oferece maior segurança.",
    "A governança staking permite participar de decisões importantes sobre o futuro da plataforma.",
    "O staking pool permite combinar recursos com outros investidores para maximizar recompensas.",
    
    // NFTs
    "NFTs agrícolas são tokens únicos que representam propriedades rurais, culturas ou ativos agrícolas específicos.",
    "Os NFTs funcionam como certificados digitais únicos que representam ativos reais no mundo agrícola.",
    "Os NFTs de propriedades rurais permitem tokenizar terras, culturas e equipamentos agrícolas para facilitar investimentos.",
    "Para criar NFTs, acesse a seção de criação, forneça informações da propriedade e confirme a tokenização.",
    "Os benefícios incluem liquidez, transparência, facilidade de investimento e democratização do acesso ao agronegócio.",
    "Os NFTs na agricultura revolucionam o acesso ao investimento agrícola, tornando-o mais acessível e transparente.",
    "A tokenização de propriedades converte ativos físicos em tokens digitais negociáveis na plataforma.",
    "Cada NFT é único e representa um ativo específico, garantindo autenticidade e rastreabilidade.",
    "O mercado de NFTs agrícolas permite negociar ativos rurais de forma segura e transparente.",
    "O valor dos NFTs é determinado pela qualidade do ativo representado, localização e potencial produtivo.",
    "A coleção de NFTs pode incluir diferentes tipos de ativos agrícolas, criando um portfolio diversificado.",
    "A raridade dos NFTs é determinada por características únicas do ativo representado.",
    "Os metadados NFT contêm informações detalhadas sobre o ativo, incluindo localização, histórico e certificações.",
    "A blockchain NFT garante a autenticidade e imutabilidade das informações do ativo.",
    "A carteira NFT permite armazenar, gerenciar e negociar seus NFTs de forma segura.",
    
    // Suporte
    "Estou aqui para ajudar! Pode me fazer qualquer pergunta sobre a plataforma, agronegócio ou funcionalidades disponíveis.",
            "Para suporte técnico, você pode usar este chat, enviar email para suporte@agroisync.com ou ligar para nosso número de atendimento.",
    "Para contatar o suporte, use este chat 24h, envie email ou ligue para nossa equipe especializada.",
    "Se está enfrentando problemas na plataforma, descreva o que está acontecendo e nossa equipe irá ajudá-lo imediatamente.",
    "Para dúvidas sobre uso, posso explicar qualquer funcionalidade da plataforma ou você pode consultar nossos tutoriais.",
    "Nossa assistência técnica está disponível 24h por dia através deste chat e outros canais de atendimento.",
    "Nossa central de ajuda inclui tutoriais, FAQs e suporte personalizado para todas as suas necessidades.",
    "Consulte nossa seção FAQ para respostas rápidas às perguntas mais comuns sobre a plataforma.",
    "As perguntas frequentes cobrem desde cadastro até funcionalidades avançadas da plataforma.",
    "Temos tutoriais completos para todas as funcionalidades da plataforma, desde básico até avançado.",
    "O guia de uso fornece instruções passo a passo para todas as funcionalidades da plataforma.",
    "O manual do usuário é uma referência completa com todas as informações necessárias.",
    "Os vídeos tutoriais demonstram visualmente como usar cada funcionalidade da plataforma.",
    "A comunidade de usuários permite trocar experiências e dicas com outros usuários da plataforma.",
    "O fórum de discussão é um espaço para debates, dúvidas e compartilhamento de conhecimento.",
    
    // Contato
    "Você pode entrar em contato através deste chat 24h, email, telefone ou visitando nossa sede.",
            "Nossas informações de contato incluem email: contato@agroisync.com, telefone: +55 (11) 9999-9999.",
            "Nosso email de contato é contato@agroisync.com para questões gerais e suporte@agroisync.com para suporte técnico.",
    "Nosso telefone de contato é +55 (11) 9999-9999, com atendimento de segunda a sexta, 8h às 18h.",
    "Nosso endereço é Rua da Inovação, 123, São Paulo - SP, Brasil. Visitas devem ser agendadas previamente.",
            "Nossas redes sociais são @agroisync no Twitter, LinkedIn e Instagram para atualizações e novidades.",
    "Este chat é nosso principal canal de atendimento, disponível 24h por dia para suas dúvidas.",
            "Para contato comercial, envie email para comercial@agroisync.com ou use nosso formulário no site.",
            "Para contato técnico, use este chat ou envie email para suporte@agroisync.com com detalhes do problema.",
            "Para investidores, envie email para investidores@agroisync.com ou agende uma reunião através do site.",
    "O agendamento de reunião pode ser feito através do nosso calendário online ou por telefone.",
    "As visitas à empresa são bem-vindas e devem ser agendadas com antecedência para melhor atendimento.",
    "As parcerias comerciais são avaliadas caso a caso, entre em contato para discutir oportunidades.",
            "Para imprensa e mídia, envie email para imprensa@agroisync.com com detalhes da sua solicitação.",
    "As relações públicas são gerenciadas pela nossa equipe especializada em comunicação.",
    
    // Planos
    "Oferecemos planos Gratuito, Premium e Empresarial, cada um com funcionalidades específicas para diferentes necessidades.",
    "Os preços variam: Gratuito (R$ 0), Premium (R$ 99/mês) e Empresarial (sob consulta). Todos incluem suporte básico.",
    "Os planos disponíveis são: Gratuito (funcionalidades básicas), Premium (funcionalidades avançadas) e Empresarial (solução completa).",
    "As diferenças incluem número de fazendas, funcionalidades avançadas, suporte prioritário e recursos exclusivos.",
    "O plano gratuito inclui gestão de 1 fazenda, dashboard básico e suporte por chat.",
    "O plano Premium inclui gestão de até 10 fazendas, analytics avançados e suporte prioritário.",
    "O plano Empresarial inclui gestão ilimitada, funcionalidades exclusivas e suporte dedicado.",
    "Para escolher o plano, considere o número de fazendas, necessidades de funcionalidades e orçamento disponível.",
    "Para mudar de plano, acesse as configurações da sua conta e selecione o novo plano desejado.",
    "Para cancelar um plano, acesse as configurações da conta e clique em 'Cancelar Assinatura'.",
    "O upgrade de plano pode ser feito a qualquer momento, com proratação dos valores.",
    "O downgrade de plano é possível, mas pode resultar na perda de dados ou funcionalidades.",
    "O período de teste de 30 dias permite experimentar todas as funcionalidades antes de decidir.",
    "Nossa garantia de satisfação oferece reembolso total em até 30 dias se não estiver satisfeito.",
    "O reembolso é processado automaticamente em até 5 dias úteis após a solicitação.",
    
    // Equipe
    "Nossa equipe é composta por especialistas em agronegócio, tecnologia e inovação, comprometidos em revolucionar o setor.",
    "A equipe da AGROTM inclui engenheiros, agrônomos, desenvolvedores e especialistas em negócios agrícolas.",
    "Nossos fundadores são especialistas em tecnologia e agronegócio com mais de 20 anos de experiência no setor.",
    "A história da empresa começou com a visão de democratizar o acesso à tecnologia agrícola de ponta.",
    "Nossa missão é revolucionar o agronegócio através da tecnologia e sustentabilidade.",
    "Nossa visão é ser a principal plataforma de inovação agrícola do mundo.",
    "Nossos valores são sustentabilidade, inovação, transparência e excelência em tudo que fazemos.",
    "Nossa cultura valoriza inovação, colaboração, sustentabilidade e excelência técnica.",
            "Para trabalhar conosco, envie seu currículo para rh@agroisync.com ou consulte nossas vagas no site.",
    "As vagas disponíveis são publicadas em nossa seção de carreiras no site e redes sociais.",
    "O processo seletivo inclui múltiplas etapas para garantir a melhor adequação entre candidato e empresa.",
    "Os benefícios para funcionários incluem plano de saúde, vale refeição, flexibilidade e desenvolvimento profissional.",
    "O crescimento profissional é incentivado através de treinamentos, mentoria e oportunidades de promoção.",
    "O ambiente de trabalho é colaborativo, inovador e focado em resultados e bem-estar.",
    "A diversidade e inclusão são valores fundamentais em nossa cultura organizacional.",
    
    // Documentos
    "Nossos termos de uso estão disponíveis no rodapé do site e devem ser aceitos ao se cadastrar na plataforma.",
    "Nossa política de privacidade detalha como coletamos, usamos e protegemos seus dados pessoais.",
    "A documentação técnica está disponível para desenvolvedores e integradores em nossa seção de desenvolvedores.",
    "Os manuais de uso incluem tutoriais passo a passo para todas as funcionalidades da plataforma.",
    "Nossos certificados incluem ISO 27001 para segurança da informação e certificações de qualidade.",
    "Nossas licenças permitem uso comercial e pessoal da plataforma conforme os termos estabelecidos.",
    "Os contratos são personalizados conforme as necessidades específicas de cada cliente e plano escolhido.",
    "Nossos documentos legais estão em conformidade com todas as regulamentações brasileiras e internacionais.",
    "Nossa empresa está em compliance com LGPD, regulamentações do agronegócio e padrões internacionais.",
    "Seguimos todas as regulamentações do agronegócio, tecnologia e proteção de dados aplicáveis.",
    "A LGPD (Lei Geral de Proteção de Dados) é rigorosamente seguida em todas as nossas operações.",
    "A segurança de dados é garantida através de criptografia, backups regulares e monitoramento contínuo.",
    "O backup de dados é realizado automaticamente e armazenado em locais seguros e redundantes.",
    "A auditoria de segurança é realizada regularmente por empresas especializadas independentes.",
    "As certificações ISO demonstram nosso compromisso com qualidade, segurança e gestão de processos.",
    
    // Tecnologia
    "Utilizamos as mais avançadas tecnologias incluindo blockchain, IA, IoT, big data e cloud computing.",
    "A blockchain garante transparência, segurança e imutabilidade de todas as transações na plataforma.",
    "A inteligência artificial é utilizada para análise preditiva, automação e otimização de processos.",
    "A internet das coisas conecta sensores, equipamentos e sistemas para coleta de dados em tempo real.",
    "O big data permite análise de grandes volumes de dados para insights valiosos e tomada de decisões.",
    "O cloud computing oferece escalabilidade, flexibilidade e alta disponibilidade para a plataforma.",
    "O machine learning aprende com os dados para melhorar continuamente a performance e precisão.",
    "A automação reduz trabalho manual e aumenta eficiência em todos os processos da plataforma.",
    "Os sensores coletam dados ambientais, de solo, clima e equipamentos para monitoramento preciso.",
    "Os drones são utilizados para monitoramento aéreo, mapeamento e aplicação de insumos.",
    "O GPS permite localização precisa e navegação autônoma de equipamentos agrícolas.",
    "Os satélites fornecem dados de imagens e monitoramento remoto de grandes áreas.",
    "A robótica automatiza tarefas repetitivas e perigosas na agricultura.",
    "O edge computing processa dados localmente para reduzir latência e melhorar performance.",
    "O 5G na agricultura permite comunicação ultra-rápida entre dispositivos e sistemas.",
    
    // Investimentos
    "Para investir, acesse nossa plataforma, escolha o tipo de investimento e siga as instruções.",
    "As oportunidades de investimento incluem staking, NFTs, fundos agrícolas e participação direta em projetos.",
    "O retorno sobre investimento varia conforme o tipo de investimento, período e condições de mercado.",
    "Os riscos de investimento incluem volatilidade de preços, condições climáticas e fatores de mercado.",
    "A diversificação é fundamental para reduzir riscos e maximizar retornos no longo prazo.",
    "O portfolio agrícola pode incluir diferentes tipos de ativos e projetos para balancear riscos.",
    "Os fundos de investimento oferecem gestão profissional e acesso a projetos diversificados.",
    "O crowdfunding permite investir em projetos agrícolas com valores menores e maior transparência.",
    "O investimento sustentável considera fatores ambientais, sociais e de governança (ESG).",
    "O ESG (Environmental, Social, Governance) é integrado em todos os nossos projetos de investimento.",
    "O impact investing busca gerar retorno financeiro e impacto social/ambiental positivo.",
    "O venture capital financia startups inovadoras no setor agrícola com alto potencial de crescimento.",
    "O private equity investe em empresas estabelecidas para expansão e modernização.",
    "O mercado de capitais oferece liquidez e transparência para investimentos agrícolas.",
    "A regulamentação financeira garante segurança e transparência em todas as operações.",
    
    // Sustentabilidade
    "A sustentabilidade é um pilar fundamental de todas as nossas operações e projetos.",
    "A agricultura regenerativa restaura e melhora a saúde do solo, água e biodiversidade.",
    "O carbono neutro é alcançado através de práticas que compensam as emissões de CO2.",
    "A energia renovável é utilizada em todos os nossos projetos e operações.",
    "A conservação ambiental é priorizada em todas as decisões e práticas agrícolas.",
    "A biodiversidade é protegida e promovida através de práticas agrícolas sustentáveis.",
    "A água é gerenciada de forma eficiente e sustentável em todos os projetos.",
    "O solo é protegido e melhorado através de práticas de conservação e regeneração.",
    "A poluição é minimizada através de tecnologias limpas e práticas sustentáveis.",
    "As mudanças climáticas são consideradas em todos os nossos projetos e planejamentos.",
    "A adaptação climática inclui tecnologias e práticas para enfrentar os desafios climáticos.",
    "A mitigação reduz as emissões de gases de efeito estufa através de práticas sustentáveis.",
    "As certificações ambientais demonstram nosso compromisso com práticas sustentáveis.",
    "Os relatórios de sustentabilidade são publicados anualmente com transparência total.",
    "Os objetivos de desenvolvimento sustentável (ODS) são integrados em nossa estratégia.",
    
    // Mercado
    "O mercado agrícola é dinâmico e influenciado por fatores climáticos, econômicos e tecnológicos.",
    "As tendências do mercado incluem digitalização, sustentabilidade e automação.",
    "Os preços de commodities são monitorados em tempo real para tomada de decisões.",
    "A oferta e demanda são analisadas para otimizar produção e comercialização.",
    "A exportação é facilitada através de nossa plataforma e parcerias internacionais.",
    "A importação de insumos e tecnologias é gerenciada de forma eficiente.",
    "A logística é otimizada para reduzir custos e tempo de entrega.",
    "A cadeia de suprimentos é rastreada e gerenciada de ponta a ponta.",
    "A distribuição é realizada através de canais eficientes e sustentáveis.",
    "O varejo é integrado com nossa plataforma para comercialização direta.",
    "O e-commerce permite venda online de produtos agrícolas com segurança.",
    "O marketplace conecta produtores e compradores de forma transparente.",
    "Os leilões digitais permitem comercialização eficiente de produtos agrícolas.",
    "Os contratos futuros oferecem proteção contra volatilidade de preços.",
    "O hedge protege contra riscos de preço e condições climáticas.",
    
    // Segurança
    "A segurança da plataforma é garantida através de múltiplas camadas de proteção.",
    "A proteção de dados é priorizada com criptografia e práticas de segurança rigorosas.",
    "A criptografia protege todas as informações e transações na plataforma.",
    "A autenticação multi-fator garante acesso seguro à plataforma.",
    "A autorização controla o acesso a diferentes funcionalidades e dados.",
    "O backup é realizado automaticamente e armazenado em locais seguros.",
    "A recuperação de desastres garante continuidade operacional em qualquer situação.",
    "O monitoramento de segurança é realizado 24/7 para detectar e prevenir ameaças.",
    "As vulnerabilidades são identificadas e corrigidas rapidamente.",
    "As atualizações de segurança são aplicadas automaticamente para manter a proteção.",
    "O compliance de segurança segue padrões internacionais e regulamentações.",
    "A auditoria de segurança é realizada regularmente por empresas especializadas.",
    "O penetration testing identifica vulnerabilidades antes que sejam exploradas.",
    "O incident response garante resposta rápida e eficaz a qualquer incidente de segurança.",
    "O business continuity garante operação contínua mesmo em situações adversas.",
    
    // Performance
    "A performance da plataforma é otimizada para oferecer a melhor experiência possível.",
    "A velocidade é priorizada com tecnologias de ponta e otimizações constantes.",
    "A escalabilidade permite crescimento sem comprometer performance.",
    "A disponibilidade é garantida com redundância e monitoramento contínuo.",
    "O uptime de 99.9% é garantido através de infraestrutura robusta e redundante.",
    "A latência é minimizada através de CDN e servidores distribuídos globalmente.",
    "O throughput é otimizado para suportar grandes volumes de transações.",
    "A otimização contínua melhora performance e eficiência da plataforma.",
    "O cache reduz tempo de carregamento e melhora experiência do usuário.",
    "O load balancing distribui carga entre servidores para melhor performance.",
    "O monitoring em tempo real identifica e resolve problemas rapidamente.",
    "Os alertas notificam sobre problemas antes que afetem os usuários.",
    "As métricas são coletadas e analisadas para otimização contínua.",
    "Os KPIs são monitorados para garantir qualidade e performance.",
    "O SLA garante níveis de serviço e performance acordados com os usuários."
  ]
};

export const Chatbot24h: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: 'Olá! Sou o assistente virtual 24h da AGROTM. Como posso ajudá-lo hoje?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const findBestMatch = (userInput: string): string => {
    const input = userInput.toLowerCase();
    let bestMatch = '';
    let highestScore = 0;

    chatbotDatabase.questions.forEach((question, index) => {
      const score = calculateSimilarity(input, question.toLowerCase());
      if (score > highestScore && score > 0.2) {
        highestScore = score;
        bestMatch = chatbotDatabase.answers[index];
      }
    });

    return bestMatch || 'Desculpe, não entendi sua pergunta. Pode reformular ou perguntar sobre agronegócio, plataforma, staking, NFTs, suporte, contato, planos, equipe, documentos, tecnologia, investimentos, sustentabilidade, mercado, segurança ou performance?';
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ').filter(word => word.length > 2);
    const words2 = str2.split(' ').filter(word => word.length > 2);
    let matches = 0;

    words1.forEach(word1 => {
      words2.forEach(word2 => {
        if (word1.includes(word2) || word2.includes(word1)) {
          matches++;
        }
      });
    });

    return matches / Math.max(words1.length, words2.length);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular digitação
    setTimeout(() => {
      const botResponse = findBestMatch(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Como funciona a plataforma?",
    "Quais são os planos?",
    "Preciso de suporte técnico",
    "Como entrar em contato?"
  ];

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-premium-silver to-premium-silver-light text-premium-black rounded-full shadow-2xl shadow-premium-silver/50 hover:shadow-premium-silver/70 transition-all duration-300 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-premium-dark border border-premium-silver/20 rounded-2xl shadow-2xl shadow-premium-silver/20 backdrop-blur-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-premium-silver/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-premium-silver to-premium-silver-light rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-premium-black" />
                </div>
                <div>
                  <h3 className="text-premium-silver font-semibold">AGROTM Assistant</h3>
                  <p className="text-premium-silver/60 text-sm">Online 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-premium-silver/60 hover:text-premium-silver transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-premium-silver to-premium-silver-light text-premium-black' 
                      : 'bg-premium-black/50 border border-premium-silver/20 text-premium-silver'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-premium-black/50 border border-premium-silver/20 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-premium-silver rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-premium-silver rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-premium-silver rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Perguntas rápidas */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-premium-silver/60 text-sm">Perguntas rápidas:</p>
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="w-full text-left p-2 bg-premium-black/30 border border-premium-silver/20 rounded-lg text-premium-silver text-sm hover:bg-premium-black/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-premium-silver/20">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-premium-black/50 border border-premium-silver/20 rounded-lg px-3 py-2 text-premium-silver placeholder-premium-silver/40 focus:outline-none focus:border-premium-silver/40"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-r from-premium-silver to-premium-silver-light text-premium-black rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
