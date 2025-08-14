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
import { motion } from 'framer-motion';
import axios from 'axios';
import { ethers } from 'ethers';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

// Componentes
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

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
const SNAPSHOT_SPACE_ID = 'agrotm.eth';
const QUORUM_THRESHOLD = 100000;

const ProposalsPage: React.FC = () => {
  const router = useRouter();
  
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
  
  // Mock data
        const mockProposals: Proposal[] = [
          {
            id: '0x1234567890abcdef1',
      title: 'Implementação de Staking Pool para AGRO',
      body: 'Proposta para criar um pool de staking com APY de 12% para tokens AGRO',
      choices: ['A favor', 'Contra', 'Abstenção'],
      start: Date.now() - 86400000, // 1 dia atrás
      end: Date.now() + 604800000, // 7 dias
            snapshot: '12345678',
            state: 'active',
      author: '0x1234...5678',
      scores: [1500, 200, 50],
      scores_total: 1750,
      votes: 175,
      quorum: 1000,
            type: 'single-choice',
              discussion: 'https://forum.agroisync.com/proposal/1',
      category: 'protocol'
    }
  ];

  useEffect(() => {
    setProposals(mockProposals);
    setFilteredProposals(mockProposals);
    setLoading(false);
  }, []);

  const openProposalDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowDetailsModal(true);
  };
  
  const openVoteModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowVoteModal(true);
  };
  
  return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
        <h1 className="text-4xl font-bold mb-2">Governança DAO</h1>
        <p className="text-xl text-gray-600 mb-6">
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
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
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
            <p className="text-gray-600">
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
                    <Badge variant={proposal.state === 'active' ? 'success' : 'warning'}>
                      {proposal.state === 'active' ? 'Ativa' : proposal.state === 'pending' ? 'Pendente' : 'Encerrada'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(proposal.start, { addSuffix: true, locale: pt })}
                    </span>
                    </div>
                    
                  <h3 className="text-lg font-semibold mb-2">{proposal.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{proposal.body}</p>
                    
                    <div className="mt-auto pt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openProposalDetails(proposal)}
                      >
                        Detalhes
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
  );
};

export default ProposalsPage;