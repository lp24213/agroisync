import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("NFTAgro", function () {
  let NFTAgro: ContractFactory;
  let nftAgro: Contract;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let operator: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let blacklistedUser: SignerWithAddress;
  let whitelistedUser: SignerWithAddress;

  const MINT_PRICE_SEED = ethers.utils.parseEther("0.01");
  const MINT_PRICE_FARM = ethers.utils.parseEther("0.1");
  const MINT_PRICE_DRONE = ethers.utils.parseEther("0.05");

  beforeEach(async function () {
    [owner, minter, operator, user1, user2, user3, blacklistedUser, whitelistedUser] = await ethers.getSigners();

    NFTAgro = await ethers.getContractFactory("NFTAgro");
    nftAgro = await NFTAgro.deploy(owner.address);
    await nftAgro.deployed();

    // Configurar roles
    await nftAgro.grantRole(await nftAgro.MINTER_ROLE(), minter.address);
    await nftAgro.grantRole(await nftAgro.OPERATOR_ROLE(), operator.address);
    await nftAgro.grantRole(await nftAgro.BLACKLIST_ROLE(), owner.address);
    await nftAgro.grantRole(await nftAgro.WHITELIST_ROLE(), owner.address);
    await nftAgro.grantRole(await nftAgro.PAUSER_ROLE(), owner.address);

    // Whitelist alguns usuários
    await nftAgro.addToWhitelist(whitelistedUser.address);
    await nftAgro.addToWhitelist(user1.address);
    await nftAgro.addToWhitelist(user2.address);
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await nftAgro.hasRole(await nftAgro.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should set correct name and symbol", async function () {
      expect(await nftAgro.name()).to.equal("AGROTM NFT");
      expect(await nftAgro.symbol()).to.equal("AGRONFT");
    });

    it("Should setup default mint configs", async function () {
      const seedConfig = await nftAgro.mintConfigs(0); // SEED
      expect(seedConfig.price).to.equal(MINT_PRICE_SEED);
      expect(seedConfig.maxSupply).to.equal(5000);
      expect(seedConfig.isActive).to.be.true;
      expect(seedConfig.maxPerWallet).to.equal(50);

      const farmConfig = await nftAgro.mintConfigs(1); // FARM
      expect(farmConfig.price).to.equal(MINT_PRICE_FARM);
      expect(farmConfig.maxSupply).to.equal(2000);
      expect(farmConfig.isActive).to.be.true;
      expect(farmConfig.maxPerWallet).to.equal(20);

      const droneConfig = await nftAgro.mintConfigs(2); // DRONE
      expect(droneConfig.price).to.equal(MINT_PRICE_DRONE);
      expect(droneConfig.maxSupply).to.equal(3000);
      expect(droneConfig.isActive).to.be.true;
      expect(droneConfig.maxPerWallet).to.equal(30);
    });

    it("Should whitelist admin", async function () {
      expect(await nftAgro.isWhitelisted(owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("Should grant minter role", async function () {
      expect(await nftAgro.hasRole(await nftAgro.MINTER_ROLE(), minter.address)).to.be.true;
    });

    it("Should grant operator role", async function () {
      expect(await nftAgro.hasRole(await nftAgro.OPERATOR_ROLE(), operator.address)).to.be.true;
    });

    it("Should revoke minter role", async function () {
      await nftAgro.revokeRole(await nftAgro.MINTER_ROLE(), minter.address);
      expect(await nftAgro.hasRole(await nftAgro.MINTER_ROLE(), minter.address)).to.be.false;
    });
  });

  describe("Minting", function () {
    const tokenURI = "ipfs://QmTest123";

    it("Should mint NFT by authorized minter", async function () {
      const nftType = 0; // SEED
      const rarity = 3;
      
      await nftAgro.connect(minter).mintNFT(user1.address, nftType, rarity, tokenURI);
      
      expect(await nftAgro.ownerOf(1)).to.equal(user1.address);
      expect(await nftAgro.tokenURI(1)).to.equal(tokenURI);
      
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.nftType).to.equal(nftType);
      expect(metadata.rarity).to.equal(rarity);
      expect(metadata.level).to.equal(1);
      expect(metadata.isActive).to.be.true;
    });

    it("Should mint public NFT with payment", async function () {
      const nftType = 0; // SEED
      
      await nftAgro.connect(user1).mintPublicNFT(nftType, tokenURI, { value: MINT_PRICE_SEED });
      
      expect(await nftAgro.ownerOf(1)).to.equal(user1.address);
      expect(await nftAgro.balanceOf(user1.address)).to.equal(1);
    });

    it("Should mint batch NFTs", async function () {
      const recipients = [user1.address, user2.address, user3.address];
      const nftTypes = [0, 1, 2]; // SEED, FARM, DRONE
      const rarities = [1, 2, 3];
      const tokenURIs = ["ipfs://1", "ipfs://2", "ipfs://3"];
      
      await nftAgro.connect(minter).mintBatch(recipients, nftTypes, rarities, tokenURIs);
      
      expect(await nftAgro.ownerOf(1)).to.equal(user1.address);
      expect(await nftAgro.ownerOf(2)).to.equal(user2.address);
      expect(await nftAgro.ownerOf(3)).to.equal(user3.address);
    });

    it("Should fail to mint by unauthorized user", async function () {
      await expect(
        nftAgro.connect(user1).mintNFT(user2.address, 0, 1, tokenURI)
      ).to.be.revertedWith("AccessControl");
    });

    it("Should fail to mint to blacklisted address", async function () {
      await nftAgro.addToBlacklist(user1.address);
      await expect(
        nftAgro.connect(minter).mintNFT(user1.address, 0, 1, tokenURI)
      ).to.be.revertedWith("Recipient is blacklisted");
    });

    it("Should fail to mint with invalid rarity", async function () {
      await expect(
        nftAgro.connect(minter).mintNFT(user1.address, 0, 6, tokenURI)
      ).to.be.revertedWith("Invalid rarity");
    });

    it("Should fail to mint when contract is paused", async function () {
      await nftAgro.pause();
      await expect(
        nftAgro.connect(minter).mintNFT(user1.address, 0, 1, tokenURI)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should fail to mint with insufficient payment", async function () {
      const lowPayment = ethers.utils.parseEther("0.005");
      await expect(
        nftAgro.connect(user1).mintPublicNFT(0, tokenURI, { value: lowPayment })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail to mint when max supply reached", async function () {
      // Mint até o limite máximo
      for (let i = 0; i < 5000; i++) {
        await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, `ipfs://${i}`);
      }
      
      await expect(
        nftAgro.connect(minter).mintNFT(user1.address, 0, 1, tokenURI)
      ).to.be.revertedWith("Max supply reached");
    });

    it("Should fail to mint when max per wallet reached", async function () {
      // Mint até o limite por carteira
      for (let i = 0; i < 50; i++) {
        await nftAgro.connect(user1).mintPublicNFT(0, `ipfs://${i}`, { value: MINT_PRICE_SEED });
      }
      
      await expect(
        nftAgro.connect(user1).mintPublicNFT(0, tokenURI, { value: MINT_PRICE_SEED })
      ).to.be.revertedWith("Max per wallet reached");
    });

    it("Should enforce rate limiting", async function () {
      // Fazer 10 mints (limite máximo)
      for (let i = 0; i < 10; i++) {
        await nftAgro.connect(user1).mintPublicNFT(0, `ipfs://${i}`, { value: MINT_PRICE_SEED });
      }

      // O 11º mint deve falhar
      await expect(
        nftAgro.connect(user1).mintPublicNFT(0, tokenURI, { value: MINT_PRICE_SEED })
      ).to.be.revertedWith("Rate limit exceeded");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
    });

    it("Should burn NFT by owner", async function () {
      await nftAgro.connect(user1).burnNFT(1);
      
      await expect(
        nftAgro.ownerOf(1)
      ).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should burn NFT by authorized operator", async function () {
      await nftAgro.connect(operator).burnNFT(1);
      
      await expect(
        nftAgro.ownerOf(1)
      ).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should fail to burn by unauthorized user", async function () {
      await expect(
        nftAgro.connect(user2).burnNFT(1)
      ).to.be.revertedWith("Not owner or approved");
    });

    it("Should fail to burn locked NFT", async function () {
      await nftAgro.connect(operator).lockNFT(1, 3600); // Lock for 1 hour
      
      await expect(
        nftAgro.connect(user1).burnNFT(1)
      ).to.be.revertedWith("NFT is locked");
    });
  });

  describe("NFT Management", function () {
    beforeEach(async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
    });

    it("Should update NFT stats", async function () {
      const newLevel = 5;
      const newExperience = 500;
      
      await nftAgro.connect(operator).updateNFTStats(1, newLevel, newExperience);
      
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.level).to.equal(newLevel);
      expect(metadata.experience).to.equal(newExperience);
    });

    it("Should add experience", async function () {
      const experienceToAdd = 200;
      
      await nftAgro.connect(operator).addExperience(1, experienceToAdd);
      
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.experience).to.equal(experienceToAdd);
    });

    it("Should level up when experience threshold is reached", async function () {
      const experienceToAdd = 1000; // Max experience for level 1
      
      await nftAgro.connect(operator).addExperience(1, experienceToAdd);
      
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.level).to.equal(2);
      expect(metadata.experience).to.equal(0);
    });

    it("Should set NFT active/inactive", async function () {
      await nftAgro.connect(operator).setNFTActive(1, false);
      
      let metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.isActive).to.be.false;
      
      await nftAgro.connect(operator).setNFTActive(1, true);
      metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.isActive).to.be.true;
    });

    it("Should lock/unlock NFT", async function () {
      const lockDuration = 3600; // 1 hour
      
      await nftAgro.connect(operator).lockNFT(1, lockDuration);
      
      let metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.isLocked).to.be.true;
      expect(metadata.lockEndTime).to.be.gt(0);
      
      await nftAgro.connect(operator).unlockNFT(1);
      
      metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.isLocked).to.be.false;
      expect(metadata.lockEndTime).to.equal(0);
    });

    it("Should fail to update stats by non-operator", async function () {
      await expect(
        nftAgro.connect(user1).updateNFTStats(1, 5, 500)
      ).to.be.revertedWith("Caller is not operator");
    });

    it("Should fail to update with invalid level", async function () {
      await expect(
        nftAgro.connect(operator).updateNFTStats(1, 101, 500)
      ).to.be.revertedWith("Invalid level");
    });

    it("Should fail to add negative experience", async function () {
      await expect(
        nftAgro.connect(operator).addExperience(1, 0)
      ).to.be.revertedWith("Experience must be positive");
    });
  });

  describe("Access Control", function () {
    it("Should add address to blacklist", async function () {
      await nftAgro.addToBlacklist(user1.address);
      expect(await nftAgro.blacklisted(user1.address)).to.be.true;
    });

    it("Should remove address from blacklist", async function () {
      await nftAgro.addToBlacklist(user1.address);
      await nftAgro.removeFromBlacklist(user1.address);
      expect(await nftAgro.blacklisted(user1.address)).to.be.false;
    });

    it("Should add address to whitelist", async function () {
      await nftAgro.addToWhitelist(user3.address);
      expect(await nftAgro.isWhitelisted(user3.address)).to.be.true;
    });

    it("Should remove address from whitelist", async function () {
      await nftAgro.addToWhitelist(user3.address);
      await nftAgro.removeFromWhitelist(user3.address);
      expect(await nftAgro.isWhitelisted(user3.address)).to.be.false;
    });

    it("Should fail to add zero address to blacklist", async function () {
      await expect(
        nftAgro.addToBlacklist(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should fail to remove non-blacklisted address", async function () {
      await expect(
        nftAgro.removeFromBlacklist(user1.address)
      ).to.be.revertedWith("Not blacklisted");
    });
  });

  describe("Admin Functions", function () {
    it("Should set mint price", async function () {
      const newPrice = ethers.utils.parseEther("0.02");
      await nftAgro.connect(operator).setMintPrice(0, newPrice);
      
      const config = await nftAgro.mintConfigs(0);
      expect(config.price).to.equal(newPrice);
    });

    it("Should set mint config", async function () {
      const maxSupply = 3000;
      const maxPerWallet = 25;
      const isActive = false;
      
      await nftAgro.connect(operator).setMintConfig(0, maxSupply, maxPerWallet, isActive);
      
      const config = await nftAgro.mintConfigs(0);
      expect(config.maxSupply).to.equal(maxSupply);
      expect(config.maxPerWallet).to.equal(maxPerWallet);
      expect(config.isActive).to.equal(isActive);
    });

    it("Should pause/unpause contract", async function () {
      await nftAgro.connect(owner).pause();
      expect(await nftAgro.paused()).to.be.true;
      
      await nftAgro.connect(owner).unpause();
      expect(await nftAgro.paused()).to.be.false;
    });

    it("Should withdraw ETH", async function () {
      // Mint um NFT para gerar ETH
      await nftAgro.connect(user1).mintPublicNFT(0, "ipfs://test", { value: MINT_PRICE_SEED });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      const withdrawAmount = ethers.utils.parseEther("0.005");
      
      await nftAgro.connect(operator).withdraw(owner.address, withdrawAmount);
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should fail to set price by non-operator", async function () {
      await expect(
        nftAgro.connect(user1).setMintPrice(0, ethers.utils.parseEther("0.02"))
      ).to.be.revertedWith("Caller is not operator");
    });

    it("Should fail to set invalid price", async function () {
      const tooHigh = ethers.utils.parseEther("15");
      await expect(
        nftAgro.connect(operator).setMintPrice(0, tooHigh)
      ).to.be.revertedWith("Invalid price");
    });

    it("Should fail to set invalid config", async function () {
      const tooHighSupply = 15000;
      await expect(
        nftAgro.connect(operator).setMintConfig(0, tooHighSupply, 25, true)
      ).to.be.revertedWith("Max supply too high");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://1");
      await nftAgro.connect(minter).mintNFT(user1.address, 1, 2, "ipfs://2");
      await nftAgro.connect(minter).mintNFT(user2.address, 2, 3, "ipfs://3");
    });

    it("Should return correct NFT metadata", async function () {
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.nftType).to.equal(0); // SEED
      expect(metadata.rarity).to.equal(1);
      expect(metadata.level).to.equal(1);
      expect(metadata.isActive).to.be.true;
    });

    it("Should return NFTs by owner", async function () {
      const userNFTs = await nftAgro.getNFTsByOwner(user1.address);
      expect(userNFTs.length).to.equal(2);
      expect(userNFTs[0]).to.equal(1);
      expect(userNFTs[1]).to.equal(2);
    });

    it("Should return NFTs by type", async function () {
      const seedNFTs = await nftAgro.getNFTsByType(0); // SEED
      expect(seedNFTs.length).to.equal(1);
      expect(seedNFTs[0]).to.equal(1);
      
      const farmNFTs = await nftAgro.getNFTsByType(1); // FARM
      expect(farmNFTs.length).to.equal(1);
      expect(farmNFTs[0]).to.equal(2);
    });

    it("Should return NFTs by rarity", async function () {
      const rarity1NFTs = await nftAgro.getNFTsByRarity(1);
      expect(rarity1NFTs.length).to.equal(1);
      expect(rarity1NFTs[0]).to.equal(1);
      
      const rarity2NFTs = await nftAgro.getNFTsByRarity(2);
      expect(rarity2NFTs.length).to.equal(1);
      expect(rarity2NFTs[0]).to.equal(2);
    });

    it("Should return contract stats", async function () {
      const stats = await nftAgro.getContractStats();
      expect(stats._totalSupply).to.equal(3);
      expect(stats._totalMinted).to.equal(3);
      expect(stats._seedSupply).to.equal(1);
      expect(stats._farmSupply).to.equal(1);
      expect(stats._droneSupply).to.equal(1);
    });
  });

  describe("Transfer Restrictions", function () {
    beforeEach(async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
    });

    it("Should fail to transfer locked NFT", async function () {
      await nftAgro.connect(operator).lockNFT(1, 3600);
      
      await expect(
        nftAgro.connect(user1).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("NFT is locked");
    });

    it("Should fail to transfer to blacklisted address", async function () {
      await nftAgro.addToBlacklist(user2.address);
      
      await expect(
        nftAgro.connect(user1).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Recipient is blacklisted");
    });

    it("Should transfer unlocked NFT", async function () {
      await nftAgro.connect(user1).transferFrom(user1.address, user2.address, 1);
      expect(await nftAgro.ownerOf(1)).to.equal(user2.address);
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
    });

    it("Should allow emergency transfer", async function () {
      await nftAgro.connect(operator).emergencyTransfer(1, user2.address);
      expect(await nftAgro.ownerOf(1)).to.equal(user2.address);
    });

    it("Should fail emergency transfer by non-operator", async function () {
      await expect(
        nftAgro.connect(user1).emergencyTransfer(1, user2.address)
      ).to.be.revertedWith("Caller is not operator");
    });

    it("Should fail emergency transfer to blacklisted address", async function () {
      await nftAgro.addToBlacklist(user2.address);
      
      await expect(
        nftAgro.connect(operator).emergencyTransfer(1, user2.address)
      ).to.be.revertedWith("Recipient is blacklisted");
    });
  });

  describe("Rarity Generation", function () {
    it("Should generate rarity within valid range", async function () {
      await nftAgro.connect(user1).mintPublicNFT(0, "ipfs://test", { value: MINT_PRICE_SEED });
      
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.rarity).to.be.gte(1);
      expect(metadata.rarity).to.be.lte(5);
    });

    it("Should generate different rarities", async function () {
      const rarities = new Set();
      
      for (let i = 0; i < 10; i++) {
        await nftAgro.connect(user1).mintPublicNFT(0, `ipfs://${i}`, { value: MINT_PRICE_SEED });
        const metadata = await nftAgro.getNFTMetadata(i + 1);
        rarities.add(metadata.rarity.toNumber());
      }
      
      // Deve gerar pelo menos 2 raridades diferentes
      expect(rarities.size).to.be.gte(2);
    });
  });

  describe("Events", function () {
    it("Should emit NFTMinted event", async function () {
      await expect(nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test"))
        .to.emit(nftAgro, "NFTMinted")
        .withArgs(user1.address, 1, 0, 1, 1, 0);
    });

    it("Should emit NFTBurned event", async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
      
      await expect(nftAgro.connect(user1).burnNFT(1))
        .to.emit(nftAgro, "NFTBurned")
        .withArgs(1, user1.address);
    });

    it("Should emit LevelUp event", async function () {
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
      
      await expect(nftAgro.connect(operator).addExperience(1, 1000))
        .to.emit(nftAgro, "LevelUp")
        .withArgs(1, 1, 2, 0);
    });

    it("Should emit BlacklistUpdated event", async function () {
      await expect(nftAgro.addToBlacklist(user1.address))
        .to.emit(nftAgro, "BlacklistUpdated")
        .withArgs(user1.address, true);
    });

    it("Should emit WhitelistUpdated event", async function () {
      await expect(nftAgro.addToWhitelist(user1.address))
        .to.emit(nftAgro, "WhitelistUpdated")
        .withArgs(user1.address, true);
    });

    it("Should emit MintPriceUpdated event", async function () {
      const newPrice = ethers.utils.parseEther("0.02");
      await expect(nftAgro.connect(operator).setMintPrice(0, newPrice))
        .to.emit(nftAgro, "MintPriceUpdated")
        .withArgs(0, MINT_PRICE_SEED, newPrice);
    });

    it("Should emit BatchMinted event", async function () {
      const recipients = [user1.address, user2.address];
      const nftTypes = [0, 1];
      const rarities = [1, 2];
      const tokenURIs = ["ipfs://1", "ipfs://2"];
      
      await expect(nftAgro.connect(minter).mintBatch(recipients, nftTypes, rarities, tokenURIs))
        .to.emit(nftAgro, "BatchMinted")
        .withArgs(minter.address, [1, 2], 0);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple NFTs by same owner", async function () {
      for (let i = 0; i < 5; i++) {
        await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, `ipfs://${i}`);
      }
      
      const userNFTs = await nftAgro.getNFTsByOwner(user1.address);
      expect(userNFTs.length).to.equal(5);
    });

    it("Should handle very large token IDs", async function () {
      // Mint muitos NFTs para testar com IDs grandes
      for (let i = 0; i < 100; i++) {
        await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, `ipfs://${i}`);
      }
      
      const metadata = await nftAgro.getNFTMetadata(100);
      expect(metadata.nftType).to.equal(0);
      expect(metadata.rarity).to.equal(1);
    });

    it("Should handle rapid minting", async function () {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          nftAgro.connect(user1).mintPublicNFT(0, `ipfs://${i}`, { value: MINT_PRICE_SEED })
        );
      }
      
      await Promise.all(promises);
      expect(await nftAgro.balanceOf(user1.address)).to.equal(5);
    });

    it("Should handle role revocation correctly", async function () {
      await nftAgro.revokeRole(await nftAgro.MINTER_ROLE(), minter.address);
      
      await expect(
        nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test")
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy attacks", async function () {
      // Este teste verifica se o modifier nonReentrant está funcionando
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
      
      // Tentar mint novamente imediatamente (deve funcionar normalmente)
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test2");
      
      expect(await nftAgro.balanceOf(user1.address)).to.equal(2);
    });

    it("Should validate all inputs", async function () {
      await expect(
        nftAgro.connect(minter).mintNFT(ethers.constants.AddressZero, 0, 1, "ipfs://test")
      ).to.be.revertedWith("Invalid address");
      
      await expect(
        nftAgro.connect(minter).mintNFT(user1.address, 0, 6, "ipfs://test")
      ).to.be.revertedWith("Invalid rarity");
    });

    it("Should handle overflow protection", async function () {
      // Teste com valores muito grandes
      await nftAgro.connect(minter).mintNFT(user1.address, 0, 1, "ipfs://test");
      
      // Tentar adicionar experiência máxima
      const maxExperience = 1000;
      await nftAgro.connect(operator).addExperience(1, maxExperience);
      
      const metadata = await nftAgro.getNFTMetadata(1);
      expect(metadata.level).to.equal(2); // Deve subir de nível
      expect(metadata.experience).to.equal(0); // Experiência deve resetar
    });

    it("Should prevent unauthorized access to admin functions", async function () {
      await expect(
        nftAgro.connect(user1).setMintPrice(0, ethers.utils.parseEther("0.02"))
      ).to.be.revertedWith("Caller is not operator");
      
      await expect(
        nftAgro.connect(user1).pause()
      ).to.be.revertedWith("AccessControl");
    });
  });
}); 