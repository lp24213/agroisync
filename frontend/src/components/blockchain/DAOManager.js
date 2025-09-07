import React, { useState, // useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-';
import { Users, Vote, Loader2 } from 'lucide-react';

const DAOManager = ({ userId }) => {
  const {  } = useTranslation();
  const [daos, setDaos] = useState([]);
  const [// loading, // setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalVotingPower, setTotalVotingPower] = useState(0);
  const [activeProposals, setActiveProposals] = useState(0);

  // useEffect(() => {
    // fetchDAOData();
  }, [userId]);

  const // fetchDAOData = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/daos?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setDaos(data.daos);
        setTotalVotingPower(data.totalVotingPower);
        setActiveProposals(data.activeProposals);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('dao.error', 'Erro ao carregar dados de DAO'));
    } finally {
      // setLoading(false);
    }
  };

  const voteOnProposal = async (proposalId, vote) => {
    try {
      const response = await fetch(`/api/blockchain/daos/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ vote, userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDaos(daos.map(dao => ({
          ...dao,
          proposals: dao.proposals.map(proposal => 
            proposal.id === proposalId 
              ? { ...proposal, userVote: vote }
              : proposal
          )
        })));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(// t('dao.voteError', 'Erro ao votar na proposta'));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <// CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <// Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <// CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <// Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (// loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {// t('dao.// loading', 'Carregando dados de DAO...')}
        </span>
      </div>
    );
  }

  return (
    <// motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <// Users className="w-6 h-6 mr-2 text-agro-emerald" />
          {// t('dao.title', 'DAO Manager')}
        </h2>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4 flex items-center">
          <// AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('dao.totalVotingPower', 'Poder de Voto Total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalVotingPower.toFixed(2)}
              </p>
            </div>
            <Vote className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('dao.activeProposals', 'Propostas Ativas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeProposals}
              </p>
            </div>
            <// Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {// t('dao.memberOf', 'Membro de')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {daos.length}
              </p>
            </div>
            <// Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* DAOs */}
      {daos.length === 0 ? (
        <div className="text-center py-8">
          <// Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {// t('dao.noDAOs', 'Nenhum DAO encontrado')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {daos.map((dao) => (
            <div key={dao.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {dao.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dao.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(dao.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {dao.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('dao.members', 'Membros')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {dao.members}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('dao.votingPower', 'Poder de Voto')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {dao.votingPower.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('dao.treasury', 'Tesouro')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${dao.treasury.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {// t('dao.proposals', 'Propostas')}:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {dao.proposals.length}
                  </p>
                </div>
              </div>
              
              {/* Propostas */}
              {dao.proposals.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {// t('dao.proposals', 'Propostas')}
                  </h4>
                  <div className="space-y-3">
                    {dao.proposals.map((proposal) => (
                      <div key={proposal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {proposal.title}
                          </h5>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {proposal.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {proposal.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {// t('dao.votes', 'Votos')}: {proposal.votesFor} / {proposal.votesAgainst}
                          </div>
                          
                          {proposal.status === 'active' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => voteOnProposal(proposal.id, 'for')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                {// t('dao.voteFor', 'Votar Sim')}
                              </button>
                              <button
                                onClick={() => voteOnProposal(proposal.id, 'against')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                {// t('dao.voteAgainst', 'Votar Não')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </// motion.div>
  );
};

export default DAOManager;
