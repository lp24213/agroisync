/**
 * Vercel Status Monitoring
 * 
 * Este módulo fornece funções para monitorar o status de implantações do Vercel
 * e integrar com o sistema de alertas do AGROTM.
 */

import axios from 'axios';
import { createAlert } from '../alerts';

// Tipos para a API do Vercel
interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  meta: {
    githubCommitRef?: string;
    githubCommitSha?: string;
    githubCommitMessage?: string;
    githubCommitAuthorName?: string;
  };
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
}

interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  updatedAt: number;
  createdAt: number;
}

interface DeploymentStatus {
  projectId: string;
  deploymentId: string;
  status: string;
  url: string;
  createdAt: number;
  readyAt?: number;
  buildDuration?: number;
}

// Configuração
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN || '';
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || '';
const PROJECT_NAME = 'agrotm';

// Cache para armazenar o ID do projeto
let projectIdCache: string | null = null;

/**
 * Obtém o ID do projeto no Vercel
 */
async function getProjectId(): Promise<string> {
  if (projectIdCache) {
    return projectIdCache;
  }

  try {
    const response = await axios.get<{ projects: VercelProject[] }>('https://api.vercel.com/v9/projects', {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
      params: {
        teamId: VERCEL_TEAM_ID,
      },
    });

    const project = response.data.projects.find(p => p.name === PROJECT_NAME);
    if (!project) {
      throw new Error(`Projeto ${PROJECT_NAME} não encontrado no Vercel`);
    }

    projectIdCache = project.id;
    return project.id;
  } catch (error) {
    console.error('Erro ao obter ID do projeto Vercel:', error);
    throw error;
  }
}

/**
 * Obtém as implantações recentes do projeto
 */
async function getDeployments(limit = 5): Promise<VercelDeployment[]> {
  try {
    const projectId = await getProjectId();
    const response = await axios.get<{ deployments: VercelDeployment[] }>(
      `https://api.vercel.com/v6/deployments`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        },
        params: {
          teamId: VERCEL_TEAM_ID,
          projectId,
          limit,
        },
      }
    );

    return response.data.deployments;
  } catch (error) {
    console.error('Erro ao obter implantações do Vercel:', error);
    throw error;
  }
}

/**
 * Obtém o status da implantação mais recente
 */
async function getLatestDeploymentStatus(): Promise<DeploymentStatus | null> {
  try {
    const deployments = await getDeployments(1);
    if (deployments.length === 0) {
      return null;
    }

    const latest = deployments[0];
    const projectId = await getProjectId();

    return {
      projectId,
      deploymentId: latest.uid,
      status: latest.state,
      url: latest.url,
      createdAt: latest.created,
      readyAt: latest.state === 'READY' ? Date.now() : undefined,
      buildDuration: latest.state === 'READY' ? Date.now() - latest.created : undefined,
    };
  } catch (error) {
    console.error('Erro ao obter status da implantação mais recente:', error);
    return null;
  }
}

/**
 * Monitora o status das implantações e envia alertas quando necessário
 */
async function monitorDeployments(): Promise<void> {
  try {
    const deployments = await getDeployments(3);
    
    // Verifica se há implantações com erro
    const failedDeployments = deployments.filter(d => d.state === 'ERROR');
    if (failedDeployments.length > 0) {
      const latestFailed = failedDeployments[0];
      const commitInfo = latestFailed.meta.githubCommitRef 
        ? `${latestFailed.meta.githubCommitRef} (${latestFailed.meta.githubCommitSha?.substring(0, 7)})` 
        : 'Desconhecido';
      
      createAlert({
        level: 'error',
        category: 'infrastructure',
        title: 'Falha na implantação do Vercel',
        message: `A implantação ${latestFailed.uid.substring(0, 8)} falhou. Commit: ${commitInfo}`,
        source: 'vercel',
        metadata: {
          deploymentId: latestFailed.uid,
          url: `https://vercel.com/dashboard/deployments/${latestFailed.uid}`,
          commit: latestFailed.meta.githubCommitSha,
          commitMessage: latestFailed.meta.githubCommitMessage,
          author: latestFailed.meta.githubCommitAuthorName,
        },
      });
    }

    // Verifica se há implantações bem-sucedidas recentes
    const successfulDeployments = deployments.filter(d => d.state === 'READY');
    if (successfulDeployments.length > 0) {
      const latestSuccess = successfulDeployments[0];
      // Verifica se a implantação ocorreu nos últimos 10 minutos
      const isRecent = Date.now() - latestSuccess.created < 10 * 60 * 1000;
      
      if (isRecent) {
        const commitInfo = latestSuccess.meta.githubCommitRef 
          ? `${latestSuccess.meta.githubCommitRef} (${latestSuccess.meta.githubCommitSha?.substring(0, 7)})` 
          : 'Desconhecido';
        
        createAlert({
          level: 'info',
          category: 'infrastructure',
          title: 'Nova implantação no Vercel',
          message: `Implantação ${latestSuccess.uid.substring(0, 8)} concluída com sucesso. Commit: ${commitInfo}`,
          source: 'vercel',
          metadata: {
            deploymentId: latestSuccess.uid,
            url: latestSuccess.url,
            commit: latestSuccess.meta.githubCommitSha,
            commitMessage: latestSuccess.meta.githubCommitMessage,
            author: latestSuccess.meta.githubCommitAuthorName,
          },
        });
      }
    }
  } catch (error) {
    console.error('Erro ao monitorar implantações:', error);
    createAlert({
      level: 'error',
      category: 'infrastructure',
      title: 'Erro ao monitorar implantações do Vercel',
      message: `Não foi possível verificar o status das implantações: ${(error as Error).message}`,
      source: 'vercel',
    });
  }
}

/**
 * Verifica o status do certificado SSL do domínio principal
 */
async function checkSSLCertificate(domain: string): Promise<void> {
  try {
    const response = await axios.get(`https://api.vercel.com/v6/domains/${domain}/certificate`, {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
      params: {
        teamId: VERCEL_TEAM_ID,
      },
    });

    const certInfo = response.data;
    const expiresAt = new Date(certInfo.expiresAt);
    const now = new Date();
    const daysUntilExpiration = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Alerta se o certificado expira em menos de 14 dias
    if (daysUntilExpiration < 14) {
      createAlert({
        level: daysUntilExpiration < 7 ? 'error' : 'warning',
        category: 'security',
        title: 'Certificado SSL próximo da expiração',
        message: `O certificado SSL para ${domain} expira em ${daysUntilExpiration} dias (${expiresAt.toISOString().split('T')[0]})`,
        source: 'vercel',
        metadata: {
          domain,
          expiresAt: certInfo.expiresAt,
          issuer: certInfo.issuer,
        },
      });
    }
  } catch (error) {
    console.error(`Erro ao verificar certificado SSL para ${domain}:`, error);
    createAlert({
      level: 'warning',
      category: 'security',
      title: 'Erro ao verificar certificado SSL',
      message: `Não foi possível verificar o status do certificado SSL para ${domain}: ${(error as Error).message}`,
      source: 'vercel',
    });
  }
}

/**
 * Inicia o monitoramento periódico das implantações
 */
export function startVercelMonitoring(intervalMinutes = 15): void {
  // Monitora implantações a cada X minutos
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Executa imediatamente e depois no intervalo definido
  monitorDeployments();
  setInterval(monitorDeployments, intervalMs);
  
  // Verifica certificados SSL diariamente
  const mainDomain = 'agrotm.com';
  checkSSLCertificate(mainDomain);
  setInterval(() => checkSSLCertificate(mainDomain), 24 * 60 * 60 * 1000);
}

// Exporta funções úteis
export {
  getLatestDeploymentStatus,
  getDeployments,
  checkSSLCertificate,
};