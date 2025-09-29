const { NextResponse } = require('next/server');
const { dataMongoDB } = require('@/services/dataMongoDB');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db');
  const collection = searchParams.get('collection');
  const keysParam = searchParams.get('keys');
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');
  const dump = searchParams.get('dump') === 'true'; // converte para booleano

  if (!db || !collection || !keysParam) {
    return NextResponse.json(
      { error: '❌ Parâmetros db, collection e keys são obrigatórios.' },
      { status: 400 }
    );
  }

  const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean);

  try {
    const result = await dataMongoDB({
      dbName: db,
      collectionName: collection,
      keys,
      limit,
      skip,
      useDumpCluster: dump,
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
