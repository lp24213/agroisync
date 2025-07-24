import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import PriceWidget from '../../components/widgets/PriceWidget';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PriceWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(<PriceWidget />);
    expect(screen.getByText(/loading price data/i)).toBeInTheDocument();
  });

  it('displays price data when loaded successfully', async () => {
    // Mock successful API response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        bitcoin: { usd: 50000 },
        ethereum: { usd: 3000 }
      }
    });

    render(<PriceWidget />);
    
    // Wait for the component to update
    await waitFor(() => {
      expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
      expect(screen.getByText(/\$50,000/)).toBeInTheDocument();
      expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
      expect(screen.getByText(/\$3,000/)).toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    // Mock failed API response
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<PriceWidget />);
    
    // Wait for the component to update
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch price data/i)).toBeInTheDocument();
    });
  });
});