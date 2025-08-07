import { NextRequest, NextResponse } from 'next/server';
import adminSDK from '../../../../lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'users';
    const field = searchParams.get('field');
    const operator = searchParams.get('operator');
    const value = searchParams.get('value');

    let documents;

    if (field && operator && value) {
      // Consulta com filtro
      documents = await adminSDK.queryDocuments(collection, [[field, operator, value]]);
    } else {
      // Consulta sem filtro (buscar todos)
      documents = await adminSDK.queryDocuments(collection, []);
    }

    return NextResponse.json({
      success: true,
      documents,
      total: documents?.length || 0
    });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, data } = body;

    if (!collection || !data) {
      return NextResponse.json({ error: 'Collection e data são obrigatórios' }, { status: 400 });
    }

    // Adicionar documento
    const docRef = await adminSDK.addDocument(collection, data);

    return NextResponse.json({
      success: true,
      documentId: docRef?.id,
      message: 'Documento criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, documentId, data } = body;

    if (!collection || !documentId || !data) {
      return NextResponse.json({ error: 'Collection, documentId e data são obrigatórios' }, { status: 400 });
    }

    // Atualizar documento
    await adminSDK.updateDocument(collection, documentId, data);

    return NextResponse.json({
      success: true,
      message: 'Documento atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const documentId = searchParams.get('documentId');

    if (!collection || !documentId) {
      return NextResponse.json({ error: 'Collection e documentId são obrigatórios' }, { status: 400 });
    }

    // Deletar documento
    await adminSDK.deleteDocument(collection, documentId);

    return NextResponse.json({
      success: true,
      message: 'Documento deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
