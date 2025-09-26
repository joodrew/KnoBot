import { crud } from '@/services/crud';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // Verifica se body é objeto ou array
    if (typeof body !== 'object' || body === null) {
      throw new Error('Body inválido: deve ser um objeto ou array');
    }

    const result = await crud(body);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 400 }
    );
  }
}
