import { NextResponse } from 'next/server';
import { moveRetratar } from '@/services/moveTratar';

export async function POST() {
  try {
    const result = await moveRetratar();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Erro na rota /move-retratar:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
