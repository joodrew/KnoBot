import { crud } from '@/services/crud';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // DEBUG: Verifica se a variável de ambiente está acessível
    const uri = process.env.MONGODBDUMP_URI;
    if (!uri) {
      throw new Error('❌ MONGODBDUMP_URI não está acessível no ambiente Vercel');
    }

    console.log('✅ URI carregada na rota:', uri);

    const result = await crud(body);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('❌ Erro na rota /crud:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 400 }
    );
  }
}
