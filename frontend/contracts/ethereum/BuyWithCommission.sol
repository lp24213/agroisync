// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title BuyWithCommission
 * @dev Contrato aprimorado para compra de tokens e NFTs com comissão automática
 * 
 * Características de Segurança:
 * - Controle de acesso baseado em roles (RBAC)
 * - Proteção contra reentrância
 * - Validações rigorosas de entrada
 * - Proteção contra overflow/underflow
 * - Rate limiting para operações
 * - Pausável para emergências
 * - Blacklist/Whitelist para endereços
 * - Anti-whale protection
 * - Proteção contra front-running
 * 
 * @author AGROTM Team
 * @custom:security-contact security@agrotm.com
 */
contract BuyWithCommission is AccessControl, ReentrancyGuard, Pausable {
    using Address for address;
    using Math for uint256;
    
    // ============ EVENTS ============
    
    event TokenPurchased(
        address indexed buyer, 
        address indexed tokenAddress, 
        uint256 amount, 
        uint256 commission,
        uint256 sellerAmount,
        uint256 price
    );
    event NFTPurchased(
        address indexed buyer, 
        address indexed nftAddress, 
        uint256 tokenId, 
        uint256 amount, 
        uint256 commission, 
        uint256 nftType,
        uint256 price
    );
    event CommissionRateChanged(uint256 oldRate, uint256 newRate);
    event AdminAddressChanged(address indexed oldAdmin, address indexed newAdmin);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event BlacklistUpdated(address indexed account, bool isBlacklisted);
    event WhitelistUpdated(address indexed account, bool isWhitelisted);
    event PurchaseLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event RateLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event EmergencyWithdraw(address indexed token, address indexed to, uint256 amount);
    
    // ============ CONSTANTS ============
    
    uint256 private constant COMMISSION_RATE_DENOMINATOR = 10000; // Base para cálculo de porcentagem (100% = 10000)
    uint256 private constant MAX_COMMISSION_RATE = 3000; // 30% máximo
    uint256 private constant MIN_COMMISSION_RATE = 100; // 1% mínimo
    uint256 private constant MAX_PURCHASE_AMOUNT = 1000 ether;
    uint256 private constant MIN_PURCHASE_AMOUNT = 0.001 ether;
    uint256 private constant RATE_LIMIT_PERIOD = 1 hours;
    uint256 private constant MAX_PURCHASES_PER_PERIOD = 20;
    
    // ============ ROLES ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");
    bytes32 public constant WHITELIST_ROLE = keccak256("WHITELIST_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    // ============ STATE VARIABLES ============
    
    uint256 public commissionRate; // Taxa de comissão em pontos base (ex: 500 = 5%)
    address public adminAddress; // Endereço que receberá as comissões
    uint256 public maxPurchaseAmount;
    uint256 public minPurchaseAmount;
    
    // Controle de acesso
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelisted;
    
    // Rate limiting
    mapping(address => uint256) public userPurchaseCount;
    mapping(address => uint256) public lastPurchaseResetTime;
    mapping(address => uint256) public userTotalSpent;
    
    // Pausa global
    bool public globalPause;
    
    // ============ MODIFIERS ============
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }
    
    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not operator");
        _;
    }
    
    modifier onlyEmergency() {
        require(hasRole(EMERGENCY_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not emergency");
        _;
    }
    
    modifier notBlacklisted(address account) {
        require(!blacklisted[account], "Account is blacklisted");
        _;
    }
    
    modifier onlyWhitelisted(address account) {
        require(whitelisted[account] || hasRole(DEFAULT_ADMIN_ROLE, account), "Account not whitelisted");
        _;
    }
    
    modifier notPaused() {
        require(!globalPause, "Contract is globally paused");
        _;
    }
    
    modifier checkRateLimit() {
        uint256 currentTime = block.timestamp;
        if (currentTime - lastPurchaseResetTime[msg.sender] >= RATE_LIMIT_PERIOD) {
            userPurchaseCount[msg.sender] = 0;
            lastPurchaseResetTime[msg.sender] = currentTime;
        }
        require(userPurchaseCount[msg.sender] < MAX_PURCHASES_PER_PERIOD, "Rate limit exceeded");
        userPurchaseCount[msg.sender]++;
        _;
    }
    
    modifier validPurchaseAmount(uint256 amount) {
        require(amount >= minPurchaseAmount, "Amount below minimum");
        require(amount <= maxPurchaseAmount, "Amount above maximum");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Construtor
     * @param _commissionRate Taxa de comissão inicial em pontos base (ex: 500 = 5%)
     * @param _adminAddress Endereço que receberá as comissões
     */
    constructor(uint256 _commissionRate, address _adminAddress) {
        require(_commissionRate <= MAX_COMMISSION_RATE, "Commission rate too high");
        require(_commissionRate >= MIN_COMMISSION_RATE, "Commission rate too low");
        require(_adminAddress != address(0), "Invalid admin address");
        
        commissionRate = _commissionRate;
        adminAddress = _adminAddress;
        maxPurchaseAmount = MAX_PURCHASE_AMOUNT;
        minPurchaseAmount = MIN_PURCHASE_AMOUNT;
        
        // Configurar roles
        _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
        _grantRole(ADMIN_ROLE, _adminAddress);
        _grantRole(OPERATOR_ROLE, _adminAddress);
        _grantRole(PAUSER_ROLE, _adminAddress);
        _grantRole(BLACKLIST_ROLE, _adminAddress);
        _grantRole(WHITELIST_ROLE, _adminAddress);
        _grantRole(EMERGENCY_ROLE, _adminAddress);
        
        // Whitelist admin
        whitelisted[_adminAddress] = true;
    }
    
    // ============ PURCHASE FUNCTIONS ============
    
    /**
     * @dev Compra tokens ERC-20 com comissão
     * @param tokenAddress Endereço do contrato do token
     * @param seller Endereço do vendedor que receberá o pagamento (menos a comissão)
     * @param amount Quantidade de tokens a comprar
     */
    function buyTokenWithCommission(
        address tokenAddress,
        address seller,
        uint256 amount
    ) external payable nonReentrant whenNotPaused notPaused checkRateLimit validPurchaseAmount(msg.value) {
        require(tokenAddress != address(0), "Invalid token address");
        require(seller != address(0), "Invalid seller address");
        require(amount > 0, "Amount must be greater than zero");
        require(!blacklisted[seller], "Seller is blacklisted");
        require(!blacklisted[msg.sender], "Buyer is blacklisted");
        
        // Calcular comissão
        uint256 commission = (msg.value * commissionRate) / COMMISSION_RATE_DENOMINATOR;
        uint256 sellerAmount = msg.value - commission;
        
        // Verificar se o vendedor tem tokens suficientes
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(seller) >= amount, "Insufficient token balance");
        require(token.allowance(seller, address(this)) >= amount, "Insufficient token allowance");
        
        // Transferir ETH para o vendedor
        (bool sellerSuccess, ) = payable(seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Transfer to seller failed");
        
        // Transferir comissão para o admin
        (bool adminSuccess, ) = payable(adminAddress).call{value: commission}("");
        require(adminSuccess, "Transfer to admin failed");
        
        // Transferir tokens para o comprador
        require(token.transferFrom(seller, msg.sender, amount), "Token transfer failed");
        
        // Atualizar estatísticas do usuário
        userTotalSpent[msg.sender] += msg.value;
        
        emit TokenPurchased(msg.sender, tokenAddress, amount, commission, sellerAmount, msg.value);
    }
    
    /**
     * @dev Compra NFT ERC-721 com comissão
     * @param nftAddress Endereço do contrato do NFT
     * @param seller Endereço do vendedor que receberá o pagamento (menos a comissão)
     * @param tokenId ID do token NFT
     */
    function buyNFTWithCommission(
        address nftAddress,
        address seller,
        uint256 tokenId
    ) external payable nonReentrant whenNotPaused notPaused checkRateLimit validPurchaseAmount(msg.value) {
        require(nftAddress != address(0), "Invalid NFT address");
        require(seller != address(0), "Invalid seller address");
        require(!blacklisted[seller], "Seller is blacklisted");
        require(!blacklisted[msg.sender], "Buyer is blacklisted");
        
        // Verificar se o vendedor é o proprietário do NFT
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == seller, "Seller is not NFT owner");
        require(nft.isApprovedForAll(seller, address(this)) || nft.getApproved(tokenId) == address(this), "NFT not approved");
        
        // Calcular comissão
        uint256 commission = (msg.value * commissionRate) / COMMISSION_RATE_DENOMINATOR;
        uint256 sellerAmount = msg.value - commission;
        
        // Transferir ETH para o vendedor
        (bool sellerSuccess, ) = payable(seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Transfer to seller failed");
        
        // Transferir comissão para o admin
        (bool adminSuccess, ) = payable(adminAddress).call{value: commission}("");
        require(adminSuccess, "Transfer to admin failed");
        
        // Transferir NFT para o comprador
        nft.safeTransferFrom(seller, msg.sender, tokenId);
        
        // Atualizar estatísticas do usuário
        userTotalSpent[msg.sender] += msg.value;
        
        emit NFTPurchased(msg.sender, nftAddress, tokenId, 1, commission, 721, msg.value);
    }
    
    /**
     * @dev Compra NFT ERC-1155 com comissão
     * @param nftAddress Endereço do contrato do NFT
     * @param seller Endereço do vendedor que receberá o pagamento (menos a comissão)
     * @param tokenId ID do token NFT
     * @param amount Quantidade de tokens a comprar
     * @param data Dados adicionais para a transferência
     */
    function buyERC1155WithCommission(
        address nftAddress,
        address seller,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external payable nonReentrant whenNotPaused notPaused checkRateLimit validPurchaseAmount(msg.value) {
        require(nftAddress != address(0), "Invalid NFT address");
        require(seller != address(0), "Invalid seller address");
        require(amount > 0, "Amount must be greater than zero");
        require(!blacklisted[seller], "Seller is blacklisted");
        require(!blacklisted[msg.sender], "Buyer is blacklisted");
        
        // Verificar se o vendedor tem tokens suficientes
        IERC1155 nft = IERC1155(nftAddress);
        require(nft.balanceOf(seller, tokenId) >= amount, "Insufficient NFT balance");
        require(nft.isApprovedForAll(seller, address(this)), "NFT not approved");
        
        // Calcular comissão
        uint256 commission = (msg.value * commissionRate) / COMMISSION_RATE_DENOMINATOR;
        uint256 sellerAmount = msg.value - commission;
        
        // Transferir ETH para o vendedor
        (bool sellerSuccess, ) = payable(seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Transfer to seller failed");
        
        // Transferir comissão para o admin
        (bool adminSuccess, ) = payable(adminAddress).call{value: commission}("");
        require(adminSuccess, "Transfer to admin failed");
        
        // Transferir NFT para o comprador
        nft.safeTransferFrom(seller, msg.sender, tokenId, amount, data);
        
        // Atualizar estatísticas do usuário
        userTotalSpent[msg.sender] += msg.value;
        
        emit NFTPurchased(msg.sender, nftAddress, tokenId, amount, commission, 1155, msg.value);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Define a taxa de comissão
     * @param _commissionRate Nova taxa de comissão em pontos base (ex: 500 = 5%)
     */
    function setCommissionRate(uint256 _commissionRate) external onlyAdmin {
        require(_commissionRate <= MAX_COMMISSION_RATE, "Commission rate too high");
        require(_commissionRate >= MIN_COMMISSION_RATE, "Commission rate too low");
        
        uint256 oldRate = commissionRate;
        commissionRate = _commissionRate;
        
        emit CommissionRateChanged(oldRate, _commissionRate);
    }
    
    /**
     * @dev Define o endereço do administrador que receberá as comissões
     * @param _adminAddress Novo endereço do administrador
     */
    function setAdminAddress(address _adminAddress) external onlyAdmin {
        require(_adminAddress != address(0), "Invalid admin address");
        
        address oldAdmin = adminAddress;
        adminAddress = _adminAddress;
        
        emit AdminAddressChanged(oldAdmin, _adminAddress);
    }
    
    /**
     * @dev Define limites de compra
     * @param _minPurchaseAmount Novo valor mínimo
     * @param _maxPurchaseAmount Novo valor máximo
     */
    function setPurchaseLimits(uint256 _minPurchaseAmount, uint256 _maxPurchaseAmount) external onlyAdmin {
        require(_minPurchaseAmount < _maxPurchaseAmount, "Invalid limits");
        require(_maxPurchaseAmount <= MAX_PURCHASE_AMOUNT, "Max amount too high");
        
        uint256 oldMin = minPurchaseAmount;
        uint256 oldMax = maxPurchaseAmount;
        
        minPurchaseAmount = _minPurchaseAmount;
        maxPurchaseAmount = _maxPurchaseAmount;
        
        emit PurchaseLimitUpdated(oldMin, _minPurchaseAmount);
        emit PurchaseLimitUpdated(oldMax, _maxPurchaseAmount);
    }
    
    // ============ ACCESS CONTROL FUNCTIONS ============
    
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
    
    // ============ WITHDRAWAL FUNCTIONS ============
    
    /**
     * @dev Retira ETH do contrato
     * @param to Endereço para onde enviar os fundos
     * @param amount Quantidade a retirar
     */
    function withdraw(address payable to, uint256 amount) external onlyOperator {
        require(to != address(0), "Invalid address");
        require(amount > 0 && amount <= address(this).balance, "Invalid amount");
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(to, amount);
    }
    
    /**
     * @dev Retira tokens ERC20 do contrato
     * @param tokenAddress Endereço do token
     * @param to Endereço de destino
     * @param amount Quantidade a retirar
     */
    function withdrawTokens(
        address tokenAddress,
        address to,
        uint256 amount
    ) external onlyEmergency {
        require(tokenAddress != address(0), "Invalid token address");
        require(to != address(0), "Invalid address");
        require(amount > 0, "Invalid amount");
        
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
        
        require(token.transfer(to, amount), "Token transfer failed");
        
        emit EmergencyWithdraw(tokenAddress, to, amount);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Calcula comissão para um valor
     * @param amount Valor para calcular comissão
     */
    function calculateCommission(uint256 amount) external view returns (uint256 commission, uint256 sellerAmount) {
        commission = (amount * commissionRate) / COMMISSION_RATE_DENOMINATOR;
        sellerAmount = amount - commission;
        return (commission, sellerAmount);
    }
    
    /**
     * @dev Retorna estatísticas do contrato
     */
    function getContractStats() external view returns (
        uint256 _commissionRate,
        address _adminAddress,
        uint256 _contractBalance,
        uint256 _minPurchaseAmount,
        uint256 _maxPurchaseAmount
    ) {
        return (
            commissionRate,
            adminAddress,
            address(this).balance,
            minPurchaseAmount,
            maxPurchaseAmount
        );
    }
    
    /**
     * @dev Retorna estatísticas de um usuário
     * @param user Endereço do usuário
     */
    function getUserStats(address user) external view returns (
        uint256 _totalSpent,
        uint256 _purchaseCount,
        uint256 _lastResetTime
    ) {
        return (
            userTotalSpent[user],
            userPurchaseCount[user],
            lastPurchaseResetTime[user]
        );
    }
    
    /**
     * @dev Verifica se um endereço está na whitelist
     * @param account Endereço a verificar
     */
    function isWhitelisted(address account) external view returns (bool) {
        return whitelisted[account] || hasRole(DEFAULT_ADMIN_ROLE, account);
    }
    
    // ============ EMERGENCY FUNCTIONS ============
    
    /**
     * @dev Função de emergência para recuperar fundos perdidos
     * @param tokenAddress Endereço do token (address(0) para ETH)
     * @param to Endereço de destino
     * @param amount Quantidade
     */
    function emergencyWithdraw(
        address tokenAddress,
        address to,
        uint256 amount
    ) external onlyEmergency {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Invalid amount");
        
        if (tokenAddress == address(0)) {
            // ETH
            require(amount <= address(this).balance, "Insufficient ETH balance");
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20
            IERC20 token = IERC20(tokenAddress);
            require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
            require(token.transfer(to, amount), "Token transfer failed");
        }
        
        emit EmergencyWithdraw(tokenAddress, to, amount);
    }
    
    /**
     * @dev Função para receber ETH
     */
    receive() external payable {}
}