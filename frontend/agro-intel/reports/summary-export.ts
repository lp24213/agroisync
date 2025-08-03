import { Configuration, OpenAIApi } from 'openai';
import { createAlert } from '../../monitoring/alerts';
import { captureException } from '../../monitoring/sentry.config';
import { getStakingStats } from '../../hooks/useStakingStats';
import { getNFTStats } from '../../hooks/useNFTStats';
import { getUserStats } from '../../hooks/useUserStats';
import { getCommodityPrices } from '../../hooks/useCommodityPrices';
import { getWeatherData } from '../../hooks/useWeatherData';
import { getTokenPrice } from '../../oracles/prices';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Configuração da API OpenAI
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
});

const openai = new OpenAIApi(configuration);

/**
 * Interface para os dados do relatório
 */
export interface ReportData {
  stakingStats: {
    totalStaked: number;
    totalStakers: number;
    averageAPY: number;
    stakingGrowth: number;
  };
  nftStats: {
    totalNFTs: number;
    totalValue: number;
    recentSales: number;
    valueGrowth: number;
  };
  userStats: {
    totalUsers: number;
    activeUsers: number;
    retentionRate: number;
    userGrowth: number;
  };
  marketData: {
    agroPrice: number;
    agroChange: number;
    commodityPrices: Record<string, number>;
    weatherImpact: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Coleta dados para o relatório
 * @param startDate Data de início do período
 * @param endDate Data de fim do período
 * @returns Dados do relatório
 */
export async function collectReportData(
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date()
): Promise<ReportData> {
  try {
    // Formatar datas para string
    const formattedStartDate = format(startDate, 'dd/MM/yyyy', { locale: ptBR });
    const formattedEndDate = format(endDate, 'dd/MM/yyyy', { locale: ptBR });

    // Coletar dados de staking
    const stakingStats = await getStakingStats(startDate, endDate);
    
    // Coletar dados de NFTs
    const nftStats = await getNFTStats(startDate, endDate);
    
    // Coletar dados de usuários
    const userStats = await getUserStats(startDate, endDate);
    
    // Coletar dados de mercado
    const agroPrice = await getTokenPrice('AGRO');
    const agroHistorical = await getTokenPrice('AGRO', startDate);
    const agroChange = ((agroPrice - agroHistorical) / agroHistorical) * 100;
    
    // Coletar preços de commodities
    const commodityPrices = await getCommodityPrices(['SOYBEAN', 'CORN', 'WHEAT', 'COFFEE']);
    
    // Coletar dados climáticos
    const weatherData = await getWeatherData('BR', 'Centro-Oeste');
    
    return {
      stakingStats: {
        totalStaked: stakingStats.totalStaked,
        totalStakers: stakingStats.totalStakers,
        averageAPY: stakingStats.averageAPY,
        stakingGrowth: stakingStats.stakingGrowth,
      },
      nftStats: {
        totalNFTs: nftStats.totalNFTs,
        totalValue: nftStats.totalValue,
        recentSales: nftStats.recentSales.length,
        valueGrowth: nftStats.valueGrowth,
      },
      userStats: {
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        retentionRate: userStats.retentionRate,
        userGrowth: userStats.userGrowth,
      },
      marketData: {
        agroPrice,
        agroChange,
        commodityPrices: {
          soybean: commodityPrices.SOYBEAN.current,
          corn: commodityPrices.CORN.current,
          wheat: commodityPrices.WHEAT.current,
          coffee: commodityPrices.COFFEE.current,
        },
        weatherImpact: weatherData.analysis.cropImpact,
      },
      period: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
    };
  } catch (error) {
    captureException(error);
    createAlert({
      type: 'business',
      level: 'error',
      title: 'Falha ao coletar dados para relatório',
      message: `Erro ao gerar dados para relatório: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}

/**
 * Gera um resumo executivo usando IA
 * @param reportData Dados do relatório
 * @returns Resumo executivo gerado por IA
 */
export async function generateAISummary(reportData: ReportData): Promise<string> {
  if (!configuration.apiKey) {
    createAlert({
      type: 'business',
      level: 'warning',
      title: 'API Key da OpenAI não configurada',
      message: 'Não foi possível gerar o resumo com IA pois a API Key da OpenAI não está configurada.',
    });
    return generateFallbackSummary(reportData);
  }

  try {
    const prompt = `
      Você é um analista financeiro especializado em agricultura e blockchain.
      Gere um resumo executivo profissional e conciso (máximo 300 palavras) sobre o desempenho do ecossistema AGROTM no período de ${reportData.period.startDate} a ${reportData.period.endDate}.
      
      Dados do período:
      
      STAKING:
      - Total em staking: ${reportData.stakingStats.totalStaked.toLocaleString()} AGRO
      - Total de stakers: ${reportData.stakingStats.totalStakers}
      - APY médio: ${reportData.stakingStats.averageAPY.toFixed(2)}%
      - Crescimento do staking: ${reportData.stakingStats.stakingGrowth.toFixed(2)}%
      
      NFTs:
      - Total de NFTs: ${reportData.nftStats.totalNFTs}
      - Valor total: $${reportData.nftStats.totalValue.toLocaleString()}
      - Vendas recentes: ${reportData.nftStats.recentSales}
      - Crescimento do valor: ${reportData.nftStats.valueGrowth.toFixed(2)}%
      
      USUÁRIOS:
      - Total de usuários: ${reportData.userStats.totalUsers}
      - Usuários ativos: ${reportData.userStats.activeUsers}
      - Taxa de retenção: ${reportData.userStats.retentionRate.toFixed(2)}%
      - Crescimento de usuários: ${reportData.userStats.userGrowth.toFixed(2)}%
      
      MERCADO:
      - Preço do AGRO: $${reportData.marketData.agroPrice.toFixed(4)}
      - Variação do AGRO: ${reportData.marketData.agroChange.toFixed(2)}%
      - Preço da soja: $${reportData.marketData.commodityPrices.soybean.toFixed(2)}
      - Preço do milho: $${reportData.marketData.commodityPrices.corn.toFixed(2)}
      - Preço do trigo: $${reportData.marketData.commodityPrices.wheat.toFixed(2)}
      - Preço do café: $${reportData.marketData.commodityPrices.coffee.toFixed(2)}
      - Impacto climático: ${reportData.marketData.weatherImpact}
      
      Inclua:
      1. Uma análise geral do desempenho
      2. Destaques positivos e negativos
      3. Correlações entre os diferentes indicadores
      4. Uma breve perspectiva para o próximo período
      
      Use linguagem formal e profissional. Escreva em português do Brasil.
    `;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].text?.trim() || generateFallbackSummary(reportData);
  } catch (error) {
    captureException(error);
    createAlert({
      type: 'business',
      level: 'warning',
      title: 'Falha ao gerar resumo com IA',
      message: `Erro ao gerar resumo com OpenAI: ${error instanceof Error ? error.message : String(error)}`,
    });
    return generateFallbackSummary(reportData);
  }
}

/**
 * Gera um resumo de fallback quando a IA não está disponível
 * @param reportData Dados do relatório
 * @returns Resumo executivo gerado sem IA
 */
function generateFallbackSummary(reportData: ReportData): string {
  const {
    stakingStats,
    nftStats,
    userStats,
    marketData,
    period,
  } = reportData;

  // Determinar tendências
  const stakingTrend = stakingStats.stakingGrowth > 0 ? 'crescimento' : 'queda';
  const nftTrend = nftStats.valueGrowth > 0 ? 'valorização' : 'desvalorização';
  const userTrend = userStats.userGrowth > 0 ? 'crescimento' : 'redução';
  const agroTrend = marketData.agroChange > 0 ? 'valorização' : 'desvalorização';

  return `
    # Resumo Executivo - AGROTM
    ## Período: ${period.startDate} a ${period.endDate}

    ### Visão Geral
    O ecossistema AGROTM apresentou ${stakingStats.stakingGrowth > 0 ? 'resultados positivos' : 'desafios'} no período analisado. 
    Observamos ${stakingTrend} de ${Math.abs(stakingStats.stakingGrowth).toFixed(2)}% no total de tokens em staking, 
    ${nftTrend} de ${Math.abs(nftStats.valueGrowth).toFixed(2)}% no valor dos NFTs agrícolas, 
    e ${userTrend} de ${Math.abs(userStats.userGrowth).toFixed(2)}% na base de usuários.

    ### Destaques
    - Total de ${stakingStats.totalStakers.toLocaleString()} stakers com ${stakingStats.totalStaked.toLocaleString()} AGRO em staking
    - APY médio de ${stakingStats.averageAPY.toFixed(2)}% nos pools de staking
    - ${nftStats.totalNFTs.toLocaleString()} NFTs com valor total de $${nftStats.totalValue.toLocaleString()}
    - ${nftStats.recentSales} vendas de NFTs no período
    - Base de ${userStats.totalUsers.toLocaleString()} usuários com taxa de retenção de ${userStats.retentionRate.toFixed(2)}%

    ### Mercado
    O token AGRO apresentou ${agroTrend} de ${Math.abs(marketData.agroChange).toFixed(2)}%, 
    fechando o período em $${marketData.agroPrice.toFixed(4)}. 
    Os preços das commodities agrícolas mantiveram-se ${marketData.agroChange > 0 ? 'favoráveis' : 'desafiadores'}, 
    com destaque para a soja ($${marketData.commodityPrices.soybean.toFixed(2)}) 
    e o milho ($${marketData.commodityPrices.corn.toFixed(2)}).

    As condições climáticas apresentaram o seguinte impacto: ${marketData.weatherImpact}.

    ### Perspectivas
    Para o próximo período, esperamos ${stakingStats.stakingGrowth > 0 && userStats.userGrowth > 0 ? 
      'continuidade no crescimento do ecossistema, impulsionado pelo aumento na base de usuários e no volume de staking.' : 
      'estabilização e possível recuperação, com foco em estratégias para aumentar a retenção de usuários e o volume de staking.'
    }
  `;
}

/**
 * Exporta um relatório completo com dados e resumo
 * @param startDate Data de início do período
 * @param endDate Data de fim do período
 * @param useAI Se deve usar IA para gerar o resumo
 * @returns Objeto com dados do relatório e resumo
 */
export async function exportSummaryReport(
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date(),
  useAI: boolean = true
): Promise<{ data: ReportData; summary: string }> {
  try {
    // Coletar dados
    const reportData = await collectReportData(startDate, endDate);
    
    // Gerar resumo
    const summary = useAI 
      ? await generateAISummary(reportData)
      : generateFallbackSummary(reportData);
    
    return {
      data: reportData,
      summary,
    };
  } catch (error) {
    captureException(error);
    throw error;
  }
}