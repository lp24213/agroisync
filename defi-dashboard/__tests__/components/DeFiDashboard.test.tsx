import React from 'react';
import { render, screen } from '@testing-library/react';
import DeFiDashboard from '../../components/defi/DeFiDashboard';
import { useDeFiPools } from '../../hooks/useDeFiPools';

// Mock the useDeFiPools hook
jest.mock('../../hooks/useDeFiPools');
const mockUseDeFiPools = useDeFiPools as jest.MockedFunction<typeof useDeFiPools>;

describe('DeFiDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state when data is being fetched', () => {
    // Mock the hook to return loading state
    mockUseDeFiPools.mockReturnValue({
      pools: [],
      loading: true,
      error: null
    });

    render(<DeFiDashboard />);
    expect(screen.getByText(/loading defi pools data/i)).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    // Mock the hook to return error state
    mockUseDeFiPools.mockReturnValue({
      pools: [],
      loading: false,
      error: new Error('Test error message')
    });

    render(<DeFiDashboard />);
    expect(screen.getByText(/error loading pools/i)).toBeInTheDocument();
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('displays pool data when loaded successfully', () => {
    // Mock the hook to return successful data
    mockUseDeFiPools.mockReturnValue({
      pools: [
        { id: '1', name: 'Test Pool 1', token: 'TEST1', tvl: 1000000 },
        { id: '2', name: 'Test Pool 2', token: 'TEST2', tvl: 2000000 }
      ],
      loading: false,
      error: null
    });

    render(<DeFiDashboard />);
    
    // Check for table headers
    expect(screen.getByText(/pool name/i)).toBeInTheDocument();
    expect(screen.getByText(/token/i)).toBeInTheDocument();
    expect(screen.getByText(/total value locked/i)).toBeInTheDocument();
    
    // Check for pool data
    expect(screen.getByText('Test Pool 1')).toBeInTheDocument();
    expect(screen.getByText('TEST1')).toBeInTheDocument();
    expect(screen.getByText('Test Pool 2')).toBeInTheDocument();
    expect(screen.getByText('TEST2')).toBeInTheDocument();
    
    // Check for formatted TVL values
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    expect(screen.getByText('$2,000,000')).toBeInTheDocument();
  });
});