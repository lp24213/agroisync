import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createAlert } from '../../monitoring/alerts';
import { captureException, addBreadcrumb } from '../../monitoring/sentry.config';
// Removido temporariamente - arquivo summary-export.ts foi deletado
// import { ReportData, exportSummaryReport } from './summary-export';

/**
 * Opções para exportação de PDF
 */
export interface PDFExportOptions {
  /** Título do documento */
  title: string;
  /** Autor do documento */
  author?: string;
  /** Orientação da página */
  orientation?: 'portrait' | 'landscape';
  /** Tamanho do papel */
  format?: 'a4' | 'a3' | 'letter' | 'legal';
  /** Margens em mm */
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /** Incluir cabeçalho */
  includeHeader?: boolean;
  /** Incluir rodapé */
  includeFooter?: boolean;
  /** Incluir marca d'água */
  includeWatermark?: boolean;
  /** Incluir resumo executivo */
  includeSummary?: boolean;
  /** Usar IA para gerar resumo */
  useAI?: boolean;
  /** Período do relatório */
  period?: {
    startDate: Date;
    endDate: Date;
  };
  /** Subtítulo do documento */
  subtitle?: string;
  /** Dados para a seção de resumo */
  data?: any[];
  /** Gráficos para a seção de resumo */
  charts?: any[];
  /** Nome do arquivo PDF (sem extensão) */
  filename?: string;
}

/**
 * Configurações padrão para exportação de PDF
 */
const defaultOptions: PDFExportOptions = {
  title: 'AGROTM - Relatório',
  author: 'AGROTM Platform',
  orientation: 'portrait',
  format: 'a4',
  margins: {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15,
  },
  includeHeader: true,
  includeFooter: true,
  includeWatermark: false,
  includeSummary: true,
  useAI: true,
  period: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
};

/**
 * Exporta um elemento HTML para PDF
 * @param elementId ID do elemento HTML a ser exportado
 * @param filename Nome do arquivo PDF (sem extensão)
 * @param options Opções de exportação
 */
export async function exportToPDF(
  elementId: string,
  filename: string = 'agrotm-report',
  options: Partial<PDFExportOptions> = {}
): Promise<void> {
  // Mesclar opções com padrões
  const mergedOptions: PDFExportOptions = { ...defaultOptions, ...options };
  
  try {
    addBreadcrumb({
      category: 'pdf-export',
      message: `Iniciando exportação de PDF para elemento ${elementId}`,
      level: 'info',
    });

    // Obter o elemento a ser exportado
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento com ID ${elementId} não encontrado`);
    }

    // Criar uma cópia do elemento para manipulação
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = element.offsetWidth + 'px';
    clonedElement.style.height = 'auto';
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '-9999px';
    document.body.appendChild(clonedElement);

    // Adicionar classe para estilo de impressão
    clonedElement.classList.add('pdf-export');

    // Configurar o documento PDF
    const pdf = new jsPDF({
      orientation: mergedOptions.orientation,
      unit: 'mm',
      format: mergedOptions.format,
    });

    // Definir metadados do documento
    pdf.setProperties({
      title: mergedOptions.title,
      author: mergedOptions.author,
      subject: `Relatório gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
      keywords: 'AGROTM, blockchain, agricultura, relatório',
      creator: 'AGROTM Platform',
    });

    // Adicionar cabeçalho se solicitado
    if (mergedOptions.includeHeader) {
      addHeader(pdf, mergedOptions);
    }

    // Adicionar resumo executivo se solicitado
    let summaryHeight = 0;
    if (mergedOptions.includeSummary) {
      summaryHeight = await addSummary(pdf, mergedOptions);
    }

    // Capturar o elemento como canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Maior qualidade
      useCORS: true, // Permitir imagens de outros domínios
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Remover o elemento clonado
    document.body.removeChild(clonedElement);

    // Calcular dimensões para ajustar ao PDF
    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margins = mergedOptions.margins!;
    const contentWidth = pageWidth - margins.left - margins.right;
    const contentHeight = pageHeight - margins.top - margins.bottom;

    // Calcular proporção para manter aspecto
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Se tiver resumo, adicionar nova página para o conteúdo
    if (mergedOptions.includeSummary) {
      pdf.addPage();
    }

    // Adicionar a imagem ao PDF
    pdf.addImage(
      imgData,
      'PNG',
      margins.left + (contentWidth - scaledWidth) / 2,
      margins.top + summaryHeight,
      scaledWidth,
      scaledHeight
    );

    // Adicionar rodapé se solicitado
    if (mergedOptions.includeFooter) {
      addFooter(pdf, mergedOptions);
    }

    // Adicionar marca d'água se solicitado
    if (mergedOptions.includeWatermark) {
      addWatermark(pdf, mergedOptions);
    }

    // Salvar o PDF
    pdf.save(`${filename}.pdf`);

    // Registrar sucesso
    addBreadcrumb({
      category: 'pdf-export',
      message: `PDF exportado com sucesso: ${filename}.pdf`,
      level: 'info',
    });

    createAlert('info', `O relatório ${filename}.pdf foi exportado com sucesso.`, {
      type: 'business',
      title: 'PDF exportado com sucesso',
      message: `O relatório ${filename}.pdf foi exportado com sucesso.`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido na exportação';
    
    // Log de erro
    addBreadcrumb({
      category: 'pdf-export',
      message: `Erro na exportação de PDF: ${errorMessage}`,
      level: 'error',
      data: { elementId, filename, options: mergedOptions },
    });

    // Capturar exceção no Sentry
    captureException(error instanceof Error ? error : new Error(errorMessage), {
      elementId,
      filename,
      options: mergedOptions,
    });

    // Criar alerta de erro
    createAlert('error', `Falha na exportação do relatório: ${errorMessage}`, {
      elementId,
      filename,
      options: mergedOptions,
    });

    throw new Error(`Falha na exportação do relatório: ${errorMessage}`);
  }
}

/**
 * Adiciona cabeçalho ao PDF
 * @param pdf Documento PDF
 * @param options Opções de exportação
 */
function addHeader(pdf: jsPDF, options: PDFExportOptions): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margins = options.margins!;
  
  // Adicionar logo
  const logoPath = '/images/agrotm-logo.png'; // Caminho para o logo
  const logoWidth = 40;
  const logoHeight = 15;
  try {
    pdf.addImage(
      logoPath,
      'PNG',
      margins.left,
      margins.top,
      logoWidth,
      logoHeight
    );
  } catch (error) {
    // Fallback se a imagem não puder ser carregada
    pdf.setFontSize(16);
    pdf.setTextColor(39, 174, 96); // Verde AGROTM
    pdf.text('AGROTM', margins.left, margins.top + 10);
  }
  
  // Adicionar título
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(
    options.title,
    pageWidth / 2,
    margins.top + 10,
    { align: 'center' }
  );
  
  // Adicionar data
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  const dateStr = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  pdf.text(
    `Gerado em: ${dateStr}`,
    pageWidth - margins.right,
    margins.top + 10,
    { align: 'right' }
  );
  
  // Adicionar linha separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(
    margins.left,
    margins.top + 15,
    pageWidth - margins.right,
    margins.top + 15
  );
}

/**
 * Adiciona rodapé ao PDF
 * @param pdf Documento PDF
 * @param options Opções de exportação
 */
function addFooter(pdf: jsPDF, options: PDFExportOptions): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = options.margins!;
  
  // Adicionar linha separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(
    margins.left,
    pageHeight - margins.bottom - 10,
    pageWidth - margins.right,
    pageHeight - margins.bottom - 10
  );
  
  // Adicionar texto de rodapé
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    'AGROTM - Plataforma de Tokenização Agrícola',
    margins.left,
    pageHeight - margins.bottom - 5
  );
  
  // Adicionar número de página
  const totalPages = 1; // Mock total pages for now
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margins.right,
      pageHeight - margins.bottom - 5,
      { align: 'right' }
    );
  }
}

/**
 * Adiciona marca d'água ao PDF
 * @param pdf Documento PDF
 * @param options Opções de exportação
 */
function addWatermark(pdf: jsPDF, options: PDFExportOptions): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Configurar estilo da marca d'água
  pdf.setFontSize(60);
  pdf.setTextColor(230, 230, 230);
  pdf.setFont('helvetica', 'bold');
  
  // Adicionar marca d'água em cada página
  const totalPages = 1; // Mock total pages for now
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Salvar estado atual
    pdf.saveGraphicsState();
    
    // Rotacionar e posicionar texto
    const angle = -45 * Math.PI / 180;
    // Use alternative method for transformation
    pdf.text('AGROTM', pageWidth / 2, pageHeight / 2, { align: 'center' });
    
    // Restaurar estado
    pdf.restoreGraphicsState();
  }
}

/**
 * Adiciona resumo executivo ao PDF
 * @param pdf Documento PDF
 * @param options Opções de exportação
 * @returns Altura ocupada pelo resumo
 */
async function addSummary(pdf: jsPDF, options: PDFExportOptions): Promise<number> {
  try {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margins = options.margins!;
    const contentWidth = pageWidth - margins.left - margins.right;
    
    // Obter dados do relatório e resumo
    const { startDate, endDate } = options.period!;
    // const { summary } = await exportSummaryReport(startDate, endDate, options.useAI);
    const summary = 'Resumo executivo temporariamente indisponível.';
    
    // Configurar estilo
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Adicionar título do resumo
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    let yPosition = margins.top + 25;
    pdf.text('Resumo Executivo', margins.left, yPosition);
    yPosition += 10;
    
    // Adicionar período do relatório
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const periodText = `Período: ${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`;
    pdf.text(periodText, margins.left, yPosition);
    yPosition += 10;
    
    // Adicionar linha separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margins.left, yPosition, pageWidth - margins.right, yPosition);
    yPosition += 5;
    
    // Adicionar texto do resumo
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Dividir o texto em linhas para caber na largura da página
    const splitText = pdf.splitTextToSize(summary, contentWidth);
    
    // Adicionar texto ao PDF
    pdf.text(splitText, margins.left, yPosition);
    
    // Calcular altura ocupada pelo resumo
    const textHeight = splitText.length * 5; // Aproximadamente 5mm por linha
    yPosition += textHeight;
    
    return yPosition - margins.top;
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)));
    
    // Em caso de erro, adicionar mensagem de erro
    pdf.setFontSize(10);
    pdf.setTextColor(255, 0, 0);
    pdf.text(
      'Não foi possível gerar o resumo executivo. Por favor, tente novamente mais tarde.',
      options.margins!.left,
      options.margins!.top + 25
    );
    
    return 30; // Altura aproximada da mensagem de erro
  }
}

/**
 * Exporta dados para PDF com layout personalizado
 * @param data Dados do relatório
 * @param filename Nome do arquivo PDF (sem extensão)
 * @param options Opções de exportação
 */
export async function exportDataToPDF(
  data: any, // Temporariamente usando any em vez de ReportData
  filename: string = 'agrotm-data-report',
  options: Partial<PDFExportOptions> = {}
): Promise<void> {
  // Mesclar opções com padrões
  const mergedOptions: PDFExportOptions = { ...defaultOptions, ...options };
  
  try {
    addBreadcrumb({
      category: 'pdf-export',
      message: `Iniciando exportação de dados para PDF: ${filename}`,
      level: 'info',
    });

    // Configurar o documento PDF
    const pdf = new jsPDF({
      orientation: mergedOptions.orientation,
      unit: 'mm',
      format: mergedOptions.format,
    });

    // Definir metadados do documento
    pdf.setProperties({
      title: mergedOptions.title,
      author: mergedOptions.author,
      subject: `Relatório de dados gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
      keywords: 'AGROTM, blockchain, agricultura, relatório, dados',
      creator: 'AGROTM Platform',
    });

    // Adicionar cabeçalho
    if (mergedOptions.includeHeader) {
      addHeader(pdf, mergedOptions);
    }

    // Adicionar resumo executivo se solicitado
    if (mergedOptions.includeSummary) {
      await addSummary(pdf, mergedOptions);
    }

    // Adicionar nova página para os dados
    pdf.addPage();

    // Adicionar seções de dados
    let yPosition = mergedOptions.margins!.top + 20;
    yPosition = addDataSection(pdf, 'Dados de Staking', data.stakingStats, yPosition, mergedOptions);
    yPosition = addDataSection(pdf, 'Dados de NFTs', data.nftStats, yPosition + 10, mergedOptions);
    yPosition = addDataSection(pdf, 'Dados de Usuários', data.userStats, yPosition + 10, mergedOptions);
    yPosition = addDataSection(pdf, 'Dados de Mercado', data.marketData, yPosition + 10, mergedOptions);

    // Adicionar rodapé
    if (mergedOptions.includeFooter) {
      addFooter(pdf, mergedOptions);
    }

    // Adicionar marca d'água se solicitado
    if (mergedOptions.includeWatermark) {
      addWatermark(pdf, mergedOptions);
    }

    // Salvar o PDF
    pdf.save(`${filename}.pdf`);

    // Registrar sucesso
    addBreadcrumb({
      category: 'pdf-export',
      message: `PDF de dados exportado com sucesso: ${filename}.pdf`,
      level: 'info',
    });

    createAlert('info', `PDF de dados exportado com sucesso: ${filename}.pdf`, {
      type: 'business',
      title: 'PDF de dados exportado com sucesso',
      message: `O relatório ${filename}.pdf foi exportado com sucesso.`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido na exportação';
    
    // Log de erro
    addBreadcrumb({
      category: 'pdf-export',
      message: `Erro na exportação de dados para PDF: ${errorMessage}`,
      level: 'error',
      data: { filename, options: mergedOptions },
    });

    // Capturar exceção no Sentry
    captureException(error instanceof Error ? error : new Error(errorMessage), {
      filename,
      options: mergedOptions,
    });

    // Criar alerta de erro
    createAlert('error', `Falha na exportação dos dados: ${errorMessage}`, {
      filename,
      options: mergedOptions,
    });

    throw new Error(`Falha na exportação dos dados: ${errorMessage}`);
  }
}

/**
 * Adiciona uma seção de dados ao PDF
 * @param pdf Documento PDF
 * @param title Título da seção
 * @param data Dados a serem exibidos
 * @param yPosition Posição Y inicial
 * @param options Opções de exportação
 * @returns Nova posição Y após adicionar a seção
 */
function addDataSection(
  pdf: jsPDF,
  title: string,
  data: Record<string, any>,
  yPosition: number,
  options: PDFExportOptions
): number {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margins = options.margins!;
  
  // Verificar se precisa adicionar nova página
  if (yPosition + 60 > pageHeight - margins.bottom) {
    pdf.addPage();
    yPosition = margins.top + 20;
  }
  
  // Adicionar título da seção
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(39, 174, 96); // Verde AGROTM
  pdf.text(title, margins.left, yPosition);
  yPosition += 8;
  
  // Adicionar linha separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(margins.left, yPosition, pageWidth - margins.right, yPosition);
  yPosition += 8;
  
  // Adicionar dados
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  // Larguras das colunas
  const col1Width = 60;
  const col2Width = 60;
  
  // Adicionar cada item de dados
  Object.entries(data).forEach(([key, value]) => {
    // Formatar chave para exibição
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1') // Adicionar espaço antes de letras maiúsculas
      .replace(/^./, (str) => str.toUpperCase()) // Primeira letra maiúscula
      .trim();
    
    // Formatar valor para exibição
    let formattedValue = '';
    if (typeof value === 'number') {
      // Formatar números
      if (key.toLowerCase().includes('price') || key.toLowerCase().includes('value')) {
        formattedValue = `$${value.toLocaleString()}`;
      } else if (key.toLowerCase().includes('percentage') || key.toLowerCase().includes('rate') || key.toLowerCase().includes('growth') || key.toLowerCase().includes('change') || key.toLowerCase().includes('apy')) {
        formattedValue = `${value.toFixed(2)}%`;
      } else {
        formattedValue = value.toLocaleString();
      }
    } else if (typeof value === 'object' && value !== null) {
      // Para objetos, mostrar [Objeto]
      formattedValue = '[Objeto]';
    } else {
      // Para outros tipos, converter para string
      formattedValue = String(value);
    }
    
    // Adicionar chave e valor
    pdf.setFont('helvetica', 'bold');
    pdf.text(formattedKey + ':', margins.left, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formattedValue, margins.left + col1Width, yPosition);
    
    yPosition += 6;
    
    // Verificar se precisa adicionar nova página
    if (yPosition + 10 > pageHeight - margins.bottom) {
      pdf.addPage();
      yPosition = margins.top + 20;
    }
  });
  
  return yPosition;
}

interface NFTData {
  id: string;
  name: string;
  type: string;
  location: string;
  value: number;
  area?: number;
  crop?: string;
}

interface NFTStats {
  totalNFTs: number;
  totalValue: number;
  averageValue: number;
  recentMints: number;
}

export const exportNFTDashboard = (data: NFTData[], stats: NFTStats): void => {
  exportToPDF('nft-dashboard', 'Dashboard de NFTs Agrícolas - AGROTM', {
    subtitle: 'Relatório de Análise e Estatísticas',
    data: data,
    filename: `agrotm-nft-dashboard-${Date.now()}.pdf`
  });
};

export const exportCustomReport = (
  title: string,
  data: any[],
  options?: Partial<PDFExportOptions>
): void => {
  exportToPDF('custom-report', title, {
    subtitle: options?.subtitle,
    data: data,
    filename: options?.filename || `agrotm-report-${Date.now()}.pdf`
  });
};

export default exportToPDF;