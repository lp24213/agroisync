// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockERC20
 * @dev Contrato ERC20 para testes do BuyWithCommission
 */
contract MockERC20 is ERC20, Ownable {
    /**
     * @dev Construtor que define o nome e símbolo do token
     * @param name Nome do token
     * @param symbol Símbolo do token
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    /**
     * @dev Função para cunhar tokens (apenas para testes)
     * @param to Endereço que receberá os tokens
     * @param amount Quantidade de tokens a serem cunhados
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}