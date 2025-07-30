import { NextResponse } from 'next/server';

interface Pool {
  id: string;
  name: string;
  address: string;
  token0: string;
  token1: string;
  apr: number;
  tvl: number;
  isActive: boolean;
  lockPeriod: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  minStake: number;
  maxStake: number;
  description: string;
  isVerified: boolean;
}

const mockPools: Pool[] = [
  {
    id: '1',
    name: 'AGRO/USDC',
    address: 'AGROUSDCpools111111111111111111111111111111111',
    token0: 'AGRO',
    token1: 'USDC',
    apr: 24.5,
    tvl: 5000000,
    isActive: true,
    lockPeriod: 30,
    riskLevel: 'High',
    minStake: 100,
    maxStake: 10000,
    description: 'A high-risk, high-reward pool for experienced traders.',
    isVerified: true,
  },
  {
    id: '2',
    name: 'AGRO/SOL',
    address: 'AGROSOLpools222222222222222222222222222222222',
    token0: 'AGRO',
    token1: 'SOL',
    apr: 18.3,
    tvl: 7500000,
    isActive: true,
    lockPeriod: 60,
    riskLevel: 'Medium',
    minStake: 10,
    maxStake: 1000,
    description: 'A medium-risk pool for investors looking for stable returns.',
    isVerified: true,
  },
  {
    id: '3',
    name: 'AGRO/BTC',
    address: 'AGROBTCpools333333333333333333333333333333333',
    token0: 'AGRO',
    token1: 'BTC',
    apr: 31.2,
    tvl: 2000000,
    isActive: true,
    lockPeriod: 90,
    riskLevel: 'Low',
    minStake: 1,
    maxStake: 100,
    description: 'A low-risk pool for beginners and conservative investors.',
    isVerified: true,
  },
];

export async function GET() {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      data: mockPools,
      message: 'Pools retrieved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch pools',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { poolId, action, amount, walletAddress } = body;

    // Validações básicas
    if (!poolId || !action || !walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const pool = mockPools.find(p => p.id === poolId);
    if (!pool) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pool not found',
        },
        { status: 404 }
      );
    }

    // Simular processamento da transação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const signature = `mock-signature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      data: {
        signature,
        poolId,
        action,
        amount,
        timestamp: new Date().toISOString(),
      },
      message: `${action} completed successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process transaction',
      },
      { status: 500 }
    );
  }
} 