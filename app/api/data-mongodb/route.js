import { NextResponse } from 'next/server';
import { dataMongoDB } from '@/services/dataMongoDB';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db');
  const collection = searchParams.get('collection');
  const key = searchParams.get('key');

  if (!db || !collection || !key) {
    return NextResponse.json(
      { error: '❌ Parâmetros db, collection e key são obrigatórios.' },
      { status: 400 }
    );
  }

  try {
    const result = await dataMongoDB({
      dbName: db,
      collectionName: collection,
      key: key,
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
