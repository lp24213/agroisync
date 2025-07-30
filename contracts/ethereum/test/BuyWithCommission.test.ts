import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer, BigNumber } from "ethers";
import { MockERC20, MockERC721, MockERC1155 } from "../contracts/mocks";

describe("BuyWithCommission", function () {
  let buyWithCommission: Contract;
  let mockERC20: Contract;
  let mockERC721: Contract;
  let mockERC1155: Contract;
  let owner: Signer;
  let buyer: Signer;
  let seller: Signer;
  let admin: Signer;
  let ownerAddress: string;
  let buyerAddress: string;
  let sellerAddress: string;
  let adminAddress: string;

  const COMMISSION_RATE = 500; // 5%
  const TOKEN_AMOUNT = ethers.utils.parseEther("1000");
  const NFT_TOKEN_ID = 1;
  const NFT_AMOUNT = 5;
  const PURCHASE_AMOUNT = ethers.utils.parseEther("1");
  
  beforeEach(async function () {
    [owner, buyer, seller, admin] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    buyerAddress = await buyer.getAddress();
    sellerAddress = await seller.getAddress();
    adminAddress = await admin.getAddress();
    
    // Deploy BuyWithCommission
    const BuyWithCommission = await ethers.getContractFactory("BuyWithCommission");
    buyWithCommission = await BuyWithCommission.deploy(COMMISSION_RATE, adminAddress);
    await buyWithCommission.deployed();
    
    // Deploy mock contracts
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20Factory.deploy("Mock Token", "MTK");
    await mockERC20.deployed();
    
    const MockERC721Factory = await ethers.getContractFactory("MockERC721");
    mockERC721 = await MockERC721Factory.deploy("Mock NFT", "MNFT");
    await mockERC721.deployed();
    
    const MockERC1155Factory = await ethers.getContractFactory("MockERC1155");
    mockERC1155 = await MockERC1155Factory.deploy("https://mock-uri.com/");
    await mockERC1155.deployed();
    
    // Setup initial state
    await mockERC20.mint(sellerAddress, TOKEN_AMOUNT);
    await mockERC721.mint(sellerAddress, NFT_TOKEN_ID);
    await mockERC1155.mint(sellerAddress, NFT_TOKEN_ID, NFT_AMOUNT, "0x");
    
    // Approve transfers
    await mockERC20.connect(seller).approve(buyWithCommission.address, TOKEN_AMOUNT);
    await mockERC721.connect(seller).approve(buyWithCommission.address, NFT_TOKEN_ID);
    await mockERC1155.connect(seller).setApprovalForAll(buyWithCommission.address, true);
  });
  
  describe("Deployment", function () {
    it("Should set the correct commission rate", async function () {
      expect(await buyWithCommission.commissionRate()).to.equal(COMMISSION_RATE);
    });
    
    it("Should set the correct admin address", async function () {
      expect(await buyWithCommission.adminAddress()).to.equal(adminAddress);
    });
    
    it("Should set the correct owner", async function () {
      expect(await buyWithCommission.owner()).to.equal(ownerAddress);
    });
  });
  
  describe("Token Purchase", function () {
    it("Should buy tokens with commission", async function () {
      const initialBuyerBalance = await mockERC20.balanceOf(buyerAddress);
      const initialSellerBalance = await ethers.provider.getBalance(sellerAddress);
      const initialAdminBalance = await ethers.provider.getBalance(adminAddress);
      
      await buyWithCommission.connect(buyer).buyTokenWithCommission(
        mockERC20.address,
        sellerAddress,
        TOKEN_AMOUNT,
        { value: PURCHASE_AMOUNT }
      );
      
      // Check token transfer
      expect(await mockERC20.balanceOf(buyerAddress)).to.equal(initialBuyerBalance.add(TOKEN_AMOUNT));
      
      // Check ETH distribution
      const commission = PURCHASE_AMOUNT.mul(COMMISSION_RATE).div(10000);
      const sellerAmount = PURCHASE_AMOUNT.sub(commission);

      expect(await ethers.provider.getBalance(sellerAddress)).to.equal(initialSellerBalance.add(sellerAmount));
      expect(await ethers.provider.getBalance(adminAddress)).to.equal(initialAdminBalance.add(commission));
    });

    it("Should emit TokenPurchased event", async function () {
      await expect(
        buyWithCommission.connect(buyer).buyTokenWithCommission(
          mockERC20.address,
          sellerAddress,
          TOKEN_AMOUNT,
          { value: PURCHASE_AMOUNT }
        )
      )
        .to.emit(buyWithCommission, "TokenPurchased")
        .withArgs(buyerAddress, mockERC20.address, TOKEN_AMOUNT, PURCHASE_AMOUNT.mul(COMMISSION_RATE).div(10000));
    });

    it("Should revert with invalid token address", async function () {
      await expect(
        buyWithCommission.connect(buyer).buyTokenWithCommission(
          ethers.constants.AddressZero,
          sellerAddress,
          TOKEN_AMOUNT,
          { value: PURCHASE_AMOUNT }
        )
      ).to.be.revertedWith("Invalid token address");
    });

    it("Should revert with invalid seller address", async function () {
      await expect(
        buyWithCommission.connect(buyer).buyTokenWithCommission(
          mockERC20.address,
          ethers.constants.AddressZero,
          TOKEN_AMOUNT,
          { value: PURCHASE_AMOUNT }
        )
      ).to.be.revertedWith("Invalid seller address");
    });

    it("Should revert with zero amount", async function () {
      await expect(
        buyWithCommission.connect(buyer).buyTokenWithCommission(
          mockERC20.address,
          sellerAddress,
          0,
          { value: PURCHASE_AMOUNT }
        )
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });
  
  describe("NFT Purchase", function () {
    it("Should buy ERC721 NFT with commission", async function () {
      const initialBuyerBalance = await mockERC721.balanceOf(buyerAddress);
      const initialSellerBalance = await ethers.provider.getBalance(sellerAddress);
      const initialAdminBalance = await ethers.provider.getBalance(adminAddress);

      await buyWithCommission.connect(buyer).buyNFTWithCommission(
        mockERC721.address,
        sellerAddress,
        NFT_TOKEN_ID,
        { value: PURCHASE_AMOUNT }
      );
      
      // Check NFT transfer
      expect(await mockERC721.balanceOf(buyerAddress)).to.equal(initialBuyerBalance.add(1));
      expect(await mockERC721.ownerOf(NFT_TOKEN_ID)).to.equal(buyerAddress);
      
      // Check ETH distribution
      const commission = PURCHASE_AMOUNT.mul(COMMISSION_RATE).div(10000);
      const sellerAmount = PURCHASE_AMOUNT.sub(commission);

      expect(await ethers.provider.getBalance(sellerAddress)).to.equal(initialSellerBalance.add(sellerAmount));
      expect(await ethers.provider.getBalance(adminAddress)).to.equal(initialAdminBalance.add(commission));
    });
    
    it("Should buy ERC1155 NFT with commission", async function () {
      const initialBuyerBalance = await mockERC1155.balanceOf(buyerAddress, NFT_TOKEN_ID);
      const initialSellerBalance = await ethers.provider.getBalance(sellerAddress);
      const initialAdminBalance = await ethers.provider.getBalance(adminAddress);

      await buyWithCommission.connect(buyer).buyERC1155WithCommission(
        mockERC1155.address,
        sellerAddress,
        NFT_TOKEN_ID,
        NFT_AMOUNT,
        "0x",
        { value: PURCHASE_AMOUNT }
      );
      
      // Check NFT transfer
      expect(await mockERC1155.balanceOf(buyerAddress, NFT_TOKEN_ID)).to.equal(initialBuyerBalance.add(NFT_AMOUNT));

      // Check ETH distribution
      const commission = PURCHASE_AMOUNT.mul(COMMISSION_RATE).div(10000);
      const sellerAmount = PURCHASE_AMOUNT.sub(commission);
      
      expect(await ethers.provider.getBalance(sellerAddress)).to.equal(initialSellerBalance.add(sellerAmount));
      expect(await ethers.provider.getBalance(adminAddress)).to.equal(initialAdminBalance.add(commission));
    });

    it("Should emit NFTPurchased event for ERC721", async function () {
      await expect(
        buyWithCommission.connect(buyer).buyNFTWithCommission(
          mockERC721.address,
          sellerAddress,
          NFT_TOKEN_ID,
          { value: PURCHASE_AMOUNT }
        )
      )
        .to.emit(buyWithCommission, "NFTPurchased")
        .withArgs(buyerAddress, mockERC721.address, NFT_TOKEN_ID, 1, PURCHASE_AMOUNT.mul(COMMISSION_RATE).div(10000), 721);
    });

    it("Should emit NFTPurchased event for ERC1155", async function () {
      await expect(
        buyWithCommission.connect(buyer).buyERC1155WithCommission(
          mockERC1155.address,
          sellerAddress,
          NFT_TOKEN_ID,
          NFT_AMOUNT,
          "0x",
          { value: PURCHASE_AMOUNT }
        )
      )
        .to.emit(buyWithCommission, "NFTPurchased")
        .withArgs(buyerAddress, mockERC1155.address, NFT_TOKEN_ID, NFT_AMOUNT, PURCHASE_AMOUNT.mul(COMMISSION_RATE).div(10000), 1155);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set commission rate", async function () {
      const newRate = 1000; // 10%
      await expect(buyWithCommission.connect(owner).setCommissionRate(newRate))
        .to.emit(buyWithCommission, "CommissionRateChanged")
        .withArgs(COMMISSION_RATE, newRate);

      expect(await buyWithCommission.commissionRate()).to.equal(newRate);
    });

    it("Should allow owner to set admin address", async function () {
      const newAdmin = await ethers.getSigner(4);
      const newAdminAddress = await newAdmin.getAddress();

      await expect(buyWithCommission.connect(owner).setAdminAddress(newAdminAddress))
        .to.emit(buyWithCommission, "AdminAddressChanged")
        .withArgs(adminAddress, newAdminAddress);
      
      expect(await buyWithCommission.adminAddress()).to.equal(newAdminAddress);
    });

    it("Should revert when non-owner tries to set commission rate", async function () {
      await expect(
        buyWithCommission.connect(buyer).setCommissionRate(1000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when non-owner tries to set admin address", async function () {
      const newAdmin = await ethers.getSigner(4);
      const newAdminAddress = await newAdmin.getAddress();

      await expect(
        buyWithCommission.connect(buyer).setAdminAddress(newAdminAddress)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when setting commission rate too high", async function () {
      await expect(
        buyWithCommission.connect(owner).setCommissionRate(3100) // 31%
      ).to.be.revertedWith("Commission rate too high");
    });

    it("Should revert when setting invalid admin address", async function () {
      await expect(
        buyWithCommission.connect(owner).setAdminAddress(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid admin address");
    });
  });
  
  describe("Pause/Unpause", function () {
    it("Should allow owner to pause and unpause", async function () {
      await buyWithCommission.connect(owner).pause();
      expect(await buyWithCommission.paused()).to.be.true;
      
      await buyWithCommission.connect(owner).unpause();
      expect(await buyWithCommission.paused()).to.be.false;
    });

    it("Should revert transactions when paused", async function () {
      await buyWithCommission.connect(owner).pause();

      await expect(
        buyWithCommission.connect(buyer).buyTokenWithCommission(
          mockERC20.address,
          sellerAddress,
          TOKEN_AMOUNT,
          { value: PURCHASE_AMOUNT }
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should revert when non-owner tries to pause", async function () {
      await expect(
        buyWithCommission.connect(buyer).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Withdraw", function () {
    it("Should allow owner to withdraw ETH", async function () {
      // First make a purchase to add ETH to contract
      await buyWithCommission.connect(buyer).buyTokenWithCommission(
        mockERC20.address,
        sellerAddress,
        TOKEN_AMOUNT,
        { value: PURCHASE_AMOUNT }
      );

      const contractBalance = await ethers.provider.getBalance(buyWithCommission.address);
      const initialOwnerBalance = await ethers.provider.getBalance(ownerAddress);

      await buyWithCommission.connect(owner).withdraw(ownerAddress, contractBalance);

      expect(await ethers.provider.getBalance(ownerAddress)).to.equal(initialOwnerBalance.add(contractBalance));
    });

    it("Should emit FundsWithdrawn event", async function () {
      // First make a purchase to add ETH to contract
      await buyWithCommission.connect(buyer).buyTokenWithCommission(
        mockERC20.address,
        sellerAddress,
        TOKEN_AMOUNT,
        { value: PURCHASE_AMOUNT }
      );
      
      const contractBalance = await ethers.provider.getBalance(buyWithCommission.address);

      await expect(buyWithCommission.connect(owner).withdraw(ownerAddress, contractBalance))
        .to.emit(buyWithCommission, "FundsWithdrawn")
        .withArgs(ownerAddress, contractBalance);
    });
    
    it("Should revert when non-owner tries to withdraw", async function () {
      await expect(
        buyWithCommission.connect(buyer).withdraw(buyerAddress, ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Receive Function", function () {
    it("Should accept ETH", async function () {
      const amount = ethers.utils.parseEther("1");
      await buyer.sendTransaction({
        to: buyWithCommission.address,
        value: amount
      });

      expect(await ethers.provider.getBalance(buyWithCommission.address)).to.equal(amount);
    });
  });
});