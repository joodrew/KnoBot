const { NextResponse } = require('next/server');
const { dataMongoDB } = require('@/services/dataMongoDB');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db');
  const collection = searchParams.get('collection');
  const keysParam = searchParams.get('keys');

  if (!db || !collection || !keysParam) {
    return NextResponse.json(
      { error: '❌ Parâmetros db, collection e keys são obrigatórios.' },
      { status: 400 }
    );
  }

  // Transforma "subject,priority,status" em array
  const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean);

  try {
    const result = await dataMongoDB({
      dbName: db,
      collectionName: collection,
      keys,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao acessar MongoDB:', error);
    return NextResponse.json(
      { error: '❌ Erro interno ao acessar MongoDB.' },
      { status: 500 }
    );
  }
}
