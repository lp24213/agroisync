import { ethers } from "hardhat";

async function main() {
  // Endereço do administrador que receberá as comissões
  const adminAddress = "0xSEU_ENDERECO_METAMASK_AQUI"; // Substitua pelo endereço real do admin
  
  // Taxa de comissão (5% = 500 pontos base)
  const commissionRate = 500;
  
  console.log("Deploying BuyWithCommission contract...");
  console.log(`Admin Address: ${adminAddress}`);
  console.log(`Commission Rate: ${commissionRate / 100}%`);
  
  // Deploy do contrato
  const BuyWithCommission = await ethers.getContractFactory("BuyWithCommission");
  const buyWithCommission = await BuyWithCommission.deploy(commissionRate, adminAddress);
  
  await buyWithCommission.deployed();
  
  console.log(`BuyWithCommission deployed to: ${buyWithCommission.address}`);
  console.log("Deployment completed successfully!");
}

// Executar a função principal
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });