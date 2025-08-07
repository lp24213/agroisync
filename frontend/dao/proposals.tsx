/**
 * DAO - Proposals Component
 * 
 * Este componente implementa a interface de propostas da DAO do projeto AGROTM.
 * Permite visualizar, votar e criar propostas de governança.
 * 
 * Inclui:
 * - Integração com Snapshot para votação off-chain
 * - Suporte a votação ponderada por tokens
 * - Visualização de propostas ativas, pendentes e encerradas
 * - Criação de novas propostas
 * - Detalhes de propostas e resultados de votação
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ethers } from 'ethers';
import { useSnapshotSpace } from '../hooks/useSnapshotSpace';
import { useAgroTokenBalance } from '../hooks/useAgroTokenBalance';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

// Componentes
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import ProposalForm from '../components/dao/ProposalForm';
import VoteForm from '../components/dao/VoteForm';
import ProposalDetails from '../components/dao/ProposalDetails';

// Tipos
interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: 'active' | 'pending' | 'closed';
  author: string;
  scores: number[];
  scores_total: number;
  votes: number;
  quorum: number;
  type: 'single-choice' | 'approval' | 'ranked-choice' | 'weighted' | 'basic';
  discussion: string;
  category: 'treasury' | 'protocol' | 'community' | 'agro-projects' | 'other';
  executionStrategy?: {
    type: string;
    address: string;
    chainId: number;
  };
}

interface Vote {
  id: string;
  voter: string;
  choice: number | number[] | Record<string, number>;
  vp: number;
  reason?: string;
  created: number;
}

// Constantes
const SNAPSHOT_SPACE_ID = 'agrotm.eth'; // ID do espaço no Snapshot
const QUORUM_THRESHOLD = 100000; // Threshold de quórum (em tokens)

const ProposalsPage: React.FC = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { space, loading: spaceLoading } = useSnapshotSpace(SNAPSHOT_SPACE_ID);
  const { balance, loading: balanceLoading } = useAgroTokenBalance(publicKey?.toString());
  
  // Estados
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [votes, setVotes] = useState<Record<string, Vote[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, Vote | null>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Efeito para carregar propostas
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Em um ambiente real, isso seria uma chamada para a API do Snapshot
        // Exemplo: const response = await axios.get(`https://hub.snapshot.org/graphql?query={proposals(first:100,skip:0,where:{space:"${SNAPSHOT_SPACE_ID}"},orderBy:"created",orderDirection:desc){id,title,body,choices,start,end,snapshot,state,author,scores,scores_total,votes,type,discussion}}`);
        
        // Simulação de dados para desenvolvimento
        const mockProposals: Proposal[] = [
          {
            id: '0x1234567890abcdef1',
            title: 'Alocação de 500.000 AGRO para programa de incentivo a pequenos produtores',
            body: 'Esta proposta visa alocar 500.000 tokens AGRO para um programa de incentivo a pequenos produtores rurais, com foco em agricultura sustentável e práticas regenerativas. Os tokens serão distribuídos ao longo de 12 meses, com relatórios trimestrais de impacto.',
            choices: ['Aprovar', 'Rejeitar', 'Abster-se'],
            start: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 dias atrás
            end: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 dias no futuro
            snapshot: '12345678',
            state: 'active',
            author: '0xabcdef1234567890abcdef1234567890abcdef12',
            scores: [350000, 50000, 25000],
            scores_total: 425000,
            votes: 48,
            quorum: QUORUM_THRESHOLD,
            type: 'single-choice',
            discussion: 'https://forum.agrotm.org/t/alocacao-500k-agro-pequenos-produtores/123',
            category: 'treasury',
          },
          {
            id: '0x1234567890abcdef2',
            title: 'Implementação de novo modelo de staking com APY variável baseado em produção agrícola',
            body: 'Proposta para implementar um novo modelo de staking onde o APY varia de acordo com índices de produção agrícola real, conectando o rendimento virtual à produtividade do campo. Isso criará um vínculo mais forte entre o token e o setor agrícola.',
            choices: ['Aprovar', 'Rejeitar', 'Abster-se'],
            start: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 dias atrás
            end: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 dias atrás
            snapshot: '12345679',
            state: 'closed',
            author: '0xfedcba0987654321fedcba0987654321fedcba09',
            scores: [780000, 120000, 50000],
            scores_total: 950000,
            votes: 112,
            quorum: QUORUM_THRESHOLD,
            type: 'single-choice',
            discussion: 'https://forum.agrotm.org/t/novo-modelo-staking-apy-variavel/456',
            category: 'protocol',
          },
          {
            id: '0x1234567890abcdef3',
            title: 'Parceria estratégica com Cooperativa Nacional de Agricultura Familiar',
            body: 'Estabelecer parceria formal com a Cooperativa Nacional de Agricultura Familiar para integrar 10.000 pequenos produtores ao ecossistema AGROTM, oferecendo tokenização de produção, acesso a financiamento descentralizado e capacitação em tecnologias blockchain.',
            choices: ['Aprovar', 'Rejeitar', 'Abster-se'],
            start: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 dias no futuro
            end: Date.now() + 9 * 24 * 60 * 60 * 1000, // 9 dias no futuro
            snapshot: '12345680',
            state: 'pending',
            author: '0x0123456789abcdef0123456789abcdef01234567',
            scores: [0, 0, 0],
            scores_total: 0,
            votes: 0,
            quorum: QUORUM_THRESHOLD,
            type: 'single-choice',
            discussion: 'https://forum.agrotm.org/t/parceria-cooperativa-nacional-agricultura-familiar/789',
            category: 'community',
          },
          {
            id: '0x1234567890abcdef4',
            title: 'Atualização do protocolo de governança para incluir votação quadrática',
            body: 'Proposta para atualizar o protocolo de governança da DAO para implementar votação quadrática, reduzindo o poder desproporcional de grandes detentores de tokens e promovendo decisões mais democráticas e representativas da comunidade como um todo.',
            choices: ['Aprovar', 'Rejeitar', 'Abster-se'],
            start: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 dias atrás
            end: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 dias no futuro
            snapshot: '12345681',
            state: 'active',
            author: '0xfedcba0987654321fedcba0987654321fedcba09',
            scores: [420000, 280000, 30000],
            scores_total: 730000,
            votes: 86,
            quorum: QUORUM_THRESHOLD,
            type: 'single-choice',
            discussion: 'https://forum.agrotm.org/t/atualizacao-governanca-votacao-quadratica/101',
            category: 'protocol',
          },
          {
            id: '0x1234567890abcdef5',
            title: 'Financiamento de 5 projetos de pesquisa em agricultura regenerativa',
            body: 'Alocar 250.000 AGRO para financiar 5 projetos de pesquisa em agricultura regenerativa, com foco em captura de carbono, biodiversidade e resiliência climática. Os projetos serão selecionados por um comitê técnico e terão seus resultados publicados como bens públicos.',
            choices: ['Aprovar', 'Rejeitar', 'Abster-se'],
            start: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 dias atrás
            end: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 dias atrás
            snapshot: '12345682',
            state: 'closed',
            author: '0x0123456789abcdef0123456789abcdef01234567',
            scores: [620000, 180000, 40000],
            scores_total: 840000,
            votes: 95,
            quorum: QUORUM_THRESHOLD,
            type: 'single-choice',
            discussion: 'https://forum.agrotm.org/t/financiamento-pesquisa-agricultura-regenerativa/202',
            category: 'agro-projects',
          },
          {
            id: '0x1234567890abcdef6',
            title: 'Implementação de multisig para tesouro da DAO com 7 signatários',
            body: 'Implementar uma carteira multisig (Gnosis Safe) para o tesouro da DAO com 7 signatários eleitos pela comunidade, exigindo 4 assinaturas para aprovar transações. Isso aumentará a segurança e descentralização da gestão dos fundos comunitários.',
            choices: ['Aprovar', 'Rejeitar', 'Abster-se'],
            start: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 dias atrás
            end: Date.now() + 4 * 24 * 60 * 60 * 1000, // 4 dias no futuro
            snapshot: '12345683',
            state: 'active',
            author: '0xabcdef1234567890abcdef1234567890abcdef12',
            scores: [520000, 80000, 20000],
            scores_total: 620000,
            votes: 73,
            quorum: QUORUM_THRESHOLD,
            type: 'single-choice',
            discussion: 'https://forum.agrotm.org/t/multisig-tesouro-dao-7-signatarios/303',
            category: 'treasury',
            executionStrategy: {
              type: 'GnosisSafe',
              address: '0x1234567890123456789012345678901234567890',
              chainId: 1,
            },
          },
        ];
        
        setProposals(mockProposals);
        
        // Simular votos do usuário
        if (publicKey) {
          const mockUserVotes: Record<string, Vote | null> = {
            '0x1234567890abcdef1': {
              id: '0xvote1',
              voter: publicKey.toString(),
              choice: 1, // Votou "Aprovar"
              vp: 5000,
              reason: 'Apoio totalmente esta iniciativa para pequenos produtores',
              created: Date.now() - 2 * 24 * 60 * 60 * 1000,
            },
            '0x1234567890abcdef2': {
              id: '0xvote2',
              voter: publicKey.toString(),
              choice: 1, // Votou "Aprovar"
              vp: 5000,
              created: Date.now() - 10 * 24 * 60 * 60 * 1000,
            },
            '0x1234567890abcdef4': null, // Não votou ainda
            '0x1234567890abcdef5': {
              id: '0xvote3',
              voter: publicKey.toString(),
              choice: 3, // Votou "Abster-se"
              vp: 5000,
              reason: 'Preciso de mais informações sobre os critérios de seleção',
              created: Date.now() - 5 * 24 * 60 * 60 * 1000,
            },
            '0x1234567890abcdef6': null, // Não votou ainda
          };
          
          setUserVotes(mockUserVotes);
        }
      } catch (err) {
        console.error('Erro ao carregar propostas:', err);
        setError('Não foi possível carregar as propostas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposals();
  }, [publicKey]);
  
  // Efeito para filtrar propostas
  useEffect(() => {
    let filtered = [...proposals];
    
    // Filtrar por estado
    if (filter !== 'all') {
      filtered = filtered.filter(proposal => proposal.state === filter);
    }
    
    // Filtrar por categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.category === categoryFilter);
    }
    
    setFilteredProposals(filtered);
  }, [proposals, filter, categoryFilter]);
  
  // Função para carregar votos de uma proposta
  const loadVotes = async (proposalId: string) => {
    try {
      // Em um ambiente real, isso seria uma chamada para a API do Snapshot
      // Exemplo: const response = await axios.get(`https://hub.snapshot.org/graphql?query={votes(first:1000,skip:0,where:{proposal:"${proposalId}"},orderBy:"created",orderDirection:desc){id,voter,choice,vp,reason,created}}`);
      
      // Simulação de dados para desenvolvimento
      const mockVotes: Vote[] = Array.from({ length: 20 }, (_, i) => ({
        id: `0xvote${i}`,
        voter: `0x${Math.random().toString(16).substring(2, 42)}`,
        choice: Math.floor(Math.random() * 3) + 1, // 1, 2 ou 3
        vp: Math.floor(Math.random() * 50000) + 1000,
        reason: Math.random() > 0.7 ? `Razão de voto ${i}` : undefined,
        created: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      }));
      
      // Adicionar o voto do usuário, se existir
      if (userVotes[proposalId]) {
        mockVotes.push(userVotes[proposalId]!);
      }
      
      setVotes(prev => ({ ...prev, [proposalId]: mockVotes }));
      return mockVotes;
    } catch (err) {
      console.error('Erro ao carregar votos:', err);
      return [];
    }
  };
  
  // Função para votar em uma proposta
  const voteOnProposal = async (proposalId: string, choice: number, reason?: string) => {
    try {
      if (!publicKey) {
        throw new Error('Carteira não conectada');
      }
      
      // Em um ambiente real, isso seria uma chamada para a API do Snapshot ou uma transação blockchain
      // Exemplo: const signature = await signVote(proposalId, choice, reason);
      // const response = await axios.post('https://hub.snapshot.org/api/message', { ...voteData, signature });
      
      // Simulação para desenvolvimento
      const newVote: Vote = {
        id: `0xvote${Date.now()}`,
        voter: publicKey.toString(),
        choice,
        vp: balance || 5000, // Usar saldo real ou valor simulado
        reason,
        created: Date.now(),
      };
      
      // Atualizar votos do usuário
      setUserVotes(prev => ({ ...prev, [proposalId]: newVote }));
      
      // Atualizar votos da proposta
      setVotes(prev => {
        const proposalVotes = prev[proposalId] || [];
        return { ...prev, [proposalId]: [...proposalVotes, newVote] };
      });
      
      // Atualizar scores da proposta
      setProposals(prev => {
        return prev.map(p => {
          if (p.id === proposalId) {
            const newScores = [...p.scores];
            newScores[choice - 1] += newVote.vp;
            return {
              ...p,
              scores: newScores,
              scores_total: p.scores_total + newVote.vp,
              votes: p.votes + 1,
            };
          }
          return p;
        });
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao votar:', err);
      throw err;
    }
  };
  
  // Função para criar uma nova proposta
  const createProposal = async (proposalData: {
    title: string;
    body: string;
    choices: string[];
    discussion: string;
    category: string;
    endDate: Date;
  }) => {
    try {
      if (!publicKey) {
        throw new Error('Carteira não conectada');
      }
      
      // Em um ambiente real, isso seria uma chamada para a API do Snapshot ou uma transação blockchain
      // Exemplo: const signature = await signProposal(proposalData);
      // const response = await axios.post('https://hub.snapshot.org/api/message', { ...proposalData, signature });
      
      // Simulação para desenvolvimento
      const newProposal: Proposal = {
        id: `0x${Math.random().toString(16).substring(2, 42)}`,
        title: proposalData.title,
        body: proposalData.body,
        choices: proposalData.choices,
        start: Date.now(),
        end: proposalData.endDate.getTime(),
        snapshot: Math.floor(Math.random() * 1000000).toString(),
        state: 'active',
        author: publicKey.toString(),
        scores: Array(proposalData.choices.length).fill(0),
        scores_total: 0,
        votes: 0,
        quorum: QUORUM_THRESHOLD,
        type: 'single-choice',
        discussion: proposalData.discussion,
        category: proposalData.category as any,
      };
      
      // Adicionar nova proposta à lista
      setProposals(prev => [newProposal, ...prev]);
      
      return newProposal.id;
    } catch (err) {
      console.error('Erro ao criar proposta:', err);
      throw err;
    }
  };
  
  // Função para abrir modal de detalhes da proposta
  const openProposalDetails = async (proposal: Proposal) => {
    setSelectedProposal(proposal);
    
    // Carregar votos se ainda não foram carregados
    if (!votes[proposal.id]) {
      await loadVotes(proposal.id);
    }
    
    setShowDetailsModal(true);
  };
  
  // Função para abrir modal de votação
  const openVoteModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowVoteModal(true);
  };
  
  // Renderizar badges de estado
  const renderStateBadge = (state: Proposal['state']) => {
    switch (state) {
      case 'active':
        return <Badge color="green">Ativa</Badge>;
      case 'pending':
        return <Badge color="yellow">Pendente</Badge>;
      case 'closed':
        return <Badge color="gray">Encerrada</Badge>;
      default:
        return null;
    }
  };
  
  // Renderizar badges de categoria
  const renderCategoryBadge = (category: Proposal['category']) => {
    const categories: Record<string, { label: string; color: string }> = {
      'treasury': { label: 'Tesouro', color: 'purple' },
      'protocol': { label: 'Protocolo', color: 'blue' },
      'community': { label: 'Comunidade', color: 'green' },
      'agro-projects': { label: 'Projetos Agro', color: 'orange' },
      'other': { label: 'Outros', color: 'gray' },
    };
    
    const cat = categories[category] || { label: category, color: 'gray' };
    return <Badge color={cat.color}>{cat.label}</Badge>;
  };
  
  // Renderizar progresso de quórum
  const renderQuorumProgress = (proposal: Proposal) => {
    const percentage = Math.min(100, (proposal.scores_total / proposal.quorum) * 100);
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span>Quórum: {Math.round(percentage)}%</span>
          <span>{proposal.scores_total.toLocaleString()} / {proposal.quorum.toLocaleString()} AGRO</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
                          className={`h-2.5 rounded-full ${percentage >= 100 ? 'bg-[#00FF00]' : 'bg-[#00bfff]'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Renderizar resultados da votação
  const renderVoteResults = (proposal: Proposal) => {
    return (
      <div className="mt-3 space-y-2">
        {proposal.choices.map((choice, index) => {
          const percentage = proposal.scores_total > 0 
            ? (proposal.scores[index] / proposal.scores_total) * 100 
            : 0;
          
          return (
            <div key={index}>
              <div className="flex justify-between text-xs mb-1">
                <span>{choice}</span>
                <span>{Math.round(percentage)}% ({proposal.scores[index].toLocaleString()} AGRO)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full ${index === 0 ? 'bg-[#00FF00]' : index === 1 ? 'bg-red-500' : 'bg-yellow-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Verificar se o usuário pode votar em uma proposta
  const canVote = (proposal: Proposal) => {
    if (!publicKey || proposal.state !== 'active') return false;
    return !userVotes[proposal.id];
  };
  
  // Verificar se o usuário pode criar propostas
  const canCreateProposal = () => {
    if (!publicKey) return false;
    // Em um ambiente real, verificaríamos se o usuário tem tokens suficientes
    return balance ? balance >= 1000 : true; // Simulação: qualquer usuário conectado pode criar
  };
  
  return (
    <Layout title="Governança DAO | AGROTM">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-gradient">Governança DAO</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Participe das decisões que moldam o futuro do ecossistema AGROTM
          </p>
          
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button 
                variant={filter === 'active' ? 'primary' : 'outline'}
                onClick={() => setFilter('active')}
              >
                Ativas
              </Button>
              <Button 
                variant={filter === 'pending' ? 'primary' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pendentes
              </Button>
              <Button 
                variant={filter === 'closed' ? 'primary' : 'outline'}
                onClick={() => setFilter('closed')}
              >
                Encerradas
              </Button>
            </div>
            
            <div>
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                <option value="treasury">Tesouro</option>
                <option value="protocol">Protocolo</option>
                <option value="community">Comunidade</option>
                <option value="agro-projects">Projetos Agro</option>
                <option value="other">Outros</option>
              </select>
            </div>
            
            <Button 
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              disabled={!canCreateProposal()}
            >
              Criar Proposta
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
              <span className="ml-3">Carregando propostas...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erro!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Nenhuma proposta encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter !== 'all' || categoryFilter !== 'all' 
                  ? 'Tente ajustar os filtros para ver mais propostas.'
                  : 'Seja o primeiro a criar uma proposta para a comunidade!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <motion.div 
                  key={proposal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        {renderStateBadge(proposal.state)}
                        {renderCategoryBadge(proposal.category)}
                      </div>
                      {userVotes[proposal.id] && (
                        <Badge color="blue">Você votou</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{proposal.title}</h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {proposal.body}
                    </p>
                    
                    {renderQuorumProgress(proposal)}
                    {renderVoteResults(proposal)}
                    
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>{proposal.votes} votos</span>
                        <span>
                          {proposal.state === 'pending' ? (
                            `Inicia em ${formatDistanceToNow(proposal.start, { locale: pt, addSuffix: true })}`
                          ) : proposal.state === 'active' ? (
                            `Encerra em ${formatDistanceToNow(proposal.end, { locale: pt, addSuffix: true })}`
                          ) : (
                            `Encerrada ${formatDistanceToNow(proposal.end, { locale: pt, addSuffix: true })}`
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openProposalDetails(proposal)}
                      >
                        Detalhes
                      </Button>
                      
                      {canVote(proposal) && (
                        <Button 
                          variant="primary" 
                          className="flex-1"
                          onClick={() => openVoteModal(proposal)}
                        >
                          Votar
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Modal de Detalhes da Proposta */}
      {selectedProposal && (
        <Modal 
          isOpen={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)}
          title={selectedProposal.title}
          size="lg"
        >
          <ProposalDetails 
            proposal={selectedProposal}
            votes={votes[selectedProposal.id] || []}
            userVote={userVotes[selectedProposal.id]}
            onVote={() => {
              setShowDetailsModal(false);
              openVoteModal(selectedProposal);
            }}
            canVote={canVote(selectedProposal)}
          />
        </Modal>
      )}
      
      {/* Modal de Votação */}
      {selectedProposal && (
        <Modal 
          isOpen={showVoteModal} 
          onClose={() => setShowVoteModal(false)}
          title="Votar na Proposta"
        >
          <VoteForm 
            proposal={selectedProposal}
            onSubmit={async (choice, reason) => {
              try {
                await voteOnProposal(selectedProposal.id, choice, reason);
                setShowVoteModal(false);
              } catch (err: any) {
                alert(`Erro ao votar: ${err.message}`);
              }
            }}
            votingPower={balance || 0}
          />
        </Modal>
      )}
      
      {/* Modal de Criação de Proposta */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Criar Nova Proposta"
        size="lg"
      >
        <ProposalForm 
          onSubmit={async (data) => {
            try {
              const proposalId = await createProposal(data);
              setShowCreateModal(false);
              // Redirecionar para a proposta criada
              router.push(`/dao/proposals?id=${proposalId}`);
            } catch (err: any) {
              alert(`Erro ao criar proposta: ${err.message}`);
            }
          }}
          minTokensRequired={1000}
          userTokens={balance || 0}
        />
      </Modal>
    </Layout>
  );
};

export default ProposalsPage;