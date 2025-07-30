/**
 * DAO - Token Distribution and Weighted Voting Logic
 * 
 * Este módulo implementa a lógica de distribuição de tokens e votos ponderados por staking
 * para o sistema de governança DAO do projeto AGROTM.
 * 
 * Funcionalidades:
 * - Cálculo de poder de voto baseado em tokens em staking
 * - Distribuição de tokens de governança
 * - Verificação de elegibilidade para votação
 * - Cálculo de votos quadráticos
 * - Rastreamento de histórico de participação
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import { Redis } from 'ioredis';
import axios from 'axios';

// Configuração do Redis para cache
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Interfaces
export interface StakingPosition {
  owner: string;
  amount: number;
  lockupPeriod: number; // em segundos
  startTime: number; // timestamp
  endTime: number; // timestamp
  isActive: boolean;
}

export interface VotingPower {
  address: string;
  rawPower: number; // Poder de voto bruto (1:1 com tokens)
  adjustedPower: number; // Poder de voto ajustado (com bônus de lockup)
  quadraticPower: number; // Poder de voto quadrático (raiz quadrada)
  delegatedTo: string | null; // Endereço para o qual o poder de voto foi delegado
  delegatedFrom: string[]; // Endereços que delegaram poder de voto para este endereço
  lastCalculated: number; // timestamp
}

export interface VotingHistory {
  address: string;
  proposalId: string;
  votingPower: number;
  votingMethod: 'standard' | 'quadratic';
  timestamp: number;
}

// Constantes
const STAKING_BONUS_MULTIPLIER = 0.5; // 50% de bônus máximo para staking de longo prazo
const MAX_LOCKUP_PERIOD = 365 * 24 * 60 * 60; // 1 ano em segundos
const MIN_VOTING_POWER = 100; // Poder de voto mínimo para participar da governança
const VOTING_POWER_CACHE_TTL = 60 * 5; // 5 minutos em segundos

/**
 * Calcula o poder de voto de um endereço com base em suas posições de staking
 * @param address Endereço do usuário
 * @param connection Conexão com a rede Solana
 * @returns Poder de voto calculado
 */
export async function calculateVotingPower(
  address: string,
  connection: Connection
): Promise<VotingPower> {
  try {
    // Verificar cache primeiro
    const cachedPower = await redis.get(`voting_power:${address}`);
    if (cachedPower) {
      return JSON.parse(cachedPower);
    }

    // Buscar posições de staking do usuário
    const stakingPositions = await getStakingPositions(address, connection);
    
    // Calcular poder de voto bruto (soma de todos os tokens em staking)
    let rawPower = 0;
    let adjustedPower = 0;
    
    const now = Math.floor(Date.now() / 1000);
    
    for (const position of stakingPositions) {
      if (position.isActive) {
        // Adicionar ao poder bruto
        rawPower += position.amount;
        
        // Calcular bônus baseado no período de lockup
        const remainingLockup = Math.max(0, position.endTime - now);
        const lockupRatio = remainingLockup / MAX_LOCKUP_PERIOD;
        const bonus = position.amount * STAKING_BONUS_MULTIPLIER * lockupRatio;
        
        // Adicionar ao poder ajustado (com bônus)
        adjustedPower += position.amount + bonus;
      }
    }
    
    // Buscar delegações
    const delegatedTo = await getDelegatedAddress(address);
    const delegatedFrom = await getDelegatingAddresses(address);
    
    // Adicionar poder de voto delegado
    for (const delegator of delegatedFrom) {
      const delegatorPower = await calculateVotingPower(delegator, connection);
      rawPower += delegatorPower.rawPower;
      adjustedPower += delegatorPower.adjustedPower;
    }
    
    // Calcular poder de voto quadrático (raiz quadrada do poder ajustado)
    const quadraticPower = Math.floor(Math.sqrt(adjustedPower));
    
    const votingPower: VotingPower = {
      address,
      rawPower,
      adjustedPower,
      quadraticPower,
      delegatedTo,
      delegatedFrom,
      lastCalculated: now
    };
    
    // Armazenar em cache
    await redis.set(
      `voting_power:${address}`,
      JSON.stringify(votingPower),
      'EX',
      VOTING_POWER_CACHE_TTL
    );
    
    return votingPower;
  } catch (error) {
    console.error('Erro ao calcular poder de voto:', error);
    // Retornar poder de voto zero em caso de erro
    return {
      address,
      rawPower: 0,
      adjustedPower: 0,
      quadraticPower: 0,
      delegatedTo: null,
      delegatedFrom: [],
      lastCalculated: Math.floor(Date.now() / 1000)
    };
  }
}

/**
 * Busca as posições de staking de um usuário
 * @param address Endereço do usuário
 * @param connection Conexão com a rede Solana
 * @returns Array de posições de staking
 */
async function getStakingPositions(
  address: string,
  connection: Connection
): Promise<StakingPosition[]> {
  try {
    // Em um ambiente real, isso seria uma chamada para um contrato Solana
    // Exemplo: const stakingProgram = new anchor.Program(IDL, STAKING_PROGRAM_ID, provider);
    // const positions = await stakingProgram.account.stakingPosition.all([{ memcmp: { offset: 8, bytes: address } }]);
    
    // Simulação para desenvolvimento
    // Gerar posições de staking aleatórias para o endereço
    const now = Math.floor(Date.now() / 1000);
    const mockPositions: StakingPosition[] = [];
    
    // Número aleatório de posições entre 1 e 5
    const numPositions = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numPositions; i++) {
      const lockupPeriod = Math.floor(Math.random() * MAX_LOCKUP_PERIOD);
      const startTime = now - Math.floor(Math.random() * 30 * 24 * 60 * 60); // Até 30 dias atrás
      const endTime = startTime + lockupPeriod;
      
      mockPositions.push({
        owner: address,
        amount: Math.floor(Math.random() * 10000) + 1000, // Entre 1000 e 11000 tokens
        lockupPeriod,
        startTime,
        endTime,
        isActive: now < endTime
      });
    }
    
    return mockPositions;
  } catch (error) {
    console.error('Erro ao buscar posições de staking:', error);
    return [];
  }
}

/**
 * Verifica se um endereço delegou seu poder de voto
 * @param address Endereço a verificar
 * @returns Endereço para o qual o poder foi delegado, ou null
 */
async function getDelegatedAddress(address: string): Promise<string | null> {
  try {
    // Em um ambiente real, isso seria uma chamada para um contrato ou banco de dados
    // Exemplo: const delegationProgram = new anchor.Program(IDL, DELEGATION_PROGRAM_ID, provider);
    // const delegation = await delegationProgram.account.delegation.fetch(delegationAddress);
    
    // Simulação para desenvolvimento - 10% de chance de ter delegado
    if (Math.random() < 0.1) {
      // Gerar um endereço aleatório
      return `0x${Math.random().toString(16).substring(2, 42)}`;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar delegação:', error);
    return null;
  }
}

/**
 * Busca endereços que delegaram poder de voto para um determinado endereço
 * @param address Endereço a verificar
 * @returns Array de endereços que delegaram poder
 */
async function getDelegatingAddresses(address: string): Promise<string[]> {
  try {
    // Em um ambiente real, isso seria uma chamada para um contrato ou banco de dados
    // Exemplo: const delegationProgram = new anchor.Program(IDL, DELEGATION_PROGRAM_ID, provider);
    // const delegations = await delegationProgram.account.delegation.all([{ memcmp: { offset: 40, bytes: address } }]);
    
    // Simulação para desenvolvimento - 0 a 3 delegações aleatórias
    const numDelegations = Math.floor(Math.random() * 4);
    const delegations: string[] = [];
    
    for (let i = 0; i < numDelegations; i++) {
      delegations.push(`0x${Math.random().toString(16).substring(2, 42)}`);
    }
    
    return delegations;
  } catch (error) {
    console.error('Erro ao buscar delegações:', error);
    return [];
  }
}

/**
 * Verifica se um endereço é elegível para votar em uma proposta
 * @param address Endereço a verificar
 * @param proposalId ID da proposta
 * @param connection Conexão com a rede Solana
 * @returns Booleano indicando elegibilidade
 */
export async function isEligibleToVote(
  address: string,
  proposalId: string,
  connection: Connection
): Promise<boolean> {
  try {
    // Verificar se já votou nesta proposta
    const hasVoted = await hasVotedOnProposal(address, proposalId);
    if (hasVoted) return false;
    
    // Verificar poder de voto
    const votingPower = await calculateVotingPower(address, connection);
    
    // Se delegou poder de voto, não pode votar
    if (votingPower.delegatedTo) return false;
    
    // Verificar poder mínimo
    return votingPower.adjustedPower >= MIN_VOTING_POWER;
  } catch (error) {
    console.error('Erro ao verificar elegibilidade para voto:', error);
    return false;
  }
}

/**
 * Verifica se um endereço já votou em uma proposta
 * @param address Endereço a verificar
 * @param proposalId ID da proposta
 * @returns Booleano indicando se já votou
 */
async function hasVotedOnProposal(address: string, proposalId: string): Promise<boolean> {
  try {
    // Em um ambiente real, isso seria uma chamada para a API do Snapshot ou contrato
    // Exemplo: const response = await axios.get(`https://hub.snapshot.org/graphql?query={votes(where:{voter:"${address}",proposal:"${proposalId}"}){id}}`);
    
    // Simulação para desenvolvimento - 20% de chance de já ter votado
    return Math.random() < 0.2;
  } catch (error) {
    console.error('Erro ao verificar voto anterior:', error);
    return false;
  }
}

/**
 * Registra um voto na história de votação
 * @param address Endereço que votou
 * @param proposalId ID da proposta
 * @param votingPower Poder de voto utilizado
 * @param votingMethod Método de votação utilizado
 */
export async function recordVote(
  address: string,
  proposalId: string,
  votingPower: number,
  votingMethod: 'standard' | 'quadratic'
): Promise<void> {
  try {
    const voteRecord: VotingHistory = {
      address,
      proposalId,
      votingPower,
      votingMethod,
      timestamp: Math.floor(Date.now() / 1000)
    };
    
    // Em um ambiente real, isso seria salvo em um banco de dados
    // Exemplo: await db.collection('voting_history').insertOne(voteRecord);
    
    // Para desenvolvimento, salvamos no Redis
    await redis.lpush(
      `voting_history:${address}`,
      JSON.stringify(voteRecord)
    );
    
    // Limitar o histórico a 100 entradas
    await redis.ltrim(`voting_history:${address}`, 0, 99);
    
    // Invalidar cache de poder de voto
    await redis.del(`voting_power:${address}`);
    
    console.log(`Voto registrado: ${address} na proposta ${proposalId}`);
  } catch (error) {
    console.error('Erro ao registrar voto:', error);
    throw error;
  }
}

/**
 * Obtém o histórico de votação de um endereço
 * @param address Endereço a consultar
 * @returns Array com histórico de votação
 */
export async function getVotingHistory(address: string): Promise<VotingHistory[]> {
  try {
    // Em um ambiente real, isso seria buscado de um banco de dados
    // Exemplo: const history = await db.collection('voting_history').find({ address }).sort({ timestamp: -1 }).limit(100).toArray();
    
    // Para desenvolvimento, buscamos do Redis
    const historyData = await redis.lrange(`voting_history:${address}`, 0, -1);
    
    return historyData.map(data => JSON.parse(data));
  } catch (error) {
    console.error('Erro ao buscar histórico de votação:', error);
    return [];
  }
}

/**
 * Delega poder de voto para outro endereço
 * @param fromAddress Endereço que está delegando
 * @param toAddress Endereço que receberá a delegação
 * @param connection Conexão com a rede Solana
 * @returns Booleano indicando sucesso
 */
export async function delegateVotingPower(
  fromAddress: string,
  toAddress: string,
  connection: Connection
): Promise<boolean> {
  try {
    // Em um ambiente real, isso seria uma transação em um contrato
    // Exemplo: await delegationProgram.methods.delegate(toAddress).accounts({ delegator: fromAddress }).rpc();
    
    // Para desenvolvimento, simulamos com Redis
    await redis.set(`delegation:${fromAddress}`, toAddress);
    
    // Invalidar caches
    await redis.del(`voting_power:${fromAddress}`);
    await redis.del(`voting_power:${toAddress}`);
    
    console.log(`Delegação: ${fromAddress} -> ${toAddress}`);
    return true;
  } catch (error) {
    console.error('Erro ao delegar poder de voto:', error);
    return false;
  }
}

/**
 * Remove delegação de poder de voto
 * @param address Endereço que deseja remover a delegação
 * @param connection Conexão com a rede Solana
 * @returns Booleano indicando sucesso
 */
export async function undelegateVotingPower(
  address: string,
  connection: Connection
): Promise<boolean> {
  try {
    // Em um ambiente real, isso seria uma transação em um contrato
    // Exemplo: await delegationProgram.methods.undelegate().accounts({ delegator: address }).rpc();
    
    // Para desenvolvimento, simulamos com Redis
    const delegatedTo = await redis.get(`delegation:${address}`);
    if (delegatedTo) {
      await redis.del(`delegation:${address}`);
      
      // Invalidar caches
      await redis.del(`voting_power:${address}`);
      await redis.del(`voting_power:${delegatedTo}`);
      
      console.log(`Delegação removida: ${address}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao remover delegação:', error);
    return false;
  }
}

/**
 * Calcula a distribuição de tokens de governança com base na participação
 * @param epoch Número da época (período de distribuição)
 * @returns Mapa de endereços para quantidades de tokens
 */
export async function calculateGovernanceTokenDistribution(
  epoch: number
): Promise<Map<string, number>> {
  try {
    // Em um ambiente real, isso seria calculado com base em dados on-chain
    // Exemplo: const stakingData = await stakingProgram.account.stakingPosition.all();
    
    // Para desenvolvimento, simulamos com dados aleatórios
    const distribution = new Map<string, number>();
    const numAddresses = 50 + Math.floor(Math.random() * 50); // 50-100 endereços
    
    // Total de tokens a distribuir nesta época
    const totalTokens = 1000000; // 1 milhão de tokens
    
    // Gerar participação aleatória
    const participationScores: { address: string; score: number }[] = [];
    let totalScore = 0;
    
    for (let i = 0; i < numAddresses; i++) {
      const address = `0x${Math.random().toString(16).substring(2, 42)}`;
      const score = Math.floor(Math.random() * 1000) + 1;
      participationScores.push({ address, score });
      totalScore += score;
    }
    
    // Calcular distribuição proporcional
    for (const { address, score } of participationScores) {
      const tokenAmount = Math.floor((score / totalScore) * totalTokens);
      distribution.set(address, tokenAmount);
    }
    
    return distribution;
  } catch (error) {
    console.error('Erro ao calcular distribuição de tokens:', error);
    return new Map<string, number>();
  }
}

/**
 * Verifica se um endereço é elegível para criar propostas
 * @param address Endereço a verificar
 * @param connection Conexão com a rede Solana
 * @returns Booleano indicando elegibilidade
 */
export async function canCreateProposal(
  address: string,
  connection: Connection
): Promise<boolean> {
  try {
    // Verificar poder de voto
    const votingPower = await calculateVotingPower(address, connection);
    
    // Requisito para criar propostas é 10x o mínimo para votar
    const requiredPower = MIN_VOTING_POWER * 10;
    
    return votingPower.adjustedPower >= requiredPower;
  } catch (error) {
    console.error('Erro ao verificar elegibilidade para criar proposta:', error);
    return false;
  }
}

/**
 * Calcula o quórum necessário para uma proposta com base no supply total
 * @param category Categoria da proposta
 * @returns Valor de quórum necessário
 */
export async function calculateQuorum(category: string): Promise<number> {
  try {
    // Em um ambiente real, isso seria calculado com base no supply total
    // Exemplo: const tokenSupply = await tokenProgram.account.mint.fetch(mintAddress);
    
    // Para desenvolvimento, usamos valores fixos por categoria
    const quorumPercentages: Record<string, number> = {
      'treasury': 0.15, // 15% do supply para decisões de tesouro
      'protocol': 0.20, // 20% para mudanças de protocolo
      'community': 0.10, // 10% para decisões comunitárias
      'agro-projects': 0.12, // 12% para projetos agrícolas
      'other': 0.05, // 5% para outros
    };
    
    // Supply total simulado
    const totalSupply = 100000000; // 100 milhões de tokens
    
    // Percentual padrão se categoria não encontrada
    const percentage = quorumPercentages[category] || 0.10;
    
    return Math.floor(totalSupply * percentage);
  } catch (error) {
    console.error('Erro ao calcular quórum:', error);
    return 1000000; // Valor padrão em caso de erro
  }
}