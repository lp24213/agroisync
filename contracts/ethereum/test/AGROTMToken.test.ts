import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("AGROTMToken", function () {
  let AGROTMToken: ContractFactory;
  let agrotmToken: Contract;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let burner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let blacklistedUser: SignerWithAddress;
  let whitelistedUser: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000000"); // 1 bilhão
  const MAX_SUPPLY = ethers.utils.parseEther("2000000000"); // 2 bilhões
  const MIN_TRANSFER_AMOUNT = ethers.utils.parseEther("1");
  const MAX_TRANSFER_AMOUNT = ethers.utils.parseEther("10000000"); // 10 milhões
  const ANTI_WHALE_LIMIT = ethers.utils.parseEther("100000000"); // 100 milhões

  beforeEach(async function () {
    [owner, minter, burner, user1, user2, user3, blacklistedUser, whitelistedUser] = await ethers.getSigners();

    AGROTMToken = await ethers.getContractFactory("AGROTMToken");
    agrotmToken = await AGROTMToken.deploy(owner.address, INITIAL_SUPPLY);
    await agrotmToken.deployed();

    // Configurar roles
    await agrotmToken.grantRole(await agrotmToken.MINTER_ROLE(), minter.address);
    await agrotmToken.grantRole(await agrotmToken.BURNER_ROLE(), burner.address);
    await agrotmToken.grantRole(await agrotmToken.BLACKLIST_ROLE(), owner.address);
    await agrotmToken.grantRole(await agrotmToken.WHITELIST_ROLE(), owner.address);
    await agrotmToken.grantRole(await agrotmToken.PAUSER_ROLE(), owner.address);
    await agrotmToken.grantRole(await agrotmToken.SNAPSHOT_ROLE(), owner.address);

    // Whitelist alguns usuários
    await agrotmToken.addToWhitelist(whitelistedUser.address);
    await agrotmToken.addToWhitelist(user1.address);
    await agrotmToken.addToWhitelist(user2.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await agrotmToken.hasRole(await agrotmToken.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should mint initial supply to owner", async function () {
      expect(await agrotmToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should set correct constants", async function () {
      expect(await agrotmToken.INITIAL_SUPPLY()).to.equal(INITIAL_SUPPLY);
      expect(await agrotmToken.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
      expect(await agrotmToken.MIN_TRANSFER_AMOUNT()).to.equal(MIN_TRANSFER_AMOUNT);
      expect(await agrotmToken.MAX_TRANSFER_AMOUNT()).to.equal(MAX_TRANSFER_AMOUNT);
      expect(await agrotmToken.ANTI_WHALE_LIMIT()).to.equal(ANTI_WHALE_LIMIT);
    });

    it("Should set correct initial state", async function () {
      expect(await agrotmToken.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await agrotmToken.transferLimit()).to.equal(MAX_TRANSFER_AMOUNT);
      expect(await agrotmToken.antiWhaleLimit()).to.equal(ANTI_WHALE_LIMIT);
    });

    it("Should whitelist owner", async function () {
      expect(await agrotmToken.isWhitelisted(owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("Should grant minter role", async function () {
      expect(await agrotmToken.hasRole(await agrotmToken.MINTER_ROLE(), minter.address)).to.be.true;
    });

    it("Should grant burner role", async function () {
      expect(await agrotmToken.hasRole(await agrotmToken.BURNER_ROLE(), burner.address)).to.be.true;
    });

    it("Should revoke minter role", async function () {
      await agrotmToken.revokeRole(await agrotmToken.MINTER_ROLE(), minter.address);
      expect(await agrotmToken.hasRole(await agrotmToken.MINTER_ROLE(), minter.address)).to.be.false;
    });
  });

  describe("Minting", function () {
    it("Should mint tokens by authorized minter", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await agrotmToken.connect(minter).mint(user1.address, mintAmount);
      expect(await agrotmToken.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should mint batch tokens", async function () {
      const recipients = [user1.address, user2.address, user3.address];
      const amounts = [
        ethers.utils.parseEther("100"),
        ethers.utils.parseEther("200"),
        ethers.utils.parseEther("300")
      ];

      await agrotmToken.connect(minter).mintBatch(recipients, amounts);

      expect(await agrotmToken.balanceOf(user1.address)).to.equal(amounts[0]);
      expect(await agrotmToken.balanceOf(user2.address)).to.equal(amounts[1]);
      expect(await agrotmToken.balanceOf(user3.address)).to.equal(amounts[2]);
    });

    it("Should fail to mint by unauthorized user", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(
        agrotmToken.connect(user1).mint(user2.address, mintAmount)
      ).to.be.revertedWith("AccessControl");
    });

    it("Should fail to mint to blacklisted address", async function () {
      await agrotmToken.addToBlacklist(user1.address);
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(
        agrotmToken.connect(minter).mint(user1.address, mintAmount)
      ).to.be.revertedWith("Recipient is blacklisted");
    });

    it("Should fail to mint more than max supply", async function () {
      const remainingSupply = MAX_SUPPLY.sub(INITIAL_SUPPLY);
      const tooMuch = remainingSupply.add(ethers.utils.parseEther("1"));
      await expect(
        agrotmToken.connect(minter).mint(user1.address, tooMuch)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should fail to mint to zero address", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(
        agrotmToken.connect(minter).mint(ethers.constants.AddressZero, mintAmount)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should fail to mint zero amount", async function () {
      await expect(
        agrotmToken.connect(minter).mint(user1.address, 0)
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("1000"));
    });

    it("Should burn own tokens", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialBalance = await agrotmToken.balanceOf(user1.address);
      await agrotmToken.connect(user1).burn(burnAmount);
      expect(await agrotmToken.balanceOf(user1.address)).to.equal(initialBalance.sub(burnAmount));
    });

    it("Should burn from other address by authorized burner", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialBalance = await agrotmToken.balanceOf(user1.address);
      await agrotmToken.connect(burner).burnFrom(user1.address, burnAmount);
      expect(await agrotmToken.balanceOf(user1.address)).to.equal(initialBalance.sub(burnAmount));
    });

    it("Should fail to burn more than balance", async function () {
      const tooMuch = ethers.utils.parseEther("2000");
      await expect(
        agrotmToken.connect(user1).burn(tooMuch)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should fail to burn from blacklisted address", async function () {
      await agrotmToken.addToBlacklist(user1.address);
      const burnAmount = ethers.utils.parseEther("100");
      await expect(
        agrotmToken.connect(burner).burnFrom(user1.address, burnAmount)
      ).to.be.revertedWith("Account is blacklisted");
    });

    it("Should fail to burn by unauthorized user", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      await expect(
        agrotmToken.connect(user2).burnFrom(user1.address, burnAmount)
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Transfer", function () {
    beforeEach(async function () {
      await agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("10000"));
      await agrotmToken.connect(minter).mint(user2.address, ethers.utils.parseEther("10000"));
    });

    it("Should transfer tokens between whitelisted users", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      await agrotmToken.connect(user1).transfer(user2.address, transferAmount);
      expect(await agrotmToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("10100"));
    });

    it("Should fail to transfer from blacklisted address", async function () {
      await agrotmToken.addToBlacklist(user1.address);
      const transferAmount = ethers.utils.parseEther("100");
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.revertedWith("Sender is blacklisted");
    });

    it("Should fail to transfer to blacklisted address", async function () {
      await agrotmToken.addToBlacklist(user2.address);
      const transferAmount = ethers.utils.parseEther("100");
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.revertedWith("Recipient is blacklisted");
    });

    it("Should fail to transfer below minimum amount", async function () {
      const smallAmount = ethers.utils.parseEther("0.5");
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, smallAmount)
      ).to.be.revertedWith("Amount below minimum");
    });

    it("Should fail to transfer above transfer limit", async function () {
      const largeAmount = ethers.utils.parseEther("20000000"); // 20 milhões
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, largeAmount)
      ).to.be.revertedWith("Amount exceeds transfer limit");
    });

    it("Should fail to transfer above anti-whale limit by non-admin", async function () {
      const whaleAmount = ethers.utils.parseEther("150000000"); // 150 milhões
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, whaleAmount)
      ).to.be.revertedWith("Amount exceeds anti-whale limit");
    });

    it("Should allow admin to transfer above anti-whale limit", async function () {
      const whaleAmount = ethers.utils.parseEther("150000000"); // 150 milhões
      await agrotmToken.connect(owner).transfer(user2.address, whaleAmount);
      expect(await agrotmToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("160000000"));
    });

    it("Should enforce rate limiting", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      // Fazer 10 transferências (limite máximo)
      for (let i = 0; i < 10; i++) {
        await agrotmToken.connect(user1).transfer(user2.address, transferAmount);
      }

      // A 11ª transferência deve falhar
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.revertedWith("Rate limit exceeded");
    });
  });

  describe("Blacklist/Whitelist", function () {
    it("Should add address to blacklist", async function () {
      await agrotmToken.addToBlacklist(user1.address);
      expect(await agrotmToken.blacklisted(user1.address)).to.be.true;
    });

    it("Should remove address from blacklist", async function () {
      await agrotmToken.addToBlacklist(user1.address);
      await agrotmToken.removeFromBlacklist(user1.address);
      expect(await agrotmToken.blacklisted(user1.address)).to.be.false;
    });

    it("Should add address to whitelist", async function () {
      await agrotmToken.addToWhitelist(user3.address);
      expect(await agrotmToken.isWhitelisted(user3.address)).to.be.true;
    });

    it("Should remove address from whitelist", async function () {
      await agrotmToken.addToWhitelist(user3.address);
      await agrotmToken.removeFromWhitelist(user3.address);
      expect(await agrotmToken.isWhitelisted(user3.address)).to.be.false;
    });

    it("Should fail to add zero address to blacklist", async function () {
      await expect(
        agrotmToken.addToBlacklist(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should fail to remove non-blacklisted address", async function () {
      await expect(
        agrotmToken.removeFromBlacklist(user1.address)
      ).to.be.revertedWith("Not blacklisted");
    });
  });

  describe("Pause/Unpause", function () {
    it("Should pause contract", async function () {
      await agrotmToken.pause();
      expect(await agrotmToken.paused()).to.be.true;
    });

    it("Should unpause contract", async function () {
      await agrotmToken.pause();
      await agrotmToken.unpause();
      expect(await agrotmToken.paused()).to.be.false;
    });

    it("Should fail to mint when paused", async function () {
      await agrotmToken.pause();
      await expect(
        agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("1000"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should fail to transfer when paused", async function () {
      await agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("1000"));
      await agrotmToken.pause();
      await expect(
        agrotmToken.connect(user1).transfer(user2.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Snapshot", function () {
    it("Should create snapshot", async function () {
      const snapshotId = await agrotmToken.snapshot();
      expect(snapshotId).to.be.gt(0);
    });

    it("Should fail to create snapshot by unauthorized user", async function () {
      await expect(
        agrotmToken.connect(user1).snapshot()
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Admin Functions", function () {
    it("Should set max supply", async function () {
      const newMaxSupply = ethers.utils.parseEther("1500000000");
      await agrotmToken.setMaxSupply(newMaxSupply);
      expect(await agrotmToken.maxSupply()).to.equal(newMaxSupply);
    });

    it("Should set transfer limit", async function () {
      const newLimit = ethers.utils.parseEther("5000000");
      await agrotmToken.setTransferLimit(newLimit);
      expect(await agrotmToken.transferLimit()).to.equal(newLimit);
    });

    it("Should set anti-whale limit", async function () {
      const newLimit = ethers.utils.parseEther("50000000");
      await agrotmToken.setAntiWhaleLimit(newLimit);
      expect(await agrotmToken.antiWhaleLimit()).to.equal(newLimit);
    });

    it("Should fail to set max supply below current supply", async function () {
      const lowSupply = ethers.utils.parseEther("500000000");
      await expect(
        agrotmToken.setMaxSupply(lowSupply)
      ).to.be.revertedWith("Max supply cannot be less than current supply");
    });

    it("Should fail to set max supply above hard limit", async function () {
      const tooHigh = ethers.utils.parseEther("3000000000");
      await expect(
        agrotmToken.setMaxSupply(tooHigh)
      ).to.be.revertedWith("Max supply exceeds hard limit");
    });

    it("Should fail to set transfer limit too low", async function () {
      const tooLow = ethers.utils.parseEther("0.5");
      await expect(
        agrotmToken.setTransferLimit(tooLow)
      ).to.be.revertedWith("Transfer limit too low");
    });

    it("Should fail to set transfer limit too high", async function () {
      const tooHigh = ethers.utils.parseEther("20000000");
      await expect(
        agrotmToken.setTransferLimit(tooHigh)
      ).to.be.revertedWith("Transfer limit too high");
    });

    it("Should fail to set anti-whale limit too high", async function () {
      const tooHigh = ethers.utils.parseEther("200000000");
      await expect(
        agrotmToken.setAntiWhaleLimit(tooHigh)
      ).to.be.revertedWith("Anti-whale limit too high");
    });
  });

  describe("View Functions", function () {
    it("Should return correct circulating supply", async function () {
      expect(await agrotmToken.circulatingSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should return correct remaining supply", async function () {
      const remaining = MAX_SUPPLY.sub(INITIAL_SUPPLY);
      expect(await agrotmToken.remainingSupply()).to.equal(remaining);
    });

    it("Should return correct contract stats", async function () {
      const stats = await agrotmToken.getContractStats();
      expect(stats._totalSupply).to.equal(INITIAL_SUPPLY);
      expect(stats._maxSupply).to.equal(MAX_SUPPLY);
      expect(stats._circulatingSupply).to.equal(INITIAL_SUPPLY);
      expect(stats._remainingSupply).to.equal(MAX_SUPPLY.sub(INITIAL_SUPPLY));
      expect(stats._transferLimit).to.equal(MAX_TRANSFER_AMOUNT);
      expect(stats._antiWhaleLimit).to.equal(ANTI_WHALE_LIMIT);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency withdrawal of tokens", async function () {
      // Mint alguns tokens para o contrato
      await agrotmToken.connect(minter).mint(agrotmToken.address, ethers.utils.parseEther("1000"));
      
      const withdrawAmount = ethers.utils.parseEther("500");
      await agrotmToken.emergencyWithdraw(agrotmToken.address, user1.address, withdrawAmount);
      expect(await agrotmToken.balanceOf(user1.address)).to.equal(withdrawAmount);
    });

    it("Should fail emergency withdrawal by unauthorized user", async function () {
      await expect(
        agrotmToken.connect(user1).emergencyWithdraw(agrotmToken.address, user2.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Events", function () {
    it("Should emit TokensMinted event", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(agrotmToken.connect(minter).mint(user1.address, mintAmount))
        .to.emit(agrotmToken, "TokensMinted")
        .withArgs(user1.address, mintAmount, minter.address);
    });

    it("Should emit TokensBurned event", async function () {
      await agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("1000"));
      const burnAmount = ethers.utils.parseEther("100");
      await expect(agrotmToken.connect(user1).burn(burnAmount))
        .to.emit(agrotmToken, "TokensBurned")
        .withArgs(user1.address, burnAmount, user1.address);
    });

    it("Should emit BlacklistUpdated event", async function () {
      await expect(agrotmToken.addToBlacklist(user1.address))
        .to.emit(agrotmToken, "BlacklistUpdated")
        .withArgs(user1.address, true);
    });

    it("Should emit WhitelistUpdated event", async function () {
      await expect(agrotmToken.addToWhitelist(user1.address))
        .to.emit(agrotmToken, "WhitelistUpdated")
        .withArgs(user1.address, true);
    });

    it("Should emit MaxSupplyChanged event", async function () {
      const newMaxSupply = ethers.utils.parseEther("1500000000");
      await expect(agrotmToken.setMaxSupply(newMaxSupply))
        .to.emit(agrotmToken, "MaxSupplyChanged")
        .withArgs(MAX_SUPPLY, newMaxSupply);
    });

    it("Should emit SnapshotCreated event", async function () {
      await expect(agrotmToken.snapshot())
        .to.emit(agrotmToken, "SnapshotCreated");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very large numbers correctly", async function () {
      const largeAmount = ethers.utils.parseEther("1000000000");
      await agrotmToken.connect(minter).mint(user1.address, largeAmount);
      expect(await agrotmToken.balanceOf(user1.address)).to.equal(largeAmount);
    });

    it("Should handle multiple rapid transactions", async function () {
      await agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("10000"));
      
      // Fazer múltiplas transferências rapidamente
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          agrotmToken.connect(user1).transfer(user2.address, ethers.utils.parseEther("100"))
        );
      }
      
      await Promise.all(promises);
      expect(await agrotmToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("500"));
    });

    it("Should handle role revocation correctly", async function () {
      await agrotmToken.revokeRole(await agrotmToken.MINTER_ROLE(), minter.address);
      await expect(
        agrotmToken.connect(minter).mint(user1.address, ethers.utils.parseEther("1000"))
      ).to.be.revertedWith("AccessControl");
    });
  });
}); 