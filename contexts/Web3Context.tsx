"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useWeb3 } from "@/hooks/useWeb3";

interface Web3ContextType {
  provider: any;
  signer: any;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  getBalance: (address?: string) => Promise<string>;
  sendTransaction: (to: string, value: string, data?: string) => Promise<any>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const web3Data = useWeb3();

  return (
    <Web3Context.Provider value={web3Data}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3Context deve ser usado dentro de Web3Provider");
  }
  return context;
}
