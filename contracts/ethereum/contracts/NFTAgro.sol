// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title NFTAgro
 * @dev NFT ERC721 aprimorado para a plataforma AGROTM com recursos de segurança avançados
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
 * 
 * @author AGROTM Team
 * @custom:security-contact security@agrotm.com
 */
contract NFTAgro is 
    ERC721, 
    ERC721URIStorage, 
    ERC721Enumerable, 
    ERC721Burnable,
    AccessControl, 
    ReentrancyGuard,
    Pausable 
{
    using Counters for Counters.Counter;
    using Strings for uint256;
    using Address for address;
    using Math for uint256;
    
    // ============ EVENTS ============
    
    event NFTMinted(
        address indexed to, 
        uint256 indexed tokenId, 
        NFTType nftType, 
        uint256 rarity,
        uint256 level,
        uint256 price
    );
    event NFTBurned(uint256 indexed tokenId, address indexed burner);
    event NFTTypeChanged(uint256 indexed tokenId, NFTType oldType, NFTType newType);
    event RarityChanged(uint256 indexed tokenId, uint256 oldRarity, uint256 newRarity);
    event LevelUp(uint256 indexed tokenId, uint256 oldLevel, uint256 newLevel, uint256 experience);
    event BlacklistUpdated(address indexed account, bool isBlacklisted);
    event WhitelistUpdated(address indexed account, bool isWhitelisted);
    event MintPriceUpdated(NFTType nftType, uint256 oldPrice, uint256 newPrice);
    event BatchMinted(address indexed to, uint256[] tokenIds, NFTType nftType);
    
    // ============ ENUMS ============
    
    enum NFTType { SEED, FARM, DRONE }
    
    // ============ STRUCTS ============
    
    struct NFTMetadata {
        NFTType nftType;
        uint256 rarity; // 1-5 (1=comum, 5=lendário)
        uint256 level;
        uint256 experience;
        uint256 maxExperience;
        uint256 createdAt;
        bool isActive;
        bool isLocked;
        uint256 lockEndTime;
    }
    
    struct MintConfig {
        uint256 price;
        uint256 maxSupply;
        uint256 currentSupply;
        bool isActive;
        uint256 maxPerWallet;
    }
    
    // ============ CONSTANTS ============
    
    uint256 public constant MAX_RARITY = 5;
    uint256 public constant MAX_LEVEL = 100;
    uint256 public constant MAX_EXPERIENCE = 1000;
    uint256 public constant MIN_MINT_PRICE = 0.001 ether;
    uint256 public constant MAX_MINT_PRICE = 10 ether;
    uint256 public constant MAX_SUPPLY_PER_TYPE = 10000;
    uint256 public constant MAX_PER_WALLET = 100;
    uint256 public constant RATE_LIMIT_PERIOD = 1 hours;
    uint256 public constant MAX_MINTS_PER_PERIOD = 10;
    
    // ============ ROLES ============
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");
    bytes32 public constant WHITELIST_ROLE = keccak256("WHITELIST_ROLE");
    
    // ============ STATE VARIABLES ============
    
    Counters.Counter private _tokenIds;
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(NFTType => MintConfig) public mintConfigs;
    
    // Controle de acesso
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelisted;
    
    // Rate limiting
    mapping(address => uint256) public userMintCount;
    mapping(address => uint256) public lastMintResetTime;
    mapping(address => uint256) public walletMintCount;
    
    // Pausa global
    bool public globalPause;
    
    // ============ MODIFIERS ============
    
    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not minter");
        _;
    }
    
    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not operator");
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
    
    modifier validTokenId(uint256 tokenId) {
        require(_exists(tokenId), "Token does not exist");
        _;
    }
    
    modifier checkRateLimit() {
        uint256 currentTime = block.timestamp;
        if (currentTime - lastMintResetTime[msg.sender] >= RATE_LIMIT_PERIOD) {
            userMintCount[msg.sender] = 0;
            lastMintResetTime[msg.sender] = currentTime;
        }
        require(userMintCount[msg.sender] < MAX_MINTS_PER_PERIOD, "Rate limit exceeded");
        userMintCount[msg.sender]++;
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Construtor
     * @param _admin Endereço do admin inicial
     */
    constructor(address _admin) ERC721("AGROTM NFT", "AGRONFT") {
        require(_admin != address(0), "Invalid admin address");
        
        // Configurar roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(BLACKLIST_ROLE, _admin);
        _grantRole(WHITELIST_ROLE, _admin);
        
        // Whitelist admin
        whitelisted[_admin] = true;
        
        // Configurar preços e limites
        _setupMintConfigs();
    }
    
    // ============ MINTING FUNCTIONS ============
    
    /**
     * @dev Mint NFT (apenas minters autorizados)
     * @param to Endereço que receberá o NFT
     * @param nftType Tipo do NFT
     * @param rarity Raridade (1-5)
     * @param tokenURI URI dos metadados
     */
    function mintNFT(
        address to,
        NFTType nftType,
        uint256 rarity,
        string memory tokenURI
    ) external onlyMinter nonReentrant notPaused {
        require(to != address(0), "Invalid address");
        require(rarity >= 1 && rarity <= MAX_RARITY, "Invalid rarity");
        require(!blacklisted[to], "Recipient is blacklisted");
        require(mintConfigs[nftType].isActive, "Mint not active for this type");
        require(mintConfigs[nftType].currentSupply < mintConfigs[nftType].maxSupply, "Max supply reached");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        nftMetadata[newTokenId] = NFTMetadata({
            nftType: nftType,
            rarity: rarity,
            level: 1,
            experience: 0,
            maxExperience: MAX_EXPERIENCE,
            createdAt: block.timestamp,
            isActive: true,
            isLocked: false,
            lockEndTime: 0
        });
        
        mintConfigs[nftType].currentSupply++;
        
        emit NFTMinted(to, newTokenId, nftType, rarity, 1, 0);
    }
    
    /**
     * @dev Mint NFT público (com pagamento)
     * @param nftType Tipo do NFT
     * @param tokenURI URI dos metadados
     */
    function mintPublicNFT(
        NFTType nftType,
        string memory tokenURI
    ) external payable nonReentrant notPaused checkRateLimit {
        require(msg.value >= mintConfigs[nftType].price, "Insufficient payment");
        require(mintConfigs[nftType].isActive, "Mint not active for this type");
        require(mintConfigs[nftType].currentSupply < mintConfigs[nftType].maxSupply, "Max supply reached");
        require(walletMintCount[msg.sender] < mintConfigs[nftType].maxPerWallet, "Max per wallet reached");
        require(!blacklisted[msg.sender], "Sender is blacklisted");
        
        uint256 rarity = _generateRarity();
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        nftMetadata[newTokenId] = NFTMetadata({
            nftType: nftType,
            rarity: rarity,
            level: 1,
            experience: 0,
            maxExperience: MAX_EXPERIENCE,
            createdAt: block.timestamp,
            isActive: true,
            isLocked: false,
            lockEndTime: 0
        });
        
        mintConfigs[nftType].currentSupply++;
        walletMintCount[msg.sender]++;
        
        emit NFTMinted(msg.sender, newTokenId, nftType, rarity, 1, msg.value);
    }
    
    /**
     * @dev Mint em lote para múltiplos endereços
     * @param recipients Array de endereços
     * @param nftTypes Array de tipos
     * @param rarities Array de raridades
     * @param tokenURIs Array de URIs
     */
    function mintBatch(
        address[] calldata recipients,
        NFTType[] calldata nftTypes,
        uint256[] calldata rarities,
        string[] calldata tokenURIs
    ) external onlyMinter nonReentrant notPaused {
        require(
            recipients.length == nftTypes.length && 
            nftTypes.length == rarities.length && 
            rarities.length == tokenURIs.length,
            "Arrays length mismatch"
        );
        require(recipients.length <= 50, "Too many recipients");
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid address");
            require(rarities[i] >= 1 && rarities[i] <= MAX_RARITY, "Invalid rarity");
            require(!blacklisted[recipients[i]], "Recipient is blacklisted");
            require(mintConfigs[nftTypes[i]].isActive, "Mint not active for this type");
            require(mintConfigs[nftTypes[i]].currentSupply < mintConfigs[nftTypes[i]].maxSupply, "Max supply reached");
            
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            tokenIds[i] = newTokenId;
            
            _safeMint(recipients[i], newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            
            nftMetadata[newTokenId] = NFTMetadata({
                nftType: nftTypes[i],
                rarity: rarities[i],
                level: 1,
                experience: 0,
                maxExperience: MAX_EXPERIENCE,
                createdAt: block.timestamp,
                isActive: true,
                isLocked: false,
                lockEndTime: 0
            });
            
            mintConfigs[nftTypes[i]].currentSupply++;
            
            emit NFTMinted(recipients[i], newTokenId, nftTypes[i], rarities[i], 1, 0);
        }
        
        emit BatchMinted(msg.sender, tokenIds, nftTypes[0]);
    }
    
    // ============ BURNING FUNCTIONS ============
    
    /**
     * @dev Burn NFT (apenas owner do token ou operadores autorizados)
     * @param tokenId ID do token
     */
    function burnNFT(uint256 tokenId) external validTokenId(tokenId) {
        require(_isApprovedOrOwner(msg.sender, tokenId) || hasRole(OPERATOR_ROLE, msg.sender), "Not owner or approved");
        require(!nftMetadata[tokenId].isLocked, "NFT is locked");
        
        _burn(tokenId);
        delete nftMetadata[tokenId];
        
        emit NFTBurned(tokenId, msg.sender);
    }
    
    // ============ NFT MANAGEMENT FUNCTIONS ============
    
    /**
     * @dev Atualiza o nível e experiência do NFT
     * @param tokenId ID do token
     * @param newLevel Novo nível
     * @param newExperience Nova experiência
     */
    function updateNFTStats(
        uint256 tokenId,
        uint256 newLevel,
        uint256 newExperience
    ) external onlyOperator validTokenId(tokenId) {
        require(newLevel >= 1 && newLevel <= MAX_LEVEL, "Invalid level");
        require(newExperience <= MAX_EXPERIENCE, "Invalid experience");
        
        uint256 oldLevel = nftMetadata[tokenId].level;
        nftMetadata[tokenId].level = newLevel;
        nftMetadata[tokenId].experience = newExperience;
        
        if (newLevel > oldLevel) {
            emit LevelUp(tokenId, oldLevel, newLevel, newExperience);
        }
    }
    
    /**
     * @dev Adiciona experiência ao NFT
     * @param tokenId ID do token
     * @param experienceToAdd Experiência a adicionar
     */
    function addExperience(uint256 tokenId, uint256 experienceToAdd) external onlyOperator validTokenId(tokenId) {
        require(experienceToAdd > 0, "Experience must be positive");
        
        NFTMetadata storage metadata = nftMetadata[tokenId];
        uint256 newExperience = metadata.experience + experienceToAdd;
        uint256 newLevel = metadata.level;
        
        // Calcular novo nível baseado na experiência
        if (newExperience >= metadata.maxExperience && newLevel < MAX_LEVEL) {
            newLevel++;
            newExperience = 0;
            metadata.maxExperience = MAX_EXPERIENCE * newLevel;
        }
        
        uint256 oldLevel = metadata.level;
        metadata.level = newLevel;
        metadata.experience = newExperience;
        
        if (newLevel > oldLevel) {
            emit LevelUp(tokenId, oldLevel, newLevel, newExperience);
        }
    }
    
    /**
     * @dev Ativa/desativa NFT
     * @param tokenId ID do token
     * @param isActive Novo status
     */
    function setNFTActive(uint256 tokenId, bool isActive) external onlyOperator validTokenId(tokenId) {
        nftMetadata[tokenId].isActive = isActive;
    }
    
    /**
     * @dev Bloqueia/desbloqueia NFT
     * @param tokenId ID do token
     * @param lockDuration Duração do bloqueio em segundos
     */
    function lockNFT(uint256 tokenId, uint256 lockDuration) external onlyOperator validTokenId(tokenId) {
        nftMetadata[tokenId].isLocked = true;
        nftMetadata[tokenId].lockEndTime = block.timestamp + lockDuration;
    }
    
    /**
     * @dev Desbloqueia NFT
     * @param tokenId ID do token
     */
    function unlockNFT(uint256 tokenId) external onlyOperator validTokenId(tokenId) {
        nftMetadata[tokenId].isLocked = false;
        nftMetadata[tokenId].lockEndTime = 0;
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
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Define o preço de mint para um tipo
     * @param nftType Tipo do NFT
     * @param price Novo preço em wei
     */
    function setMintPrice(NFTType nftType, uint256 price) external onlyOperator {
        require(price >= MIN_MINT_PRICE && price <= MAX_MINT_PRICE, "Invalid price");
        
        uint256 oldPrice = mintConfigs[nftType].price;
        mintConfigs[nftType].price = price;
        
        emit MintPriceUpdated(nftType, oldPrice, price);
    }
    
    /**
     * @dev Define configurações de mint para um tipo
     * @param nftType Tipo do NFT
     * @param maxSupply Supply máximo
     * @param maxPerWallet Máximo por carteira
     * @param isActive Se está ativo
     */
    function setMintConfig(
        NFTType nftType,
        uint256 maxSupply,
        uint256 maxPerWallet,
        bool isActive
    ) external onlyOperator {
        require(maxSupply <= MAX_SUPPLY_PER_TYPE, "Max supply too high");
        require(maxPerWallet <= MAX_PER_WALLET, "Max per wallet too high");
        
        mintConfigs[nftType].maxSupply = maxSupply;
        mintConfigs[nftType].maxPerWallet = maxPerWallet;
        mintConfigs[nftType].isActive = isActive;
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
     * @dev Retira ETH do contrato
     * @param to Endereço para onde enviar os fundos
     * @param amount Quantidade a retirar
     */
    function withdraw(address payable to, uint256 amount) external onlyOperator {
        require(to != address(0), "Invalid address");
        require(amount > 0 && amount <= address(this).balance, "Invalid amount");
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Gera raridade aleatória baseada em probabilidades
     */
    function _generateRarity() internal view returns (uint256) {
        uint256 rand = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            msg.sender, 
            block.difficulty,
            block.number
        ))) % 100;
        
        if (rand < 50) return 1;      // 50% - Comum
        if (rand < 75) return 2;      // 25% - Incomum
        if (rand < 90) return 3;      // 15% - Raro
        if (rand < 98) return 4;      // 8% - Épico
        return 5;                     // 2% - Lendário
    }
    
    /**
     * @dev Configura configurações de mint padrão
     */
    function _setupMintConfigs() internal {
        // SEED
        mintConfigs[NFTType.SEED] = MintConfig({
            price: 0.01 ether,
            maxSupply: 5000,
            currentSupply: 0,
            isActive: true,
            maxPerWallet: 50
        });
        
        // FARM
        mintConfigs[NFTType.FARM] = MintConfig({
            price: 0.1 ether,
            maxSupply: 2000,
            currentSupply: 0,
            isActive: true,
            maxPerWallet: 20
        });
        
        // DRONE
        mintConfigs[NFTType.DRONE] = MintConfig({
            price: 0.05 ether,
            maxSupply: 3000,
            currentSupply: 0,
            isActive: true,
            maxPerWallet: 30
        });
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Retorna os metadados de um NFT
     * @param tokenId ID do token
     */
    function getNFTMetadata(uint256 tokenId) external view validTokenId(tokenId) returns (NFTMetadata memory) {
        return nftMetadata[tokenId];
    }
    
    /**
     * @dev Retorna todos os NFTs de um endereço
     * @param owner Endereço do proprietário
     */
    function getNFTsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    /**
     * @dev Retorna NFTs por tipo
     * @param nftType Tipo do NFT
     */
    function getNFTsByType(NFTType nftType) external view returns (uint256[] memory) {
        uint256 totalTokens = totalSupply();
        uint256[] memory tempTokens = new uint256[](totalTokens);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (_exists(i) && nftMetadata[i].nftType == nftType) {
                tempTokens[count] = i;
                count++;
            }
        }
        
        uint256[] memory tokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokens[i] = tempTokens[i];
        }
        
        return tokens;
    }
    
    /**
     * @dev Retorna NFTs por raridade
     * @param rarity Raridade (1-5)
     */
    function getNFTsByRarity(uint256 rarity) external view returns (uint256[] memory) {
        require(rarity >= 1 && rarity <= MAX_RARITY, "Invalid rarity");
        
        uint256 totalTokens = totalSupply();
        uint256[] memory tempTokens = new uint256[](totalTokens);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (_exists(i) && nftMetadata[i].rarity == rarity) {
                tempTokens[count] = i;
                count++;
            }
        }
        
        uint256[] memory tokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokens[i] = tempTokens[i];
        }
        
        return tokens;
    }
    
    /**
     * @dev Retorna estatísticas do contrato
     */
    function getContractStats() external view returns (
        uint256 _totalSupply,
        uint256 _totalMinted,
        uint256 _seedSupply,
        uint256 _farmSupply,
        uint256 _droneSupply
    ) {
        return (
            totalSupply(),
            _tokenIds.current(),
            mintConfigs[NFTType.SEED].currentSupply,
            mintConfigs[NFTType.FARM].currentSupply,
            mintConfigs[NFTType.DRONE].currentSupply
        );
    }
    
    /**
     * @dev Verifica se um endereço está na whitelist
     * @param account Endereço a verificar
     */
    function isWhitelisted(address account) external view returns (bool) {
        return whitelisted[account] || hasRole(DEFAULT_ADMIN_ROLE, account);
    }
    
    // ============ OVERRIDE FUNCTIONS ============
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        
        // Verificar se NFTs estão bloqueados
        for (uint256 i = 0; i < batchSize; i++) {
            uint256 tokenId = firstTokenId + i;
            if (_exists(tokenId)) {
                require(!nftMetadata[tokenId].isLocked, "NFT is locked");
                require(!blacklisted[to], "Recipient is blacklisted");
            }
        }
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // ============ EMERGENCY FUNCTIONS ============
    
    /**
     * @dev Função de emergência para recuperar NFTs perdidos
     * @param tokenId ID do token
     * @param to Endereço de destino
     */
    function emergencyTransfer(uint256 tokenId, address to) external onlyOperator validTokenId(tokenId) {
        require(to != address(0), "Invalid address");
        require(!blacklisted[to], "Recipient is blacklisted");
        
        address owner = ownerOf(tokenId);
        _transfer(owner, to, tokenId);
    }
    
    /**
     * @dev Função para receber ETH
     */
    receive() external payable {}
} 