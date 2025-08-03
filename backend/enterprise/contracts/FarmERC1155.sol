// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FarmERC1155
 * @dev Contrato para tokenização de ativos agrícolas usando o padrão ERC-1155
 * Permite a criação de múltiplos tipos de tokens representando diferentes ativos agrícolas
 * como fazendas, maquinário, lotes de grãos, etc.
 */
contract FarmERC1155 is 
    ERC1155, 
    ERC1155Pausable, 
    ERC1155Burnable, 
    ERC1155Supply, 
    ERC1155URIStorage,
    AccessControl,
    ReentrancyGuard {
    using Strings for uint256;

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Enumeração para tipos de ativos
    enum AssetType {
        FARM,           // Propriedade rural
        MACHINERY,      // Maquinário agrícola
        GRAIN_LOT,      // Lote de grãos
        LIVESTOCK,      // Rebanho
        WATER_RIGHTS,   // Direitos de água
        CARBON_CREDITS, // Créditos de carbono
        HARVEST_RIGHTS  // Direitos de colheita
    }

    // Estrutura para armazenar informações do ativo
    struct Asset {
        uint256 id;
        AssetType assetType;
        address creator;
        bool verified;
        string documentHash; // Hash IPFS dos documentos do ativo
        uint256 createdAt;
        uint256 expiryDate; // 0 se não expirar
        mapping(string => string) attributes; // Atributos adicionais do ativo
    }

    // Estrutura para armazenar informações de royalties
    struct RoyaltyInfo {
        address receiver;
        uint96 royaltyFraction; // em pontos base (1/10000)
    }

    // Mapeamento de ID do token para informações do ativo
    mapping(uint256 => Asset) private _assets;
    
    // Mapeamento de ID do token para informações de royalties
    mapping(uint256 => RoyaltyInfo) private _royalties;

    // Contador para IDs de tokens
    uint256 private _tokenIdCounter;

    // Nome e símbolo do contrato
    string private _name;
    string private _symbol;

    // Base URI para metadados
    string private _baseURI;

    // Eventos
    event AssetCreated(uint256 indexed tokenId, AssetType assetType, address indexed creator, uint256 amount);
    event AssetVerified(uint256 indexed tokenId, address indexed verifier);
    event AssetAttributeSet(uint256 indexed tokenId, string key, string value);
    event RoyaltySet(uint256 indexed tokenId, address receiver, uint96 royaltyFraction);

    /**
     * @dev Construtor
     * @param name_ Nome do contrato
     * @param symbol_ Símbolo do contrato
     * @param baseURI_ URI base para metadados
     */
    constructor(string memory name_, string memory symbol_, string memory baseURI_) ERC1155(baseURI_) {
        _name = name_;
        _symbol = symbol_;
        _baseURI = baseURI_;

        // Configurar roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Retorna o nome do contrato
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Retorna o símbolo do contrato
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Retorna a URI base
     */
    function baseURI() public view returns (string memory) {
        return _baseURI;
    }

    /**
     * @dev Define a URI base
     * @param newBaseURI Nova URI base
     */
    function setBaseURI(string memory newBaseURI) public onlyRole(URI_SETTER_ROLE) {
        _baseURI = newBaseURI;
    }

    /**
     * @dev Cria um novo ativo agrícola
     * @param to Endereço que receberá o token
     * @param assetType Tipo de ativo
     * @param amount Quantidade de tokens
     * @param documentHash Hash IPFS dos documentos do ativo
     * @param uri URI dos metadados do token
     * @param expiryDate Data de expiração (0 se não expirar)
     * @param data Dados adicionais
     * @return tokenId ID do token criado
     */
    function createAsset(
        address to,
        AssetType assetType,
        uint256 amount,
        string memory documentHash,
        string memory uri,
        uint256 expiryDate,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) nonReentrant returns (uint256) {
        require(amount > 0, "FarmERC1155: amount must be greater than 0");
        require(bytes(documentHash).length > 0, "FarmERC1155: document hash is required");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Inicializar o ativo
        Asset storage asset = _assets[tokenId];
        asset.id = tokenId;
        asset.assetType = assetType;
        asset.creator = msg.sender;
        asset.verified = false;
        asset.documentHash = documentHash;
        asset.createdAt = block.timestamp;
        asset.expiryDate = expiryDate;

        // Definir URI para o token
        _setURI(tokenId, uri);

        // Cunhar tokens
        _mint(to, tokenId, amount, data);

        emit AssetCreated(tokenId, assetType, msg.sender, amount);

        return tokenId;
    }

    /**
     * @dev Verifica um ativo
     * @param tokenId ID do token
     */
    function verifyAsset(uint256 tokenId) public onlyRole(VERIFIER_ROLE) {
        require(exists(tokenId), "FarmERC1155: token does not exist");
        require(!_assets[tokenId].verified, "FarmERC1155: asset already verified");

        _assets[tokenId].verified = true;

        emit AssetVerified(tokenId, msg.sender);
    }

    /**
     * @dev Define um atributo para um ativo
     * @param tokenId ID do token
     * @param key Chave do atributo
     * @param value Valor do atributo
     */
    function setAssetAttribute(uint256 tokenId, string memory key, string memory value) public {
        require(exists(tokenId), "FarmERC1155: token does not exist");
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
            msg.sender == _assets[tokenId].creator,
            "FarmERC1155: caller is not admin or creator"
        );

        _assets[tokenId].attributes[key] = value;

        emit AssetAttributeSet(tokenId, key, value);
    }

    /**
     * @dev Obtém um atributo de um ativo
     * @param tokenId ID do token
     * @param key Chave do atributo
     * @return Valor do atributo
     */
    function getAssetAttribute(uint256 tokenId, string memory key) public view returns (string memory) {
        require(exists(tokenId), "FarmERC1155: token does not exist");
        return _assets[tokenId].attributes[key];
    }

    /**
     * @dev Obtém informações básicas de um ativo
     * @param tokenId ID do token
     * @return assetType Tipo de ativo
     * @return creator Criador do ativo
     * @return verified Se o ativo foi verificado
     * @return documentHash Hash IPFS dos documentos do ativo
     * @return createdAt Timestamp de criação
     * @return expiryDate Data de expiração
     */
    function getAssetInfo(uint256 tokenId) public view returns (
        AssetType assetType,
        address creator,
        bool verified,
        string memory documentHash,
        uint256 createdAt,
        uint256 expiryDate
    ) {
        require(exists(tokenId), "FarmERC1155: token does not exist");

        Asset storage asset = _assets[tokenId];
        return (
            asset.assetType,
            asset.creator,
            asset.verified,
            asset.documentHash,
            asset.createdAt,
            asset.expiryDate
        );
    }

    /**
     * @dev Define informações de royalties para um token
     * @param tokenId ID do token
     * @param receiver Endereço que receberá os royalties
     * @param royaltyFraction Fração de royalties em pontos base (1/10000)
     */
    function setRoyalty(uint256 tokenId, address receiver, uint96 royaltyFraction) public {
        require(exists(tokenId), "FarmERC1155: token does not exist");
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
            msg.sender == _assets[tokenId].creator,
            "FarmERC1155: caller is not admin or creator"
        );
        require(royaltyFraction <= 1000, "FarmERC1155: royalty too high"); // Max 10%

        _royalties[tokenId] = RoyaltyInfo(receiver, royaltyFraction);

        emit RoyaltySet(tokenId, receiver, royaltyFraction);
    }

    /**
     * @dev Obtém informações de royalties para um token
     * @param tokenId ID do token
     * @param salePrice Preço de venda
     * @return receiver Endereço que receberá os royalties
     * @return royaltyAmount Valor dos royalties
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view returns (address receiver, uint256 royaltyAmount) {
        if (!exists(tokenId)) {
            return (address(0), 0);
        }

        RoyaltyInfo memory royalty = _royalties[tokenId];
        if (royalty.receiver == address(0)) {
            return (address(0), 0);
        }

        return (royalty.receiver, (salePrice * royalty.royaltyFraction) / 10000);
    }

    /**
     * @dev Pausa todas as transferências de tokens
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Despausa todas as transferências de tokens
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Cunha tokens para um endereço
     * @param to Endereço que receberá os tokens
     * @param id ID do token
     * @param amount Quantidade de tokens
     * @param data Dados adicionais
     */
    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyRole(MINTER_ROLE) {
        require(exists(id), "FarmERC1155: token does not exist");
        _mint(to, id, amount, data);
    }

    /**
     * @dev Cunha múltiplos tokens para um endereço
     * @param to Endereço que receberá os tokens
     * @param ids IDs dos tokens
     * @param amounts Quantidades de tokens
     * @param data Dados adicionais
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < ids.length; i++) {
            require(exists(ids[i]), "FarmERC1155: token does not exist");
        }
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Retorna a URI para um token específico
     * @param tokenId ID do token
     * @return URI do token
     */
    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return ERC1155URIStorage.uri(tokenId);
    }

    /**
     * @dev Verifica se um token existe
     * @param id ID do token
     * @return Se o token existe
     */
    function exists(uint256 id) public view override returns (bool) {
        return ERC1155Supply.exists(id);
    }

    /**
     * @dev Retorna o total de tipos de tokens criados
     * @return Contador de IDs de tokens
     */
    function totalTokenTypes() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Função interna para definir a URI de um token
     * @param tokenId ID do token
     * @param tokenURI URI do token
     */
    function _setURI(uint256 tokenId, string memory tokenURI) internal virtual {
        ERC1155URIStorage._setURI(tokenId, tokenURI);
    }

    /**
     * @dev Hook interno chamado antes de qualquer transferência de tokens
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        // Verificar se algum token expirou
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 expiryDate = _assets[ids[i]].expiryDate;
            if (expiryDate > 0 && block.timestamp > expiryDate) {
                revert("FarmERC1155: token has expired");
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /**
     * @dev Verifica se o contrato suporta uma interface
     * @param interfaceId ID da interface
     * @return Se o contrato suporta a interface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return 
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            interfaceId == type(AccessControl).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}