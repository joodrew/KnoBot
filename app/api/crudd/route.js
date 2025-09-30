import { crud } from '@/services/crud';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const { collection, data } = body;

    if (!data || typeof data !== 'object') {
      throw new Error('❌ Dados inválidos ou ausentes no campo "data"');
    }

    const uri = process.env.MONGODBDUMP_URI;
    if (!uri) {
      throw new Error('❌ MONGODBDUMP_URI não está acessível no ambiente Vercel');
    }

    console.log('✅ URI carregada na rota:', uri);
    console.log('📦 Collection recebida:', collection);
    console.log('📦 Dados recebidos:', JSON.stringify(data, null, 2));

    const result = await crud(data, collection);

    console.log('✅ Resultado da operação CRUD:', result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('❌ Erro na rota /crudd:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 400 }
    );
  }
}