import { NextResponse } from 'next/server';

interface Stats {
  totalValueLocked: number;
  totalUsers: number;
  averageAPR: number;
  totalTransactions: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  activePools: number;
  totalRewardsDistributed: number;
  platformFee: number;
}

const mockStats: Stats = {
  totalValueLocked: 12500000,
  totalUsers: 25430,
  averageAPR: 18.5,
  totalTransactions: 156789,
  dailyVolume: 234567,
  weeklyVolume: 1234567,
  monthlyVolume: 4567890,
  activePools: 12,
  totalRewardsDistributed: 890123,
  platformFee: 0.3,
};

export async function GET() {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({
      success: true,
      data: mockStats,
      message: 'Statistics retrieved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch statistics',
      },
      { status: 500 }
    );
  }
} 