import { renderHook, act } from '@testing-library/react';
import { useWeb3 } from '../../hooks/useWeb3';

// Mock Web3 providers
const mockProvider = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

const mockSigner = {
  getAddress: jest.fn(),
  signMessage: jest.fn(),
  signTransaction: jest.fn(),
};

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: jest.fn(() => mockProvider),
    },
  },
}));

describe('useWeb3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.ethereum
    delete (window as any).ethereum;
  });

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useWeb3());

    expect(result.current.isConnected).toBe(false);
    expect(result.current.account).toBe(null);
    expect(result.current.provider).toBe(null);
    expect(result.current.signer).toBe(null);
    expect(result.current.chainId).toBe(null);
  });

  it('should detect MetaMask when available', () => {
    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    expect(result.current.isMetaMask).toBe(true);
  });

  it('should connect to MetaMask successfully', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockChainId = '1';

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress]) // eth_requestAccounts
        .mockResolvedValueOnce(mockChainId), // eth_chainId
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.account).toBe(mockAddress);
    expect(result.current.chainId).toBe(mockChainId);
  });

  it('should handle connection errors', async () => {
    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn().mockRejectedValue(new Error('User rejected')),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      try {
        await result.current.connect();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('User rejected');
      }
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.account).toBe(null);
  });

  it('should disconnect successfully', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1'),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    // First connect
    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.isConnected).toBe(true);

    // Then disconnect
    await act(async () => {
      await result.current.disconnect();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.account).toBe(null);
    expect(result.current.provider).toBe(null);
    expect(result.current.signer).toBe(null);
  });

  it('should switch networks successfully', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1')
        .mockResolvedValueOnce(null), // switchNetwork
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    await act(async () => {
      await result.current.switchNetwork(137); // Polygon
    });

    expect(result.current.chainId).toBe('137');
  });

  it('should handle network switching errors', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1')
        .mockRejectedValue(new Error('Network not supported')),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    await act(async () => {
      try {
        await result.current.switchNetwork(999);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Network not supported');
      }
    });
  });

  it('should sign messages successfully', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockSignature = '0x1234567890abcdef';

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1')
        .mockResolvedValueOnce(mockSignature),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    const message = 'Hello AGROTM!';
    const signature = await result.current.signMessage(message);

    expect(signature).toBe(mockSignature);
  });

  it('should handle message signing errors', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1')
        .mockRejectedValue(new Error('User rejected signing')),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    const message = 'Hello AGROTM!';

    await act(async () => {
      try {
        await result.current.signMessage(message);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('User rejected signing');
      }
    });
  });

  it('should listen to account changes', async () => {
    const mockAddress1 = '0x1234567890123456789012345678901234567890';
    const mockAddress2 = '0x0987654321098765432109876543210987654321';

    let accountsChangedCallback: (accounts: string[]) => void;
    let chainChangedCallback: (chainId: string) => void;

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress1])
        .mockResolvedValueOnce('1'),
      on: jest.fn((event, callback) => {
        if (event === 'accountsChanged') {
          accountsChangedCallback = callback;
        } else if (event === 'chainChanged') {
          chainChangedCallback = callback;
        }
      }),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.account).toBe(mockAddress1);

    // Simulate account change
    await act(async () => {
      accountsChangedCallback([mockAddress2]);
    });

    expect(result.current.account).toBe(mockAddress2);
  });

  it('should listen to chain changes', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    let chainChangedCallback: (chainId: string) => void;

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1'),
      on: jest.fn((event, callback) => {
        if (event === 'chainChanged') {
          chainChangedCallback = callback;
        }
      }),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.chainId).toBe('1');

    // Simulate chain change
    await act(async () => {
      chainChangedCallback('137');
    });

    expect(result.current.chainId).toBe('137');
  });

  it('should handle disconnection events', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';

    let disconnectCallback: () => void;

    (window as any).ethereum = {
      isMetaMask: true,
      request: jest.fn()
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('1'),
      on: jest.fn((event, callback) => {
        if (event === 'disconnect') {
          disconnectCallback = callback;
        }
      }),
      removeListener: jest.fn(),
    };

    const { result } = renderHook(() => useWeb3());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.isConnected).toBe(true);

    // Simulate disconnect
    await act(async () => {
      disconnectCallback();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.account).toBe(null);
  });
}); 