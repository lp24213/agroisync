declare module '@solana/web3.js' {
  export class PublicKey {
    constructor(value: string | Buffer | Uint8Array | number[]);
    static isOnCurve(pubkey: string | Buffer | Uint8Array): boolean;
    static createWithSeed(fromPublicKey: PublicKey, seed: string, programId: PublicKey): Promise<PublicKey>;
    static findProgramAddress(seeds: (Buffer | Uint8Array)[], programId: PublicKey): Promise<[PublicKey, number]>;
    equals(publicKey: PublicKey): boolean;
    toBase58(): string;
    toBuffer(): Buffer;
    toString(): string;
    toBytes(): Uint8Array;
  }

  export class Connection {
    constructor(endpoint: string, commitment?: string);
    getAccountInfo(publicKey: PublicKey): Promise<any>;
    getBalance(publicKey: PublicKey): Promise<number>;
    getBlockHeight(): Promise<number>;
    getLatestBlockhash(): Promise<any>;
    sendTransaction(transaction: any, signers?: any[]): Promise<string>;
    confirmTransaction(signature: string): Promise<any>;
    getTransaction(signature: string): Promise<any>;
  }

  export class Transaction {
    constructor();
    add(instruction: any): Transaction;
    sign(...signers: any[]): void;
    serialize(): Buffer;
  }

  export class SystemProgram {
    static transfer(params: {
      fromPubkey: PublicKey;
      toPubkey: PublicKey;
      lamports: number;
    }): any;
    static createAccount(params: {
      fromPubkey: PublicKey;
      newAccountPubkey: PublicKey;
      lamports: number;
      space: number;
      programId: PublicKey;
    }): any;
  }

  export const LAMPORTS_PER_SOL: number;

  export function clusterApiUrl(cluster: string, tls?: boolean): string;

  export interface Keypair {
    publicKey: PublicKey;
    secretKey: Uint8Array;
  }

  export class Keypair {
    static generate(): Keypair;
    static fromSecretKey(secretKey: Uint8Array): Keypair;
    static fromSeed(seed: Uint8Array): Keypair;
  }

  export interface SendOptions {
    skipPreflight?: boolean;
    preflightCommitment?: string;
    maxRetries?: number;
  }

  export interface ConfirmOptions {
    skipPreflight?: boolean;
    commitment?: string;
    preflightCommitment?: string;
    maxRetries?: number;
  }

  export type Commitment = 'processed' | 'confirmed' | 'finalized';

  export interface AccountInfo<T> {
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: T;
    rentEpoch?: number;
  }

  export interface RpcResponseAndContext<T> {
    context: {
      slot: number;
    };
    value: T;
  }

  export type AccountChangeCallback = (accountInfo: AccountInfo<Buffer>, context: any) => void;

  export interface SignatureResult {
    err: any;
  }

  export interface BlockhashAndFeeCalculator {
    blockhash: string;
    feeCalculator: {
      lamportsPerSignature: number;
    };
  }

  export interface ParsedAccountData {
    program: string;
    parsed: any;
    space: number;
  }

  export type TokenAmount = {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
}