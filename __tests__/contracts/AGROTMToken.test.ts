import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { AGROTMToken } from '../../contracts/ethereum/typechain-types';

describe('AGROTMToken', function () {
  let agrotmToken: AGROTMToken;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let ownerAddress: string;
  let user1Address: string;
  let user2Address: string;

  const INITIAL_SUPPLY = ethers.parseEther('1000000000'); // 1 bilhão
  const MAX_SUPPLY = ethers.parseEther('2000000000'); // 2 bilhões

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();

    const AGROTMTokenFactory = await ethers.getContractFactory('AGROTMToken');
    agrotmToken = await AGROTMTokenFactory.deploy(ownerAddress);
    await agrotmToken.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await agrotmToken.owner()).to.equal(ownerAddress);
    });

    it('Should assign the total supply to the owner', async function () {
      const ownerBalance = await agrotmToken.balanceOf(ownerAddress);
      expect(await agrotmToken.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it('Should set the correct name and symbol', async function () {
      expect(await agrotmToken.name()).to.equal('AGROTM Token');
      expect(await agrotmToken.symbol()).to.equal('AGROTM');
    });

    it('Should set the correct max supply', async function () {
      expect(await agrotmToken.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it('Should set owner as authorized minter', async function () {
      expect(await agrotmToken.authorizedMinters(ownerAddress)).to.be.true;
    });
  });

  describe('Minting', function () {
    it('Should allow owner to mint tokens', async function () {
      const mintAmount = ethers.parseEther('1000000');
      await agrotmToken.connect(owner).mint(user1Address, mintAmount);
      
      expect(await agrotmToken.balanceOf(user1Address)).to.equal(mintAmount);
    });

    it('Should allow authorized minter to mint tokens', async function () {
      const mintAmount = ethers.parseEther('1000000');
      await agrotmToken.connect(owner).addAuthorizedMinter(user1Address);
      await agrotmToken.connect(user1).mint(user2Address, mintAmount);
      
      expect(await agrotmToken.balanceOf(user2Address)).to.equal(mintAmount);
    });

    it('Should prevent unauthorized users from minting', async function () {
      const mintAmount = ethers.parseEther('1000000');
      await expect(
        agrotmToken.connect(user1).mint(user2Address, mintAmount)
      ).to.be.revertedWithCustomError(agrotmToken, 'OwnableUnauthorizedAccount');
    });

    it('Should prevent minting beyond max supply', async function () {
      const remainingSupply = MAX_SUPPLY - INITIAL_SUPPLY;
      const excessAmount = ethers.parseEther('1');
      
      await expect(
        agrotmToken.connect(owner).mint(user1Address, remainingSupply + excessAmount)
      ).to.be.revertedWith('Exceeds max supply');
    });
  });

  describe('Burning', function () {
    beforeEach(async function () {
      // Transfer some tokens to user1 for burning tests
      await agrotmToken.connect(owner).transfer(user1Address, ethers.parseEther('1000000'));
    });

    it('Should allow users to burn their own tokens', async function () {
      const burnAmount = ethers.parseEther('100000');
      const initialBalance = await agrotmToken.balanceOf(user1Address);
      
      await agrotmToken.connect(user1).burn(burnAmount);
      
      expect(await agrotmToken.balanceOf(user1Address)).to.equal(initialBalance - burnAmount);
    });

    it('Should allow owner to burn from any address', async function () {
      const burnAmount = ethers.parseEther('100000');
      const initialBalance = await agrotmToken.balanceOf(user1Address);
      
      await agrotmToken.connect(owner).burnFrom(user1Address, burnAmount);
      
      expect(await agrotmToken.balanceOf(user1Address)).to.equal(initialBalance - burnAmount);
    });

    it('Should prevent burning more than balance', async function () {
      const balance = await agrotmToken.balanceOf(user1Address);
      const burnAmount = balance + ethers.parseEther('1');
      
      await expect(
        agrotmToken.connect(user1).burn(burnAmount)
      ).to.be.revertedWith('ERC20: burn amount exceeds balance');
    });
  });

  describe('Authorized Minters', function () {
    it('Should allow owner to add authorized minter', async function () {
      await agrotmToken.connect(owner).addAuthorizedMinter(user1Address);
      expect(await agrotmToken.authorizedMinters(user1Address)).to.be.true;
    });

    it('Should allow owner to remove authorized minter', async function () {
      await agrotmToken.connect(owner).addAuthorizedMinter(user1Address);
      await agrotmToken.connect(owner).removeAuthorizedMinter(user1Address);
      expect(await agrotmToken.authorizedMinters(user1Address)).to.be.false;
    });

    it('Should prevent non-owner from adding authorized minter', async function () {
      await expect(
        agrotmToken.connect(user1).addAuthorizedMinter(user2Address)
      ).to.be.revertedWithCustomError(agrotmToken, 'OwnableUnauthorizedAccount');
    });
  });

  describe('Pausing', function () {
    it('Should allow owner to pause and unpause', async function () {
      await agrotmToken.connect(owner).pause();
      expect(await agrotmToken.paused()).to.be.true;
      
      await agrotmToken.connect(owner).unpause();
      expect(await agrotmToken.paused()).to.be.false;
    });

    it('Should prevent transfers when paused', async function () {
      await agrotmToken.connect(owner).pause();
      
      await expect(
        agrotmToken.connect(owner).transfer(user1Address, ethers.parseEther('1000'))
      ).to.be.revertedWith('Pausable: paused');
    });

    it('Should prevent non-owner from pausing', async function () {
      await expect(
        agrotmToken.connect(user1).pause()
      ).to.be.revertedWithCustomError(agrotmToken, 'OwnableUnauthorizedAccount');
    });
  });

  describe('Supply Functions', function () {
    it('Should return correct circulating supply', async function () {
      expect(await agrotmToken.circulatingSupply()).to.equal(await agrotmToken.totalSupply());
    });

    it('Should return correct remaining supply', async function () {
      const remaining = await agrotmToken.remainingSupply();
      expect(remaining).to.equal(MAX_SUPPLY - INITIAL_SUPPLY);
    });
  });

  describe('Max Supply', function () {
    it('Should allow owner to update max supply', async function () {
      const newMaxSupply = ethers.parseEther('3000000000');
      await agrotmToken.connect(owner).setMaxSupply(newMaxSupply);
      expect(await agrotmToken.maxSupply()).to.equal(newMaxSupply);
    });

    it('Should prevent non-owner from updating max supply', async function () {
      const newMaxSupply = ethers.parseEther('3000000000');
      await expect(
        agrotmToken.connect(user1).setMaxSupply(newMaxSupply)
      ).to.be.revertedWithCustomError(agrotmToken, 'OwnableUnauthorizedAccount');
    });
  });
}); 