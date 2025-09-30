const { NextResponse } = require('next/server');
const { dataMongoDB } = require('@/services/dataMongoDB');

// Função utilitária para tratar filterValue
function parseFilterValue(rawFilterValue) {
  if (!rawFilterValue) return undefined;

  if (typeof rawFilterValue === 'string') {
    const values = rawFilterValue.split(',').map(val => val.trim());
    return values.map(val => isNaN(val) ? val : Number(val));
  }

  if (Array.isArray(rawFilterValue)) {
    return rawFilterValue.map(val => isNaN(val) ? val : Number(val));
  }

  return isNaN(rawFilterValue) ? rawFilterValue : Number(rawFilterValue);
}

async function handleRequest(request, method) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db');
  const collection = searchParams.get('collection');
  const keysParam = searchParams.get('keys');
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');
  const dump = searchParams.get('dump') === 'true';
  const filterField = searchParams.get('filterField');

  let rawFilterValue;

  if (method === 'POST') {
    const body = await request.json();
    rawFilterValue = body.filterValue;
  } else {
    rawFilterValue = searchParams.get('filterValue');
  }

  if (!db || !collection || !keysParam) {
    return NextResponse.json(
      { error: '❌ Parâmetros db, collection e keys são obrigatórios.' },
      { status: 400 }
    );
  }

  const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean);
  const filterValue = parseFilterValue(rawFilterValue);

  try {
    const result = await dataMongoDB({
      dbName: db,
      collectionName: collection,
      keys,
      limit,
      skip,
      useDumpCluster: dump,
      filterField,
      filterValue,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Erro ao acessar MongoDB:', error);
    return NextResponse.json(
      { error: '❌ Erro interno ao acessar MongoDB.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return handleRequest(request, 'GET');
}

export async function POST(request) {
  return handleRequest(request, 'POST');
}