import { NextRequest, NextResponse } from 'next/server';
import adminSDK from '../../../../lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado (exemplo básico)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar o token
    const decodedToken = await adminSDK.verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Listar usuários (apenas para administradores)
    const listUsersResult = await adminSDK.listUsers(100);
    
    return NextResponse.json({
      success: true,
      users: listUsersResult?.users || [],
      total: listUsersResult?.users?.length || 0
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, photoURL } = body;

    // Validar dados obrigatórios
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Criar usuário
    const userRecord = await adminSDK.createUser({
      email,
      password,
      displayName,
      photoURL
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord?.uid,
        email: userRecord?.email,
        displayName: userRecord?.displayName,
        photoURL: userRecord?.photoURL
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
