// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// AGROTM Token (ERC20)
contract AGROTMToken is ERC20, Ownable {
    constructor() ERC20("AGROTM Token", "AGROTM") {
        _mint(msg.sender, 100000000 * 10 ** decimals()); // 100M AGROTM
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

// AGROTM NFT (ERC721)
contract AGROTMNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) private _tokenURIs;
    constructor() ERC721("AGROTM NFT", "AGROTMNFT") {}
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }
} 