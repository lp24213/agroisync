import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  console.log("🚀 Iniciando deploy dos contratos AGROTM...");
  
  // Obter o deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());
  
  // Endereço do dono (deve ser configurado no .env)
  const ownerAddress = process.env.OWNER_METAMASK_ADDRESS || deployer.address;
  const commissionRate = process.env.COMMISSION_RATE ? parseInt(process.env.COMMISSION_RATE) : 500; // 5%
  
  console.log("👑 Owner address:", ownerAddress);
  console.log("💸 Commission rate:", commissionRate / 100, "%");
  
  try {
    // 1. Deploy AGROTM Token
    console.log("\n📦 Deploying AGROTM Token...");
    const AGROTMToken = await ethers.getContractFactory("AGROTMToken");
    const agrotmToken = await AGROTMToken.deploy(ownerAddress);
    await agrotmToken.deployed();
    console.log("✅ AGROTM Token deployed to:", agrotmToken.address);
    
    // 2. Deploy NFT Agro
    console.log("\n🎨 Deploying NFT Agro...");
    const NFTAgro = await ethers.getContractFactory("NFTAgro");
    const nftAgro = await NFTAgro.deploy(ownerAddress);
    await nftAgro.deployed();
    console.log("✅ NFT Agro deployed to:", nftAgro.address);
    
    // 3. Deploy BuyWithCommission
    console.log("\n💳 Deploying BuyWithCommission...");
    const BuyWithCommission = await ethers.getContractFactory("BuyWithCommission");
    const buyWithCommission = await BuyWithCommission.deploy(commissionRate, ownerAddress);
    await buyWithCommission.deployed();
    console.log("✅ BuyWithCommission deployed to:", buyWithCommission.address);
    
    // 4. Deploy Staking
    console.log("\n🔒 Deploying Staking...");
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(agrotmToken.address, ownerAddress);
    await staking.deployed();
    console.log("✅ Staking deployed to:", staking.address);
    
    // 5. Configurar permissões
    console.log("\n⚙️ Configurando permissões...");
    
    // Adicionar BuyWithCommission como minter autorizado do token
    await agrotmToken.addAuthorizedMinter(buyWithCommission.address);
    console.log("✅ BuyWithCommission adicionado como minter do token");
    
    // Adicionar Staking como minter autorizado do token
    await agrotmToken.addAuthorizedMinter(staking.address);
    console.log("✅ Staking adicionado como minter do token");
    
    // Adicionar deployer como minter autorizado do NFT
    await nftAgro.addAuthorizedMinter(deployer.address);
    console.log("✅ Deployer adicionado como minter do NFT");
    
    // 6. Verificar contratos
    console.log("\n🔍 Verificando contratos...");
    
    // Verificar token
    const tokenName = await agrotmToken.name();
    const tokenSymbol = await agrotmToken.symbol();
    const totalSupply = await agrotmToken.totalSupply();
    console.log(`✅ Token: ${tokenName} (${tokenSymbol}) - Supply: ${ethers.utils.formatEther(totalSupply)}`);
    
    // Verificar NFT
    const nftName = await nftAgro.name();
    const nftSymbol = await nftAgro.symbol();
    console.log(`✅ NFT: ${nftName} (${nftSymbol})`);
    
    // Verificar comissão
    const commission = await buyWithCommission.commissionRate();
    const admin = await buyWithCommission.adminAddress();
    console.log(`✅ Comissão: ${commission / 100}% para ${admin}`);
    
    // Verificar staking
    const stakingToken = await staking.agrotmToken();
    const totalStaked = await staking.totalStaked();
    console.log(`✅ Staking: Token ${stakingToken}, Total staked: ${ethers.utils.formatEther(totalStaked)}`);
    
    // 7. Salvar endereços
    console.log("\n📋 Endereços dos contratos:");
    console.log("==================================");
    console.log(`AGROTM_TOKEN_ADDRESS=${agrotmToken.address}`);
    console.log(`NFT_AGRO_ADDRESS=${nftAgro.address}`);
    console.log(`BUY_WITH_COMMISSION_ADDRESS=${buyWithCommission.address}`);
    console.log(`STAKING_CONTRACT_ADDRESS=${staking.address}`);
    console.log("==================================");
    
    // 8. Criar arquivo de configuração
    const configData = {
      network: await ethers.provider.getNetwork(),
      contracts: {
        agrotmToken: agrotmToken.address,
        nftAgro: nftAgro.address,
        buyWithCommission: buyWithCommission.address,
        staking: staking.address
      },
      owner: ownerAddress,
      commissionRate: commissionRate,
      deployer: deployer.address,
      deployedAt: new Date().toISOString()
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      'deployment-config.json',
      JSON.stringify(configData, null, 2)
    );
    console.log("\n💾 Configuração salva em deployment-config.json");
    
    console.log("\n🎉 Deploy concluído com sucesso!");
    console.log("\n📝 Próximos passos:");
    console.log("1. Copie os endereços acima para o arquivo .env");
    console.log("2. Execute os testes: npm run test");
    console.log("3. Verifique os contratos no explorer da rede");
    console.log("4. Configure o frontend com os novos endereços");
    
  } catch (error) {
    console.error("❌ Erro durante o deploy:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 