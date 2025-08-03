import { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, MintLayout, AccountLayout } from '@solana/spl-token';
import { createAlert } from '../monitoring/alerts';
// Sentry removed - using console logging instead
import { uploadToIPFS } from '../utils/ipfs';

// Tipos de ativos agrícolas que podem ser tokenizados
export enum AssetType {
  FARM = 'FARM',
  MACHINERY = 'MACHINERY',
  GRAIN_LOT = 'GRAIN_LOT',
  LIVESTOCK = 'LIVESTOCK',
  WATER_RIGHTS = 'WATER_RIGHTS',
  CARBON_CREDITS = 'CARBON_CREDITS',
  HARVEST_RIGHTS = 'HARVEST_RIGHTS',
}

// Interface para metadados do token
export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  assetType: AssetType;
  properties: {
    size?: number; // tamanho em hectares para fazendas
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    documents?: string[]; // hashes IPFS de documentos
    certifications?: string[];
    attributes?: Record<string, any>; // atributos específicos do tipo de ativo
    issueDate: string;
    expiryDate?: string;
    issuer: string;
    legalIdentifier?: string;
  };
  external_url?: string;
}

// Interface para opções de tokenização
export interface TokenizationOptions {
  connection: Connection;
  payer: Keypair;
  metadata: TokenMetadata;
  supply: number;
  decimals: number;
  freezeAuthority?: PublicKey;
  programId?: PublicKey;
  onProgress?: (step: string, progress: number) => void;
}

// Interface para resultado da tokenização
export interface TokenizationResult {
  mint: PublicKey;
  tokenAccount: PublicKey;
  metadataUri: string;
  metadataAccount?: PublicKey;
  transaction: string;
  supply: number;
}

/**
 * Cria um novo token para representar um ativo agrícola
 * @param options Opções de tokenização
 * @returns Resultado da tokenização
 */
export async function tokenizeAsset(options: TokenizationOptions): Promise<TokenizationResult> {
  console.log(`[TOKENIZE] Starting tokenization for asset`);
  
  try {
    const { connection, payer, metadata, supply, decimals, freezeAuthority, programId, onProgress } = options;
    
    // Notificar progresso
    onProgress?.('Iniciando tokenização', 0);
    
    // Validar metadados
    validateMetadata(metadata);
    
    // Fazer upload dos metadados para IPFS
    onProgress?.('Enviando metadados para IPFS', 10);
    const metadataUri = await uploadMetadataToIPFS(metadata);
    
    // Criar mint account
    onProgress?.('Criando conta do token', 30);
    const mintAccount = Keypair.generate();
    const tokenProgramId = programId || TOKEN_PROGRAM_ID;
    
    // Calcular tamanho e rent exemption para mint account
    const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
    
    // Criar transaction para criar mint account
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        lamports: mintRent,
        space: MintLayout.span,
        programId: tokenProgramId,
      })
    );
    
    // Inicializar mint account
    transaction.add(
      Token.createInitMintInstruction(
        tokenProgramId,
        mintAccount.publicKey,
        decimals,
        payer.publicKey,
        freezeAuthority || payer.publicKey
      )
    );
    
    // Criar token account para o payer
    onProgress?.('Criando conta do token', 50);
    const tokenAccount = await Token.getAssociatedTokenAddress(
      tokenProgramId,
      tokenProgramId,
      mintAccount.publicKey,
      payer.publicKey
    );
    
    // Adicionar instrução para criar associated token account
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        tokenProgramId,
        tokenProgramId,
        mintAccount.publicKey,
        tokenAccount,
        payer.publicKey,
        payer.publicKey
      )
    );
    
    // Cunhar tokens
    onProgress?.('Cunhando tokens', 70);
    transaction.add(
      Token.createMintToInstruction(
        tokenProgramId,
        mintAccount.publicKey,
        tokenAccount,
        payer.publicKey,
        [],
        supply * Math.pow(10, decimals)
      )
    );
    
    // Enviar transação
    onProgress?.('Enviando transação', 80);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      payer,
      mintAccount,
    ]);
    
    // Registrar evento de sucesso
    createAlert({
      type: 'business',
      level: 'info',
      title: 'Ativo tokenizado com sucesso',
      message: `Ativo ${metadata.name} (${metadata.symbol}) foi tokenizado com sucesso. Mint: ${mintAccount.publicKey.toString()}`,
    });
    
    onProgress?.('Tokenização concluída', 100);
    
    // Retornar resultado
    const result: TokenizationResult = {
      mint: mintAccount.publicKey,
      tokenAccount,
      metadataUri,
      transaction: signature,
      supply,
    };
    
    console.log(`[TOKENIZE] Tokenization completed successfully`);
    return result;
  } catch (error) {
    console.error('Erro ao tokenizar ativo:', error);
    
    // Registrar evento de erro
    createAlert({
      type: 'business',
      level: 'error',
      title: 'Erro ao tokenizar ativo',
      message: `Ocorreu um erro ao tokenizar ativo: ${error.message}`,
    });
    
    throw error;
  }
}

/**
 * Valida os metadados do token
 * @param metadata Metadados do token
 * @throws Error se os metadados forem inválidos
 */
function validateMetadata(metadata: TokenMetadata): void {
  if (!metadata.name || metadata.name.trim() === '') {
    throw new Error('Nome do token é obrigatório');
  }
  
  if (!metadata.symbol || metadata.symbol.trim() === '') {
    throw new Error('Símbolo do token é obrigatório');
  }
  
  if (!metadata.description || metadata.description.trim() === '') {
    throw new Error('Descrição do token é obrigatória');
  }
  
  if (!metadata.assetType || !Object.values(AssetType).includes(metadata.assetType)) {
    throw new Error('Tipo de ativo inválido');
  }
  
  if (!metadata.properties) {
    throw new Error('Propriedades do token são obrigatórias');
  }
  
  if (!metadata.properties.issueDate) {
    throw new Error('Data de emissão é obrigatória');
  }
  
  if (!metadata.properties.issuer) {
    throw new Error('Emissor é obrigatório');
  }
  
  // Validações específicas por tipo de ativo
  switch (metadata.assetType) {
    case AssetType.FARM:
      if (!metadata.properties.size) {
        throw new Error('Tamanho da fazenda é obrigatório');
      }
      if (!metadata.properties.location) {
        throw new Error('Localização da fazenda é obrigatória');
      }
      break;
      
    case AssetType.GRAIN_LOT:
      if (!metadata.properties.attributes?.quantity) {
        throw new Error('Quantidade do lote de grãos é obrigatória');
      }
      if (!metadata.properties.attributes?.grainType) {
        throw new Error('Tipo de grão é obrigatório');
      }
      break;
      
    case AssetType.MACHINERY:
      if (!metadata.properties.attributes?.model) {
        throw new Error('Modelo do maquinário é obrigatório');
      }
      if (!metadata.properties.attributes?.manufacturer) {
        throw new Error('Fabricante do maquinário é obrigatório');
      }
      if (!metadata.properties.attributes?.year) {
        throw new Error('Ano do maquinário é obrigatório');
      }
      break;
  }
}

/**
 * Faz upload dos metadados para IPFS
 * @param metadata Metadados do token
 * @returns URI dos metadados no IPFS
 */
async function uploadMetadataToIPFS(metadata: TokenMetadata): Promise<string> {
  try {
    // Converter metadados para formato compatível com NFT standard
    const metadataForUpload = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image: metadata.image,
      external_url: metadata.external_url,
      attributes: [
        {
          trait_type: 'Asset Type',
          value: metadata.assetType,
        },
        ...Object.entries(metadata.properties).flatMap(([key, value]) => {
          if (key === 'attributes') {
            return Object.entries(value).map(([attrKey, attrValue]) => ({
              trait_type: attrKey,
              value: attrValue,
            }));
          } else if (key === 'location') {
            return [
              {
                trait_type: 'Latitude',
                value: value.latitude,
              },
              {
                trait_type: 'Longitude',
                value: value.longitude,
              },
              value.address ? {
                trait_type: 'Address',
                value: value.address,
              } : null,
            ].filter(Boolean);
          } else if (key === 'documents' || key === 'certifications') {
            return [];
          } else {
            return {
              trait_type: key,
              value,
            };
          }
        }).filter(Boolean),
      ],
      properties: {
        documents: metadata.properties.documents || [],
        certifications: metadata.properties.certifications || [],
        issueDate: metadata.properties.issueDate,
        expiryDate: metadata.properties.expiryDate,
        issuer: metadata.properties.issuer,
        legalIdentifier: metadata.properties.legalIdentifier,
      },
    };
    
    // Fazer upload para IPFS
    const ipfsHash = await uploadToIPFS(JSON.stringify(metadataForUpload), {
      name: `${metadata.symbol}_metadata.json`,
      type: 'application/json',
    });
    
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Erro ao fazer upload dos metadados para IPFS:', error);
    captureException(error);
    throw new Error(`Erro ao fazer upload dos metadados: ${error.message}`);
  }
}

/**
 * Obtém informações sobre um token agrícola
 * @param connection Conexão Solana
 * @param mintAddress Endereço do mint
 * @returns Informações do token
 */
export async function getTokenInfo(connection: Connection, mintAddress: string): Promise<{
  mint: PublicKey;
  supply: number;
  decimals: number;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
}> {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const mintInfo = await connection.getAccountInfo(mintPublicKey);
    
    if (!mintInfo) {
      throw new Error('Token não encontrado');
    }
    
    // Decodificar informações do mint
    const data = Buffer.from(mintInfo.data);
    const mintLayout = MintLayout.decode(data);
    
    // Calcular supply real
    const supply = Number(mintLayout.supply.toString()) / Math.pow(10, mintLayout.decimals);
    
    return {
      mint: mintPublicKey,
      supply,
      decimals: mintLayout.decimals,
      mintAuthority: mintLayout.mintAuthorityOption === 0 ? null : new PublicKey(mintLayout.mintAuthority),
      freezeAuthority: mintLayout.freezeAuthorityOption === 0 ? null : new PublicKey(mintLayout.freezeAuthority),
    };
  } catch (error) {
    console.error('Erro ao obter informações do token:', error);
    captureException(error);
    throw error;
  }
}

/**
 * Transfere tokens para outro endereço
 * @param connection Conexão Solana
 * @param payer Keypair do pagador
 * @param mint Endereço do mint
 * @param destination Endereço de destino
 * @param amount Quantidade a transferir
 * @returns Assinatura da transação
 */
export async function transferTokens(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  destination: PublicKey,
  amount: number,
  decimals: number
): Promise<string> {
  const sentryTransaction = startSentryTransaction({
    name: 'transfer-tokens',
    op: 'token-transfer',
  });
  
  try {
    // Obter contas de token
    const sourceTokenAccount = await Token.getAssociatedTokenAddress(
      TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      payer.publicKey
    );
    
    // Verificar se a conta de destino existe, se não, criar
    const destinationTokenAccount = await Token.getAssociatedTokenAddress(
      TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      destination
    );
    
    // Verificar se a conta de destino existe
    const destinationAccountInfo = await connection.getAccountInfo(destinationTokenAccount);
    
    // Criar transação
    const transaction = new Transaction();
    
    // Se a conta de destino não existir, criar
    if (!destinationAccountInfo) {
      transaction.add(
        Token.createAssociatedTokenAccountInstruction(
          TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          destinationTokenAccount,
          destination,
          payer.publicKey
        )
      );
    }
    
    // Adicionar instrução de transferência
    transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount,
        destinationTokenAccount,
        payer.publicKey,
        [],
        amount * Math.pow(10, decimals)
      )
    );
    
    // Enviar transação
    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    
    // Registrar evento de sucesso
    createAlert({
      type: 'business',
      level: 'info',
      title: 'Tokens transferidos com sucesso',
      message: `${amount} tokens do mint ${mint.toString()} foram transferidos para ${destination.toString()}`,
    });
    
    sentryTransaction.finish();
    return signature;
  } catch (error) {
    console.error('Erro ao transferir tokens:', error);
    captureException(error);
    
    // Registrar evento de erro
    createAlert({
      type: 'business',
      level: 'error',
      title: 'Erro ao transferir tokens',
      message: `Ocorreu um erro ao transferir tokens: ${error.message}`,
    });
    
    sentryTransaction.finish('error');
    throw error;
  }
}

/**
 * Congela uma conta de token
 * @param connection Conexão Solana
 * @param payer Keypair do pagador (deve ser a autoridade de congelamento)
 * @param mint Endereço do mint
 * @param account Conta a ser congelada
 * @returns Assinatura da transação
 */
export async function freezeTokenAccount(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  account: PublicKey
): Promise<string> {
  try {
    // Criar token com a mint existente
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    
    // Congelar conta
    const signature = await token.freezeAccount(account, payer.publicKey, []);
    
    // Registrar evento
    createAlert({
      type: 'business',
      level: 'warning',
      title: 'Conta de token congelada',
      message: `A conta ${account.toString()} do token ${mint.toString()} foi congelada`,
    });
    
    return signature;
  } catch (error) {
    console.error('Erro ao congelar conta de token:', error);
    captureException(error);
    throw error;
  }
}

/**n
 * Descongela uma conta de token
 * @param connection Conexão Solana
 * @param payer Keypair do pagador (deve ser a autoridade de congelamento)
 * @param mint Endereço do mint
 * @param account Conta a ser descongelada
 * @returns Assinatura da transação
 */
export async function thawTokenAccount(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  account: PublicKey
): Promise<string> {
  try {
    // Criar token com a mint existente
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    
    // Descongelar conta
    const signature = await token.thawAccount(account, payer.publicKey, []);
    
    // Registrar evento
    createAlert({
      type: 'business',
      level: 'info',
      title: 'Conta de token descongelada',
      message: `A conta ${account.toString()} do token ${mint.toString()} foi descongelada`,
    });
    
    return signature;
  } catch (error) {
    console.error('Erro ao descongelar conta de token:', error);
    captureException(error);
    throw error;
  }
}