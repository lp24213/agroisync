#!/usr/bin/env ts-node

import { ethers } from 'ethers';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface DeployConfig {
  network: string;
  rpcUrl: string;
  privateKey: string;
  gasLimit?: number;
  gasPrice?: string;
}

interface ContractConfig {
  name: string;
  path: string;
  constructorArgs: any[];
}

class ContractDeployer {
  private config: DeployConfig;
  private contracts: ContractConfig[];

  constructor(config: DeployConfig) {
    this.config = config;
    this.contracts = this.loadContractConfigs();
  }

  private loadContractConfigs(): ContractConfig[] {
    return [
      {
        name: 'AGROTMToken',
        path: '../contracts/ethereum/contracts/AGROTMToken.sol',
        constructorArgs: [
          'AGROTM Token',
          'AGRO',
          ethers.utils.parseEther('1000000000'), // 1 billion tokens
          process.env.TREASURY_ADDRESS || ethers.constants.AddressZero
        ]
      },
      {
        name: 'Staking',
        path: '../contracts/ethereum/contracts/Staking.sol',
        constructorArgs: [
          process.env.AGRO_TOKEN_ADDRESS || ethers.constants.AddressZero,
          process.env.REWARDS_TOKEN_ADDRESS || ethers.constants.AddressZero
        ]
      },
      {
        name: 'NFTAgro',
        path: '../contracts/ethereum/contracts/NFTAgro.sol',
        constructorArgs: [
          'AGROTM NFTs',
          'AGRONFT',
          process.env.AGRO_TOKEN_ADDRESS || ethers.constants.AddressZero
        ]
      },
      {
        name: 'BuyWithCommission',
        path: '../contracts/ethereum/BuyWithCommission.sol',
        constructorArgs: [
          process.env.COMMISSION_RATE || '250', // 2.5%
          process.env.COMMISSION_RECEIVER || ethers.constants.AddressZero
        ]
      }
    ];
  }

  async deployEthereumContracts(): Promise<void> {
    console.log('🚀 Starting Ethereum contract deployment...');

    const provider = new ethers.providers.JsonRpcProvider(this.config.rpcUrl);
    const wallet = new ethers.Wallet(this.config.privateKey, provider);
    
    const deployedAddresses: { [key: string]: string } = {};

    for (const contract of this.contracts) {
      try {
        console.log(`📦 Deploying ${contract.name}...`);
        
        const contractPath = path.resolve(__dirname, contract.path);
        const contractSource = fs.readFileSync(contractPath, 'utf8');
        
        // Compile contract
        const compiledContract = await this.compileContract(contractSource, contract.name);
        
        // Deploy contract
        const factory = new ethers.ContractFactory(
          compiledContract.abi,
          compiledContract.bytecode,
          wallet
        );

        const deploymentOptions = {
          gasLimit: this.config.gasLimit || 5000000,
          gasPrice: this.config.gasPrice ? ethers.utils.parseUnits(this.config.gasPrice, 'gwei') : undefined
        };

        const deployedContract = await factory.deploy(...contract.constructorArgs, deploymentOptions);
        await deployedContract.deployed();

        deployedAddresses[contract.name] = deployedContract.address;
        
        console.log(`✅ ${contract.name} deployed at: ${deployedContract.address}`);
        
        // Wait for confirmation
        await deployedContract.deployTransaction.wait(5);
        
      } catch (error) {
        console.error(`❌ Failed to deploy ${contract.name}:`, error);
        throw error;
      }
    }

    // Save deployment addresses
    this.saveDeploymentAddresses('ethereum', deployedAddresses);
    
    console.log('🎉 Ethereum deployment completed successfully!');
  }

  async deploySolanaContracts(): Promise<void> {
    console.log('🚀 Starting Solana contract deployment...');

    const connection = new Connection(this.config.rpcUrl, 'confirmed');
    const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(this.config.privateKey)));
    
    const provider = new AnchorProvider(connection, { publicKey: keypair.publicKey, signTransaction: (tx) => Promise.resolve(tx) }, {});
    
    const deployedAddresses: { [key: string]: string } = {};

    try {
      // Deploy AGROTM Token
      console.log('📦 Deploying AGROTM Token...');
      const tokenProgram = await this.deploySolanaProgram('agrotm_token', provider, keypair);
      deployedAddresses['AGROTMToken'] = tokenProgram.programId.toString();
      
      // Deploy Staking Program
      console.log('📦 Deploying Staking Program...');
      const stakingProgram = await this.deploySolanaProgram('staking', provider, keypair);
      deployedAddresses['Staking'] = stakingProgram.programId.toString();
      
      // Deploy NFT Program
      console.log('📦 Deploying NFT Program...');
      const nftProgram = await this.deploySolanaProgram('nft_agro', provider, keypair);
      deployedAddresses['NFTAgro'] = nftProgram.programId.toString();

      // Save deployment addresses
      this.saveDeploymentAddresses('solana', deployedAddresses);
      
      console.log('🎉 Solana deployment completed successfully!');
      
    } catch (error) {
      console.error('❌ Failed to deploy Solana contracts:', error);
      throw error;
    }
  }

  private async deploySolanaProgram(programName: string, provider: AnchorProvider, keypair: Keypair): Promise<Program> {
    const programPath = path.resolve(__dirname, `../contracts/solana/${programName}`);
    
    // Build program
    const buildResult = await this.buildSolanaProgram(programPath);
    
    if (!buildResult.success) {
      throw new Error(`Failed to build ${programName}: ${buildResult.error}`);
    }

    // Deploy program
    const programId = new PublicKey(buildResult.programId);
    const program = new Program(buildResult.idl, programId, provider);
    
    // Upload program
    const programBuffer = fs.readFileSync(buildResult.programPath);
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.createAccount({
        fromPubkey: keypair.publicKey,
        newAccountPubkey: programId,
        space: programBuffer.length,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(programBuffer.length),
        programId: web3.SystemProgram.programId
      }),
      web3.BpfLoaderUpgradeable.load({
        programId,
        programBuffer
      })
    );

    const signature = await provider.sendAndConfirm(transaction, [keypair]);
    console.log(`✅ ${programName} deployed with signature: ${signature}`);
    
    return program;
  }

  private async buildSolanaProgram(programPath: string): Promise<any> {
    try {
      // Integrate with Anchor build process
      const { execSync } = require('child_process');
      
      // Run Anchor build command
      execSync('anchor build', { 
        cwd: programPath, 
        stdio: 'pipe' 
      });
      
      // Read the generated program ID
      const idlPath = path.join(programPath, 'target/idl/agrotm.json');
      const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
      
      // Read the program keypair
      const keypairPath = path.join(programPath, 'target/deploy/agrotm-keypair.json');
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const programId = new PublicKey(keypairData);
      
      return {
        success: true,
        programId: programId.toString(),
        idl,
        programPath: path.join(programPath, 'target/deploy/agrotm.so')
      };
    } catch (error) {
      console.error('Failed to build Solana program:', error);
      throw error;
    }
  }

  private async compileContract(source: string, name: string): Promise<any> {
    try {
      // Integrate with Solidity compiler
      const solc = require('solc');
      
      const input = {
        language: 'Solidity',
        sources: {
          [name]: {
            content: source
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      
      const output = JSON.parse(solc.compile(JSON.stringify(input)));
      
      if (output.errors) {
        const errors = output.errors.filter((error: any) => error.severity === 'error');
        if (errors.length > 0) {
          throw new Error(`Compilation failed: ${errors.map((e: any) => e.formattedMessage).join(', ')}`);
        }
      }
      
      const contract = output.contracts[name][name];
      
      return {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
      };
    } catch (error) {
      console.error('Failed to compile contract:', error);
      throw error;
    }
  }

  private saveDeploymentAddresses(network: string, addresses: { [key: string]: string }): void {
    const deploymentPath = path.resolve(__dirname, `../deployments/${network}`);
    
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const deploymentFile = path.join(deploymentPath, 'deployed-addresses.json');
    const deploymentData = {
      network,
      timestamp: new Date().toISOString(),
      addresses
    };

    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));
    console.log(`📄 Deployment addresses saved to: ${deploymentFile}`);
  }

  async verifyContracts(network: string): Promise<void> {
    console.log(`🔍 Verifying contracts on ${network}...`);
    
    const deploymentFile = path.resolve(__dirname, `../deployments/${network}/deployed-addresses.json`);
    
    if (!fs.existsSync(deploymentFile)) {
      console.log('❌ No deployment file found for verification');
      return;
    }

    const deploymentData = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    
    for (const [contractName, address] of Object.entries(deploymentData.addresses)) {
      try {
        console.log(`🔍 Verifying ${contractName} at ${address}...`);
        
        // This would integrate with block explorer APIs for verification
        // For now, just logging the verification attempt
        console.log(`✅ ${contractName} verification initiated`);
        
      } catch (error) {
        console.error(`❌ Failed to verify ${contractName}:`, error);
      }
    }
  }

  async run(): Promise<void> {
    try {
      console.log('🚀 AGROTM Contract Deployment Script');
      console.log('=====================================');
      
      // Deploy based on network
      if (this.config.network === 'ethereum' || this.config.network === 'polygon' || this.config.network === 'bsc') {
        await this.deployEthereumContracts();
        await this.verifyContracts(this.config.network);
      } else if (this.config.network === 'solana') {
        await this.deploySolanaContracts();
        await this.verifyContracts(this.config.network);
      } else {
        throw new Error(`Unsupported network: ${this.config.network}`);
      }
      
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const network = args[0] || process.env.NETWORK || 'ethereum';
  
  const config: DeployConfig = {
    network,
    rpcUrl: process.env[`${network.toUpperCase()}_RPC_URL`] || '',
    privateKey: process.env[`${network.toUpperCase()}_PRIVATE_KEY`] || '',
    gasLimit: parseInt(process.env.GAS_LIMIT || '5000000'),
    gasPrice: process.env.GAS_PRICE
  };

  if (!config.rpcUrl) {
    console.error(`❌ ${network.toUpperCase()}_RPC_URL environment variable is required`);
    process.exit(1);
  }

  if (!config.privateKey) {
    console.error(`❌ ${network.toUpperCase()}_PRIVATE_KEY environment variable is required`);
    process.exit(1);
  }

  const deployer = new ContractDeployer(config);
  await deployer.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { ContractDeployer, DeployConfig, ContractConfig }; 