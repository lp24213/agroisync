// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title Staking
 * @dev Contrato de staking aprimorado para tokens AGROTM com recursos de segurança avançados
 * 
 * Características de Segurança:
 * - Controle de acesso baseado em roles (RBAC)
 * - Proteção contra reentrância
 * - Validações rigorosas de entrada
 * - Proteção contra overflow/underflow
 * - Rate limiting para operações
 * - Pausável para emergências
 * - Snapshot para auditoria
 * - Anti-whale protection
 * 
 * @author AGROTM Team
 * @custom:security-contact security@agrotm.com
 */
contract Staking is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using Address for address;
    using Math for uint256;
    
    // ============ EVENTS ============
    
    event Staked(
        address indexed user, 
        uint256 indexed stakeId, 
        uint256 amount, 
        uint256 lockPeriod, 
        uint256 apr,
        uint256 startTime,
        uint256 endTime
    );
    event Unstaked(
        address indexed user, 
        uint256 indexed stakeId, 
        uint256 amount, 
        uint256 rewards,
        uint256 totalAmount
    );
    event RewardsClaimed(
        address indexed user, 
        uint256 indexed stakeId, 
        uint256 rewards,
        uint256 timestamp
    );
    event APRUpdated(uint256 lockPeriod, uint256 oldAPR, uint256 newAPR);
    event EmergencyWithdraw(
        address indexed user, 
        uint256 indexed stakeId, 
        uint256 amount,
        address indexed admin
    );
    event StakePaused(uint256 indexed stakeId, address indexed user);
    event StakeResumed(uint256 indexed stakeId, address indexed user);
    event LockPeriodUpdated(uint256 indexed periodId, uint256 duration, uint256 apr, bool isActive);
    event AntiWhaleLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event RateLimitUpdated(uint256 oldLimit, uint256 newLimit);
    
    // ============ STRUCTS ============
    
    struct Stake {
        uint256 stakeId;
        address user;
        uint256 amount;
        uint256 lockPeriod;
        uint256 apr;
        uint256 startTime;
        uint256 endTime;
        uint256 lastRewardTime;
        uint256 accumulatedRewards;
        bool isActive;
        bool isLocked;
        bool isPaused;
        uint256 pauseStartTime;
        uint256 totalPausedTime;
    }
    
    struct LockPeriod {
        uint256 duration; // em segundos
        uint256 apr; // em pontos base (ex: 1200 = 12%)
        bool isActive;
        uint256 maxStakeAmount; // limite máximo por stake neste período
        uint256 totalStaked; // total staked neste período
    }
    
    struct UserStats {
        uint256 totalStaked;
        uint256 totalRewards;
        uint256 activeStakes;
        uint256 lastStakeTime;
    }
    
    // ============ CONSTANTS ============
    
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant MAX_APR = 5000; // 50% máximo
    uint256 public constant MIN_LOCK_PERIOD = 1 days;
    uint256 public constant MAX_LOCK_PERIOD = 365 days;
    uint256 public constant MAX_STAKE_AMOUNT = 1_000_000 * 10**18; // 1 milhão de tokens
    uint256 public constant MIN_STAKE_AMOUNT = 100 * 10**18; // 100 tokens
    uint256 public constant ANTI_WHALE_LIMIT = 100_000 * 10**18; // 100k tokens por usuário
    uint256 public constant RATE_LIMIT_PERIOD = 1 hours;
    uint256 public constant MAX_STAKES_PER_PERIOD = 5;
    
    // ============ ROLES ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    // ============ STATE VARIABLES ============
    
    IERC20 public immutable agrotmToken;
    Counters.Counter private _stakeIds;
    
    mapping(uint256 => Stake) public stakes;
    mapping(address => uint256[]) public userStakes;
    mapping(address => UserStats) public userStats;
    mapping(uint256 => LockPeriod) public lockPeriods;
    
    uint256 public totalStaked;
    uint256 public totalRewardsDistributed;
    uint256 public minStakeAmount;
    uint256 public maxStakeAmount;
    uint256 public antiWhaleLimit;
    
    // Rate limiting
    mapping(address => uint256) public userStakeCount;
    mapping(address => uint256) public lastStakeResetTime;
    
    // Pausa global
    bool public globalPause;
    
    // ============ MODIFIERS ============
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }
    
    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Caller is not operator");
        _;
    }
    
    modifier onlyEmergency() {
        require(hasRole(EMERGENCY_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "Caller is not emergency");
        _;
    }
    
    modifier notPaused() {
        require(!globalPause, "Contract is globally paused");
        _;
    }
    
    modifier validStakeId(uint256 stakeId) {
        require(stakeId > 0 && stakeId <= _stakeIds.current(), "Invalid stake ID");
        _;
    }
    
    modifier validLockPeriod(uint256 lockPeriodIndex) {
        require(lockPeriodIndex < 5, "Invalid lock period");
        require(lockPeriods[lockPeriodIndex].isActive, "Lock period not active");
        _;
    }
    
    modifier checkRateLimit() {
        uint256 currentTime = block.timestamp;
        if (currentTime - lastStakeResetTime[msg.sender] >= RATE_LIMIT_PERIOD) {
            userStakeCount[msg.sender] = 0;
            lastStakeResetTime[msg.sender] = currentTime;
        }
        require(userStakeCount[msg.sender] < MAX_STAKES_PER_PERIOD, "Rate limit exceeded");
        userStakeCount[msg.sender]++;
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Construtor
     * @param _agrotmToken Endereço do token AGROTM
     * @param _admin Endereço do admin
     */
    constructor(address _agrotmToken, address _admin) {
        require(_agrotmToken != address(0), "Invalid token address");
        require(_admin != address(0), "Invalid admin address");
        
        agrotmToken = IERC20(_agrotmToken);
        minStakeAmount = MIN_STAKE_AMOUNT;
        maxStakeAmount = MAX_STAKE_AMOUNT;
        antiWhaleLimit = ANTI_WHALE_LIMIT;
        
        // Configurar roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(EMERGENCY_ROLE, _admin);
        
        // Configurar períodos de lock padrão
        _setupDefaultLockPeriods();
    }
    
    // ============ STAKING FUNCTIONS ============
    
    /**
     * @dev Stake tokens com validações avançadas
     * @param amount Quantidade de tokens para stake
     * @param lockPeriodIndex Índice do período de lock
     */
    function stake(
        uint256 amount, 
        uint256 lockPeriodIndex
    ) external nonReentrant whenNotPaused notPaused checkRateLimit validLockPeriod(lockPeriodIndex) {
        require(amount >= minStakeAmount, "Amount below minimum");
        require(amount <= maxStakeAmount, "Amount above maximum");
        require(amount <= lockPeriods[lockPeriodIndex].maxStakeAmount, "Amount exceeds period limit");
        
        // Verificar limite anti-whale
        uint256 userTotalStaked = userStats[msg.sender].totalStaked;
        require(userTotalStaked + amount <= antiWhaleLimit, "Exceeds anti-whale limit");
        
        LockPeriod memory lockPeriod = lockPeriods[lockPeriodIndex];
        
        _stakeIds.increment();
        uint256 stakeId = _stakeIds.current();
        
        uint256 endTime = block.timestamp + lockPeriod.duration;
        
        stakes[stakeId] = Stake({
            stakeId: stakeId,
            user: msg.sender,
            amount: amount,
            lockPeriod: lockPeriod.duration,
            apr: lockPeriod.apr,
            startTime: block.timestamp,
            endTime: endTime,
            lastRewardTime: block.timestamp,
            accumulatedRewards: 0,
            isActive: true,
            isLocked: lockPeriod.duration > 0,
            isPaused: false,
            pauseStartTime: 0,
            totalPausedTime: 0
        });
        
        userStakes[msg.sender].push(stakeId);
        
        // Atualizar estatísticas
        userStats[msg.sender].totalStaked += amount;
        userStats[msg.sender].activeStakes++;
        userStats[msg.sender].lastStakeTime = block.timestamp;
        
        lockPeriods[lockPeriodIndex].totalStaked += amount;
        totalStaked += amount;
        
        agrotmToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Staked(
            msg.sender, 
            stakeId, 
            amount, 
            lockPeriod.duration, 
            lockPeriod.apr,
            block.timestamp,
            endTime
        );
    }
    
    /**
     * @dev Unstake tokens (após período de lock)
     * @param stakeId ID do stake
     */
    function unstake(uint256 stakeId) external nonReentrant validStakeId(stakeId) {
        Stake storage userStake = stakes[stakeId];
        require(userStake.user == msg.sender, "Not stake owner");
        require(userStake.isActive, "Stake not active");
        require(!userStake.isPaused, "Stake is paused");
        require(block.timestamp >= userStake.endTime, "Lock period not ended");
        
        uint256 rewards = _calculateRewards(stakeId);
        uint256 totalAmount = userStake.amount + rewards;
        
        // Atualizar estatísticas
        userStats[msg.sender].totalStaked -= userStake.amount;
        userStats[msg.sender].totalRewards += rewards;
        userStats[msg.sender].activeStakes--;
        
        totalStaked -= userStake.amount;
        totalRewardsDistributed += rewards;
        
        userStake.isActive = false;
        userStake.isLocked = false;
        
        agrotmToken.safeTransfer(msg.sender, totalAmount);
        
        emit Unstaked(msg.sender, stakeId, userStake.amount, rewards, totalAmount);
    }
    
    /**
     * @dev Claim rewards (para stakes flexíveis)
     * @param stakeId ID do stake
     */
    function claimRewards(uint256 stakeId) external nonReentrant validStakeId(stakeId) {
        Stake storage userStake = stakes[stakeId];
        require(userStake.user == msg.sender, "Not stake owner");
        require(userStake.isActive, "Stake not active");
        require(!userStake.isLocked, "Stake is locked");
        require(!userStake.isPaused, "Stake is paused");
        
        uint256 rewards = _calculateRewards(stakeId);
        require(rewards > 0, "No rewards to claim");
        
        userStake.lastRewardTime = block.timestamp;
        userStake.accumulatedRewards += rewards;
        userStats[msg.sender].totalRewards += rewards;
        totalRewardsDistributed += rewards;
        
        agrotmToken.safeTransfer(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, stakeId, rewards, block.timestamp);
    }
    
    /**
     * @dev Retorna stake flexível (antes do período de lock)
     * @param stakeId ID do stake
     */
    function unstakeFlexible(uint256 stakeId) external nonReentrant validStakeId(stakeId) {
        Stake storage userStake = stakes[stakeId];
        require(userStake.user == msg.sender, "Not stake owner");
        require(userStake.isActive, "Stake not active");
        require(!userStake.isLocked, "Stake is locked");
        require(!userStake.isPaused, "Stake is paused");
        
        uint256 rewards = _calculateRewards(stakeId);
        uint256 totalAmount = userStake.amount + rewards;
        
        // Atualizar estatísticas
        userStats[msg.sender].totalStaked -= userStake.amount;
        userStats[msg.sender].totalRewards += rewards;
        userStats[msg.sender].activeStakes--;
        
        totalStaked -= userStake.amount;
        totalRewardsDistributed += rewards;
        
        userStake.isActive = false;
        
        agrotmToken.safeTransfer(msg.sender, totalAmount);
        
        emit Unstaked(msg.sender, stakeId, userStake.amount, rewards, totalAmount);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Atualiza APR de um período de lock
     * @param lockPeriodIndex Índice do período
     * @param newAPR Novo APR em pontos base
     */
    function updateAPR(
        uint256 lockPeriodIndex, 
        uint256 newAPR
    ) external onlyOperator {
        require(lockPeriodIndex < 5, "Invalid lock period");
        require(newAPR <= MAX_APR, "APR too high");
        
        uint256 oldAPR = lockPeriods[lockPeriodIndex].apr;
        lockPeriods[lockPeriodIndex].apr = newAPR;
        
        emit APRUpdated(lockPeriods[lockPeriodIndex].duration, oldAPR, newAPR);
    }
    
    /**
     * @dev Ativa/desativa período de lock
     * @param lockPeriodIndex Índice do período
     * @param isActive Novo status
     */
    function setLockPeriodActive(
        uint256 lockPeriodIndex, 
        bool isActive
    ) external onlyOperator {
        require(lockPeriodIndex < 5, "Invalid lock period");
        lockPeriods[lockPeriodIndex].isActive = isActive;
        
        emit LockPeriodUpdated(
            lockPeriodIndex,
            lockPeriods[lockPeriodIndex].duration,
            lockPeriods[lockPeriodIndex].apr,
            isActive
        );
    }
    
    /**
     * @dev Define limites de stake
     * @param _minStakeAmount Novo valor mínimo
     * @param _maxStakeAmount Novo valor máximo
     */
    function setStakeLimits(
        uint256 _minStakeAmount, 
        uint256 _maxStakeAmount
    ) external onlyAdmin {
        require(_minStakeAmount < _maxStakeAmount, "Invalid limits");
        require(_maxStakeAmount <= MAX_STAKE_AMOUNT, "Max amount too high");
        
        minStakeAmount = _minStakeAmount;
        maxStakeAmount = _maxStakeAmount;
    }
    
    /**
     * @dev Define limite anti-whale
     * @param _antiWhaleLimit Novo limite
     */
    function setAntiWhaleLimit(uint256 _antiWhaleLimit) external onlyAdmin {
        require(_antiWhaleLimit <= MAX_STAKE_AMOUNT, "Anti-whale limit too high");
        
        uint256 oldLimit = antiWhaleLimit;
        antiWhaleLimit = _antiWhaleLimit;
        
        emit AntiWhaleLimitUpdated(oldLimit, _antiWhaleLimit);
    }
    
    /**
     * @dev Pausa um stake específico
     * @param stakeId ID do stake
     */
    function pauseStake(uint256 stakeId) external onlyOperator validStakeId(stakeId) {
        Stake storage userStake = stakes[stakeId];
        require(userStake.isActive, "Stake not active");
        require(!userStake.isPaused, "Stake already paused");
        
        userStake.isPaused = true;
        userStake.pauseStartTime = block.timestamp;
        
        emit StakePaused(stakeId, userStake.user);
    }
    
    /**
     * @dev Resume um stake pausado
     * @param stakeId ID do stake
     */
    function resumeStake(uint256 stakeId) external onlyOperator validStakeId(stakeId) {
        Stake storage userStake = stakes[stakeId];
        require(userStake.isActive, "Stake not active");
        require(userStake.isPaused, "Stake not paused");
        
        userStake.isPaused = false;
        userStake.totalPausedTime += block.timestamp - userStake.pauseStartTime;
        userStake.pauseStartTime = 0;
        
        emit StakeResumed(stakeId, userStake.user);
    }
    
    /**
     * @dev Pausa o contrato globalmente
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        globalPause = true;
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        globalPause = false;
        _unpause();
    }
    
    /**
     * @dev Retira tokens de emergência (apenas emergency role)
     * @param tokenAddress Endereço do token
     * @param amount Quantidade
     */
    function emergencyWithdraw(
        address tokenAddress, 
        uint256 amount
    ) external onlyEmergency {
        IERC20 token = IERC20(tokenAddress);
        token.safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, 0, amount, msg.sender);
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Calcula recompensas pendentes com proteção contra overflow
     * @param stakeId ID do stake
     */
    function _calculateRewards(uint256 stakeId) internal view returns (uint256) {
        Stake memory userStake = stakes[stakeId];
        if (!userStake.isActive || userStake.isPaused) return 0;
        
        uint256 currentTime = block.timestamp;
        uint256 effectiveLastRewardTime = userStake.lastRewardTime + userStake.totalPausedTime;
        
        if (currentTime <= effectiveLastRewardTime) return 0;
        
        uint256 timeElapsed = currentTime - effectiveLastRewardTime;
        uint256 annualReward = (userStake.amount * userStake.apr) / 10000;
        uint256 reward = (annualReward * timeElapsed) / SECONDS_PER_YEAR;
        
        return reward;
    }
    
    /**
     * @dev Configura períodos de lock padrão
     */
    function _setupDefaultLockPeriods() internal {
        // 30 dias - 8% APR
        lockPeriods[0] = LockPeriod({
            duration: 30 days,
            apr: 800,
            isActive: true,
            maxStakeAmount: 500_000 * 10**18,
            totalStaked: 0
        });
        
        // 90 dias - 12% APR
        lockPeriods[1] = LockPeriod({
            duration: 90 days,
            apr: 1200,
            isActive: true,
            maxStakeAmount: 750_000 * 10**18,
            totalStaked: 0
        });
        
        // 180 dias - 18% APR
        lockPeriods[2] = LockPeriod({
            duration: 180 days,
            apr: 1800,
            isActive: true,
            maxStakeAmount: 1_000_000 * 10**18,
            totalStaked: 0
        });
        
        // 365 dias - 25% APR
        lockPeriods[3] = LockPeriod({
            duration: 365 days,
            apr: 2500,
            isActive: true,
            maxStakeAmount: 1_000_000 * 10**18,
            totalStaked: 0
        });
        
        // Flexível - 5% APR
        lockPeriods[4] = LockPeriod({
            duration: 0,
            apr: 500,
            isActive: true,
            maxStakeAmount: 250_000 * 10**18,
            totalStaked: 0
        });
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Retorna informações de um stake
     * @param stakeId ID do stake
     */
    function getStakeInfo(
        uint256 stakeId
    ) external view validStakeId(stakeId) returns (Stake memory, uint256 pendingRewards) {
        Stake memory stake = stakes[stakeId];
        uint256 rewards = _calculateRewards(stakeId);
        return (stake, rewards);
    }
    
    /**
     * @dev Retorna todos os stakes de um usuário
     * @param user Endereço do usuário
     */
    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }
    
    /**
     * @dev Retorna recompensas pendentes de um stake
     * @param stakeId ID do stake
     */
    function getPendingRewards(uint256 stakeId) external view validStakeId(stakeId) returns (uint256) {
        return _calculateRewards(stakeId);
    }
    
    /**
     * @dev Retorna estatísticas do contrato
     */
    function getContractStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalRewardsDistributed,
        uint256 _totalStakes,
        uint256 _minStakeAmount,
        uint256 _maxStakeAmount,
        uint256 _antiWhaleLimit
    ) {
        return (
            totalStaked,
            totalRewardsDistributed,
            _stakeIds.current(),
            minStakeAmount,
            maxStakeAmount,
            antiWhaleLimit
        );
    }
    
    /**
     * @dev Retorna informações de um período de lock
     * @param lockPeriodIndex Índice do período
     */
    function getLockPeriodInfo(
        uint256 lockPeriodIndex
    ) external view returns (LockPeriod memory) {
        require(lockPeriodIndex < 5, "Invalid lock period");
        return lockPeriods[lockPeriodIndex];
    }
    
    /**
     * @dev Retorna estatísticas de um usuário
     * @param user Endereço do usuário
     */
    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }
    
    /**
     * @dev Retorna stakes ativos de um usuário
     * @param user Endereço do usuário
     */
    function getActiveStakes(address user) external view returns (uint256[] memory) {
        uint256[] memory allStakes = userStakes[user];
        uint256 activeCount = 0;
        
        // Contar stakes ativos
        for (uint256 i = 0; i < allStakes.length; i++) {
            if (stakes[allStakes[i]].isActive) {
                activeCount++;
            }
        }
        
        // Criar array de stakes ativos
        uint256[] memory activeStakes = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allStakes.length; i++) {
            if (stakes[allStakes[i]].isActive) {
                activeStakes[index] = allStakes[i];
                index++;
            }
        }
        
        return activeStakes;
    }
} 