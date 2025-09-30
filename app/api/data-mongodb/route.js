const { NextResponse } = require('next/server');
const { dataMongoDB } = require('@/services/dataMongoDB');

const { NextResponse } = require('next/server');
const { dataMongoDB } = require('@/services/dataMongoDB');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db');
  const collection = searchParams.get('collection');
  const keysParam = searchParams.get('keys');
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');
  const dump = searchParams.get('dump') === 'true';

  const filterField = searchParams.get('filterField');
  const rawFilterValue = searchParams.get('filterValue');

  if (!db || !collection || !keysParam) {
    return NextResponse.json(
      { error: '❌ Parâmetros db, collection e keys são obrigatórios.' },
      { status: 400 }
    );
  }

  const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean);

  let filterValue;
  if (rawFilterValue) {
    const values = rawFilterValue.split(',').map(val => val.trim());
    filterValue = values.map(val => isNaN(val) ? val : Number(val));
  }

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
    console.error('Erro ao acessar MongoDB:', error);
    return NextResponse.json(
      { error: '❌ Erro interno ao acessar MongoDB.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db');
  const collection = searchParams.get('collection');
  const keysParam = searchParams.get('keys');
  const limit = parseInt(searchParams.get('limit') || '100');
  const skip = parseInt(searchParams.get('skip') || '0');
  const dump = searchParams.get('dump') === 'true';

  const filterField = searchParams.get('filterField');
  const body = await request.json();
  const rawFilterValue = body.filterValue;

  if (!db || !collection || !keysParam) {
    return NextResponse.json(
      { error: '❌ Parâmetros db, collection e keys são obrigatórios.' },
      { status: 400 }
    );
  }

  const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean);

  let filterValue;
  if (rawFilterValue) {
    if (typeof rawFilterValue === 'string') {
      const values = rawFilterValue.split(',').map(val => val.trim());
      filterValue = values.map(val => isNaN(val) ? val : Number(val));
    } else if (Array.isArray(rawFilterValue)) {
      filterValue = rawFilterValue.map(val => isNaN(val) ? val : Number(val));
    } else {
      filterValue = isNaN(rawFilterValue) ? rawFilterValue : Number(rawFilterValue);
    }
  }

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
    console.error('Erro ao acessar MongoDB:', error);
    return NextResponse.json(
      { error: '❌ Erro interno ao acessar MongoDB.' },
      { status: 500 }
    );
  }
}