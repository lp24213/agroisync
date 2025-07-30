declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isConnected?: boolean;
      connect: () => Promise<{ publicKey: { toBytes: () => Uint8Array } }>;
      disconnect: () => Promise<void>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      request: (args: any) => Promise<any>;
      publicKey?: { toString: () => string };
    };
    ethereum?: {
      isMetaMask?: boolean;
      isConnected?: boolean;
      request: (args: any) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

export {}; 