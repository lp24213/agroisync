import { NextRequest, NextResponse } from 'next/server';

// Base da API hospedada na AWS (ECS/Lambda). Utilize variável de ambiente.
const AWS_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    const backendUrl = `${AWS_BACKEND_URL.replace(/\/$/, '')}/${path}${queryString}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AGROTM-Frontend/1.0',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    
    const backendUrl = `${AWS_BACKEND_URL.replace(/\/$/, '')}/${path}`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AGROTM-Frontend/1.0',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    
    const backendUrl = `${AWS_BACKEND_URL.replace(/\/$/, '')}/${path}`;
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AGROTM-Frontend/1.0',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    
    const backendUrl = `${AWS_BACKEND_URL.replace(/\/$/, '')}/${path}`;
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AGROTM-Frontend/1.0',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 