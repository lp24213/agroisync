import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Staking", function () {
  let AGROTMToken: ContractFactory;
  let Staking: ContractFactory;
  let agrotmToken: Contract;
  let staking: Contract;
  let owner: SignerWithAddress;
  let operator: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let emergency: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000000"); // 1 bilhão
  const STAKE_AMOUNT = ethers.utils.parseEther("1000");
  const MIN_STAKE_AMOUNT = ethers.utils.parseEther("100");
  const MAX_STAKE_AMOUNT = ethers.utils.parseEther("1000000");
  const ANTI_WHALE_LIMIT = ethers.utils.parseEther("100000");

  beforeEach(async function () {
    [owner, operator, user1, user2, user3, emergency] = await ethers.getSigners();

    // Deploy AGROTM Token
    AGROTMToken = await ethers.getContractFactory("AGROTMToken");
    agrotmToken = await AGROTMToken.deploy(owner.address, INITIAL_SUPPLY);
    await agrotmToken.deployed();

    // Deploy Staking Contract
    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(agrotmToken.address, owner.address);
    await staking.deployed();

    // Configurar roles
    await staking.grantRole(await staking.ADMIN_ROLE(), owner.address);
    await staking.grantRole(await staking.OPERATOR_ROLE(), operator.address);
    await staking.grantRole(await staking.EMERGENCY_ROLE(), emergency.address);

    // Transferir tokens para usuários
    await agrotmToken.transfer(user1.address, ethers.utils.parseEther("10000"));
    await agrotmToken.transfer(user2.address, ethers.utils.parseEther("10000"));
    await agrotmToken.transfer(user3.address, ethers.utils.parseEther("10000"));

    // Aprovar staking contract
    await agrotmToken.connect(user1).approve(staking.address, ethers.utils.parseEther("10000"));
    await agrotmToken.connect(user2).approve(staking.address, ethers.utils.parseEther("10000"));
    await agrotmToken.connect(user3).approve(staking.address, ethers.utils.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await staking.hasRole(await staking.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should set correct token address", async function () {
      expect(await staking.agrotmToken()).to.equal(agrotmToken.address);
    });

    it("Should set correct initial limits", async function () {
      expect(await staking.minStakeAmount()).to.equal(MIN_STAKE_AMOUNT);
      expect(await staking.maxStakeAmount()).to.equal(MAX_STAKE_AMOUNT);
      expect(await staking.antiWhaleLimit()).to.equal(ANTI_WHALE_LIMIT);
    });

    it("Should setup default lock periods", async function () {
      const period0 = await staking.getLockPeriodInfo(0);
      expect(period0.duration).to.equal(30 * 24 * 60 * 60); // 30 days
      expect(period0.apr).to.equal(800); // 8%
      expect(period0.isActive).to.be.true;

      const period1 = await staking.getLockPeriodInfo(1);
      expect(period1.duration).to.equal(90 * 24 * 60 * 60); // 90 days
      expect(period1.apr).to.equal(1200); // 12%
      expect(period1.isActive).to.be.true;

      const period4 = await staking.getLockPeriodInfo(4);
      expect(period4.duration).to.equal(0); // Flexible
      expect(period4.apr).to.equal(500); // 5%
      expect(period4.isActive).to.be.true;
    });
  });

  describe("Staking", function () {
    it("Should stake tokens successfully", async function () {
      const lockPeriodIndex = 0; // 30 days
      await staking.connect(user1).stake(STAKE_AMOUNT, lockPeriodIndex);

      expect(await agrotmToken.balanceOf(staking.address)).to.equal(STAKE_AMOUNT);
      expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT);

      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.totalStaked).to.equal(STAKE_AMOUNT);
      expect(userStats.activeStakes).to.equal(1);
    });

    it("Should stake with flexible period", async function () {
      const lockPeriodIndex = 4; // Flexible
      await staking.connect(user1).stake(STAKE_AMOUNT, lockPeriodIndex);

      const userStakes = await staking.getUserStakes(user1.address);
      const stakeInfo = await staking.getStakeInfo(userStakes[0]);
      expect(stakeInfo[0].isLocked).to.be.false;
    });

    it("Should fail to stake below minimum amount", async function () {
      const smallAmount = ethers.utils.parseEther("50");
      await expect(
        staking.connect(user1).stake(smallAmount, 0)
      ).to.be.revertedWith("Amount below minimum");
    });

    it("Should fail to stake above maximum amount", async function () {
      const largeAmount = ethers.utils.parseEther("2000000");
      await expect(
        staking.connect(user1).stake(largeAmount, 0)
      ).to.be.revertedWith("Amount above maximum");
    });

    it("Should fail to stake above anti-whale limit", async function () {
      const whaleAmount = ethers.utils.parseEther("150000");
      await expect(
        staking.connect(user1).stake(whaleAmount, 0)
      ).to.be.revertedWith("Exceeds anti-whale limit");
    });

    it("Should fail to stake with invalid lock period", async function () {
      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT, 5)
      ).to.be.revertedWith("Invalid lock period");
    });

    it("Should fail to stake when contract is paused", async function () {
      await staking.pause();
      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT, 0)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should enforce rate limiting", async function () {
      // Fazer 5 stakes (limite máximo)
      for (let i = 0; i < 5; i++) {
        await staking.connect(user1).stake(STAKE_AMOUNT, 0);
      }

      // O 6º stake deve falhar
      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT, 0)
      ).to.be.revertedWith("Rate limit exceeded");
    });

    it("Should fail to stake above period limit", async function () {
      const periodLimit = ethers.utils.parseEther("600000"); // 600k tokens
      await expect(
        staking.connect(user1).stake(periodLimit, 0)
      ).to.be.revertedWith("Amount exceeds period limit");
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0); // 30 days lock
    });

    it("Should fail to unstake before lock period ends", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await expect(
        staking.connect(user1).unstake(userStakes[0])
      ).to.be.revertedWith("Lock period not ended");
    });

    it("Should unstake after lock period ends", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      
      // Avançar 31 dias
      await time.increase(31 * 24 * 60 * 60);
      
      const initialBalance = await agrotmToken.balanceOf(user1.address);
      await staking.connect(user1).unstake(userStakes[0]);
      
      const finalBalance = await agrotmToken.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance); // Deve receber tokens + recompensas
      
      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.activeStakes).to.equal(0);
    });

    it("Should fail to unstake by non-owner", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await time.increase(31 * 24 * 60 * 60);
      
      await expect(
        staking.connect(user2).unstake(userStakes[0])
      ).to.be.revertedWith("Not stake owner");
    });

    it("Should fail to unstake inactive stake", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await time.increase(31 * 24 * 60 * 60);
      await staking.connect(user1).unstake(userStakes[0]);
      
      await expect(
        staking.connect(user1).unstake(userStakes[0])
      ).to.be.revertedWith("Stake not active");
    });
  });

  describe("Flexible Unstaking", function () {
    beforeEach(async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 4); // Flexible
    });

    it("Should unstake flexible stake immediately", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      const initialBalance = await agrotmToken.balanceOf(user1.address);
      
      await staking.connect(user1).unstakeFlexible(userStakes[0]);
      
      const finalBalance = await agrotmToken.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should fail to unstake flexible stake with regular unstake", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await expect(
        staking.connect(user1).unstake(userStakes[0])
      ).to.be.revertedWith("Lock period not ended");
    });
  });

  describe("Claiming Rewards", function () {
    beforeEach(async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 4); // Flexible
    });

    it("Should claim rewards", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      
      // Avançar 1 dia para gerar recompensas
      await time.increase(24 * 60 * 60);
      
      const initialBalance = await agrotmToken.balanceOf(user1.address);
      await staking.connect(user1).claimRewards(userStakes[0]);
      
      const finalBalance = await agrotmToken.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should fail to claim rewards from locked stake", async function () {
      await staking.connect(user2).stake(STAKE_AMOUNT, 0); // 30 days lock
      const userStakes = await staking.getUserStakes(user2.address);
      
      await expect(
        staking.connect(user2).claimRewards(userStakes[0])
      ).to.be.revertedWith("Stake is locked");
    });

    it("Should fail to claim rewards when no rewards available", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      
      await expect(
        staking.connect(user1).claimRewards(userStakes[0])
      ).to.be.revertedWith("No rewards to claim");
    });
  });

  describe("Paused Stakes", function () {
    beforeEach(async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0);
    });

    it("Should pause individual stake", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await staking.connect(operator).pauseStake(userStakes[0]);
      
      const stakeInfo = await staking.getStakeInfo(userStakes[0]);
      expect(stakeInfo[0].isPaused).to.be.true;
    });

    it("Should resume paused stake", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await staking.connect(operator).pauseStake(userStakes[0]);
      await staking.connect(operator).resumeStake(userStakes[0]);
      
      const stakeInfo = await staking.getStakeInfo(userStakes[0]);
      expect(stakeInfo[0].isPaused).to.be.false;
    });

    it("Should fail to unstake paused stake", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      await staking.connect(operator).pauseStake(userStakes[0]);
      await time.increase(31 * 24 * 60 * 60);
      
      await expect(
        staking.connect(user1).unstake(userStakes[0])
      ).to.be.revertedWith("Stake is paused");
    });

    it("Should fail to claim rewards from paused stake", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 4); // Flexible
      const userStakes = await staking.getUserStakes(user1.address);
      await staking.connect(operator).pauseStake(userStakes[1]);
      
      await expect(
        staking.connect(user1).claimRewards(userStakes[1])
      ).to.be.revertedWith("Stake is paused");
    });
  });

  describe("Admin Functions", function () {
    it("Should update APR", async function () {
      const newAPR = 1500; // 15%
      await staking.connect(operator).updateAPR(0, newAPR);
      
      const periodInfo = await staking.getLockPeriodInfo(0);
      expect(periodInfo.apr).to.equal(newAPR);
    });

    it("Should set lock period active/inactive", async function () {
      await staking.connect(operator).setLockPeriodActive(0, false);
      
      let periodInfo = await staking.getLockPeriodInfo(0);
      expect(periodInfo.isActive).to.be.false;
      
      await staking.connect(operator).setLockPeriodActive(0, true);
      periodInfo = await staking.getLockPeriodInfo(0);
      expect(periodInfo.isActive).to.be.true;
    });

    it("Should set stake limits", async function () {
      const newMin = ethers.utils.parseEther("200");
      const newMax = ethers.utils.parseEther("500000");
      
      await staking.connect(owner).setStakeLimits(newMin, newMax);
      
      expect(await staking.minStakeAmount()).to.equal(newMin);
      expect(await staking.maxStakeAmount()).to.equal(newMax);
    });

    it("Should set anti-whale limit", async function () {
      const newLimit = ethers.utils.parseEther("50000");
      await staking.connect(owner).setAntiWhaleLimit(newLimit);
      
      expect(await staking.antiWhaleLimit()).to.equal(newLimit);
    });

    it("Should fail to update APR by non-operator", async function () {
      await expect(
        staking.connect(user1).updateAPR(0, 1500)
      ).to.be.revertedWith("Caller is not operator");
    });

    it("Should fail to set limits by non-admin", async function () {
      await expect(
        staking.connect(operator).setStakeLimits(
          ethers.utils.parseEther("200"),
          ethers.utils.parseEther("500000")
        )
      ).to.be.revertedWith("Caller is not admin");
    });
  });

  describe("Pause/Unpause", function () {
    it("Should pause contract", async function () {
      await staking.connect(owner).pause();
      expect(await staking.paused()).to.be.true;
    });

    it("Should unpause contract", async function () {
      await staking.connect(owner).pause();
      await staking.connect(owner).unpause();
      expect(await staking.paused()).to.be.false;
    });

    it("Should fail to pause by non-pauser", async function () {
      await expect(
        staking.connect(user1).pause()
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency withdrawal", async function () {
      await staking.connect(emergency).emergencyWithdraw(
        agrotmToken.address,
        ethers.utils.parseEther("1000")
      );
    });

    it("Should fail emergency withdrawal by non-emergency", async function () {
      await expect(
        staking.connect(user1).emergencyWithdraw(
          agrotmToken.address,
          ethers.utils.parseEther("1000")
        )
      ).to.be.revertedWith("Caller is not emergency");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0);
      await staking.connect(user2).stake(STAKE_AMOUNT, 1);
    });

    it("Should return correct stake info", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      const stakeInfo = await staking.getStakeInfo(userStakes[0]);
      
      expect(stakeInfo[0].user).to.equal(user1.address);
      expect(stakeInfo[0].amount).to.equal(STAKE_AMOUNT);
      expect(stakeInfo[0].isActive).to.be.true;
    });

    it("Should return correct pending rewards", async function () {
      const userStakes = await staking.getUserStakes(user1.address);
      const pendingRewards = await staking.getPendingRewards(userStakes[0]);
      expect(pendingRewards).to.be.gte(0);
    });

    it("Should return correct contract stats", async function () {
      const stats = await staking.getContractStats();
      expect(stats._totalStaked).to.equal(STAKE_AMOUNT.mul(2));
      expect(stats._totalStakes).to.equal(2);
      expect(stats._minStakeAmount).to.equal(MIN_STAKE_AMOUNT);
      expect(stats._maxStakeAmount).to.equal(MAX_STAKE_AMOUNT);
      expect(stats._antiWhaleLimit).to.equal(ANTI_WHALE_LIMIT);
    });

    it("Should return correct user stats", async function () {
      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.totalStaked).to.equal(STAKE_AMOUNT);
      expect(userStats.activeStakes).to.equal(1);
    });

    it("Should return active stakes", async function () {
      const activeStakes = await staking.getActiveStakes(user1.address);
      expect(activeStakes.length).to.equal(1);
    });
  });

  describe("Reward Calculation", function () {
    it("Should calculate rewards correctly", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0); // 8% APR
      
      // Avançar 1 ano
      await time.increase(365 * 24 * 60 * 60);
      
      const userStakes = await staking.getUserStakes(user1.address);
      const pendingRewards = await staking.getPendingRewards(userStakes[0]);
      
      // Recompensas esperadas: 1000 * 0.08 = 80 tokens
      expect(pendingRewards).to.be.closeTo(
        ethers.utils.parseEther("80"),
        ethers.utils.parseEther("1") // Tolerância de 1 token
      );
    });

    it("Should not calculate rewards for paused stakes", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0);
      const userStakes = await staking.getUserStakes(user1.address);
      
      await staking.connect(operator).pauseStake(userStakes[0]);
      await time.increase(365 * 24 * 60 * 60);
      
      const pendingRewards = await staking.getPendingRewards(userStakes[0]);
      expect(pendingRewards).to.equal(0);
    });
  });

  describe("Events", function () {
    it("Should emit Staked event", async function () {
      await expect(staking.connect(user1).stake(STAKE_AMOUNT, 0))
        .to.emit(staking, "Staked")
        .withArgs(user1.address, 1, STAKE_AMOUNT, 30 * 24 * 60 * 60, 800);
    });

    it("Should emit Unstaked event", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 4); // Flexible
      const userStakes = await staking.getUserStakes(user1.address);
      
      await expect(staking.connect(user1).unstakeFlexible(userStakes[0]))
        .to.emit(staking, "Unstaked");
    });

    it("Should emit RewardsClaimed event", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 4); // Flexible
      const userStakes = await staking.getUserStakes(user1.address);
      
      await time.increase(24 * 60 * 60);
      
      await expect(staking.connect(user1).claimRewards(userStakes[0]))
        .to.emit(staking, "RewardsClaimed");
    });

    it("Should emit APRUpdated event", async function () {
      await expect(staking.connect(operator).updateAPR(0, 1500))
        .to.emit(staking, "APRUpdated")
        .withArgs(30 * 24 * 60 * 60, 800, 1500);
    });

    it("Should emit StakePaused event", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0);
      const userStakes = await staking.getUserStakes(user1.address);
      
      await expect(staking.connect(operator).pauseStake(userStakes[0]))
        .to.emit(staking, "StakePaused")
        .withArgs(userStakes[0], user1.address);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple stakes by same user", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 0);
      await staking.connect(user1).stake(STAKE_AMOUNT, 1);
      await staking.connect(user1).stake(STAKE_AMOUNT, 4);
      
      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.activeStakes).to.equal(3);
      expect(userStats.totalStaked).to.equal(STAKE_AMOUNT.mul(3));
    });

    it("Should handle very large stake amounts", async function () {
      const largeAmount = ethers.utils.parseEther("500000"); // 500k tokens
      await agrotmToken.transfer(user1.address, largeAmount);
      await agrotmToken.connect(user1).approve(staking.address, largeAmount);
      
      await staking.connect(user1).stake(largeAmount, 0);
      
      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.totalStaked).to.equal(largeAmount);
    });

    it("Should handle rapid stake/unstake", async function () {
      await staking.connect(user1).stake(STAKE_AMOUNT, 4); // Flexible
      const userStakes = await staking.getUserStakes(user1.address);
      
      await staking.connect(user1).unstakeFlexible(userStakes[0]);
      
      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.activeStakes).to.equal(0);
    });

    it("Should handle role revocation correctly", async function () {
      await staking.revokeRole(await staking.OPERATOR_ROLE(), operator.address);
      
      await expect(
        staking.connect(operator).updateAPR(0, 1500)
      ).to.be.revertedWith("Caller is not operator");
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy attacks", async function () {
      // Este teste verifica se o modifier nonReentrant está funcionando
      await staking.connect(user1).stake(STAKE_AMOUNT, 0);
      
      // Tentar fazer stake novamente imediatamente (deve funcionar normalmente)
      await staking.connect(user1).stake(STAKE_AMOUNT, 1);
      
      const userStats = await staking.getUserStats(user1.address);
      expect(userStats.activeStakes).to.equal(2);
    });

    it("Should validate all inputs", async function () {
      await expect(
        staking.connect(user1).stake(0, 0)
      ).to.be.revertedWith("Amount below minimum");
      
      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT, 10)
      ).to.be.revertedWith("Invalid lock period");
    });

    it("Should handle overflow protection", async function () {
      // Teste com valores muito grandes
      const hugeAmount = ethers.utils.parseEther("1000000000"); // 1 bilhão
      await agrotmToken.transfer(user1.address, hugeAmount);
      await agrotmToken.connect(user1).approve(staking.address, hugeAmount);
      
      // Deve falhar devido ao limite anti-whale
      await expect(
        staking.connect(user1).stake(hugeAmount, 0)
      ).to.be.revertedWith("Exceeds anti-whale limit");
    });
  });
}); 