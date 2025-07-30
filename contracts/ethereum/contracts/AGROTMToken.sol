// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title AGROTMToken
 * @dev Token ERC20 aprimorado para a plataforma AGROTM com recursos de segurança avançados
 * 
 * Características de Segurança:
 * - Controle de acesso baseado em roles (RBAC)
 * - Blacklist/Whitelist para endereços
 * - Proteção anti-whale com limites de transferência
 * - Snapshot para auditoria
 * - Pausável para emergências
 * - Proteção contra reentrância
 * - Validações rigorosas de entrada
 * 
 * @author AGROTM Team
 * @custom:security-contact security@agrotm.com
 */
contract AGROTMToken is 
    ERC20, 
    ERC20Burnable, 
    ERC20Pausable, 
    ERC20Snapshot, 
    AccessControl, 
    ReentrancyGuard 
{
    using Address for address;

    // ============ EVENTS ============
    
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount, address indexed burner);
    event MaxSupplyChanged(uint256 oldMaxSupply, uint256 newMaxSupply);
    event BlacklistUpdated(address indexed account, bool isBlacklisted);
    event WhitelistUpdated(address indexed account, bool isWhitelisted);
    event TransferLimitChanged(uint256 oldLimit, uint256 newLimit);
    event AntiWhaleLimitChanged(uint256 oldLimit, uint256 newLimit);
    event SnapshotCreated(uint256 snapshotId, uint256 timestamp);
    
    // ============ CONSTANTS ============
    
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18; // 1 bilhão de tokens
    uint256 public constant MAX_SUPPLY = 2_000_000_000 * 10**18; // 2 bilhões de tokens máximo
    uint256 public constant MIN_TRANSFER_AMOUNT = 1 * 10**18; // 1 token mínimo
    uint256 public constant MAX_TRANSFER_AMOUNT = 10_000_000 * 10**18; // 10 milhões de tokens máximo
    uint256 public constant ANTI_WHALE_LIMIT = 100_000_000 * 10**18; // 100 milhões de tokens (10% do supply inicial)
    
    // ============ ROLES ============
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");
    bytes32 public constant WHITELIST_ROLE = keccak256("WHITELIST_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // ============ STATE VARIABLES ============
    
    uint256 public maxSupply;
    uint256 public transferLimit;
    uint256 public antiWhaleLimit;
    
    // Mappings para controle de acesso
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public lastTransferTime;
    
    // Controle de rate limiting
    uint256 public constant RATE_LIMIT_PERIOD = 1 hours;
    uint256 public constant MAX_TRANSFERS_PER_PERIOD = 10;
    mapping(address => uint256) public transferCount;
    mapping(address => uint256) public lastResetTime;
    
    // ============ MODIFIERS ============
    
    modifier notBlacklisted(address account) {
        require(!blacklisted[account], "Account is blacklisted");
        _;
    }
    
    modifier onlyWhitelisted(address account) {
        require(whitelisted[account] || hasRole(DEFAULT_ADMIN_ROLE, account), "Account not whitelisted");
        _;
    }
    
    modifier withinTransferLimit(uint256 amount) {
        require(amount >= MIN_TRANSFER_AMOUNT, "Amount below minimum");
        require(amount <= transferLimit, "Amount exceeds transfer limit");
        _;
    }
    
    modifier checkRateLimit() {
        uint256 currentTime = block.timestamp;
        if (currentTime - lastResetTime[msg.sender] >= RATE_LIMIT_PERIOD) {
            transferCount[msg.sender] = 0;
            lastResetTime[msg.sender] = currentTime;
        }
        require(transferCount[msg.sender] < MAX_TRANSFERS_PER_PERIOD, "Rate limit exceeded");
        transferCount[msg.sender]++;
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Construtor
     * @param _owner Endereço do owner inicial
     * @param _initialSupply Supply inicial (opcional, usa constante se 0)
     */
    constructor(
        address _owner,
        uint256 _initialSupply
    ) ERC20("AGROTM Token", "AGROTM") {
        require(_owner != address(0), "Invalid owner address");
        
        // Configurar supply
        uint256 initialSupply = _initialSupply > 0 ? _initialSupply : INITIAL_SUPPLY;
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max");
        
        maxSupply = MAX_SUPPLY;
        transferLimit = MAX_TRANSFER_AMOUNT;
        antiWhaleLimit = ANTI_WHALE_LIMIT;
        
        // Configurar roles
        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
        _grantRole(MINTER_ROLE, _owner);
        _grantRole(BURNER_ROLE, _owner);
        _grantRole(SNAPSHOT_ROLE, _owner);
        _grantRole(BLACKLIST_ROLE, _owner);
        _grantRole(WHITELIST_ROLE, _owner);
        _grantRole(PAUSER_ROLE, _owner);
        
        // Whitelist owner
        whitelisted[_owner] = true;
        
        // Mint supply inicial
        _mint(_owner, initialSupply);
        
        emit TokensMinted(_owner, initialSupply, _owner);
    }
    
    // ============ MINTING FUNCTIONS ============
    
    /**
     * @dev Mint tokens (apenas minters autorizados)
     * @param to Endereço que receberá os tokens
     * @param amount Quantidade de tokens a mintar
     */
    function mint(
        address to, 
        uint256 amount
    ) external onlyRole(MINTER_ROLE) nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        require(!blacklisted[to], "Recipient is blacklisted");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, msg.sender);
    }
    
    /**
     * @dev Mint em lote para múltiplos endereços
     * @param recipients Array de endereços
     * @param amounts Array de quantidades
     */
    function mintBatch(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(MINTER_ROLE) nonReentrant {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 100, "Too many recipients");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalSupply() + totalAmount <= maxSupply, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid address");
            require(amounts[i] > 0, "Amount must be greater than zero");
            require(!blacklisted[recipients[i]], "Recipient is blacklisted");
            
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i], msg.sender);
        }
    }
    
    // ============ BURNING FUNCTIONS ============
    
    /**
     * @dev Burn tokens do próprio endereço
     * @param amount Quantidade de tokens a queimar
     */
    function burn(uint256 amount) external override {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(!blacklisted[msg.sender], "Account is blacklisted");
        
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, msg.sender);
    }
    
    /**
     * @dev Burn tokens de outro endereço (apenas burners autorizados)
     * @param from Endereço de onde queimar os tokens
     * @param amount Quantidade de tokens a queimar
     */
    function burnFrom(
        address from, 
        uint256 amount
    ) external override onlyRole(BURNER_ROLE) {
        require(from != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(from) >= amount, "Insufficient balance");
        require(!blacklisted[from], "Account is blacklisted");
        
        _burn(from, amount);
        emit TokensBurned(from, amount, msg.sender);
    }
    
    // ============ TRANSFER FUNCTIONS ============
    
    /**
     * @dev Transfer tokens com validações de segurança
     * @param to Endereço de destino
     * @param amount Quantidade a transferir
     */
    function transfer(
        address to, 
        uint256 amount
    ) public override withinTransferLimit(amount) checkRateLimit returns (bool) {
        require(!blacklisted[msg.sender], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        require(onlyWhitelisted(msg.sender) || onlyWhitelisted(to), "Transfer not allowed");
        
        // Verificar limite anti-whale
        if (amount > antiWhaleLimit) {
            require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Amount exceeds anti-whale limit");
        }
        
        bool success = super.transfer(to, amount);
        if (success) {
            lastTransferTime[msg.sender] = block.timestamp;
        }
        return success;
    }
    
    /**
     * @dev TransferFrom com validações de segurança
     * @param from Endereço de origem
     * @param to Endereço de destino
     * @param amount Quantidade a transferir
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override withinTransferLimit(amount) checkRateLimit returns (bool) {
        require(!blacklisted[from], "From is blacklisted");
        require(!blacklisted[to], "To is blacklisted");
        require(onlyWhitelisted(from) || onlyWhitelisted(to), "Transfer not allowed");
        
        // Verificar limite anti-whale
        if (amount > antiWhaleLimit) {
            require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Amount exceeds anti-whale limit");
        }
        
        bool success = super.transferFrom(from, to, amount);
        if (success) {
            lastTransferTime[from] = block.timestamp;
        }
        return success;
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Define o supply máximo
     * @param _maxSupply Novo supply máximo
     */
    function setMaxSupply(uint256 _maxSupply) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_maxSupply >= totalSupply(), "Max supply cannot be less than current supply");
        require(_maxSupply <= MAX_SUPPLY, "Max supply exceeds hard limit");
        
        uint256 oldMaxSupply = maxSupply;
        maxSupply = _maxSupply;
        
        emit MaxSupplyChanged(oldMaxSupply, _maxSupply);
    }
    
    /**
     * @dev Define o limite de transferência
     * @param _transferLimit Novo limite
     */
    function setTransferLimit(uint256 _transferLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_transferLimit >= MIN_TRANSFER_AMOUNT, "Transfer limit too low");
        require(_transferLimit <= MAX_TRANSFER_AMOUNT, "Transfer limit too high");
        
        uint256 oldLimit = transferLimit;
        transferLimit = _transferLimit;
        
        emit TransferLimitChanged(oldLimit, _transferLimit);
    }
    
    /**
     * @dev Define o limite anti-whale
     * @param _antiWhaleLimit Novo limite
     */
    function setAntiWhaleLimit(uint256 _antiWhaleLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_antiWhaleLimit <= maxSupply / 10, "Anti-whale limit too high");
        
        uint256 oldLimit = antiWhaleLimit;
        antiWhaleLimit = _antiWhaleLimit;
        
        emit AntiWhaleLimitChanged(oldLimit, _antiWhaleLimit);
    }
    
    // ============ BLACKLIST/WHITELIST FUNCTIONS ============
    
    /**
     * @dev Adiciona endereço à blacklist
     * @param account Endereço a blacklistar
     */
    function addToBlacklist(address account) external onlyRole(BLACKLIST_ROLE) {
        require(account != address(0), "Invalid address");
        require(!blacklisted[account], "Already blacklisted");
        
        blacklisted[account] = true;
        emit BlacklistUpdated(account, true);
    }
    
    /**
     * @dev Remove endereço da blacklist
     * @param account Endereço a remover
     */
    function removeFromBlacklist(address account) external onlyRole(BLACKLIST_ROLE) {
        require(account != address(0), "Invalid address");
        require(blacklisted[account], "Not blacklisted");
        
        blacklisted[account] = false;
        emit BlacklistUpdated(account, false);
    }
    
    /**
     * @dev Adiciona endereço à whitelist
     * @param account Endereço a whitelistar
     */
    function addToWhitelist(address account) external onlyRole(WHITELIST_ROLE) {
        require(account != address(0), "Invalid address");
        require(!whitelisted[account], "Already whitelisted");
        
        whitelisted[account] = true;
        emit WhitelistUpdated(account, true);
    }
    
    /**
     * @dev Remove endereço da whitelist
     * @param account Endereço a remover
     */
    function removeFromWhitelist(address account) external onlyRole(WHITELIST_ROLE) {
        require(account != address(0), "Invalid address");
        require(whitelisted[account], "Not whitelisted");
        
        whitelisted[account] = false;
        emit WhitelistUpdated(account, false);
    }
    
    // ============ PAUSE FUNCTIONS ============
    
    /**
     * @dev Pausa o contrato
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    // ============ SNAPSHOT FUNCTIONS ============
    
    /**
     * @dev Cria um snapshot do estado atual
     */
    function snapshot() external onlyRole(SNAPSHOT_ROLE) returns (uint256) {
        uint256 snapshotId = _snapshot();
        emit SnapshotCreated(snapshotId, block.timestamp);
        return snapshotId;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Retorna o supply circulante
     */
    function circulatingSupply() external view returns (uint256) {
        return totalSupply();
    }
    
    /**
     * @dev Retorna o supply restante disponível para mint
     */
    function remainingSupply() external view returns (uint256) {
        return maxSupply - totalSupply();
    }
    
    /**
     * @dev Verifica se um endereço está na whitelist
     * @param account Endereço a verificar
     */
    function isWhitelisted(address account) external view returns (bool) {
        return whitelisted[account] || hasRole(DEFAULT_ADMIN_ROLE, account);
    }
    
    /**
     * @dev Retorna estatísticas do contrato
     */
    function getContractStats() external view returns (
        uint256 _totalSupply,
        uint256 _maxSupply,
        uint256 _circulatingSupply,
        uint256 _remainingSupply,
        uint256 _transferLimit,
        uint256 _antiWhaleLimit
    ) {
        return (
            totalSupply(),
            maxSupply,
            circulatingSupply(),
            remainingSupply(),
            transferLimit,
            antiWhaleLimit
        );
    }
    
    // ============ OVERRIDE FUNCTIONS ============
    
    function _update(
        address from, 
        address to, 
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
    
    function _snapshot() internal override(ERC20Snapshot) returns (uint256) {
        return super._snapshot();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    // ============ EMERGENCY FUNCTIONS ============
    
    /**
     * @dev Função de emergência para recuperar tokens perdidos
     * @param tokenAddress Endereço do token
     * @param to Endereço de destino
     * @param amount Quantidade
     */
    function emergencyWithdraw(
        address tokenAddress,
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Invalid amount");
        
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(to, amount), "Transfer failed");
    }
} 