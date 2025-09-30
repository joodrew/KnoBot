import { NextResponse } from 'next/server';
import { crud } from '@/services/crud';

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, collection } = body;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: '❌ O campo "data" deve ser um array de grupos.' },
        { status: 400 }
      );
    }

    const result = await crud(data, collection); // collection é opcional

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: '❌ Erro interno ao processar os dados.' },
      { status: 500 }
    );
  }
}