import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import WalletConnect from '../../components/WalletConnect';
import { Web3Provider } from '../../contexts/Web3Context';

// Mock the Web3 context
const mockWeb3Context = {
  account: null,
  isConnected: false,
  isConnecting: false,
  connect: vi.fn(),
  disconnect: vi.fn(),
  switchNetwork: vi.fn(),
  contracts: {
    agrotmToken: null,
    nftAgro: null,
    buyWithCommission: null,
    staking: null,
  },
};

vi.mock('../../contexts/Web3Context', () => ({
  useWeb3: () => mockWeb3Context,
  Web3Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    isMetaMask: true,
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
  writable: true,
});

describe('WalletConnect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render connect button when not connected', () => {
    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    expect(screen.getByText(/conectar carteira/i)).toBeInTheDocument();
  });

  it('should show connecting state when connecting', () => {
    mockWeb3Context.isConnecting = true;

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    expect(screen.getByText(/conectando/i)).toBeInTheDocument();
  });

  it('should show connected state with address when connected', () => {
    mockWeb3Context.isConnected = true;
    mockWeb3Context.account = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    expect(screen.getByText(/0x742d...d8b6/i)).toBeInTheDocument();
  });

  it('should call connect function when connect button is clicked', async () => {
    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    const connectButton = screen.getByText(/conectar carteira/i);
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockWeb3Context.connect).toHaveBeenCalledTimes(1);
    });
  });

  it('should call disconnect function when disconnect button is clicked', async () => {
    mockWeb3Context.isConnected = true;
    mockWeb3Context.account = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    const disconnectButton = screen.getByText(/desconectar/i);
    fireEvent.click(disconnectButton);

    await waitFor(() => {
      expect(mockWeb3Context.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  it('should format address correctly', () => {
    mockWeb3Context.isConnected = true;
    mockWeb3Context.account = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    expect(screen.getByText(/0x742d...d8b6/i)).toBeInTheDocument();
  });

  it('should show dropdown when connected and clicked', async () => {
    mockWeb3Context.isConnected = true;
    mockWeb3Context.account = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    const walletButton = screen.getByText(/0x742d...d8b6/i);
    fireEvent.click(walletButton);

    await waitFor(() => {
      expect(screen.getByText(/desconectar/i)).toBeInTheDocument();
    });
  });

  it('should handle MetaMask not installed', () => {
    // Remove ethereum from window
    delete (window as any).ethereum;

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    const connectButton = screen.getByText(/conectar carteira/i);
    fireEvent.click(connectButton);

    // Should still call connect (which will handle the error)
    expect(mockWeb3Context.connect).toHaveBeenCalledTimes(1);
  });

  it('should show network switching options', async () => {
    mockWeb3Context.isConnected = true;
    mockWeb3Context.account = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    const walletButton = screen.getByText(/0x742d...d8b6/i);
    fireEvent.click(walletButton);

    await waitFor(() => {
      expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
      expect(screen.getByText(/bsc/i)).toBeInTheDocument();
    });
  });

  it('should handle network switching', async () => {
    mockWeb3Context.isConnected = true;
    mockWeb3Context.account = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

    render(
      <Web3Provider>
        <WalletConnect />
      </Web3Provider>
    );

    const walletButton = screen.getByText(/0x742d...d8b6/i);
    fireEvent.click(walletButton);

    await waitFor(() => {
      const ethereumButton = screen.getByText(/ethereum/i);
      fireEvent.click(ethereumButton);
    });

    expect(mockWeb3Context.switchNetwork).toHaveBeenCalledWith(1);
  });
}); 