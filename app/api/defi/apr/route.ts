import { NextResponse } from 'next/server';

interface APRData {
  poolId: string;
  apr: number;
  change24h: number;
  change7d: number;
  historicalData: Array<{
    date: string;
    apr: number;
  }>;
}

const mockAPRData: APRData[] = [
  {
    poolId: '1',
    apr: 24.5,
    change24h: 0.3,
    change7d: -1.2,
    historicalData: [
      { date: '2024-01-10', apr: 25.8 },
      { date: '2024-01-11', apr: 25.2 },
      { date: '2024-01-12', apr: 24.9 },
      { date: '2024-01-13', apr: 24.7 },
      { date: '2024-01-14', apr: 24.5 },
    ],
  },
  {
    poolId: '2',
    apr: 18.3,
    change24h: -0.2,
    change7d: 0.8,
    historicalData: [
      { date: '2024-01-10', apr: 17.5 },
      { date: '2024-01-11', apr: 17.8 },
      { date: '2024-01-12', apr: 18.1 },
      { date: '2024-01-13', apr: 18.2 },
      { date: '2024-01-14', apr: 18.3 },
    ],
  },
  {
    poolId: '3',
    apr: 31.2,
    change24h: 1.5,
    change7d: 3.2,
    historicalData: [
      { date: '2024-01-10', apr: 28.0 },
      { date: '2024-01-11', apr: 29.2 },
      { date: '2024-01-12', apr: 30.1 },
      { date: '2024-01-13', apr: 30.8 },
      { date: '2024-01-14', apr: 31.2 },
    ],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poolId = searchParams.get('poolId');
    const timeframe = searchParams.get('timeframe') || '7d';

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    let data = mockAPRData;

    // Filtrar por pool se especificado
    if (poolId) {
      data = mockAPRData.filter(item => item.poolId === poolId);
    }

    // Filtrar dados históricos por timeframe
    if (timeframe !== 'all') {
      data = data.map(item => ({
        ...item,
        historicalData: item.historicalData.slice(-parseInt(timeframe.replace('d', ''))),
      }));
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'APR data retrieved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch APR data',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { poolId, newAPR } = body;

    // Validações básicas
    if (!poolId || typeof newAPR !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: poolId and newAPR',
        },
        { status: 400 }
      );
    }

    // Simular atualização de APR
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: {
        poolId,
        newAPR,
        updatedAt: new Date().toISOString(),
      },
      message: 'APR updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update APR',
      },
      { status: 500 }
    );
  }
} 