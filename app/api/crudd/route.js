// app/api/crudd/route.js
import { crud } from '@/services/crud';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      throw new Error('❌ Corpo da requisição inválido ou vazio');
    }

    const uri = process.env.MONGODBDUMP_URI;
    if (!uri) {
      throw new Error('❌ MONGODBDUMP_URI não está acessível no ambiente Vercel');
    }

    console.log('✅ URI carregada na rota:', uri);
    console.log('📦 Body recebido:', JSON.stringify(body, null, 2));

    const result = await crud(body);

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