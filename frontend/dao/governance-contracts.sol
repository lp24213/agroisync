// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title AGROGovernanceToken
 * @dev Token de governança do ecossistema AGROTM com suporte a delegação e snapshot
 */
contract AGROGovernanceToken is ERC20Votes, AccessControl, Pausable, ReentrancyGuard {
    using SafeMath for uint256;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    
    uint256 public maxSupply;
    uint256 public mintingAllowedAfter;
    
    // Mapeamento para rastrear recompensas de staking
    mapping(address => uint256) public stakingRewards;
    
    // Eventos
    event RewardDistributed(address indexed user, uint256 amount);
    event GovernanceTransferred(address indexed previousGovernance, address indexed newGovernance);
    
    /**
     * @dev Construtor do token de governança
     * @param name Nome do token
     * @param symbol Símbolo do token
     * @param initialSupply Fornecimento inicial
     * @param _maxSupply Fornecimento máximo
     * @param admin Endereço do administrador inicial
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _maxSupply,
        address admin
    ) ERC20(name, symbol) ERC20Permit(name) {
        require(initialSupply <= _maxSupply, "Initial supply exceeds max supply");
        
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(BURNER_ROLE, admin);
        _setupRole(GOVERNANCE_ROLE, admin);
        
        maxSupply = _maxSupply;
        mintingAllowedAfter = block.timestamp + 90 days; // Minting bloqueado por 90 dias
        
        _mint(admin, initialSupply);
    }
    
    /**
     * @dev Cria novos tokens
     * @param to Endereço que receberá os tokens
     * @param amount Quantidade de tokens a criar
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(block.timestamp >= mintingAllowedAfter, "Minting not allowed yet");
        require(totalSupply().add(amount) <= maxSupply, "Max supply exceeded");
        
        _mint(to, amount);
    }
    
    /**
     * @dev Destrói tokens
     * @param from Endereço de onde os tokens serão queimados
     * @param amount Quantidade de tokens a queimar
     */
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
    
    /**
     * @dev Distribui recompensas de staking
     * @param user Endereço do usuário
     * @param amount Quantidade de tokens de recompensa
     */
    function distributeReward(address user, uint256 amount) external onlyRole(MINTER_ROLE) nonReentrant whenNotPaused {
        require(totalSupply().add(amount) <= maxSupply, "Max supply exceeded");
        
        stakingRewards[user] = stakingRewards[user].add(amount);
        _mint(user, amount);
        
        emit RewardDistributed(user, amount);
    }
    
    /**
     * @dev Pausa todas as transferências e operações de token
     */
    function pause() external onlyRole(GOVERNANCE_ROLE) {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyRole(GOVERNANCE_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Atualiza o fornecimento máximo
     * @param newMaxSupply Novo fornecimento máximo
     */
    function updateMaxSupply(uint256 newMaxSupply) external onlyRole(GOVERNANCE_ROLE) {
        require(newMaxSupply >= totalSupply(), "New max supply below current total supply");
        maxSupply = newMaxSupply;
    }
    
    /**
     * @dev Hook interno que é chamado antes de qualquer transferência de tokens
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Sobrescreve a função de transferência para adicionar verificação de pausa
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Sobrescreve a função de transferFrom para adicionar verificação de pausa
     */
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
}

/**
 * @title AGROGovernor
 * @dev Contrato de governança para o ecossistema AGROTM
 */
contract AGROGovernor is AccessControl, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using ECDSA for bytes32;
    
    // Estruturas
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        uint256 quorum;
        bool executed;
        bool canceled;
        uint256[] votes;
        mapping(address => uint256) hasVoted;
        bytes32 snapshotId;
        ProposalType proposalType;
        address targetContract;
        bytes executionCalldata;
    }
    
    enum ProposalType {
        SIGNALING,      // Proposta de sinalização (sem execução on-chain)
        PARAMETER,      // Alteração de parâmetros do protocolo
        TREASURY,       // Movimentação de fundos do tesouro
        UPGRADE,        // Atualização de contratos
        EMERGENCY       // Ação de emergência
    }
    
    struct ProposalView {
        uint256 id;
        address proposer;
        string title;
        string description;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        uint256 quorum;
        bool executed;
        bool canceled;
        uint256[] votes;
        bytes32 snapshotId;
        ProposalType proposalType;
        address targetContract;
        bytes executionCalldata;
    }
    
    // Constantes
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    // Variáveis de estado
    AGROGovernanceToken public governanceToken;
    uint256 public proposalCount;
    uint256 public votingDelay; // Tempo em segundos entre proposta e início da votação
    uint256 public votingPeriod; // Duração da votação em segundos
    uint256 public proposalThreshold; // Tokens mínimos para criar proposta
    uint256 public quorumThreshold; // Percentual do supply para quórum (base 10000)
    uint256 public executionDelay; // Tempo em segundos entre aprovação e execução
    
    // Mapeamentos
    mapping(uint256 => Proposal) public proposals;
    mapping(bytes32 => uint256) public snapshotToProposal;
    
    // Eventos
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string[] options,
        uint256 startTime,
        uint256 endTime,
        uint256 quorum,
        ProposalType proposalType
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 option,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId, address executor);
    event ProposalCanceled(uint256 indexed proposalId, address canceler);
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
    event QuorumThresholdSet(uint256 oldQuorumThreshold, uint256 newQuorumThreshold);
    event ExecutionDelaySet(uint256 oldExecutionDelay, uint256 newExecutionDelay);
    
    /**
     * @dev Construtor do contrato de governança
     * @param _governanceToken Endereço do token de governança
     * @param admin Endereço do administrador inicial
     */
    constructor(
        address _governanceToken,
        address admin
    ) {
        require(_governanceToken != address(0), "Invalid governance token address");
        
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(GOVERNANCE_ROLE, admin);
        _setupRole(PROPOSER_ROLE, admin);
        _setupRole(EXECUTOR_ROLE, admin);
        
        governanceToken = AGROGovernanceToken(_governanceToken);
        
        // Configurações iniciais
        votingDelay = 1 days;
        votingPeriod = 7 days;
        proposalThreshold = 100000 * 10**18; // 100,000 tokens
        quorumThreshold = 1000; // 10% (base 10000)
        executionDelay = 2 days;
    }
    
    /**
     * @dev Cria uma nova proposta
     * @param title Título da proposta
     * @param description Descrição detalhada da proposta
     * @param options Opções de voto
     * @param proposalType Tipo da proposta
     * @param targetContract Contrato alvo para execução (opcional)
     * @param executionCalldata Dados para execução (opcional)
     * @param snapshotId ID do snapshot (opcional)
     * @return ID da proposta criada
     */
    function createProposal(
        string memory title,
        string memory description,
        string[] memory options,
        ProposalType proposalType,
        address targetContract,
        bytes memory executionCalldata,
        bytes32 snapshotId
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(options.length >= 2 && options.length <= 10, "Invalid number of options");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        // Verificar se o criador tem tokens suficientes ou tem o papel de proposer
        if (!hasRole(PROPOSER_ROLE, msg.sender)) {
            uint256 proposerVotes = governanceToken.getPastVotes(msg.sender, block.number - 1);
            require(proposerVotes >= proposalThreshold, "Proposer votes below threshold");
        }
        
        // Para propostas que exigem execução, verificar dados adicionais
        if (proposalType != ProposalType.SIGNALING) {
            require(targetContract != address(0), "Target contract required for execution");
            require(executionCalldata.length > 0, "Execution calldata required");
        }
        
        // Calcular quórum baseado no supply atual
        uint256 quorum = governanceToken.totalSupply().mul(quorumThreshold).div(10000);
        
        // Criar nova proposta
        uint256 proposalId = proposalCount + 1;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.options = options;
        proposal.startTime = block.timestamp + votingDelay;
        proposal.endTime = proposal.startTime + votingPeriod;
        proposal.quorum = quorum;
        proposal.executed = false;
        proposal.canceled = false;
        proposal.votes = new uint256[](options.length);
        proposal.snapshotId = snapshotId;
        proposal.proposalType = proposalType;
        proposal.targetContract = targetContract;
        proposal.executionCalldata = executionCalldata;
        
        // Atualizar contagem de propostas
        proposalCount = proposalId;
        
        // Mapear snapshot para proposta, se fornecido
        if (snapshotId != bytes32(0)) {
            snapshotToProposal[snapshotId] = proposalId;
        }
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            title,
            options,
            proposal.startTime,
            proposal.endTime,
            quorum,
            proposalType
        );
        
        return proposalId;
    }
    
    /**
     * @dev Vota em uma proposta
     * @param proposalId ID da proposta
     * @param option Índice da opção escolhida
     */
    function castVote(uint256 proposalId, uint256 option) external whenNotPaused nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!proposal.canceled, "Proposal canceled");
        require(option < proposal.options.length, "Invalid option");
        require(proposal.hasVoted[msg.sender] == 0, "Already voted");
        
        // Calcular peso do voto baseado no snapshot
        uint256 votes = governanceToken.getPastVotes(msg.sender, block.number - 1);
        require(votes > 0, "No voting power");
        
        // Registrar voto
        proposal.votes[option] = proposal.votes[option].add(votes);
        proposal.hasVoted[msg.sender] = option + 1; // +1 para diferenciar de não votado (0)
        
        emit VoteCast(proposalId, msg.sender, option, votes);
    }
    
    /**
     * @dev Vota em uma proposta com assinatura (para votação off-chain)
     * @param proposalId ID da proposta
     * @param option Índice da opção escolhida
     * @param voter Endereço do votante
     * @param signature Assinatura do votante
     */
    function castVoteBySig(
        uint256 proposalId,
        uint256 option,
        address voter,
        bytes memory signature
    ) external whenNotPaused nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!proposal.canceled, "Proposal canceled");
        require(option < proposal.options.length, "Invalid option");
        require(proposal.hasVoted[voter] == 0, "Already voted");
        
        // Verificar assinatura
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(proposalId, option))));
        address recoveredSigner = messageHash.recover(signature);
        require(recoveredSigner == voter, "Invalid signature");
        
        // Calcular peso do voto baseado no snapshot
        uint256 votes = governanceToken.getPastVotes(voter, block.number - 1);
        require(votes > 0, "No voting power");
        
        // Registrar voto
        proposal.votes[option] = proposal.votes[option].add(votes);
        proposal.hasVoted[voter] = option + 1; // +1 para diferenciar de não votado (0)
        
        emit VoteCast(proposalId, voter, option, votes);
    }
    
    /**
     * @dev Executa uma proposta aprovada
     * @param proposalId ID da proposta
     */
    function executeProposal(uint256 proposalId) external whenNotPaused nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(block.timestamp >= proposal.endTime + executionDelay, "Execution delay not passed");
        
        // Verificar se a proposta atingiu quórum
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < proposal.votes.length; i++) {
            totalVotes = totalVotes.add(proposal.votes[i]);
        }
        require(totalVotes >= proposal.quorum, "Quorum not reached");
        
        // Verificar se a proposta foi aprovada (opção 0 tem mais votos)
        uint256 winningOption = 0;
        for (uint256 i = 1; i < proposal.votes.length; i++) {
            if (proposal.votes[i] > proposal.votes[winningOption]) {
                winningOption = i;
            }
        }
        require(winningOption == 0, "Proposal not approved"); // Opção 0 deve ser "Aprovar"
        
        // Verificar permissão para executar
        if (!hasRole(EXECUTOR_ROLE, msg.sender)) {
            require(proposal.proposalType != ProposalType.TREASURY && 
                    proposal.proposalType != ProposalType.UPGRADE, 
                    "Only executors can execute this type");
        }
        
        // Marcar como executada
        proposal.executed = true;
        
        // Executar a proposta se não for apenas de sinalização
        if (proposal.proposalType != ProposalType.SIGNALING) {
            (bool success, ) = proposal.targetContract.call(proposal.executionCalldata);
            require(success, "Proposal execution failed");
        }
        
        emit ProposalExecuted(proposalId, msg.sender);
    }
    
    /**
     * @dev Cancela uma proposta
     * @param proposalId ID da proposta
     */
    function cancelProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal already canceled");
        
        // Apenas o proposer ou governança pode cancelar
        require(
            proposal.proposer == msg.sender || hasRole(GOVERNANCE_ROLE, msg.sender),
            "Not authorized to cancel"
        );
        
        // Se a votação já começou, apenas governança pode cancelar
        if (block.timestamp >= proposal.startTime) {
            require(hasRole(GOVERNANCE_ROLE, msg.sender), "Only governance can cancel active proposals");
        }
        
        proposal.canceled = true;
        
        emit ProposalCanceled(proposalId, msg.sender);
    }
    
    /**
     * @dev Obtém detalhes de uma proposta
     * @param proposalId ID da proposta
     * @return Detalhes da proposta
     */
    function getProposal(uint256 proposalId) external view returns (ProposalView memory) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        
        return ProposalView({
            id: proposal.id,
            proposer: proposal.proposer,
            title: proposal.title,
            description: proposal.description,
            options: proposal.options,
            startTime: proposal.startTime,
            endTime: proposal.endTime,
            quorum: proposal.quorum,
            executed: proposal.executed,
            canceled: proposal.canceled,
            votes: proposal.votes,
            snapshotId: proposal.snapshotId,
            proposalType: proposal.proposalType,
            targetContract: proposal.targetContract,
            executionCalldata: proposal.executionCalldata
        });
    }
    
    /**
     * @dev Verifica se um endereço já votou em uma proposta
     * @param proposalId ID da proposta
     * @param voter Endereço do votante
     * @return Opção votada (0 se não votou, ou índice+1 da opção)
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (uint256) {
        return proposals[proposalId].hasVoted[voter];
    }
    
    /**
     * @dev Atualiza o atraso de votação
     * @param newVotingDelay Novo atraso em segundos
     */
    function setVotingDelay(uint256 newVotingDelay) external onlyRole(GOVERNANCE_ROLE) {
        require(newVotingDelay >= 1 hours && newVotingDelay <= 7 days, "Invalid voting delay");
        
        uint256 oldVotingDelay = votingDelay;
        votingDelay = newVotingDelay;
        
        emit VotingDelaySet(oldVotingDelay, newVotingDelay);
    }
    
    /**
     * @dev Atualiza o período de votação
     * @param newVotingPeriod Novo período em segundos
     */
    function setVotingPeriod(uint256 newVotingPeriod) external onlyRole(GOVERNANCE_ROLE) {
        require(newVotingPeriod >= 1 days && newVotingPeriod <= 30 days, "Invalid voting period");
        
        uint256 oldVotingPeriod = votingPeriod;
        votingPeriod = newVotingPeriod;
        
        emit VotingPeriodSet(oldVotingPeriod, newVotingPeriod);
    }
    
    /**
     * @dev Atualiza o threshold para criar propostas
     * @param newProposalThreshold Novo threshold
     */
    function setProposalThreshold(uint256 newProposalThreshold) external onlyRole(GOVERNANCE_ROLE) {
        require(newProposalThreshold > 0, "Threshold must be positive");
        
        uint256 oldProposalThreshold = proposalThreshold;
        proposalThreshold = newProposalThreshold;
        
        emit ProposalThresholdSet(oldProposalThreshold, newProposalThreshold);
    }
    
    /**
     * @dev Atualiza o threshold de quórum
     * @param newQuorumThreshold Novo threshold (base 10000)
     */
    function setQuorumThreshold(uint256 newQuorumThreshold) external onlyRole(GOVERNANCE_ROLE) {
        require(newQuorumThreshold > 0 && newQuorumThreshold <= 5000, "Invalid quorum threshold");
        
        uint256 oldQuorumThreshold = quorumThreshold;
        quorumThreshold = newQuorumThreshold;
        
        emit QuorumThresholdSet(oldQuorumThreshold, newQuorumThreshold);
    }
    
    /**
     * @dev Atualiza o atraso de execução
     * @param newExecutionDelay Novo atraso em segundos
     */
    function setExecutionDelay(uint256 newExecutionDelay) external onlyRole(GOVERNANCE_ROLE) {
        require(newExecutionDelay <= 14 days, "Execution delay too long");
        
        uint256 oldExecutionDelay = executionDelay;
        executionDelay = newExecutionDelay;
        
        emit ExecutionDelaySet(oldExecutionDelay, newExecutionDelay);
    }
    
    /**
     * @dev Pausa o contrato de governança
     */
    function pause() external onlyRole(GOVERNANCE_ROLE) {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyRole(GOVERNANCE_ROLE) {
        _unpause();
    }
}

/**
 * @title AGROTimelock
 * @dev Contrato de timelock para execução atrasada de transações de governança
 */
contract AGROTimelock is AccessControl, Pausable {
    using SafeMath for uint256;
    
    bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
    
    uint256 public constant MIN_DELAY = 1 days;
    uint256 public constant MAX_DELAY = 30 days;
    
    uint256 public delay;
    
    mapping(bytes32 => bool) public queuedTransactions;
    
    event TransactionQueued(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    
    event TransactionExecuted(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    
    event TransactionCancelled(
        bytes32 indexed txHash
    );
    
    event DelayChanged(
        uint256 oldDelay,
        uint256 newDelay
    );
    
    /**
     * @dev Construtor do timelock
     * @param admin Endereço do administrador
     * @param proposer Endereço do proposer
     * @param executor Endereço do executor
     * @param initialDelay Atraso inicial em segundos
     */
    constructor(
        address admin,
        address proposer,
        address executor,
        uint256 initialDelay
    ) {
        require(initialDelay >= MIN_DELAY, "Delay must exceed minimum delay");
        require(initialDelay <= MAX_DELAY, "Delay must not exceed maximum delay");
        
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(TIMELOCK_ADMIN_ROLE, admin);
        _setupRole(PROPOSER_ROLE, proposer);
        _setupRole(EXECUTOR_ROLE, executor);
        _setupRole(CANCELLER_ROLE, admin);
        
        delay = initialDelay;
    }
    
    /**
     * @dev Coloca uma transação na fila para execução futura
     * @param target Endereço do contrato alvo
     * @param value Valor em ether a enviar
     * @param signature Assinatura da função a chamar
     * @param data Dados da chamada
     * @param eta Tempo estimado de execução (timestamp)
     * @return Hash da transação
     */
    function queueTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public onlyRole(PROPOSER_ROLE) whenNotPaused returns (bytes32) {
        require(eta >= block.timestamp.add(delay), "Estimated execution time must satisfy delay");
        
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = true;
        
        emit TransactionQueued(txHash, target, value, signature, data, eta);
        
        return txHash;
    }
    
    /**
     * @dev Cancela uma transação na fila
     * @param target Endereço do contrato alvo
     * @param value Valor em ether a enviar
     * @param signature Assinatura da função a chamar
     * @param data Dados da chamada
     * @param eta Tempo estimado de execução (timestamp)
     */
    function cancelTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public onlyRole(CANCELLER_ROLE) {
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = false;
        
        emit TransactionCancelled(txHash);
    }
    
    /**
     * @dev Executa uma transação na fila
     * @param target Endereço do contrato alvo
     * @param value Valor em ether a enviar
     * @param signature Assinatura da função a chamar
     * @param data Dados da chamada
     * @param eta Tempo estimado de execução (timestamp)
     * @return Dados retornados pela execução
     */
    function executeTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public payable onlyRole(EXECUTOR_ROLE) whenNotPaused returns (bytes memory) {
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        
        require(queuedTransactions[txHash], "Transaction not queued");
        require(block.timestamp >= eta, "Transaction hasn't surpassed time lock");
        require(block.timestamp <= eta.add(14 days), "Transaction is stale");
        
        queuedTransactions[txHash] = false;
        
        bytes memory callData;
        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
        }
        
        // Execute transaction
        (bool success, bytes memory returnData) = target.call{value: value}(callData);
        require(success, "Transaction execution reverted");
        
        emit TransactionExecuted(txHash, target, value, signature, data, eta);
        
        return returnData;
    }
    
    /**
     * @dev Atualiza o atraso do timelock
     * @param newDelay Novo atraso em segundos
     */
    function updateDelay(uint256 newDelay) external onlyRole(TIMELOCK_ADMIN_ROLE) {
        require(newDelay >= MIN_DELAY, "Delay must exceed minimum delay");
        require(newDelay <= MAX_DELAY, "Delay must not exceed maximum delay");
        
        uint256 oldDelay = delay;
        delay = newDelay;
        
        emit DelayChanged(oldDelay, newDelay);
    }
    
    /**
     * @dev Pausa o contrato
     */
    function pause() external onlyRole(TIMELOCK_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyRole(TIMELOCK_ADMIN_ROLE) {
        _unpause();
    }
    
    receive() external payable {}
}

/**
 * @title AGROTreasury
 * @dev Contrato de tesouro para o ecossistema AGROTM
 */
contract AGROTreasury is AccessControl, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    
    bytes32 public constant TREASURY_ADMIN_ROLE = keccak256("TREASURY_ADMIN_ROLE");
    bytes32 public constant SPENDER_ROLE = keccak256("SPENDER_ROLE");
    bytes32 public constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");
    
    // Eventos
    event Deposited(address indexed token, address indexed from, uint256 amount);
    event Withdrawn(address indexed token, address indexed to, uint256 amount);
    event EtherWithdrawn(address indexed to, uint256 amount);
    event EtherDeposited(address indexed from, uint256 amount);
    
    /**
     * @dev Construtor do tesouro
     * @param admin Endereço do administrador
     * @param timelock Endereço do timelock
     */
    constructor(address admin, address timelock) {
        require(admin != address(0), "Invalid admin address");
        require(timelock != address(0), "Invalid timelock address");
        
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(TREASURY_ADMIN_ROLE, admin);
        _setupRole(SPENDER_ROLE, timelock);
        _setupRole(DEPOSITOR_ROLE, admin);
    }
    
    /**
     * @dev Deposita tokens ERC20 no tesouro
     * @param token Endereço do token
     * @param amount Quantidade a depositar
     */
    function deposit(address token, uint256 amount) external nonReentrant whenNotPaused {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be positive");
        
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        emit Deposited(token, msg.sender, amount);
    }
    
    /**
     * @dev Retira tokens ERC20 do tesouro
     * @param token Endereço do token
     * @param to Endereço de destino
     * @param amount Quantidade a retirar
     */
    function withdraw(address token, address to, uint256 amount) external onlyRole(SPENDER_ROLE) nonReentrant whenNotPaused {
        require(token != address(0), "Invalid token address");
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be positive");
        
        IERC20(token).transfer(to, amount);
        
        emit Withdrawn(token, to, amount);
    }
    
    /**
     * @dev Retira ether do tesouro
     * @param to Endereço de destino
     * @param amount Quantidade a retirar
     */
    function withdrawEther(address payable to, uint256 amount) external onlyRole(SPENDER_ROLE) nonReentrant whenNotPaused {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be positive");
        require(address(this).balance >= amount, "Insufficient balance");
        
        to.transfer(amount);
        
        emit EtherWithdrawn(to, amount);
    }
    
    /**
     * @dev Pausa o contrato
     */
    function pause() external onlyRole(TREASURY_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyRole(TREASURY_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Função para receber ether
     */
    receive() external payable {
        emit EtherDeposited(msg.sender, msg.value);
    }
}